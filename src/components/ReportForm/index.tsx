import { component$, Signal } from "@builder.io/qwik";

export interface ReportFormProps {
  handleSubmit: () => void;
  titleSignal: Signal<string>;
  contentSignal: Signal<string>;
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
    isLoading,
    title = "New Report",
    btnTitle,
    id,
  } = props;

  return (
    <form preventdefault:submit onSubmit$={handleSubmit} class="space-y-4">
      <h3 class="font-bold text-lg mb-4">{title}</h3>
      <div class="form-control">
        <label class="label" for="title">
          <span class="label-text">Report Title</span>
        </label>
        <input
          type="text"
          id="title"
          class="input input-bordered w-full"
          value={titleSignal.value}
          onInput$={(e) =>
            (titleSignal.value = (e.target as HTMLInputElement).value)
          }
          placeholder="Enter report title..."
          required
        />
      </div>
      <div class="form-control">
        <label class="label" for="content">
          <span class="label-text">Report Content</span>
        </label>
        <textarea
          id="content"
          class="textarea textarea-bordered h-24 w-full"
          value={contentSignal.value}
          onInput$={(e) =>
            (contentSignal.value = (e.target as HTMLTextAreaElement).value)
          }
          placeholder="Enter report content..."
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
            {isLoading.value ? "Saving..." : btnTitle}
          </button>
          {id && (
            <button class="btn btn-error" onClick$={handleDelete}>
              Delete
            </button>
          )}
        </div>
      </div>
    </form>
  );
});
