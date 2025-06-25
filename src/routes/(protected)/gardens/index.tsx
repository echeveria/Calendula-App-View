import { component$, $ } from "@builder.io/qwik";
import { DocumentHead, useNavigate } from "@builder.io/qwik-city";
import { GardensList } from "~/components/GardensList";

export default component$(() => {
  const navigate = useNavigate();

  // Function to handle garden list refresh and check if there's only one garden
  const handleRefresh = $((gardens?: any[], search?: string | undefined) => {
    if (!search && gardens && gardens.length === 1) {
      navigate(`/gardens/details/${gardens[0].id}`);
    }
  });

  return (
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-6">Обекти</h1>
      <GardensList onRefresh={handleRefresh} showActions={true} showCreateButton={true} />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Gardens",
  meta: [
    {
      name: "description",
      content: "List of gardens",
    },
  ],
};
