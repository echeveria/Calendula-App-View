import { component$, useSignal, $, NoSerialize } from "@builder.io/qwik";
import { useNavigate, type DocumentHead, useLocation } from "@builder.io/qwik-city";
import { pb, getAuthToken, getUserInfo } from "~/utils/pocketbase";
import { ReportForm } from "~/components/ReportForm";
import { handleImageDelete, handleImageUpload } from "~/utils/views";

export default component$(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const taskId = location.params.taskId;

  const titleSignal = useSignal("");
  const contentSignal = useSignal("");
  const markedAsReadSignal = useSignal(false);
  const errorSignal = useSignal("");
  const isLoading = useSignal(false);

  const imagesPreviewSignal = useSignal<NoSerialize<string[]>>(undefined);
  const imagesSignal = useSignal<NoSerialize<File[]>>(undefined);

  const handleSubmit = $(async () => {
    errorSignal.value = "";
    isLoading.value = true;
    const currentUser = getUserInfo();

    try {
      // Validate form

      if (!titleSignal.value) {
        errorSignal.value = "Report title is required";
        isLoading.value = false;
        return;
      }

      if (!taskId) {
        errorSignal.value = "Report task ID is required";
        isLoading.value = false;
        return;
      }

      if (!contentSignal.value) {
        errorSignal.value = "Report content is required";
        isLoading.value = false;
        return;
      }

      // Create report in PocketBase
      const reportData = {
        title: titleSignal.value,
        content: contentSignal.value,
        marked_as_read: markedAsReadSignal.value,
        _task: taskId,
        _user: currentUser.id,
        images: imagesSignal.value,
      };

      // Set the auth token for the request
      pb.authStore.save(getAuthToken() || "", null);

      try {
        await pb.collection("reports").create(reportData);
        // Redirect to reports list with success message
        navigate("/reports");
      } catch (err: any) {
        errorSignal.value = err.message || "Failed to create report";
        console.error("Error creating report:", err);
      }
    } catch (error) {
      console.error("Error creating report:", error);
      errorSignal.value = "An error occurred while creating the report";
    } finally {
      isLoading.value = false;
    }
  });

  return (
    <div class="min-h-screen bg-base-200 p-4">
      <div class="max-w-md md:max-w-2xl lg:max-w-3xl mx-auto">
        <h1 class="text-3xl font-bold mb-6">Създай репорт</h1>

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
            <ReportForm
              handleSubmit={handleSubmit}
              titleSignal={titleSignal}
              contentSignal={contentSignal}
              markedAsReadSignal={markedAsReadSignal}
              isLoading={isLoading}
              title="Нов Репорт"
              btnTitle="Запази"
              handleImageUpload={$((files: File[]) =>
                handleImageUpload(files, imagesSignal, imagesPreviewSignal)
              )}
              images={imagesPreviewSignal.value}
              handleImageDelete={$((index: number) =>
                handleImageDelete(index, imagesSignal, imagesPreviewSignal)
              )}
            />
            <div class="text-center mt-4">
              <a href="/reports" class="link link-primary">
                Назад към рапорти
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Create Report",
  meta: [
    {
      name: "description",
      content: "Create a new report",
    },
  ],
};
