export interface JobApplication {
  id: string
  company: string
  position: string
  status: ApplicationStatus
  dateApplied: string
  notes?: string
}

export type ApplicationStatus =
  | "Applied"
  | "Interviewing"
  | "Technical"
  | "Final Round"
  | "Offer"
  | "Rejected"
  | "Withdrawn"

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "Applied",
  "Interviewing",
  "Technical",
  "Final Round",
  "Offer",
  "Rejected",
  "Withdrawn",
]
