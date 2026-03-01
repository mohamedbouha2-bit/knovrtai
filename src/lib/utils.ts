import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * دالة دمج فئات Tailwind الذكية.
 * تعالج التكرار، التعارض، والشروط المنطقية في سطر واحد.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}