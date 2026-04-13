import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import CursorRing from "./components/cursor/CursorRing";
import ToastContainer from "./components/shared/Toast";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import StudentDashboard from "./pages/student/Dashboard";
import SubmitComplaint from "./pages/student/SubmitComplaint";
import ComplaintHistory from "./pages/student/ComplaintHistory";
import StudentComplaintDetail from "./pages/student/ComplaintDetail";
import StaffDashboard from "./pages/staff/Dashboard";
import AssignedComplaints from "./pages/staff/AssignedComplaints";
import StaffComplaintDetail from "./pages/staff/ComplaintDetail";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminAllComplaints from "./pages/admin/AllComplaints";
import AdminComplaintDetail from "./pages/admin/ComplaintDetail";
import DepartmentPerformance from "./pages/admin/DepartmentPerformance";

const App = () => (
  <>
    <CursorRing />
    <ToastContainer />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student */}
        <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/submit" element={<ProtectedRoute allowedRoles={['student']}><SubmitComplaint /></ProtectedRoute>} />
        <Route path="/student/complaints" element={<ProtectedRoute allowedRoles={['student']}><ComplaintHistory /></ProtectedRoute>} />
        <Route path="/student/complaints/:id" element={<ProtectedRoute allowedRoles={['student']}><StudentComplaintDetail /></ProtectedRoute>} />

        {/* Staff */}
        <Route path="/staff/dashboard" element={<ProtectedRoute allowedRoles={['staff']}><StaffDashboard /></ProtectedRoute>} />
        <Route path="/staff/complaints" element={<ProtectedRoute allowedRoles={['staff']}><AssignedComplaints /></ProtectedRoute>} />
        <Route path="/staff/complaints/:id" element={<ProtectedRoute allowedRoles={['staff']}><StaffComplaintDetail /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/complaints" element={<ProtectedRoute allowedRoles={['admin']}><AdminAllComplaints /></ProtectedRoute>} />
        <Route path="/admin/complaints/:id" element={<ProtectedRoute allowedRoles={['admin']}><AdminComplaintDetail /></ProtectedRoute>} />
        <Route path="/admin/departments" element={<ProtectedRoute allowedRoles={['admin']}><DepartmentPerformance /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </>
);

export default App;
