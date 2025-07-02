import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { getAuthToken, pb } from "~/utils/pocketbase";
import { deduplicateById } from "~/utils/views";
import DOMPurify from "dompurify";

export interface ReportsInTaskProps {
  taskId: string;
}

export const ReportsInTask = component$<ReportsInTaskProps>((props) => {
  const { taskId } = props;
  const errorSignal = useSignal("");
  const successSignal = useSignal("");
  const isLoading = useSignal(false);
  const reports = useSignal<any[]>([]);

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
              <li class="list-row" tabIndex={index} key={index}>
                <div>
                  <div class="flex justify-between items-center mb-4">
                    <div class="text-xs uppercase font-semibold opacity-60">{report.title}</div>
                    {report.expand._user && (
                      <span class="badge badge-sm badge-info">{report.expand._user.name}</span>
                    )}
                  </div>
                  <div dangerouslySetInnerHTML={DOMPurify.sanitize(report.content)} />
                  <a href={`/reports/edit/${report.id}`} class="mt-2 badge badge-sm badge-warning">
                    {report.images.length > 0 ? `Снимки ${report.images.length}` : `Няма снимки.`}
                  </a>
                </div>
                <a href={`/reports/edit/${report.id}`} class="btn btn-square btn-ghost">
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
                </a>
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
