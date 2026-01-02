import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(value: string) {
  const date = new Date(value);
  return date.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export function formatDateTime(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}
