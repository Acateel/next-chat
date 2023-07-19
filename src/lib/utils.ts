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

/**
 * Generate chat Href
 * @param id1 first user's id
 * @param id2 second user's id
 * @returns string Href
 */
export function chatHrefConstructor(id1: string, id2: string) {
  const sortedIds = [id1, id2].sort();
  return `${sortedIds[0]}--${sortedIds[1]}`;
}

/**
 * Generate pussher key.
 * replace celons in doble dash.
 * @param key key with colon
 * @returns pussher key with doble dash
 */
export function toPusherKey(key: string) {
  return key.replace(/:/g, "__");
}
