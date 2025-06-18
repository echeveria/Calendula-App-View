import { $, component$, Signal } from "@builder.io/qwik";
import { GardensSelector } from "~/components/GardensSelector";
import { taskStatusValue } from "~/utils/views";

export interface TaskFormProps {
  handleSubmit: () => void;
  handleDelete?: () => void;
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
  } = props;

  const onSelectionChange = $((id: string) => (props.gardenSignal.value = id));

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
          <span class="label-text">Status</span>
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
          <span class="label-text">Task Date</span>
        </label>
        <input
          type="datetime-local"
          id="date"
          class="input w-full"
          value={(dateSignal.value.length
            ? new Date(dateSignal.value)
            : new Date()
          ).toISOString()}
          onInput$={(e) =>
            (dateSignal.value = (e.target as HTMLInputElement).value)
          }
        />
      </div>
      <div class="form-control">
        <label class="label" for="info">
          <span class="label-text">Task Information</span>
        </label>
        <textarea
          id="info"
          class="textarea textarea-bordered h-24 w-full"
          value={infoSignal.value}
          onInput$={(e) =>
            (infoSignal.value = (e.target as HTMLTextAreaElement).value)
          }
          placeholder="Enter task details..."
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
            {isLoading.value ? "Updating..." : btnTitle}
          </button>
          <div class="indicator">
            {!!totalReports && (
              <span class="indicator-item badge badge-secondary">
                {totalReports}
              </span>
            )}
            <a href={`/reports/create/${id}`} class="btn btn-accent">
              Report
            </a>
          </div>
          <button class="btn btn-info">View</button>
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
