import { $, component$, noSerialize, useSignal, useStore, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { getAuthToken, getUserInfo, pb } from "~/utils/pocketbase";
import { TaskModal } from "~/components/TaskModal";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Calendar } from "@fullcalendar/core";
import bgLocale from "@fullcalendar/core/locales/bg";
import { statusToColor, taskStatus } from "~/utils/views";
import { CalendarStatusFilter } from "~/components/CalendarStatusFilter/CalendarStatusFilter";

export default component$(() => {
  const isModalOpen = useSignal(false);
  const selectedDate = useSignal("");
  const selectedTaskId = useSignal("");
  const calendarRef = useSignal<ReturnType<typeof noSerialize<Calendar>>>();
  const statusFilter = useSignal<"all" | taskStatus>("all");

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

  // Function to load tasks from PocketBase
  const loadTasks = $(async () => {
    isLoading.value = true;
    errorSignal.value = "";

    try {
      // Set the auth token for the request
      pb.authStore.save(getAuthToken() || "", null);

      const user = getUserInfo();
      let filter = undefined;
      if (user.type === "owner") {
        filter = { filter: `garden._owner = "${user.id}"` };
      }

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

  useVisibleTask$(async () => {
    await loadTasks();

    const calendarEl = document.getElementById("calendar");
    if (!calendarEl) return;

    const originalEvents = tasks.value.map((task) => ({
      title: task.expand._garden.title,
      id: task.id,
      start: task.due_date,
      backgroundColor: statusToColor(task.status),
      borderColor: statusToColor(task.status),
    }));

    if (!calendarRef.value) {
      const calendar = new Calendar(calendarEl, {
        plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin],
        displayEventTime: false,
        initialView: "dayGridMonth",
        selectable: true,
        dateClick: (info) => {
          info.jsEvent.preventDefault();
          selectedDate.value = info.dateStr;
          selectedTaskId.value = "";
          isModalOpen.value = true;
        },
        eventClick: (info) => {
          info.jsEvent.preventDefault();
          selectedTaskId.value = info.event.id;
          selectedDate.value = "";
          isModalOpen.value = true;
        },
        locales: [bgLocale],
        locale: "bg",
        titleFormat: { month: "long" },
        headerToolbar: {
          left: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        },
        footerToolbar: {
          right: "prev,next",
        },
        dayMaxEventRows: true,
        views: {
          timeGrid: { dayMaxEventRows: 3 },
          dayGrid: { dayMaxEventRows: 3 },
        },
        height: "auto",
        events: originalEvents,
      });

      calendar.render();
      calendarRef.value = noSerialize(calendar);
    } else {
      calendarRef.value.removeAllEvents();
      calendarRef.value.addEventSource(originalEvents);
    }
  });

  const filterEvents = $((status: string) => {
    if (!calendarRef.value) return;

    const filtered =
      status === "all" ? tasks.value : tasks.value.filter((task) => task.status === status);

    const eventsToShow = filtered.map((task) => ({
      title: task.expand._garden.title,
      id: task.id,
      start: task.due_date,
      backgroundColor: statusToColor(task.status),
      borderColor: statusToColor(task.status),
    }));

    calendarRef.value.removeAllEvents();
    calendarRef.value.addEventSource(eventsToShow);
  });

  const onFilterChange = $((event: "all" | taskStatus) => {
    statusFilter.value = event;
    filterEvents(event);
  });

  return (
    <div class="min-h-screen p-4 bg-base-200 rounded-box">
      <CalendarStatusFilter
        currentStatusFilter={statusFilter}
        handleStatusFilterChange={onFilterChange}
      />
      <div id="calendar" />
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
