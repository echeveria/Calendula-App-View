import { component$, useSignal, $, useVisibleTask$, NoSerialize } from "@builder.io/qwik";
import { TaskForm } from "~/components/TaskForm/TaskForm";
import { pb, getAuthToken, getUserInfo } from "~/utils/pocketbase";
import { handleImageDelete, handleImageUpload } from "~/utils/views";
import { ReportsInTask } from "~/components/ReportsInTask/ReportsInTask";

export interface TaskModalProps {
  isOpen: boolean;
  onClose: (reload?: boolean) => void;
  date?: string;
  id?: string;
}

export const TaskModal = component$<TaskModalProps>((props) => {
  const { isOpen, onClose, date, id } = props;

  const infoSignal = useSignal("");
  const statusSignal = useSignal("pending");
  const gardenSignal = useSignal<string | null>(null);
  const nameSignal = useSignal("");
  const dateSignal = useSignal("");
  const errorSignal = useSignal("");
  const isLoading = useSignal(false);
  const totalReportsSignal = useSignal<number | undefined>(undefined);
  const readSignal = useSignal<number>(0);
  const imagesPreviewSignal = useSignal<NoSerialize<string[]>>(undefined);
  const imagesSignal = useSignal<NoSerialize<File[]>>(undefined);
  const refreshReportsSignal = useSignal(0);

  // Check if user is logged in and load task data if editing
  useVisibleTask$(async ({ track, cleanup }) => {
    track(() => id);
    track(() => date);

    if (date) {
      dateSignal.value = date;
    }

    // If id is provided, load the task data
    if (id) {
      isLoading.value = true;
      try {
        pb.authStore.save(getAuthToken() || "", null);
        const task = await pb.collection("tasks").getOne(id, {
          expand: "_garden",
        });

        const reports = await pb.collection("reports").getList(1, 1, {
          filter: `_task.id = "${task.id}"`,
        });
        totalReportsSignal.value = reports.totalItems;

        readSignal.value = reports.items.filter((item: any) => item.marked_as_read !== true).length;

        if (task) {
          nameSignal.value = task.expand?._garden.title || "";
          infoSignal.value = task.info || "";
          statusSignal.value = task.status || "pending";
          gardenSignal.value = task.expand?._garden.id || null;
          dateSignal.value = task.due_date ? new Date(task.due_date).toISOString() : "";
          imagesSignal.value = task.images || [];
          imagesPreviewSignal.value = task.images.map((img: any) => pb.files.getURL(task, img));
        }
      } catch (error) {
        console.error("Error loading task:", error);
        errorSignal.value = "Failed to load task data";
      } finally {
        isLoading.value = false;
      }
    } else {
      infoSignal.value = "";
      statusSignal.value = "not_started";
      gardenSignal.value = "";
    }

    cleanup(() => {
      statusSignal.value = "pending";
      infoSignal.value = "";
      gardenSignal.value = null;
      nameSignal.value = "";
      dateSignal.value = "";
      errorSignal.value = "";
      isLoading.value = false;
      totalReportsSignal.value = undefined;
      readSignal.value = 0;
      imagesPreviewSignal.value = undefined;
      imagesSignal.value = undefined;
    });
  });

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

      // Create task data object
      const taskData = {
        info: infoSignal.value,
        status: statusSignal.value,
        due_date: dateSignal.value ? new Date(dateSignal.value) : new Date(),
        _garden: gardenSignal.value,
        _created_by: currentUser.id,
        images: imagesSignal.value,
      };

      // Set the auth token for the request
      pb.authStore.save(getAuthToken() || "", null);
      try {
        if (id) {
          // Update existing task
          await pb.collection("tasks").update(id, taskData);
        } else {
          // Create new task
          await pb.collection("tasks").create(taskData);
        }

        // Close modal and reset form
        onClose(true);
      } catch (err: any) {
        errorSignal.value = err.message || "Failed to save task";
        console.error("Error saving task:", err);
      }
    } catch (error) {
      console.error("Error saving task:", error);
      errorSignal.value = "An error occurred while saving the task";
    } finally {
      isLoading.value = false;
    }
  });

  // Function to delete a task
  const deleteTask = $(async () => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    errorSignal.value = "";

    try {
      // Set the auth token for the request
      pb.authStore.save(getAuthToken() || "", null);

      try {
        if (id) {
          await pb.collection("tasks").delete(id);
        }
      } catch (err: any) {
        errorSignal.value = err.message || "Failed to delete task";
        console.error("Error deleting task:", err);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      errorSignal.value = "An error occurred while deleting the task";
    } finally {
      // Close modal and reset form
      onClose(true);
    }
  });

  return (
    <div class={`modal z-10000  ${isOpen ? "modal-open" : ""}`}>
      <div class="modal-box sm:rounded-none">
        <button class="absolute top-2 right-2  btn btn-circle" onClick$={() => onClose()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-circle-x-icon lucide-circle-x"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
        </button>
        {errorSignal.value && (
          <div class="alert alert-error mt-4 mb-4">
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
        {isOpen && (
          <TaskForm
            handleSubmit={handleSubmit}
            handleDelete={deleteTask}
            gardenSignal={gardenSignal}
            statusSignal={statusSignal}
            dateSignal={dateSignal}
            isLoading={isLoading}
            infoSignal={infoSignal}
            btnTitle={"Запази"}
            title={nameSignal.value || "Нова Задача"}
            id={id}
            totalReports={readSignal.value}
            handleImageUpload={$((files: File[]) =>
              handleImageUpload(files, imagesSignal, imagesPreviewSignal)
            )}
            images={imagesPreviewSignal.value}
            handleImageDelete={$((index: number) =>
              handleImageDelete(index, imagesSignal, imagesPreviewSignal)
            )}
            refreshReportsSignal={refreshReportsSignal}
          />
        )}
        {id && <ReportsInTask taskId={id} refreshTrigger={refreshReportsSignal} />}
      </div>
      <div class="modal-backdrop" onClick$={() => onClose()}></div>
    </div>
  );
});
