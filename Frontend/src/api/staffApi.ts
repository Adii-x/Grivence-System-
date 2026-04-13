import axiosInstance from './axiosInstance';
import type { ApiComment, ApiComplaint } from './types';
export const getStaffComplaintsApi=async()=>{const {data}=await axiosInstance.get<{complaints:ApiComplaint[]}>('/staff/complaints');return data.complaints;};
export const getStaffComplaintApi=async(id:string)=>{const {data}=await axiosInstance.get<{complaint:ApiComplaint;comments:ApiComment[]}>(`/staff/complaints/${id}`);return data;};
export const updateStaffComplaintApi=async(id:string,payload:{status:string;deadline?:string})=>{const {data}=await axiosInstance.put(`/staff/complaints/${id}/status`,payload);return data;};
export const addStaffCommentApi=async(id:string,message:string)=>{const {data}=await axiosInstance.post(`/staff/complaints/${id}/comment`,{message});return data;};
