import { $, component$, noSerialize, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { DocumentHead, useLocation } from "@builder.io/qwik-city";
import { pb, getAuthToken } from "~/utils/pocketbase";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Calendar } from "@fullcalendar/core";
import { statusToColor } from "~/utils/views";
import bgLocale from "@fullcalendar/core/locales/bg";
import { TaskModal } from "~/components/TaskModal";
import { ImageCarousel } from "~/components/ImageCarousel";

export default component$(() => {
  const location = useLocation();
  const gardenId = location.params.id;
  const gardenSignal = useSignal<any>(null);
  const tasksSignal = useSignal<any[]>([]);
  const isLoading = useSignal(true);
  const errorSignal = useSignal("");
  const calendarRef = useSignal<ReturnType<typeof noSerialize<Calendar>>>();
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

  // Function to load garden details from PocketBase
  useVisibleTask$(async () => {
    isLoading.value = true;
    errorSignal.value = "";

    try {
      // Set the auth token for the request
      pb.authStore.save(getAuthToken() || "", null);

      try {
        // Fetch garden details
        const garden = await pb.collection("gardens").getOne(gardenId);
        gardenSignal.value = garden;

        // Fetch tasks for this garden
        const tasksResponse = await pb.collection("tasks").getList(1, 100, {
          filter: `_garden = "${gardenId}"`,
          sort: "due_date",
        });

        console.log(tasksResponse.items);
        tasksSignal.value = tasksResponse.items || [];
      } catch (err: any) {
        errorSignal.value = err.message || "Failed to load garden details";
        console.error("Error loading garden details:", err);
      }
    } catch (error) {
      console.error("Error loading garden details:", error);
      errorSignal.value = "An error occurred while loading garden details";
    } finally {
      isLoading.value = false;
    }
  });

  // Initialize calendar after data is loaded
  useVisibleTask$(({ track }) => {
    track(() => tasksSignal.value);
    track(() => isLoading.value);

    if (!isLoading.value && tasksSignal.value.length > 0) {
      const calendarEl = document.getElementById("garden-calendar");
      console.log(tasksSignal);
      if (calendarEl) {
        const calendar = new Calendar(calendarEl, {
          plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin],
          displayEventTime: false,
          initialView: "dayGridMonth",
          locales: [bgLocale],
          locale: "bg",
          titleFormat: { month: "long" },
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
          headerToolbar: {
            left: "title",
            right: "dayGridMonth,timeGridWeek,dayGridDay",
          },
          footerToolbar: { right: "prev,next" },
          dayMaxEventRows: true,
          views: {
            timeGrid: {
              dayMaxEventRows: 4, // adjust to 6 only for timeGridWeek/timeGridDay
            },
            dayGrid: {
              dayMaxEventRows: 4, // adjust to 6 only for timeGridWeek/timeGridDay
            },
          },
          height: "auto",
          events: tasksSignal.value.map((task) => ({
            title: gardenSignal.value.title,
            id: task.id,
            start: task.due_date,
            backgroundColor: statusToColor(task.status),
            borderColor: statusToColor(task.status),
            url: `/tasks/edit/${task.id}`,
          })),
        });

        calendar.render();
        calendarRef.value = noSerialize(calendar);
      }
    }
  });

  const printCalendar = $(() => {
    const calendar = calendarRef.value;
    if (!calendar) return;

    const prevView = calendar.view.type;

    // Сменяме изгледа на dayGridMonth
    calendar.changeView("dayGridMonth");

    // Изчакваме да се рендерира и тогава принтираме
    setTimeout(() => {
      window.print();

      // След печат връщаме обратно предишния изглед
      setTimeout(() => {
        calendar.changeView(prevView);
      }, 300);
    }, 300);
  });
  return (
    <div class="container mx-auto p-4">
      <div class="object-info">
        <h1 class="text-2xl font-bold mb-6">Детайли за градината</h1>

        {isLoading.value && (
          <div class="flex justify-center items-center p-8">
            <span class="loading loading-spinner loading-lg"></span>
          </div>
        )}

        {errorSignal.value && <div class="alert alert-error mb-4">{errorSignal.value}</div>}

        {!isLoading.value && !gardenSignal.value && (
          <div class="alert alert-warning">Градината не съществува.</div>
        )}

        {gardenSignal.value && (
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Garden Images */}
            <div class="lg:col-span-1">
              <div class="card p-4 bg-base-100 shadow-xl">
                {gardenSignal.value.photos && gardenSignal.value.photos.length > 0 ? (
                  <ImageCarousel
                    images={gardenSignal.value.photos.map(
                      (photo: string) =>
                        `${pb.baseURL}/api/files/${gardenSignal.value.collectionId}/${gardenSignal.value.id}/${photo}`
                    )}
                  />
                ) : (
                  <div class="h-48 w-full bg-gray-200 flex items-center justify-center">
                    <span class="text-gray-400">Няма снимка</span>
                  </div>
                )}
              </div>
            </div>

            {/* Garden Details */}
            <div class="lg:col-span-2">
              <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                  <h2 class="card-title text-2xl">{gardenSignal.value.title}</h2>

                  <div class="divider"></div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 class="font-bold">Адрес</h3>
                      <p>{gardenSignal.value.address || "No address provided"}</p>
                    </div>

                    <div>
                      <h3 class="font-bold">Създаден на</h3>
                      <p>{new Date(gardenSignal.value.created).toLocaleDateString()}</p>
                    </div>

                    <div>
                      <h3 class="font-bold">Последна редакция</h3>
                      <p>{new Date(gardenSignal.value.updated).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div class="mt-4">
                    <h3 class="font-bold">Описание</h3>
                    <p class="whitespace-pre-line">
                      {gardenSignal.value.description || "No description provided"}
                    </p>
                  </div>

                  {gardenSignal.value.geolocation && (
                    <div class="mt-4">
                      <h3 class="font-bold">Geolocation</h3>
                      <pre class="bg-base-200 p-2 rounded text-sm overflow-auto">
                        {JSON.stringify(gardenSignal.value.geolocation, null, 2)}
                      </pre>
                    </div>
                  )}

                  <div class="card-actions justify-end mt-6">
                    <a
                      href={`/tasks/create?gardenId=${gardenSignal.value.id}`}
                      class="btn btn-primary"
                    >
                      Създай задача
                    </a>
                    <a href="/gardens" class="btn">
                      Назад към Обекти
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Calendar Section */}
      {gardenSignal.value && (
        <div class="mt-8">
          <h2 class="text-xl font-bold mb-4">Календар със задачи</h2>
          {tasksSignal.value.length === 0 ? (
            <div class="alert alert-info">Не са открити задачи. Създай нова за календара.</div>
          ) : (
            <>
              <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                  <div id="garden-calendar" class="min-h-[500px]"></div>
                </div>
              </div>
              <button
                onClick$={printCalendar}
                class="bg-blue-500 text-white px-4 py-2 rounded mt-4"
              >
                🖨️ Принтирай
              </button>
            </>
          )}
        </div>
      )}
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
  title: "Garden Details",
  meta: [
    {
      name: "description",
      content: "Garden details and tasks calendar",
    },
  ],
};
