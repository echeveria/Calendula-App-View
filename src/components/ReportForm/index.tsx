import { component$, Signal } from "@builder.io/qwik";

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
  } = props;

  return (
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
        <textarea
          id="content"
          class="textarea textarea-bordered h-24 w-full"
          value={contentSignal.value}
          onInput$={(e) => (contentSignal.value = (e.target as HTMLTextAreaElement).value)}
          placeholder="Въведете съдържание..."
          required
        ></textarea>
      </div>
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
  );
});
