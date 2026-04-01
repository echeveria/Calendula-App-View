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
  const showReportForm = useSignal(false);

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
      statusSignal.value = "pending";
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

  const toggleReport = $(() => {
    showReportForm.value = !showReportForm.value;
    if (showReportForm.value) {
      setTimeout(() => {
        const el = document.getElementById("report-form-section");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  });

  return (
    <div class={`modal z-10000  ${isOpen ? "modal-open" : ""}`}>
      <div class="modal-box w-full max-w-full sm:max-w-lg md:max-w-2xl rounded-none flex flex-col overflow-hidden p-0">
        {/* Sticky header */}
        <div class="sticky top-0 z-10 bg-base-100 flex items-center justify-between px-4 py-3 border-b border-base-300 shrink-0">
          <h3 class="font-bold text-lg truncate pr-2">
            {nameSignal.value || "Нова Задача"}
          </h3>
          <button class="btn btn-circle btn-sm shrink-0" onClick$={() => onClose()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div class="flex-1 overflow-y-auto px-4 py-3">
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
              hideTitle={true}
              hideActions={true}
              showReportFormSignal={showReportForm}
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

        {/* Fixed footer buttons */}
        <div class="shrink-0 bg-base-100 border-t border-base-300 px-4 py-3">
          <div class="flex gap-2">
            <button
              type="button"
              class={`btn btn-sm sm:btn-md btn-primary flex-1 min-w-0 ${isLoading.value ? "loading" : ""}`}
              disabled={isLoading.value}
              onClick$={handleSubmit}
            >
              {isLoading.value ? "..." : "Запази"}
            </button>
            <button
              type="button"
              class="btn btn-sm sm:btn-md btn-accent flex-1 min-w-0"
              onClick$={toggleReport}
            >
              {showReportForm.value ? "Скрий" : "Рапорт"}
            </button>
            {id && (
              <button
                type="button"
                class="btn btn-sm sm:btn-md btn-error flex-1 min-w-0"
                onClick$={deleteTask}
              >
                Изтрий
              </button>
            )}
          </div>
        </div>
      </div>
      <div class="modal-backdrop" onClick$={() => onClose()}></div>
    </div>
  );
});
