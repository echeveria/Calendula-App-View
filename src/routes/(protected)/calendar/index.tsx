import { $, component$, useSignal, useStore, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { getAuthToken, getUserInfo, pb } from "~/utils/pocketbase";
import { TaskModal } from "~/components/TaskModal";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Calendar } from "@fullcalendar/core";
import bgLocale from "@fullcalendar/core/locales/bg";
import { formatStatus, statusToColor, taskStatus, taskStatusValue } from "~/utils/views";

export default component$(() => {
  const isModalOpen = useSignal(false);
  const selectedDate = useSignal("");
  const selectedTaskId = useSignal("");
  const currentStatusFilter = useSignal<"all" | taskStatus>("all");

  const closeModal = $((reload?: boolean) => {
    isModalOpen.value = false;
    selectedDate.value = "";
    selectedTaskId.value = "";
    if (typeof window !== "undefined" && reload) {
      window.location.reload();
    }
  });

  const tasks = useStore<{ value: any[] }>({ value: [] });
  const isLoading = useSignal(false);
  const errorSignal = useSignal("");

  // Function to handle status filter changes
  const handleStatusFilterChange = $((status: "all" | taskStatus) => {
    currentStatusFilter.value = status;
    loadTasks();
  });

  // Function to load tasks from PocketBase
  const loadTasks = $(async () => {
    isLoading.value = true;
    errorSignal.value = "";

    try {
      // Set the auth token for the request
      pb.authStore.save(getAuthToken() || "", null);

      const user = getUserInfo();
      let filterStr = "";

      if (user.type === "owner") {
        filterStr = `garden._owner = "${user.id}"`;
      }

      // Add status filter if not "all"
      if (currentStatusFilter.value !== "all") {
        const statusFilter = `status = "${currentStatusFilter.value}"`;
        filterStr = filterStr ? `${filterStr} && ${statusFilter}` : statusFilter;
      }

      const filter = filterStr ? { filter: filterStr } : undefined;

      try {
        const response = await pb.collection("tasks").getFullList({
          sort: "-created",
          expand: "_garden",
          ...filter,
        });

        tasks.value = response || [];
      } catch (err: any) {
        errorSignal.value = err.message || "Failed to load tasks";
        console.error("Error loading tasks:", err);
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
      errorSignal.value = "An error occurred while loading tasks";
    } finally {
      isLoading.value = false;
    }
  });

  useVisibleTask$(async ({ track }) => {
    // Track changes to tasks and currentStatusFilter
    track(() => tasks.value);
    track(() => currentStatusFilter.value);

    await loadTasks();

    const calendarEl = document.getElementById("calendar");

    if (calendarEl) {
      // Clear the calendar element to avoid duplicate calendars
      calendarEl.innerHTML = "";

      const calendar = new Calendar(calendarEl, {
        plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, dayGridPlugin],
        initialView: "dayGridMonth",
        selectable: true,
        dateClick: function (info) {
          info.jsEvent.preventDefault();
          selectedDate.value = info.dateStr;
          selectedTaskId.value = "";
          isModalOpen.value = true;
        },
        eventClick: function (info) {
          info.jsEvent.preventDefault();
          selectedTaskId.value = info.event.id;
          selectedDate.value = "";
          isModalOpen.value = true;
        },
        locales: [bgLocale],
        locale: "bg",
        titleFormat: { month: "long" },
        customButtons: {
          myCustomButton: {
            text: "custom!",
            click: function () {
              alert("clicked the custom button!");
            },
          },
        },
        headerToolbar: {
          left: "title",
          right: "dayGridMonth,timeGridWeek,dayGridDay",
        },
        footerToolbar: { right: "prev,next" /*left: "myCustomButton" */ },
        dayMaxEventRows: true,
        views: {
          timeGrid: {
            dayMaxEventRows: 3, // adjust to 6 only for timeGridWeek/timeGridDay
          },
          dayGrid: {
            dayMaxEventRows: 3, // adjust to 6 only for timeGridWeek/timeGridDay
          },
        },
        height: "auto",
        events: tasks.value.map((task) => ({
          title: task.expand._garden.title,
          id: task.id,
          start: task.due_date,
          backgroundColor: statusToColor(task.status),
          borderColor: statusToColor(task.status),
        })),
      });
      calendar.render();
    }
  });

  return (
    <div class="min-h-screen p-4 bg-base-200 rounded-box">
      <div class="flex flex-wrap gap-2 mb-4">
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
          Изчакващи
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
      <div id="calendar"></div>
      <TaskModal
        isOpen={isModalOpen.value}
        onClose={closeModal}
        date={selectedDate.value}
        id={selectedTaskId.value}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Calendar",
  meta: [
    {
      name: "description",
      content: "Calendar page",
    },
  ],
};
