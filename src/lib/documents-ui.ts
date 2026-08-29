import type { ApplicationStatus } from "@/lib/documents.functions";

export const DEFAULT_ORIGIN = "Any other country";

export const ORIGIN_COUNTRIES = [
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Canada",
  "Australia",
  "Nigeria",
  "Ghana",
  "Kenya",
  "Egypt",
  "India",
  "Pakistan",
  DEFAULT_ORIGIN,
];

export const STATUS_FLOW: ApplicationStatus[] = [
  "submitted",
  "in_review",
  "at_embassy",
  "decision",
  "ready",
  "delivered",
];

export const STATUS_LABEL: Record<ApplicationStatus, string> = {
  submitted: "Submitted",
  in_review: "In review",
  at_embassy: "Submitted to embassy",
  decision: "Decision received",
  ready: "Ready for collection",
  delivered: "Delivered",
  rejected: "Rejected",
};

export const REQUIREMENT_LABEL: Record<string, string> = {
  visa_free: "No visa needed",
  e_visa: "Visa required (online)",
  on_arrival: "Visa on arrival",
  sticker: "Visa required (embassy)",
};

export function formatMoney(value: number) {
  return value === 0 ? "Free" : `$${Number(value).toLocaleString()}`;
}
