import { $, component$, Signal, useSignal } from "@builder.io/qwik";
import { GardensSelector } from "~/components/GardensSelector";
import { taskStatusValue } from "~/utils/views";

export interface TaskFormProps {
  handleSubmit: () => void;
  handleDelete?: () => void;
  handleImageUpload: (files: File[]) => void;
  handleImageDelete: (index: number) => void;
  images?: string[];
  gardenSignal: Signal<string | null>;
  statusSignal: Signal<string>;
  dateSignal: Signal<string>;
  infoSignal: Signal<string>;
  isLoading: Signal<boolean>;
  title?: string;
  btnTitle?: string;
  id?: string;
  totalReports?: number;
}

export const TaskForm = component$<TaskFormProps>((props) => {
  const {
    handleSubmit,
    handleDelete,
    gardenSignal,
    statusSignal,
    dateSignal,
    infoSignal,
    isLoading,
    title = "New Task",
    btnTitle,
    id,
    totalReports,
    handleImageDelete,
    handleImageUpload,
    images,
  } = props;

  const deletable = useSignal(false);

  const onSelectionChange = $((id: string) => (props.gardenSignal.value = id));

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
    handleImageDelete(index);
  });

  return (
    <form preventdefault:submit onSubmit$={handleSubmit} class="space-y-4">
      <h3 class="font-bold text-lg mb-4">{title}</h3>
      <div class="form-control">
        <GardensSelector
          selectedId={gardenSignal.value}
          onSelectionChange={onSelectionChange}
        />
      </div>
      <div class="form-control">
        <label class="label" for="status">
          <span class="label-text">Статус</span>
        </label>
        <select
          id="status"
          class="select select-bordered w-full"
          value={statusSignal.value}
          onChange$={(e) =>
            (statusSignal.value = (e.target as HTMLSelectElement).value)
          }
        >
          {taskStatusValue.map((config) => (
            <option key={config} value={config}>
              {config}
            </option>
          ))}
        </select>
      </div>
      <div class="form-control">
        <label class="label" for="date">
          <span class="label-text">Дата на изпълнение</span>
        </label>
        <input
          type="datetime-local"
          id="date"
          class="input w-full"
          value={(dateSignal.value.length
            ? new Date(dateSignal.value)
            : new Date()
          )
            .toISOString()
            .slice(0, 16)}
          onInput$={(e) =>
            (dateSignal.value = (e.target as HTMLInputElement).value)
          }
        />
      </div>
      <div class="form-control">
        <label class="label" for="info">
          <span class="label-text">Информация</span>
        </label>
        <textarea
          id="info"
          class="textarea textarea-bordered h-24 w-full"
          value={infoSignal.value}
          onInput$={(e) =>
            (infoSignal.value = (e.target as HTMLTextAreaElement).value)
          }
          placeholder="Детайли на задачата..."
          required
        ></textarea>
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
                  class="w-full h-32 object-cover rounded-lg"
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
            {isLoading.value ? "Updating..." : btnTitle}
          </button>
          <div class="indicator">
            {!!totalReports && (
              <span class="indicator-item badge badge-secondary">
                {totalReports}
              </span>
            )}
            <a href={`/reports/create/${id}`} class="btn btn-accent">
              Рапорт
            </a>
          </div>
          {/*          <button class="btn btn-info">Преглед</button>*/}
          {id && (
            <button class="btn btn-error" onClick$={handleDelete}>
              Изтрий
            </button>
          )}
        </div>
      </div>
    </form>
  );
});
