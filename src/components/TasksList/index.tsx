import { component$, useSignal, $, useVisibleTask$ } from "@builder.io/qwik";
import { pb, getAuthToken, isLoggedIn } from "~/utils/pocketbase";
import { formatStatus } from "~/utils/views";

export interface TasksListProps {
  onTaskSelected?: (taskId: string) => void;
  onRefresh?: () => void;
  showActions?: boolean;
  showCreateButton?: boolean;
}

export const TasksList = component$<TasksListProps>(
  ({
    onTaskSelected = () => {},
    onRefresh = () => {},
    showActions = true,
    showCreateButton = true,
  }) => {
    const isLoading = useSignal(false);
    const isDeleting = useSignal(false);
    const tasks = useSignal<any[]>([]);
    const errorSignal = useSignal("");
    const successSignal = useSignal("");

    // Function to load tasks from PocketBase
    const loadTasks = $(async () => {
      isLoading.value = true;
      errorSignal.value = "";

      try {
        if (!isLoggedIn()) {
          errorSignal.value = "Authentication required";
          return;
        }

        // Set the auth token for the request
        pb.authStore.save(getAuthToken() || "", null);

        try {
          const response = await pb.collection("tasks").getList(1, 50, {
            sort: "-created",
            expand: "_garden",
          });
          console.log(response);

          function deduplicateById<T extends { id: string }>(items: T[]): T[] {
            const map: Record<string, T> = {};
            for (const item of items) {
              map[item.id] = item;
            }
            return Object.values(map);
          }
          tasks.value = deduplicateById(response.items) || [];
          onRefresh();
        } catch (err: any) {
          errorSignal.value = err.message || "Failed to load tasks";
          console.error("Error loading tasks:", err);
        }
      } catch (error) {
        console.error("Error loading tasks:", error);
        errorSignal.value = "An error occurred while loading tasks";
      } finally {
        isLoading.value = false;
      }
    });

    // Load tasks when component mounts
    useVisibleTask$(async () => {
      await loadTasks();
    });

    // Function to delete a task
    const deleteTask = $(async (taskId: string) => {
      if (!confirm("Are you sure you want to delete this task?")) {
        return;
      }

      isDeleting.value = true;
      errorSignal.value = "";
      successSignal.value = "";

      try {
        if (!isLoggedIn()) {
          errorSignal.value = "Authentication required";
          return;
        }

        // Set the auth token for the request
        pb.authStore.save(getAuthToken() || "", null);

        try {
          await pb.collection("tasks").delete(taskId);
          successSignal.value = "Task deleted successfully";
          // Refresh the task list
          await loadTasks();
        } catch (err: any) {
          errorSignal.value = err.message || "Failed to delete task";
          console.error("Error deleting task:", err);
        }
      } catch (error) {
        console.error("Error deleting task:", error);
        errorSignal.value = "An error occurred while deleting the task";
      } finally {
        isDeleting.value = false;
      }
    });

    return (
      <div class="card bg-base-100 shadow-xl mb-6">
        <div class="card-body">
          <h2 class="card-title">Tasks</h2>

          {errorSignal.value && (
            <div class="alert alert-error mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{errorSignal.value}</span>
            </div>
          )}

          {successSignal.value && (
            <div class="alert alert-success mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{successSignal.value}</span>
            </div>
          )}

          {isLoading.value ? (
            <div class="flex justify-center p-4">
              <span class="loading loading-spinner loading-lg"></span>
            </div>
          ) : tasks.value.length === 0 ? (
            <div class="text-center p-4">
              <p>No tasks found. Create your first task!</p>
            </div>
          ) : (
            <div class="overflow-x-auto">
              <table class="table w-full">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Run At</th>
                    {showActions && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {tasks.value.map((task) => (
                    <tr
                      key={task.id}
                      onClick$={() => onTaskSelected}
                      class="cursor-pointer hover:bg-base-200"
                    >
                      <td>{task.expand._garden.title}</td>
                      <td>
                        <span
                          class={`badge ${
                            task.status === "completed"
                              ? "badge-success"
                              : task.status === "in_progress"
                                ? "badge-warning"
                                : "badge-ghost"
                          }`}
                        >
                          {formatStatus(task.status)}
                        </span>
                      </td>
                      <td>{new Date(task.due_date).toLocaleDateString()}</td>
                      {showActions && (
                        <td onClick$={(e) => e.stopPropagation()}>
                          <div class="flex space-x-2">
                            <a
                              href={`/tasks/edit/${task.id}`}
                              class="btn btn-sm btn-primary"
                            >
                              Edit
                            </a>
                            <button
                              class={`btn btn-sm btn-error ${isDeleting.value ? "loading" : ""}`}
                              onClick$={() => deleteTask(task.id)}
                              disabled={isDeleting.value}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {showCreateButton && (
            <div class="card-actions justify-end mt-4">
              <a href="/tasks/create" class="btn btn-primary">
                Create New Task
              </a>
            </div>
          )}
        </div>
      </div>
    );
  },
);
