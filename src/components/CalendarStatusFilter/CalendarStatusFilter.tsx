import { component$, Signal } from "@builder.io/qwik";
import { taskStatus } from "~/utils/views";

export interface CalendarStatusFilterProps {
  currentStatusFilter: Signal<taskStatus | "all">;
  handleStatusFilterChange: (status: taskStatus | "all") => void;
}

export const CalendarStatusFilter = component$<CalendarStatusFilterProps>((props) => {
  const { currentStatusFilter, handleStatusFilterChange } = props;
  return (
    <>
      {/* Desktop filter buttons - hidden on mobile */}
      <div class="hidden md:flex flex-wrap gap-2 mb-4">
        <button
          class={`btn btn-sm ${currentStatusFilter.value === "all" ? "btn-primary" : "btn-outline"}`}
          onClick$={() => handleStatusFilterChange("all")}
        >
          Всички
        </button>
        <button
          class={`btn btn-sm ${currentStatusFilter.value === "pending" ? "btn-primary" : "btn-outline"}`}
          onClick$={() => handleStatusFilterChange("pending")}
        >
          Бъдещи
        </button>
        <button
          class={`btn btn-sm ${currentStatusFilter.value === "in_progress" ? "btn-primary" : "btn-outline"}`}
          onClick$={() => handleStatusFilterChange("in_progress")}
        >
          Текущи
        </button>
        <button
          class={`btn btn-sm ${currentStatusFilter.value === "completed" ? "btn-primary" : "btn-outline"}`}
          onClick$={() => handleStatusFilterChange("completed")}
        >
          Завършени
        </button>
        <button
          class={`btn btn-sm ${currentStatusFilter.value === "canceled" ? "btn-primary" : "btn-outline"}`}
          onClick$={() => handleStatusFilterChange("canceled")}
        >
          Прекратени
        </button>
      </div>

      {/* Mobile dropdown select - visible only on mobile */}
      <div class="md:hidden mb-4">
        <select
          class="select select-bordered w-full"
          value={currentStatusFilter.value}
          onChange$={(e) =>
            handleStatusFilterChange((e.target as HTMLSelectElement).value as taskStatus | "all")
          }
        >
          <option value="all">Всички</option>
          <option value="pending">Бъдещи</option>
          <option value="in_progress">Текущи</option>
          <option value="completed">Завършени</option>
          <option value="canceled">Прекратени</option>
        </select>
      </div>
    </>
  );
});
