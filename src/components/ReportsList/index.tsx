import { component$, useSignal, $, useVisibleTask$ } from "@builder.io/qwik";
import { pb, getAuthToken, isLoggedIn } from "~/utils/pocketbase";
import { useLocation } from "@builder.io/qwik-city";
import { Pagination } from "~/components/Pagination";

export interface ReportsListProps {
  onReportSelected?: (reportId: string) => void;
  onRefresh?: () => void;
  showActions?: boolean;
  showCreateButton?: boolean;
}

type FilterType = "all" | "old" | "today" | "not_read";

export const ReportsList = component$<ReportsListProps>(
  ({
    onReportSelected = () => {},
    onRefresh = () => {},
    showActions = true,
    showCreateButton = true,
  }) => {
    const loc = useLocation();
    const taskId = loc.url.searchParams.get("taskId");
    const isLoading = useSignal(false);
    const isDeleting = useSignal(false);
    const reports = useSignal<any[]>([]);
    const errorSignal = useSignal("");
    const successSignal = useSignal("");
    const currentFilter = useSignal<FilterType>("all");
    const currentPage = useSignal(1);
    const totalPages = useSignal(1);
    const itemsPerPage = 20;

    // Function to load reports from PocketBase
    const loadReports = $(async () => {
      isLoading.value = true;
      errorSignal.value = "";

      try {
        // Set the auth token for the request
        pb.authStore.save(getAuthToken() || "", null);

        try {
          let filterStr = "";

          // Base filter for task ID if provided
          if (taskId) {
            filterStr = `_task.id = "${taskId}"`;
          }

          // Apply additional filters based on currentFilter
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const todayISOString = today.toISOString();

          switch (currentFilter.value) {
            case "today":
              filterStr = filterStr
                ? `${filterStr} && created >= "${todayISOString}"`
                : `created >= "${todayISOString}"`;
              break;
            case "old":
              filterStr = filterStr
                ? `${filterStr} && created < "${todayISOString}"`
                : `created < "${todayISOString}"`;
              break;
            case "not_read":
              filterStr = filterStr
                ? `${filterStr} && marked_as_read = false`
                : `marked_as_read = false`;
              break;
            case "all":
            default:
              // No additional filter for "all"
              break;
          }

          const filter = filterStr ? { filter: filterStr } : undefined;

          const response = await pb.collection("reports").getList(currentPage.value, itemsPerPage, {
            sort: "-created",
            expand: "_task, _task._garden",
            ...filter,
          });

          function deduplicateById<T extends { id: string }>(items: T[]): T[] {
            const map: Record<string, T> = {};
            for (const item of items) {
              map[item.id] = item;
            }
            return Object.values(map);
          }
          reports.value = deduplicateById(response.items) || [];

          // Calculate total pages
          totalPages.value = Math.ceil(response.totalItems / itemsPerPage);
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

    // Function to handle filter changes
    const handleFilterChange = $((filter: FilterType) => {
      currentFilter.value = filter;
      currentPage.value = 1; // Reset to first page when filter changes
      loadReports();
    });

    // Function to handle page navigation
    const goToPage = $((page: number) => {
      if (page < 1 || page > totalPages.value) return;
      currentPage.value = page;
      loadReports();
    });

    // Function to go to next page
    const nextPage = $(() => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
        loadReports();
      }
    });

    // Function to go to previous page
    const prevPage = $(() => {
      if (currentPage.value > 1) {
        currentPage.value--;
        loadReports();
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
          <h2 class="card-title">Рапорти</h2>

          <div class="flex flex-wrap gap-2 my-4">
            <button
              class={`btn btn-sm ${currentFilter.value === "all" ? "btn-primary" : "btn-outline"}`}
              onClick$={() => handleFilterChange("all")}
            >
              Всички
            </button>
            <button
              class={`btn btn-sm ${currentFilter.value === "old" ? "btn-primary" : "btn-outline"}`}
              onClick$={() => handleFilterChange("old")}
            >
              Стари
            </button>
            <button
              class={`btn btn-sm ${currentFilter.value === "today" ? "btn-primary" : "btn-outline"}`}
              onClick$={() => handleFilterChange("today")}
            >
              Днешни
            </button>
            <button
              class={`btn btn-sm ${currentFilter.value === "not_read" ? "btn-primary" : "btn-outline"}`}
              onClick$={() => handleFilterChange("not_read")}
            >
              Непрочетени
            </button>
          </div>

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
              <p>
                Няма рапорти.{" "}
                <a href="/calendar" class="link">
                  Създайте първият!
                </a>
              </p>
            </div>
          ) : (
            <div class="overflow-x-auto">
              <table class="table w-full">
                <thead>
                  <tr>
                    <th>Заглавие</th>
                    <th>Задача:Дата</th>
                    <th>Създаден на</th>
                    {showActions && <th>Действия</th>}
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
                          <a class="link" href={`/tasks/edit/${report.expand._task.id}`}>
                            {report.expand._task.expand._garden.title}
                            {":  "}
                            {new Date(report.expand._task.due_date).toLocaleDateString()}
                          </a>
                        )}
                      </td>
                      <td>{new Date(report.created).toLocaleDateString()}</td>
                      {showActions && (
                        <td onClick$={(e) => e.stopPropagation()}>
                          <div class="flex space-x-2">
                            <a href={`/reports/edit/${report.id}`} class="btn btn-sm btn-primary">
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

          {/* Pagination controls */}
          {!isLoading.value && reports.value.length > 0 && (
            <Pagination
              currentPage={currentPage.value}
              totalPages={totalPages.value}
              onPrevPage={prevPage}
              onNextPage={nextPage}
              onGoToPage={goToPage}
            />
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
  }
);
