import { component$, useSignal, $, useVisibleTask$ } from "@builder.io/qwik";
import { pb, getAuthToken, isLoggedIn } from "~/utils/pocketbase";

export interface ReportsListProps {
  onReportSelected?: (reportId: string) => void;
  onRefresh?: () => void;
  showActions?: boolean;
  showCreateButton?: boolean;
}

export const ReportsList = component$<ReportsListProps>(
  ({
    onReportSelected = () => {},
    onRefresh = () => {},
    showActions = true,
    showCreateButton = true,
  }) => {
    const isLoading = useSignal(false);
    const isDeleting = useSignal(false);
    const reports = useSignal<any[]>([]);
    const errorSignal = useSignal("");
    const successSignal = useSignal("");

    // Function to load reports from PocketBase
    const loadReports = $(async () => {
      isLoading.value = true;
      errorSignal.value = "";

      try {
        // Set the auth token for the request
        pb.authStore.save(getAuthToken() || "", null);

        try {
          const response = await pb.collection("reports").getList(1, 50, {
            sort: "-created",
            expand: "_task, _task._garden",
          });

          function deduplicateById<T extends { id: string }>(items: T[]): T[] {
            const map: Record<string, T> = {};
            for (const item of items) {
              map[item.id] = item;
            }
            return Object.values(map);
          }
          reports.value = deduplicateById(response.items) || [];
          onRefresh();
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

    // Function to delete a report
    const deleteReport = $(async (reportId: string) => {
      if (!confirm("Are you sure you want to delete this report?")) {
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
          await pb.collection("reports").delete(reportId);
          successSignal.value = "Report deleted successfully";
          // Refresh the report list
          await loadReports();
        } catch (err: any) {
          errorSignal.value = err.message || "Failed to delete report";
          console.error("Error deleting report:", err);
        }
      } catch (error) {
        console.error("Error deleting report:", error);
        errorSignal.value = "An error occurred while deleting the report";
      } finally {
        isDeleting.value = false;
      }
    });

    return (
      <div class="card bg-base-100 shadow-xl mb-6">
        <div class="card-body">
          <h2 class="card-title">Reports</h2>

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
          ) : reports.value.length === 0 ? (
            <div class="text-center p-4">
              <p>No reports found. Create your first report!</p>
            </div>
          ) : (
            <div class="overflow-x-auto">
              <table class="table w-full">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Task:Date</th>
                    <th>Created At</th>
                    {showActions && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {reports.value.map((report) => (
                    <tr
                      key={report.id}
                      onClick$={() => onReportSelected}
                      class="cursor-pointer hover:bg-base-200"
                    >
                      <td>{report.title}</td>
                      <td>
                        {Object.keys(report.expand).length > 0 && (
                          <a
                            class="link"
                            href={`/tasks/edit/${report.expand._task.id}`}
                          >
                            {report.expand._task.expand._garden.title}
                            {":  "}
                            {new Date(
                              report.expand._task.due_date,
                            ).toLocaleDateString()}
                          </a>
                        )}
                      </td>
                      <td>{new Date(report.created).toLocaleDateString()}</td>
                      {showActions && (
                        <td onClick$={(e) => e.stopPropagation()}>
                          <div class="flex space-x-2">
                            <a
                              href={`/reports/edit/${report.id}`}
                              class="btn btn-sm btn-primary"
                            >
                              Edit
                            </a>
                            <button
                              class={`btn btn-sm btn-error ${isDeleting.value ? "loading" : ""}`}
                              onClick$={() => deleteReport(report.id)}
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
              <a href="/reports/create" class="btn btn-primary">
                Create New Report
              </a>
            </div>
          )}
        </div>
      </div>
    );
  },
);
