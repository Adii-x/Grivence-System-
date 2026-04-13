import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { PriorityBadge, StatusBadge, CategoryTag } from '../../components/shared/Badge';
import { useAuthStore } from '../../store/authStore';
import type { Complaint } from '../../utils/constants';
import { AlertTriangle } from 'lucide-react';
import { getStaffComplaintsApi } from '../../api/staffApi';
import { mapComplaint } from '../../api/mappers';

const StaffDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  useEffect(() => {
    getStaffComplaintsApi()
      .then((items) => setComplaints(items.map(mapComplaint)))
      .catch(() => setComplaints([]));
  }, []);
  const escalated = complaints.filter((c) => c.status === 'Escalated');

  const stats = [
    { label: 'Total Assigned', value: complaints.length },
    { label: 'Pending', value: complaints.filter((c) => c.status === 'Pending').length },
    { label: 'In Progress', value: complaints.filter((c) => c.status === 'In Progress').length },
    { label: 'Resolved Today', value: complaints.filter((c) => c.status === 'Resolved').length },
  ];

  return (
    <MainLayout>
      <h1 className="text-lg font-medium tracking-tight mb-6">{user?.department || 'Department'}</h1>

      {escalated.length > 0 && (
        <div className="bg-[#2C1515] border border-[#FCA5A5]/20 rounded-lg px-4 py-3 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-[#FCA5A5] shrink-0 mt-0.5" />
          <p className="text-sm text-[#FCA5A5] leading-snug">
            {escalated.length} complaint{escalated.length > 1 ? 's are' : ' is'} overdue and require{escalated.length === 1 ? 's' : ''} immediate attention
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-surface border border-border rounded-lg p-5 card-appear" style={{ animationDelay: `${i * 30}ms` }}>
            <p className="text-[28px] font-semibold">{s.value}</p>
            <p className="text-xs text-text-secondary">{s.label}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xs uppercase tracking-[0.08em] text-text-secondary font-medium mb-4">Recent Complaints</h2>
      <div className="space-y-0">
        {complaints.slice(0, 5).map((c) => (
          <Link key={c.id} to={`/staff/complaints/${c.id}`}
            className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between py-3 border-b border-[hsl(var(--border-subtle))] hover:bg-elevated transition-colors px-3 rounded-md">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <span className="text-sm font-medium break-words sm:truncate min-w-0">{c.title}</span>
              <CategoryTag category={c.category} />
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
              <span className="text-xs text-text-secondary break-all sm:break-normal">{c.studentName}</span>
              <PriorityBadge priority={c.priority} />
              <StatusBadge status={c.status} />
            </div>
          </Link>
        ))}
      </div>
    </MainLayout>
  );
};

export default StaffDashboard;
