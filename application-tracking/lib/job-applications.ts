import type { JobApplication } from "@/types/job-application"

// Mock data for initial display
export const mockApplications: JobApplication[] = [
  {
    id: "1",
    company: "Google",
    position: "Software Engineer",
    status: "Interviewing",
    dateApplied: "2024-01-15",
    notes: "Applied through referral",
  },
  {
    id: "2",
    company: "Microsoft",
    position: "Frontend Developer",
    status: "Applied",
    dateApplied: "2024-01-10",
    notes: "Found on LinkedIn",
  },
  {
    id: "3",
    company: "Apple",
    position: "Full Stack Developer",
    status: "Technical",
    dateApplied: "2024-01-08",
    notes: "Company website application",
  },
]

// Local storage key
const STORAGE_KEY = "job-applications"

export function getApplications(): JobApplication[] {
  if (typeof window === "undefined") return mockApplications

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : mockApplications
  } catch {
    return mockApplications
  }
}

export function saveApplications(applications: JobApplication[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
  } catch (error) {
    console.error("Failed to save applications:", error)
  }
}

export function addApplication(application: Omit<JobApplication, "id">): JobApplication {
  const newApplication: JobApplication = {
    ...application,
    id: Date.now().toString(),
  }

  const applications = getApplications()
  const updatedApplications = [...applications, newApplication]
  saveApplications(updatedApplications)

  return newApplication
}

export function updateApplication(id: string, updates: Partial<JobApplication>): JobApplication | null {
  const applications = getApplications()
  const index = applications.findIndex((app) => app.id === id)

  if (index === -1) return null

  const updatedApplication = { ...applications[index], ...updates }
  applications[index] = updatedApplication
  saveApplications(applications)

  return updatedApplication
}

export function deleteApplication(id: string): boolean {
  const applications = getApplications()
  const filteredApplications = applications.filter((app) => app.id !== id)

  if (filteredApplications.length === applications.length) return false

  saveApplications(filteredApplications)
  return true
}
