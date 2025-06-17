import { component$, useSignal, $, useVisibleTask$ } from "@builder.io/qwik";
import {
  useNavigate,
  useLocation,
  type DocumentHead,
} from "@builder.io/qwik-city";
import { pb, getAuthToken } from "~/utils/pocketbase";
import { ReportForm } from "~/components/ReportForm";

export default component$(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const reportId = location.params.id;

  const titleSignal = useSignal("");
  const contentSignal = useSignal("");
  const errorSignal = useSignal("");
  const isLoading = useSignal(false);
  const isLoadingReport = useSignal(true);

  // Function to load report data from PocketBase
  const loadReport = $(async () => {
    isLoadingReport.value = true;
    errorSignal.value = "";

    try {
      // Set the auth token for the request
      pb.authStore.save(getAuthToken() || "", null);

      try {
        const data = await pb.collection("reports").getOne(reportId);

        // Populate form with report data
        titleSignal.value = data.title || "";
        contentSignal.value = data.content || "";
      } catch (err: any) {
        errorSignal.value = err.message || "Failed to load report";
        console.error("Error loading report:", err);
      }
    } catch (error) {
      console.error("Error loading report:", error);
      errorSignal.value = "An error occurred while loading the report";
    } finally {
      isLoadingReport.value = false;
    }
  });

  // Check if user is logged in and load report data
  useVisibleTask$(async () => {
    // Load report data
    await loadReport();
  });

  const handleSubmit = $(async () => {
    errorSignal.value = "";
    isLoading.value = true;

    try {
      // Validate form
      if (!titleSignal.value) {
        errorSignal.value = "Report title is required";
        isLoading.value = false;
        return;
      }

      if (!contentSignal.value) {
        errorSignal.value = "Report content is required";
        isLoading.value = false;
        return;
      }

      // Update report in PocketBase
      const reportData = {
        title: titleSignal.value,
        content: contentSignal.value,
      };

      // Set the auth token for the request
      pb.authStore.save(getAuthToken() || "", null);

      try {
        await pb.collection("reports").update(reportId, reportData);
        // Redirect to reports list with success message
        navigate("/reports");
      } catch (err: any) {
        errorSignal.value = err.message || "Failed to update report";
        console.error("Error updating report:", err);
      }
    } catch (error) {
      console.error("Error updating report:", error);
      errorSignal.value = "An error occurred while updating the report";
    } finally {
      isLoading.value = false;
    }
  });

  const handleDelete = $(async () => {
    if (!confirm("Are you sure you want to delete this report?")) {
      return;
    }

    errorSignal.value = "";
    isLoading.value = true;

    try {
      // Set the auth token for the request
      pb.authStore.save(getAuthToken() || "", null);

      try {
        await pb.collection("reports").delete(reportId);
        // Redirect to reports list with success message
        navigate("/reports");
      } catch (err: any) {
        errorSignal.value = err.message || "Failed to delete report";
        console.error("Error deleting report:", err);
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      errorSignal.value = "An error occurred while deleting the report";
    } finally {
      isLoading.value = false;
    }
  });

  return (
    <div class="min-h-screen bg-base-200 p-4">
      <div class="max-w-md mx-auto">
        <h1 class="text-3xl font-bold mb-6">Edit Report</h1>

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

        {isLoadingReport.value ? (
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body flex items-center justify-center">
              <span class="loading loading-spinner loading-lg"></span>
              <p class="mt-4">Loading report data...</p>
            </div>
          </div>
        ) : (
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <ReportForm
                handleSubmit={handleSubmit}
                titleSignal={titleSignal}
                contentSignal={contentSignal}
                isLoading={isLoading}
                title={titleSignal.value || "Edit Report"}
                btnTitle="Update Report"
                id={reportId}
                handleDelete={handleDelete}
              />
              <div class="text-center mt-4">
                <a href="/reports" class="link link-primary">
                  Back to Reports
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
  title: "Edit Report",
  meta: [
    {
      name: "description",
      content: "Edit an existing report",
    },
  ],
};
