import { $, NoSerialize, noSerialize, Signal } from "@builder.io/qwik";

export type taskStatus = "pending" | "in_progress" | "completed" | "canceled";
export const taskStatusValue = [
  "pending",
  "in_progress",
  "completed",
  "canceled",
];

export const statusToColor = (status: taskStatus): string => {
  switch (status) {
    case "pending":
      return "orange";
    case "in_progress":
      return "yellow";
    case "canceled":
      return "red";
    default:
      return "green";
  }
};

export function formatStatus(str: taskStatus): string {
  return str
    .replace(/_/g, " ") // заменя _ с интервал
    .replace(/\b\w/g, (c) => c.toUpperCase()); // прави всяка дума с главна буква
}

export const handleImageUpload = $(
  async (
    files: File[],
    imagesSignal: Signal<NoSerialize<File[]>>,
    imagesPreviewSignal: Signal<NoSerialize<string[]>>,
  ) => {
    imagesPreviewSignal.value = noSerialize(
      files.map((file) => URL.createObjectURL(file)),
    );
    imagesSignal.value = noSerialize(files);
  },
);

export const handleImageDelete = $(
  async (
    index: number,
    imagesSignal: Signal<NoSerialize<File[]>>,
    imagesPreviewSignal: Signal<NoSerialize<string[]>>,
  ) => {
    const files = Array.from(imagesSignal.value || []);
    const preview = Array.from(imagesPreviewSignal.value || []);

    files.splice(index, 1);
    preview.splice(index, 1);

    imagesPreviewSignal.value = noSerialize(preview);
    imagesSignal.value = noSerialize(files);
  },
);
