import axiosInstance from "./axiosInstance";
import type { ApiComplaint } from "./types";
export const getAllComplaintsApi = async (params?: Record<string, string>) => {
  const { data } = await axiosInstance.get<{ complaints: ApiComplaint[] }>(
    "/admin/complaints",
    { params },
  );
  return data.complaints;
};
export const getAdminComplaintApi = async (id: string) => {
  const { data } = await axiosInstance.get<{ complaint: ApiComplaint }>(
    `/admin/complaints/${id}`,
  );
  return data.complaint;
};
export const assignComplaintApi = async (id: string, department: string) => {
  const { data } = await axiosInstance.put(`/admin/complaints/${id}/assign`, {
    department,
  });
  return data;
};
export const getAnalyticsApi = async () => {
  const { data } = await axiosInstance.get("/admin/analytics");
  return data;
};
export const getDepartmentsApi = async () => {
  const { data } = await axiosInstance.get<{ departments: string[] }>(
    "/admin/departments",
  );
  return data.departments;
};
