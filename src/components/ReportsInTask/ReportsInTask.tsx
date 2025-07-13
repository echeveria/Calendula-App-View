import {
  $,
  component$,
  useSignal,
  useVisibleTask$,
  Signal,
  NoSerialize,
  noSerialize,
} from "@builder.io/qwik";
import { getAuthToken, pb } from "~/utils/pocketbase";
import { deduplicateById, handleImageDelete, handleImageUpload } from "~/utils/views";
import DOMPurify from "dompurify";
import { ReportForm } from "~/components/ReportForm";

export interface ReportsInTaskProps {
  taskId: string;
  refreshTrigger?: Signal<number>;
}

export const ReportsInTask = component$<ReportsInTaskProps>((props) => {
  const { taskId, refreshTrigger } = props;
  const errorSignal = useSignal("");
  const successSignal = useSignal("");
  const isLoading = useSignal(false);
  const reports = useSignal<any[]>([]);

  // Edit form state
  const editingReportId = useSignal<string | null>(null);
  const editTitleSignal = useSignal("");
  const editContentSignal = useSignal("");
  const editMarkedAsReadSignal = useSignal(false);
  const editIsLoading = useSignal(false);
  const editImagesPreviewSignal = useSignal<NoSerialize<string[]>>(undefined);
  const editImagesSignal = useSignal<NoSerialize<File[]>>(undefined);

  const loadReports = $(async () => {
    isLoading.value = true;
    errorSignal.value = "";

    try {
      // Set the auth token for the request
      pb.authStore.save(getAuthToken() || "", null);

      try {
        let filterStr = "";

        filterStr = `_task.id = "${taskId}"`;

        // Apply additional filters based on currentFilter
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const response = await pb.collection("reports").getFullList({
          filter: filterStr,
          sort: "-created",
          expand: "_task, _task._garden, _user",
          requestKey: null,
        });

        reports.value = deduplicateById(response) || [];
        console.log(reports.value);
      } catch (err: any) {
        errorSignal.value = err.message || "Failed to load reports";
        console.error("Error loading reports:", err);
      }
    } catch (error) {
      console.error("Error loading reports:", error);
      errorSignal.value = "An error occurred while loading reports";
    } finally {
      isLoading.value = false;
    }
  });

  // Load reports when component mounts
  useVisibleTask$(async () => {
    await loadReports();
  });

  // Load reports when refresh trigger changes
  useVisibleTask$(async ({ track }) => {
    if (refreshTrigger) {
      track(() => refreshTrigger.value);
      if (refreshTrigger.value > 0) {
        await loadReports();
      }
    }
  });

  // Start editing a report
  const startEditReport = $(async (report: any) => {
    editingReportId.value = report.id;
    editTitleSignal.value = report.title || "";
    editContentSignal.value = report.content || "";
    editMarkedAsReadSignal.value = report.marked_as_read || false;

    // Load images if available
    if (report.images && report.images.length > 0) {
      const imageUrls = report.images.map((image: any) => pb.files.getURL(report, image));
      editImagesPreviewSignal.value = noSerialize(imageUrls);
    } else {
      editImagesPreviewSignal.value = undefined;
    }
    editImagesSignal.value = undefined;
  });

  // Cancel editing
  const cancelEdit = $(() => {
    editingReportId.value = null;
    editTitleSignal.value = "";
    editContentSignal.value = "";
    editMarkedAsReadSignal.value = false;
    editImagesPreviewSignal.value = undefined;
    editImagesSignal.value = undefined;
  });

  // Update report
  const updateReport = $(async () => {
    if (!editingReportId.value) return;

    editIsLoading.value = true;
    errorSignal.value = "";

    try {
      // Validate form
      if (!editTitleSignal.value) {
        errorSignal.value = "Report title is required";
        editIsLoading.value = false;
        return;
      }

      if (!editContentSignal.value) {
        errorSignal.value = "Report content is required";
        editIsLoading.value = false;
        return;
      }

      // Update report in PocketBase
      const reportData = {
        title: editTitleSignal.value,
        content: editContentSignal.value,
        marked_as_read: editMarkedAsReadSignal.value,
        images: editImagesSignal.value,
      };

      // Set the auth token for the request
      pb.authStore.save(getAuthToken() || "", null);

      await pb.collection("reports").update(editingReportId.value, reportData);

      // Show success message
      successSignal.value = "Рапортът е обновен успешно!";

      // Refresh reports list
      await loadReports();

      // Cancel edit mode
      cancelEdit();
    } catch (error: any) {
      errorSignal.value = error.message || "Failed to update report";
      console.error("Error updating report:", error);
    } finally {
      editIsLoading.value = false;
    }
  });

  return (
    <div class="my-4">
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
      <div>
        <ul class="list bg-base-100 rounded-box shadow-md">
          <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">Репорти</li>
          {reports.value.length > 0 ? (
            reports.value.map((report, index) => (
              <li class="list" tabIndex={index} key={index}>
                {!editingReportId.value && (
                  <div class="m-2">
                    <div>
                      <div class="mb-4">
                        <div class="text-xs uppercase font-semibold opacity-60">{report.title}</div>
                        <div class="flex justify-between items-center mb-4">
                          {report.expand._user && (
                            <span class="badge badge-sm badge-info mt-2">
                              {report.expand._user.name}
                            </span>
                          )}
                          <button
                            type="button"
                            class="btn btn-square btn-ghost inline"
                            onClick$={() => startEditReport(report)}
                          >
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
                              class="lucide lucide-square-pen-icon lucide-square-pen"
                            >
                              <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div dangerouslySetInnerHTML={DOMPurify.sanitize(report.content)} />
                      <a
                        href={`/reports/edit/${report.id}`}
                        class="mt-2 badge badge-sm badge-warning"
                      >
                        {report.images.length > 0
                          ? `Снимки ${report.images.length}`
                          : `Няма снимки`}
                      </a>
                    </div>
                  </div>
                )}

                {/* Edit Form */}
                {editingReportId.value && (
                  <div class="relative mt-6 p-4 bg-base-50 ">
                    <button
                      type="button"
                      class="absolute right-1 btn btn-square btn-ghost inline"
                      onClick$={cancelEdit}
                    >
                      ✕
                    </button>

                    <ReportForm
                      handleSubmit={updateReport}
                      titleSignal={editTitleSignal}
                      contentSignal={editContentSignal}
                      markedAsReadSignal={editMarkedAsReadSignal}
                      isLoading={editIsLoading}
                      title="Редактиране на рапорт"
                      btnTitle="Обнови рапорт"
                      id={editingReportId.value}
                      handleImageUpload={$((files: File[]) =>
                        handleImageUpload(files, editImagesSignal, editImagesPreviewSignal)
                      )}
                      images={editImagesPreviewSignal.value}
                      handleImageDelete={$((index: number) =>
                        handleImageDelete(index, editImagesSignal, editImagesPreviewSignal)
                      )}
                    />
                  </div>
                )}
              </li>
            ))
          ) : (
            <li class="list-row">Няма добавени репорти</li>
          )}
        </ul>
      </div>
    </div>
  );
});
