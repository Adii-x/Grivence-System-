import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { PriorityBadge, StatusBadge, CategoryTag } from '../../components/shared/Badge';
import { useAuthStore } from '../../store/authStore';
import type { Complaint } from '../../utils/constants';
import { FileText, Send } from 'lucide-react';
import Button from '../../components/shared/Button';
import { getMyComplaintsApi } from '../../api/complaintsApi';
import { mapComplaint } from '../../api/mappers';

const StudentDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const now = new Date();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    getMyComplaintsApi()
      .then((items) => setComplaints(items.map(mapComplaint)))
      .catch(() => setComplaints([]));
  }, []);

  const myComplaints = complaints;
  const stats = [
    { label: 'Total Submitted', value: myComplaints.length },
    { label: 'Pending', value: myComplaints.filter((c) => c.status === 'Pending').length },
    { label: 'In Progress', value: myComplaints.filter((c) => c.status === 'In Progress').length },
    { label: 'Resolved', value: myComplaints.filter((c) => c.status === 'Resolved').length },
  ];

  // Use all complaints for demo
  const recent = complaints.slice(0, 3);

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-xl font-medium tracking-tight">{greeting}, {user?.name?.split(' ')[0]}</h1>
        <p className="text-text-secondary text-sm">{dateStr}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-surface border border-border rounded-lg p-5 card-appear" style={{ animationDelay: `${i * 30}ms` }}>
            <p className="text-[28px] font-semibold">{s.value}</p>
            <p className="text-xs text-text-secondary">{s.label}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs uppercase tracking-[0.08em] text-text-secondary font-medium">Recent Complaints</h2>
          <Link to="/student/complaints" className="text-xs text-accent hover:underline">View all</Link>
        </div>

        {recent.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-8 h-8 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary text-sm mb-4">No complaints yet</p>
            <Link to="/student/submit"><Button><Send className="w-4 h-4 mr-2" />Submit a Complaint</Button></Link>
          </div>
        ) : (
          <div className="space-y-0">
            {recent.map((c) => (
              <Link key={c.id} to={`/student/complaints/${c.id}`}
                className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between py-3 border-b border-[hsl(var(--border-subtle))] hover:bg-elevated transition-colors px-3 rounded-md group">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <span className="text-sm font-medium break-words sm:truncate min-w-0">{c.title}</span>
                  <CategoryTag category={c.category} />
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
                  <PriorityBadge priority={c.priority} />
                  <StatusBadge status={c.status} />
                  <span className="text-xs text-text-secondary sm:ml-auto">{c.createdAt}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default StudentDashboard;
