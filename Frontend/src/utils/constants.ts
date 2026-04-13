export const DEPARTMENTS = [
  'Computer Science',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Business Administration',
  'Mathematics',
  'Physics',
  'Chemistry',
];

export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export const CATEGORIES = [
  'Academic',
  'Infrastructure',
  'Faculty',
  'Hostel',
  'Library',
  'Examination',
  'Ragging',
  'Other',
];

export const PRIORITY_LEVELS = ['Low', 'Medium', 'High', 'Urgent'] as const;
export const STATUS_OPTIONS = ['Pending', 'In Progress', 'Resolved', 'Escalated'] as const;

export type Priority = typeof PRIORITY_LEVELS[number];
export type Status = typeof STATUS_OPTIONS[number];

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: Priority;
  status: Status;
  department: string;
  studentName: string;
  studentId: string;
  studentDepartment: string;
  studentYear: string;
  createdAt: string;
  deadline: string;
  updatedAt: string;
  assignedDepartment?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  author: string;
  role: string;
  message: string;
  timestamp: string;
  avatar?: string;
}

// Mock data
export const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: '1', title: 'WiFi not working in Block A', description: 'The WiFi connection in Block A hostel has been down for 3 days. Students are unable to access online resources for assignments.', category: 'Infrastructure', priority: 'High', status: 'In Progress', department: 'Computer Science', studentName: 'Rahul Sharma', studentId: 'CS2021045', studentDepartment: 'Computer Science', studentYear: '3rd Year', createdAt: '2026-04-08', deadline: '2026-04-15', updatedAt: '2026-04-10',
    comments: [
      { id: 'c1', author: 'IT Support', role: 'staff', message: 'We are looking into the router issue. Expected fix by tomorrow.', timestamp: '2026-04-09 14:30' },
      { id: 'c2', author: 'Rahul Sharma', role: 'student', message: 'Thank you for the update.', timestamp: '2026-04-09 15:00' },
    ],
  },
  {
    id: '2', title: 'Unfair grading in Mathematics', description: 'The mid-semester exam was graded incorrectly. Multiple students have reported discrepancies in their marks.', category: 'Academic', priority: 'Medium', status: 'Pending', department: 'Mathematics', studentName: 'Priya Patel', studentId: 'MA2022018', studentDepartment: 'Mathematics', studentYear: '2nd Year', createdAt: '2026-04-10', deadline: '2026-04-17', updatedAt: '2026-04-10',
    comments: [],
  },
  {
    id: '3', title: 'Broken furniture in Lecture Hall 3', description: 'Several chairs and desks in LH-3 are broken and pose a safety hazard.', category: 'Infrastructure', priority: 'Low', status: 'Resolved', department: 'Civil Engineering', studentName: 'Amit Kumar', studentId: 'CE2023012', studentDepartment: 'Civil Engineering', studentYear: '1st Year', createdAt: '2026-04-05', deadline: '2026-04-12', updatedAt: '2026-04-11',
    comments: [
      { id: 'c3', author: 'Maintenance Dept', role: 'staff', message: 'All furniture has been replaced.', timestamp: '2026-04-11 10:00' },
    ],
  },
  {
    id: '4', title: 'Hostel water supply issue', description: 'Hot water supply in Boys Hostel 2 has been disrupted for a week. Immediate attention required.', category: 'Hostel', priority: 'Urgent', status: 'Escalated', department: 'Civil Engineering', studentName: 'Vikram Singh', studentId: 'ME2021033', studentDepartment: 'Mechanical Engineering', studentYear: '3rd Year', createdAt: '2026-04-03', deadline: '2026-04-08', updatedAt: '2026-04-12',
    comments: [
      { id: 'c4', author: 'Hostel Warden', role: 'staff', message: 'This has been escalated to administration.', timestamp: '2026-04-08 09:00' },
    ],
  },
  {
    id: '5', title: 'Library books not available', description: 'Required reference books for the semester are out of stock in the library. Students need them for final exams.', category: 'Library', priority: 'Medium', status: 'In Progress', department: 'Business Administration', studentName: 'Sneha Gupta', studentId: 'BA2022007', studentDepartment: 'Business Administration', studentYear: '2nd Year', createdAt: '2026-04-09', deadline: '2026-04-16', updatedAt: '2026-04-11',
    comments: [],
  },
  {
    id: '6', title: 'Lab equipment malfunction', description: 'The oscilloscope in EE Lab 2 is not functioning properly, affecting practical sessions.', category: 'Infrastructure', priority: 'High', status: 'Pending', department: 'Electrical Engineering', studentName: 'Karan Mehta', studentId: 'EE2023021', studentDepartment: 'Electrical Engineering', studentYear: '1st Year', createdAt: '2026-04-11', deadline: '2026-04-18', updatedAt: '2026-04-11',
    comments: [],
  },
];
