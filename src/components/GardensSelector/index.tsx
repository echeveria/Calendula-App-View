import { component$, useSignal, $, useVisibleTask$ } from "@builder.io/qwik";
import { pb, getAuthToken } from "~/utils/pocketbase";

export interface GardensSelectorProps {
  selectedId?: string | null;
  onSelectionChange?: (id: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export const GardensSelector = component$<GardensSelectorProps>(
  ({
    selectedId,
    onSelectionChange = $(() => {}),
    label = "Обект",
    placeholder = "-- Избери обект --",
    required = false,
  }) => {
    const taskConfigsSignal = useSignal<any[]>([]);
    const errorSignal = useSignal("");
    const isLoading = useSignal(true);

    // Function to load task configs from PocketBase
    const loadTaskConfigs = $(async () => {
      isLoading.value = true;
      errorSignal.value = "";

      try {
        // Set the auth token for the request
        pb.authStore.save(getAuthToken() || "", null);

        try {
          const response = await pb.collection("gardens").getList(1, 50, {
            sort: "title",
          });

          taskConfigsSignal.value = response.items || [];
        } catch (err: any) {
          errorSignal.value = err.message || "Failed to load Обект";
          console.error("Error loading task configs:", err);
        }
      } catch (error) {
        console.error("Error loading task configs:", error);
        errorSignal.value = "An error occurred while loading Обект";
      } finally {
        isLoading.value = false;
      }
    });

    // Load task configs when component mounts
    useVisibleTask$(async () => {
      await loadTaskConfigs();
    });

    // Handle selection change
    const handleChange = $((e: Event) => {
      const value = (e.target as HTMLSelectElement).value;
      onSelectionChange(value);
    });
    return (
      <div class="form-control">
        <label class="label" for="taskConfig">
          <span class="label-text">{label}</span>
        </label>
        <select
          id="taskConfig"
          class="select select-bordered w-full"
          value={selectedId || undefined}
          onChange$={handleChange}
          disabled={isLoading.value}
          required={required}
        >
          <option value="">{placeholder}</option>
          {taskConfigsSignal.value.map((config) => (
            <option key={config.id} value={config.id}>
              {config.title}
            </option>
          ))}
        </select>

        {errorSignal.value && <div class="text-error text-sm mt-1">{errorSignal.value}</div>}

        {isLoading.value && (
          <div class="text-sm mt-1 flex items-center">
            <span class="loading loading-spinner loading-xs mr-2"></span>
            <span>Зареждане на конфигурация...</span>
          </div>
        )}
      </div>
    );
  }
);
