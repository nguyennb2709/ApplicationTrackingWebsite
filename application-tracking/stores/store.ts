import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { JobApplication } from "@/types/job-application";
import {
  getJobApplications,
  addJobApplication,
  deleteJobApplication,
  updateJobApplication,
} from "@/services/application-services";

interface JobApplicationStore {
  applications: JobApplication[];
  addApplication: (
    application: Omit<
      JobApplication,
      "id" | "createdAt" | "updatedAt" | "dateApplied"
    >
  ) => Promise<JobApplication>;
  updateApplication: (application: JobApplication) => Promise<JobApplication>;
  deleteApplication: (id: string) => Promise<void>;
  offset: number;
  limit: number;
  totalPages: number;
  currentPage: number;
  pageNumbers: number[];
  fetchApplication: (page?: number) => Promise<void>;
}

export const useJobApplicationStore = create<JobApplicationStore>()(
  persist(
    (set, get) => ({
      applications: [],
      offset: 0,
      limit: 5,
      currentPage: 1,
      totalPages: 0,
      pageNumbers: [],

      fetchApplication: async (page = 1) => {
        const { limit } = get();
        const offset = (page - 1) * limit;
        const result = await getJobApplications(offset, limit);
        const totalPages = Math.ceil(
          result?.totalCount ? result.totalCount / limit : 0
        );
        const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
        const items: JobApplication[] =
          result?.items?.map((item: any) => ({
            id: item.id,
            company: item.company,
            status: item.status,
            position: item.position,
            dateApplied: item.dateApplied,
          })) ?? [];

        set({
          applications: items,
          pageNumbers,
          totalPages,
          currentPage: page,
        });
      },

      addApplication: async (applicationData) => {
        const result = await addJobApplication(applicationData);
        if (!result) throw new Error("Failed to add job application");

        await get().fetchApplication(get().currentPage);
        return result;
      },

      updateApplication: async (application) => {
        const result = await updateJobApplication(application);
        if (!result) throw new Error("Failed to update job application");

        await get().fetchApplication(get().currentPage);
        return result;
      },

      deleteApplication: async (id) => {
        const result = await deleteJobApplication(id);
        if (result) {
          await get().fetchApplication(get().currentPage);
        }
      },
    }),
    { name: "job-applications-storage" }
  )
);

export { getJobApplications };
