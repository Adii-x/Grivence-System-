import axiosInstance from './axiosInstance';
import type { ApiComment, ApiComplaint } from './types';
export const createComplaintApi=async(form:FormData)=>{const {data}=await axiosInstance.post('/complaints',form,{headers:{'Content-Type':'multipart/form-data'}});return data;};
export const getMyComplaintsApi=async()=>{const {data}=await axiosInstance.get<{complaints:ApiComplaint[]}>('/complaints/mine');return data.complaints;};
export const getMyComplaintByIdApi=async(id:string)=>{const {data}=await axiosInstance.get<{complaint:ApiComplaint;comments:ApiComment[]}>(`/complaints/${id}`);return data;};
