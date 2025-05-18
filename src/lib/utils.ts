// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/**
 * Format a date to a string with options
 * @param date - Date to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  }
): string {
  return new Intl.DateTimeFormat("id-ID", options).format(new Date(date));
}

/**
 * Truncate a string to a specified length
 * @param str - String to truncate
 * @param length - Max length
 * @returns Truncated string
 */
export function truncateString(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trim() + "...";
}

/**
 * Format bytes to a human-readable string
 * @param bytes - Number of bytes
 * @param decimals - Number of decimal places
 * @returns Formatted string
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Get initials from a name
 * @param name - Full name
 * @param maxLength - Maximum length of initials
 * @returns Initials
 */
export function getInitials(name: string, maxLength = 2): string {
  if (!name) return "";
  
  return name
    .split(" ")
    .map(part => part[0])
    .slice(0, maxLength)
    .join("")
    .toUpperCase();
}

/**
 * Debounce a function
 * @param fn - Function to debounce
 * @param ms - Debounce delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  ms = 300
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return function(this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
}

/**
 * Check if object is empty
 * @param obj - Object to check
 * @returns Boolean indicating if object is empty
 */
export function isEmptyObject(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * Generate a random string ID
 * @param length - Length of ID
 * @returns Random string
 */
export function generateId(length = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}