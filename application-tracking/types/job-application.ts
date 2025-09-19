export interface JobApplication {
  id: string;
  company: string;
  position: string;
  status: ApplicationStatus;
  dateApplied: string;
  createdAt: string;
}

export type ApplicationStatus =
  | "applied"
  | "interviewing"
  | "offer"
  | "rejected"
  | "withdrawn";

export const APPLICATION_STATUSES: {
  value: ApplicationStatus;
  label: string;
}[] = [
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
];

export interface PaginationParameters {
  offset?: number;
  limit?: number;
}
export interface PagedResult {
  totalCount?: number;
  items?: any;
}
