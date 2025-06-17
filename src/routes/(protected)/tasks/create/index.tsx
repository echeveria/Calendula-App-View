import { component$, useSignal, $ } from "@builder.io/qwik";
import {
  useNavigate,
  type DocumentHead,
  useLocation,
} from "@builder.io/qwik-city";
import { pb, getAuthToken, getUserInfo } from "~/utils/pocketbase";
import { TaskForm } from "~/components/TaskForm/TaskForm";

export default component$(() => {
  const navigate = useNavigate();
  const loc = useLocation();
  const gardenId = loc.url.searchParams.get("gardenId");

  const infoSignal = useSignal("");
  const statusSignal = useSignal("pending");
  const taskConfigSignal = useSignal(gardenId || "");
  const dateSignal = useSignal("");
  const errorSignal = useSignal("");
  const isLoading = useSignal(false);

  const handleSubmit = $(async () => {
    errorSignal.value = "";
    isLoading.value = true;

    const currentUser = getUserInfo();

    try {
      // Validate form
      if (!infoSignal.value) {
        errorSignal.value = "Task information is required";
        isLoading.value = false;
        return;
      }

      // Create task in PocketBase
      const taskData = {
        info: infoSignal.value,
        status: statusSignal.value,
        _garden: taskConfigSignal.value,
        due_date: new Date(dateSignal.value),
        _created_by: currentUser.id,
      };

      // Add parent (task_config) if selected
      if (taskConfigSignal.value) {
        taskData._garden = taskConfigSignal.value;
      }

      if (dateSignal.value) {
        taskData.due_date = new Date(dateSignal.value);
      } else {
        taskData.due_date = new Date();
      }

      // Set the auth token for the request
      pb.authStore.save(getAuthToken() || "", null);

      try {
        await pb.collection("tasks").create(taskData);
        // Redirect to tasks list with success message
        navigate("/tasks");
      } catch (err: any) {
        errorSignal.value = err.message || "Failed to create task";
        console.error("Error creating task:", err);
      }
    } catch (error) {
      console.error("Error creating task:", error);
      errorSignal.value = "An error occurred while creating the task";
    } finally {
      isLoading.value = false;
    }
  });

  return (
    <div class="min-h-screen bg-base-200 p-4">
      <div class="max-w-md mx-auto">
        <h1 class="text-3xl font-bold mb-6">Create New Task</h1>

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

        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <TaskForm
              handleSubmit={handleSubmit}
              gardenSignal={taskConfigSignal}
              statusSignal={statusSignal}
              dateSignal={dateSignal}
              isLoading={isLoading}
              infoSignal={infoSignal}
              btnTitle="Create Task"
              title="New Task"
            />

            <div class="text-center mt-4">
              <a href="/tasks" class="link link-primary">
                Back to Tasks
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Create Task",
  meta: [
    {
      name: "description",
      content: "Create a new task",
    },
  ],
};
