import { component$, useSignal, $, useVisibleTask$, NoSerialize } from "@builder.io/qwik";
import { useNavigate, useLocation, type DocumentHead } from "@builder.io/qwik-city";
import { pb, getAuthToken } from "~/utils/pocketbase";
import { TaskForm } from "~/components/TaskForm/TaskForm";
import { handleImageDelete, handleImageUpload } from "~/utils/views";

export default component$(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const taskId = location.params.id;

  const infoSignal = useSignal("");
  const titleSignal = useSignal("");
  const statusSignal = useSignal("");
  const dateSignal = useSignal("");
  const taskConfigSignal = useSignal("");
  const errorSignal = useSignal("");
  const isLoading = useSignal(false);
  const isLoadingTask = useSignal(true);
  const imagesPreviewSignal = useSignal<NoSerialize<string[]>>(undefined);
  const imagesSignal = useSignal<NoSerialize<File[]>>(undefined);

  // Function to load task data from PocketBase
  const loadTask = $(async () => {
    isLoadingTask.value = true;
    errorSignal.value = "";

    try {
      // Set the auth token for the request
      pb.authStore.save(getAuthToken() || "", null);

      try {
        const data = await pb.collection("tasks").getOne(taskId, { expand: "_garden" });

        // Populate form with task data
        infoSignal.value = data.info || "";
        statusSignal.value = data.status || "pending";
        dateSignal.value = data.due_date || new Date();
        titleSignal.value = data.expand?._garden.title;
        imagesSignal.value = data.images || [];
        imagesPreviewSignal.value = data.images.map((img: any) => pb.files.getURL(data, img));

        // Set task config if it exists
        if (data._garden) {
          taskConfigSignal.value = data._garden;
        }
      } catch (err: any) {
        errorSignal.value = err.message || "Failed to load task";
        console.error("Error loading task:", err);
      }
    } catch (error) {
      console.error("Error loading task:", error);
      errorSignal.value = "An error occurred while loading the task";
    } finally {
      isLoadingTask.value = false;
    }
  });
  // Check if user is logged in and load task data
  useVisibleTask$(async () => {
    // Load task data
    await loadTask();
  });

  const handleSubmit = $(async () => {
    errorSignal.value = "";
    isLoading.value = true;

    try {
      // Validate form
      if (!infoSignal.value) {
        errorSignal.value = "Task information is required";
        isLoading.value = false;
        return;
      }

      // Update task in PocketBase
      const taskData = {
        info: infoSignal.value,
        status: statusSignal.value,
        due_date: new Date(dateSignal.value),
        images: imagesSignal.value,
      };

      if (infoSignal.value) {
        taskData.info = infoSignal.value;
      }

      if (dateSignal.value) {
        taskData.due_date = new Date(dateSignal.value);
      }

      // Set the auth token for the request
      pb.authStore.save(getAuthToken() || "", null);

      try {
        await pb.collection("tasks").update(taskId, taskData);
        // Redirect to tasks list with success message
        navigate("/tasks");
      } catch (err: any) {
        errorSignal.value = err.message || "Failed to update task";
        console.error("Error updating task:", err);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      errorSignal.value = "An error occurred while updating the task";
    } finally {
      isLoading.value = false;
    }
  });

  return (
    <div class="min-h-screen bg-base-200 p-4">
      <div class="max-w-md mx-auto">
        <h1 class="text-3xl font-bold mb-6">Редакция</h1>

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

        {isLoadingTask.value ? (
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body flex items-center justify-center">
              <span class="loading loading-spinner loading-lg"></span>
              <p class="mt-4">Loading task data...</p>
            </div>
          </div>
        ) : (
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <TaskForm
                handleSubmit={handleSubmit}
                gardenSignal={taskConfigSignal}
                statusSignal={statusSignal}
                dateSignal={dateSignal}
                isLoading={isLoading}
                infoSignal={infoSignal}
                title={titleSignal.value || "Зова задача"}
                btnTitle="Запази"
                id={taskId}
                handleImageUpload={$((files: File[]) =>
                  handleImageUpload(files, imagesSignal, imagesPreviewSignal)
                )}
                images={imagesPreviewSignal.value}
                handleImageDelete={$((index: number) =>
                  handleImageDelete(index, imagesSignal, imagesPreviewSignal)
                )}
              />
              <div class="text-center mt-4">
                <a href="/tasks" class="link link-primary">
                  Обратно в Задачи
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Редакция",
  meta: [
    {
      name: "description",
      content: "Edit an existing task",
    },
  ],
};
