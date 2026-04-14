import type { Complaint } from '../utils/constants';
import type { ApiComment, ApiComplaint } from './types';
const fmt=(d:string)=>new Date(d).toISOString().slice(0,10);
export const mapComplaint=(c:ApiComplaint):Complaint=>({id:c._id,title:c.title,description:c.description,category:c.category,priority:c.finalPriority,status:c.status,department:c.assignedDept,studentName:c.studentName,studentId:c.studentIdValue||'',studentDepartment:c.studentDepartment||c.assignedDept,studentYear:c.studentYear||'',createdAt:fmt(c.createdAt),deadline:fmt(c.deadline),updatedAt:fmt(c.updatedAt),assignedDepartment:c.assignedDept,attachmentUrl:c.attachment||undefined,comments:[]});
export const mapComment=(c:ApiComment)=>({id:c._id,author:c.authorName,role:c.authorRole,message:c.message,timestamp:new Date(c.createdAt).toLocaleString()});
