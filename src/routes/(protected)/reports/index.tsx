import { component$, useSignal, $ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { ReportsList } from "~/components/ReportsList";

export default component$(() => {
  const successSignal = useSignal("");

  // Handle report selection
  const handleReportSelected = $((reportId: string) => {
    console.log("Report selected:", reportId);
    // You can navigate to the report details or perform other actions
  });

  // Handle refresh
  const handleRefresh = $(() => {
    // This will be called after reports are loaded
    console.log("Reports refreshed");
  });

  return (
    <div class="min-h-screen bg-base-200 p-4">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold mb-6">Report Management</h1>

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

        <ReportsList
          onReportSelected={handleReportSelected}
          onRefresh={handleRefresh}
          showActions={true}
          showCreateButton={false}
        />
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Report Management",
  meta: [
    {
      name: "description",
      content: "Create and manage your reports",
    },
  ],
};
