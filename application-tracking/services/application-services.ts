import { JobApplication, PagedResult } from "@/types/job-application";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/JobApplication",
  headers: {
    "Content-Type": "application/json",
  },
});

const handleRequest = async <T>(promise: Promise<any>): Promise<T | null> => {
  try {
    const response = await promise;
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
};

export const getJobApplications = async (
  offset = 0,
  limit = 10
): Promise<PagedResult | null> => {
  return await handleRequest<PagedResult>(api.post("/All", { offset, limit }));
};

export const addJobApplication = async (
  data: Omit<JobApplication, "id" | "createdAt" | "updatedAt" | "dateApplied">
): Promise<JobApplication | null> => {
  return await handleRequest<JobApplication>(
    api.post("/", {
      company: data.company,
      position: data.position,
      status: data.status,
    })
  );
};

export const updateJobApplication = async (
  data: JobApplication
): Promise<JobApplication | null> => {
  return await handleRequest<JobApplication>(
    api.put("/", {
      id: data.id,
      dateApplied: data.dateApplied,
      company: data.company,
      position: data.position,
      status: data.status,
    })
  );
};

export const deleteJobApplication = async (id: string): Promise<boolean> => {
  const result = await handleRequest(api.delete(`/${id}`));
  return result !== null;
};
