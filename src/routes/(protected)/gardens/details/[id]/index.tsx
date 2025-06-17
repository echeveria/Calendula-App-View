import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { DocumentHead, useLocation } from "@builder.io/qwik-city";
import { pb, getAuthToken } from "~/utils/pocketbase";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Calendar } from "@fullcalendar/core";
import { statusToColor } from "~/utils/views";
import bgLocale from "@fullcalendar/core/locales/bg";
import { TaskModal } from "~/components/TaskModal";

export default component$(() => {
  const location = useLocation();
  const gardenId = location.params.id;
  const gardenSignal = useSignal<any>(null);
  const tasksSignal = useSignal<any[]>([]);
  const isLoading = useSignal(true);
  const errorSignal = useSignal("");

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
            center: "prev,next",
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
      }
    }
  });

  return (
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-6">Garden Details</h1>

      {isLoading.value && (
        <div class="flex justify-center items-center p-8">
          <span class="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {errorSignal.value && (
        <div class="alert alert-error mb-4">{errorSignal.value}</div>
      )}

      {!isLoading.value && !gardenSignal.value && (
        <div class="alert alert-warning">Garden not found.</div>
      )}

      {gardenSignal.value && (
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Garden Images */}
          <div class="lg:col-span-1">
            <div class="card bg-base-100 shadow-xl">
              {gardenSignal.value.photos &&
              gardenSignal.value.photos.length > 0 ? (
                <figure>
                  <img
                    src={`${pb.baseURL}/api/files/${gardenSignal.value.collectionId}/${gardenSignal.value.id}/${gardenSignal.value.photos[0]}`}
                    alt={gardenSignal.value.title}
                    class="w-full object-cover"
                  />
                </figure>
              ) : (
                <div class="h-48 w-full bg-gray-200 flex items-center justify-center">
                  <span class="text-gray-400">No image</span>
                </div>
              )}

              {/* Additional photos gallery */}
              {gardenSignal.value.photos &&
                gardenSignal.value.photos.length > 1 && (
                  <div class="p-4">
                    <h3 class="font-bold text-lg mb-2">Gallery</h3>
                    <div class="grid grid-cols-3 gap-2">
                      {gardenSignal.value.photos
                        .slice(1)
                        .map((photo: string) => (
                          <img
                            key={photo}
                            src={`${pb.baseURL}/api/files/${gardenSignal.value.collectionId}/${gardenSignal.value.id}/${photo}`}
                            alt={gardenSignal.value.title}
                            class="w-full h-24 object-cover rounded"
                          />
                        ))}
                    </div>
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
                    <h3 class="font-bold">Address</h3>
                    <p>{gardenSignal.value.address || "No address provided"}</p>
                  </div>

                  <div>
                    <h3 class="font-bold">Created</h3>
                    <p>
                      {new Date(
                        gardenSignal.value.created,
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <h3 class="font-bold">Last Updated</h3>
                    <p>
                      {new Date(
                        gardenSignal.value.updated,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div class="mt-4">
                  <h3 class="font-bold">Description</h3>
                  <p class="whitespace-pre-line">
                    {gardenSignal.value.description ||
                      "No description provided"}
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
                    Create Task
                  </a>
                  <a href="/gardens" class="btn">
                    Back to Gardens
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Section */}
      {gardenSignal.value && (
        <div class="mt-8">
          <h2 class="text-xl font-bold mb-4">Tasks Calendar</h2>

          {tasksSignal.value.length === 0 ? (
            <div class="alert alert-info">
              No tasks found for this garden. Create a task to see it in the
              calendar.
            </div>
          ) : (
            <div class="card bg-base-100 shadow-xl">
              <div class="card-body">
                <div id="garden-calendar" class="min-h-[500px]"></div>
              </div>
            </div>
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
