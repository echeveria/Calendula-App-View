import { component$, useSignal, $, useVisibleTask$, NoSerialize } from "@builder.io/qwik";
import { useNavigate, useLocation, type DocumentHead } from "@builder.io/qwik-city";
import { pb, getAuthToken } from "~/utils/pocketbase";
import { handleImageDelete, handleImageUpload } from "~/utils/views";
import { RichTextEditor } from "~/components/RichTextEditor";

export default component$(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const gardenId = location.params.id;

  const titleSignal = useSignal("");
  const addressSignal = useSignal("");
  const descriptionSignal = useSignal("");
  const errorSignal = useSignal("");
  const successSignal = useSignal("");
  const isLoading = useSignal(false);
  const isLoadingGarden = useSignal(true);
  const imagesPreviewSignal = useSignal<NoSerialize<string[]>>(undefined);
  const imagesSignal = useSignal<NoSerialize<File[]>>(undefined);

  // Function to load garden data from PocketBase
  const loadGarden = $(async () => {
    isLoadingGarden.value = true;
    errorSignal.value = "";

    try {
      // Set the auth token for the request
      pb.authStore.save(getAuthToken() || "", null);

      try {
        const data = await pb.collection("gardens").getOne(gardenId);

        // Populate form with garden data
        titleSignal.value = data.title || "";
        addressSignal.value = data.address || "";
        descriptionSignal.value = data.description || "";

        // Handle images
        if (data.photos && data.photos.length > 0) {
          imagesSignal.value = data.photos || [];
          imagesPreviewSignal.value = data.photos.map((img: any) => pb.files.getURL(data, img));
        }
      } catch (err: any) {
        errorSignal.value = err.message || "Failed to load garden";
        console.error("Error loading garden:", err);
      }
    } catch (error) {
      console.error("Error loading garden:", error);
      errorSignal.value = "An error occurred while loading the garden";
    } finally {
      isLoadingGarden.value = false;
    }
  });

  // Check if user is logged in and load garden data
  useVisibleTask$(async () => {
    // Load garden data
    await loadGarden();
  });

  const handleSubmit = $(async () => {
    errorSignal.value = "";
    successSignal.value = "";
    isLoading.value = true;

    try {
      // Validate form
      if (!titleSignal.value) {
        errorSignal.value = "Garden title is required";
        isLoading.value = false;
        return;
      }

      // Update garden in PocketBase
      const gardenData: any = {
        title: titleSignal.value,
        address: addressSignal.value,
        description: descriptionSignal.value,
      };

      // Add images if they exist
      if (imagesSignal.value) {
        gardenData.photos = imagesSignal.value;
      }

      // Set the auth token for the request
      pb.authStore.save(getAuthToken() || "", null);

      try {
        await pb.collection("gardens").update(gardenId, gardenData);
        successSignal.value = "Garden updated successfully";

        // Redirect to gardens list after a short delay
        setTimeout(() => {
          navigate("/gardens");
        }, 1500);
      } catch (err: any) {
        errorSignal.value = err.message || "Failed to update garden";
        console.error("Error updating garden:", err);
      }
    } catch (error) {
      console.error("Error updating garden:", error);
      errorSignal.value = "An error occurred while updating the garden";
    } finally {
      isLoading.value = false;
    }
  });

  return (
    <div class="min-h-screen bg-base-200 p-4">
      <div class="max-w-md md:max-w-2xl lg:max-w-3xl mx-auto">
        <h1 class="text-3xl font-bold mb-6">Редакция на обект</h1>

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

        {isLoadingGarden.value ? (
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body flex items-center justify-center">
              <span class="loading loading-spinner loading-lg"></span>
              <p class="mt-4">Зареждане на данни...</p>
            </div>
          </div>
        ) : (
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <form preventdefault:submit onSubmit$={handleSubmit} class="space-y-4">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Заглавие</span>
                  </label>
                  <input
                    type="text"
                    class="input input-bordered w-full"
                    value={titleSignal.value}
                    onInput$={(e: any) => (titleSignal.value = e.target.value)}
                    required
                  />
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Адрес</span>
                  </label>
                  <input
                    type="text"
                    class="input input-bordered w-full"
                    value={addressSignal.value}
                    onInput$={(e: any) => (addressSignal.value = e.target.value)}
                  />
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Описание</span>
                  </label>
                  <RichTextEditor
                    content={descriptionSignal}
                    placeholder="Въведете описание..."
                    height="h-64"
                  />
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Снимки</span>
                  </label>
                  <input
                    type="file"
                    class="file-input file-input-bordered w-full"
                    accept="image/*"
                    multiple
                    onChange$={(e: any) => {
                      if (e.target.files) {
                        handleImageUpload(
                          Array.from(e.target.files),
                          imagesSignal,
                          imagesPreviewSignal
                        );
                      }
                    }}
                  />
                </div>

                {/* Image previews */}
                {imagesPreviewSignal.value && imagesPreviewSignal.value.length > 0 && (
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text">Преглед</span>
                    </label>
                    <div class="grid grid-cols-3 gap-2">
                      {imagesPreviewSignal.value.map((preview, index) => (
                        <div key={index} class="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index}`}
                            class="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            class="btn btn-circle btn-error btn-sm absolute top-2 right-2"
                            onClick$={() => handleImageDelete(index, imagesSignal, imagesPreviewSignal)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div class="form-control mt-6">
                  <div class="join flex justify-between">
                    <button
                      type="submit"
                      class={`btn btn-primary ${isLoading.value ? "loading" : ""}`}
                      disabled={isLoading.value}
                    >
                      {isLoading.value ? "Запазване..." : "Запази"}
                    </button>
                  </div>
                </div>
              </form>

              <div class="text-center mt-4">
                <a href="/gardens" class="link link-primary">
                  Обратно към Обекти
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
  title: "Редакция на обект",
  meta: [
    {
      name: "description",
      content: "Edit an existing garden",
    },
  ],
};
