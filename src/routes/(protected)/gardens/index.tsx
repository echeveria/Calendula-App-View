import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { pb, getAuthToken } from "~/utils/pocketbase";

export default component$(() => {
  const gardensSignal = useSignal<any[]>([]);
  const isLoading = useSignal(true);
  const errorSignal = useSignal("");

  // Function to load gardens from PocketBase
  useVisibleTask$(async () => {
    isLoading.value = true;
    errorSignal.value = "";

    try {
      // Set the auth token for the request
      pb.authStore.save(getAuthToken() || "", null);

      try {
        const response = await pb.collection("gardens").getList(1, 50, {
          sort: "title",
        });

        gardensSignal.value = response.items || [];
      } catch (err: any) {
        errorSignal.value = err.message || "Failed to load gardens";
        console.error("Error loading gardens:", err);
      }
    } catch (error) {
      console.error("Error loading gardens:", error);
      errorSignal.value = "An error occurred while loading gardens";
    } finally {
      isLoading.value = false;
    }
  });

  return (
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-6">Обекти</h1>

      {isLoading.value && (
        <div class="flex justify-center items-center p-8">
          <span class="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {errorSignal.value && <div class="alert alert-error mb-4">{errorSignal.value}</div>}

      {!isLoading.value && gardensSignal.value.length === 0 && (
        <div class="alert alert-info">Няма намерени Обекти.</div>
      )}

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gardensSignal.value.map((garden) => (
          <div key={garden.id} class="card bg-base-100 shadow-xl">
            <figure>
              {garden.photos && garden.photos.length > 0 ? (
                <img
                  src={`${pb.baseURL}/api/files/${garden.collectionId}/${garden.id}/${garden.photos[0]}`}
                  alt={garden.title}
                  class="h-48 w-full object-cover"
                />
              ) : (
                <div class="h-48 w-full bg-gray-200 flex items-center justify-center">
                  <span class="text-gray-400">Няма снимка</span>
                </div>
              )}
            </figure>
            <div class="card-body">
              <h2 class="card-title">{garden.title}</h2>
              <p>{garden.address}</p>
              <div class="card-actions justify-end mt-4">
                <a href={`/gardens/details/${garden.id}`} class="btn btn-primary">
                  Детайли
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
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
