import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merging tailwind classes for className atribute
 * @param inputs tailwind classes
 * @returns one string with merging classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
