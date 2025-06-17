import {
  $,
  component$,
  useSignal,
  useStore,
  useVisibleTask$,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { getAuthToken, getUserInfo, pb } from "~/utils/pocketbase";
import { TaskModal } from "~/components/TaskModal";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Calendar } from "@fullcalendar/core";
import bgLocale from "@fullcalendar/core/locales/bg";
import { statusToColor } from "~/utils/views";

export default component$(() => {
  const isModalOpen = useSignal(false);
  const selectedDate = useSignal("");
  const selectedTaskId = useSignal("");

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

    if (calendarEl) {
      const calendar = new Calendar(calendarEl, {
        plugins: [
          interactionPlugin,
          dayGridPlugin,
          timeGridPlugin,
          dayGridPlugin,
        ],
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
          center: "prev,next",
          right: "dayGridMonth,timeGridWeek,dayGridDay",
        },
        footerToolbar: { right: "prev,next", left: "myCustomButton" },
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
        // events: [
        //     {
        //         title: 'Meeting',
        //         start:'2025-06-01',
        //     },
        //     {
        //         title: 'Birthday Party',
        //         start: '2025-06-01',
        //         backgroundColor: 'green',
        //         borderColor: 'green',
        //     },
        //     {
        //         title: 'Birthday Party',
        //         start: '2025-06-01',
        //         backgroundColor: 'green',
        //         borderColor: 'green',
        //     },
        //     {
        //         title: 'Birthday Party',
        //         start: '2025-06-01',
        //         backgroundColor: 'green',
        //         borderColor: 'green',
        //     }
        // ],
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
