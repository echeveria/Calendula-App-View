import { component$, useSignal, $, Signal } from "@builder.io/qwik";

export interface ImageCarouselProps {
  images: string[];
  onDelete?: (index: number) => void;
  showDeleteButton?: boolean;
}

export const ImageCarousel = component$<ImageCarouselProps>(
  ({ images, onDelete, showDeleteButton = false }) => {
    const currentIndex = useSignal(0);
    const isModalOpen = useSignal(false);
    const modalImageIndex = useSignal(0);

    // Navigate to the next image
    const nextImage = $(() => {
      if (currentIndex.value < images.length - 1) {
        currentIndex.value++;
      } else {
        currentIndex.value = 0; // Loop back to the first image
      }
    });

    // Navigate to the previous image
    const prevImage = $(() => {
      if (currentIndex.value > 0) {
        currentIndex.value--;
      } else {
        currentIndex.value = images.length - 1; // Loop to the last image
      }
    });

    // Open the modal with the clicked image
    const openModal = $((index: number) => {
      modalImageIndex.value = index;
      isModalOpen.value = true;
    });

    // Close the modal
    const closeModal = $(() => {
      isModalOpen.value = false;
    });

    // Handle image deletion
    const handleDelete = $((index: number) => {
      if (onDelete) {
        onDelete(index);
        // Adjust current index if needed
        // if (currentIndex.value >= images.length - 1) {
        //   currentIndex.value = Math.max(0, images.length - 2);
        // }
      }
    });

    if (!images || images.length === 0) {
      return (
        <div class="h-48 w-full bg-gray-200 flex items-center justify-center">
          <span class="text-gray-400">Няма снимки</span>
        </div>
      );
    }

    return (
      <div class="relative">
        {/* Main carousel */}
        <div class="carousel w-full rounded-lg overflow-hidden">
          {images.map((image, index) => (
            <div
              key={index}
              class={`carousel-item relative w-full ${
                index === currentIndex.value ? "block" : "hidden"
              }`}
            >
              <img
                src={image}
                alt={`Image ${index + 1}`}
                class="w-full object-cover rounded cursor-pointer"
                onClick$={() => openModal(index)}
              />

              {/* Navigation arrows */}
              <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <button
                  class="btn btn-circle btn-sm bg-base-200 bg-opacity-70"
                  onClick$={prevImage}
                >
                  ❮
                </button>
                <button
                  class="btn btn-circle btn-sm bg-base-200 bg-opacity-70"
                  onClick$={nextImage}
                >
                  ❯
                </button>
              </div>

              {/* Delete button */}
              {showDeleteButton && (
                <button
                  class="btn btn-circle btn-error btn-sm absolute top-2 right-2"
                  onClick$={() => handleDelete(index)}
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
              )}
            </div>
          ))}
        </div>

        {/* Thumbnail navigation */}
        {images.length > 1 && (
          <div class="flex justify-center mt-2 space-x-2 overflow-x-auto">
            {images.map((image, index) => (
              <div
                key={index}
                class={`w-16 h-16 cursor-pointer rounded-md overflow-hidden border-2 ${
                  index === currentIndex.value ? "border-primary" : "border-transparent"
                }`}
                onClick$={() => (currentIndex.value = index)}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  class="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Modal for full-size image view */}
        {isModalOpen.value && (
          <div
            class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
            onClick$={closeModal}
          >
            <div class="relative max-w-4xl max-h-screen p-4" onClick$={(e) => e.stopPropagation()}>
              <img
                src={images[modalImageIndex.value]}
                alt={`Full size image ${modalImageIndex.value + 1}`}
                class="max-w-full max-h-[80vh] object-contain"
              />

              {/* Modal navigation */}
              <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <button
                  class="btn btn-circle"
                  onClick$={() => {
                    if (modalImageIndex.value > 0) {
                      modalImageIndex.value--;
                    } else {
                      modalImageIndex.value = images.length - 1;
                    }
                  }}
                >
                  ❮
                </button>
                <button
                  class="btn btn-circle"
                  onClick$={() => {
                    if (modalImageIndex.value < images.length - 1) {
                      modalImageIndex.value++;
                    } else {
                      modalImageIndex.value = 0;
                    }
                  }}
                >
                  ❯
                </button>
              </div>

              {/* Close button */}
              <button
                class="btn btn-circle btn-sm absolute top-2 right-2 bg-base-200"
                onClick$={closeModal}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);
