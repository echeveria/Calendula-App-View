import { $, component$, Signal, useSignal } from "@builder.io/qwik";
import { RichTextEditor } from "~/components/RichTextEditor";

export interface ReportFormProps {
  handleSubmit: () => void;
  titleSignal: Signal<string>;
  contentSignal: Signal<string>;
  markedAsReadSignal: Signal<boolean>;
  isLoading: Signal<boolean>;
  title?: string;
  btnTitle?: string;
  id?: string;
  handleDelete?: () => void;
  handleImageUpload?: (files: File[]) => void;
  handleImageDelete?: (index: number) => void;
  images?: string[];
}

export const ReportForm = component$<ReportFormProps>((props) => {
  const {
    handleSubmit,
    handleDelete,
    titleSignal,
    contentSignal,
    markedAsReadSignal,
    isLoading,
    title = "Нов рапорт",
    btnTitle,
    id,
    handleImageUpload,
    handleImageDelete,
    images,
  } = props;

  const deletable = useSignal(false);
  const isImageModalOpen = useSignal(false);
  const selectedImageUrl = useSignal("");

  // Handle image upload
  const onImageUpload = $((e: Event) => {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const newFiles = Array.from(input.files);
      if (handleImageUpload) {
        handleImageUpload(newFiles);
      }
      deletable.value = true;
    }
  });

  // Handle image deletion
  const onImageDelete = $((index: number) => {
    if (handleImageDelete) {
      handleImageDelete(index);
    }
  });

  // Open image preview modal
  const openImageModal = $((imageUrl: string) => {
    selectedImageUrl.value = imageUrl;
    isImageModalOpen.value = true;
  });

  // Close image preview modal
  const closeImageModal = $(() => {
    isImageModalOpen.value = false;
  });

  return (
    <>
      <form preventdefault:submit onSubmit$={handleSubmit} class="space-y-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-lg">{title}</h3>
        </div>
        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text mr-2">Маркирай като прочетено</span>
            <input
              type="checkbox"
              class="toggle toggle-primary"
              checked={markedAsReadSignal.value}
              onChange$={(e) => (markedAsReadSignal.value = (e.target as HTMLInputElement).checked)}
            />
          </label>
        </div>
        <div class="form-control">
          <label class="label" for="title">
            <span class="label-text">Заглавие</span>
          </label>
          <input
            type="text"
            id="title"
            class="input input-bordered w-full"
            value={titleSignal.value}
            onInput$={(e) => (titleSignal.value = (e.target as HTMLInputElement).value)}
            placeholder="Добавете заглавие..."
            required
          />
        </div>
        <div class="form-control">
          <label class="label" for="content">
            <span class="label-text">Съдържание</span>
          </label>
          <RichTextEditor
            content={contentSignal}
            placeholder="Въведете съдържание..."
            height="h-64"
          />
        </div>

        {/* Image Upload Section */}
        <div class="form-control">
          <label class="label" for="images">
            <span class="label-text">Качи снимки</span>
          </label>
          <input
            type="file"
            id="images"
            class="file-input file-input-bordered w-full"
            accept="image/*"
            multiple
            onChange$={onImageUpload}
          />
        </div>

        {/* Image Preview Section */}
        {images && images.length > 0 && (
          <div class="form-control">
            <label class="label">
              <span class="label-text">Преглед</span>
            </label>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((preview, index) => (
                <div key={index} class="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    class="w-full h-32 object-cover rounded-lg cursor-pointer"
                    onClick$={() => openImageModal(preview)}
                  />
                  {deletable.value && (
                    <button
                      type="button"
                      class="btn btn-circle btn-error btn-sm absolute top-2 right-2"
                      onClick$={() => onImageDelete(index)}
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
          </div>
        )}

        <div class="form-control mt-6">
          <div class="join flex justify-between">
            <button
              type="submit"
              class={`btn btn-primary ${isLoading.value ? "loading" : ""}`}
              disabled={isLoading.value}
            >
              {isLoading.value ? "Запазване..." : btnTitle}
            </button>
            {id && (
              <button class="btn btn-error" onClick$={handleDelete}>
                Изтрий
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Image Preview Modal */}
      {isImageModalOpen.value && (
        <div
          class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick$={closeImageModal}
        >
          <div class="relative max-w-4xl max-h-screen p-4" onClick$={(e) => e.stopPropagation()}>
            <img
              src={selectedImageUrl.value}
              alt="Full size image"
              class="max-w-full max-h-[80vh] object-contain"
            />
            {/* Close button */}
            <button
              class="btn btn-circle btn-sm absolute top-2 right-2 bg-base-200"
              onClick$={closeImageModal}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
});
