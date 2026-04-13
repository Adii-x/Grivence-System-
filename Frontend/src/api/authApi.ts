import axiosInstance from './axiosInstance';
import type { ApiUser } from './types';
export const loginApi=async(email:string,password:string)=>{const {data}=await axiosInstance.post<{token:string;user:ApiUser}>('/auth/login',{email,password});return data;};
export const registerApi=async(payload:{name:string;email:string;password:string;studentId:string;department:string;year:string})=>{const {data}=await axiosInstance.post<{token:string;user:ApiUser}>('/auth/register',payload);return data;};
