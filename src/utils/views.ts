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
