import React, { useEffect, useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { DEPARTMENTS } from '../../utils/constants';
import { getAllComplaintsApi } from '../../api/adminApi';
import { mapComplaint } from '../../api/mappers';

const DepartmentPerformance: React.FC = () => {
  const [deptStats, setDeptStats] = useState<any[]>([]);
  useEffect(() => {
    getAllComplaintsApi()
      .then((items) => {
        const complaints = items.map(mapComplaint);
        const grouped = DEPARTMENTS.map((name) => {
          const rows = complaints.filter((c) => c.department === name);
          const resolved = rows.filter((r) => r.status === 'Resolved').length;
          const pending = rows.filter((r) => r.status === 'Pending').length;
          const escalated = rows.filter((r) => r.status === 'Escalated').length;
          const avgDays = rows.length === 0 ? 0 : Math.round(rows.reduce((acc, r) => acc + Math.max(1, Math.floor((new Date(r.updatedAt).getTime() - new Date(r.createdAt).getTime()) / 86400000)), 0) / rows.length);
          return { name, received: rows.length, resolved, pending, escalated, avgDays };
        }).sort((a, b) => b.avgDays - a.avgDays);
        setDeptStats(grouped);
      })
      .catch(() => setDeptStats([]));
  }, []);

  return (
    <MainLayout>
      <h1 className="text-xl font-medium tracking-tight mb-6">Department Performance</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deptStats.map((d, i) => {
          const dot = d.avgDays < 5 ? 'bg-success' : d.avgDays <= 10 ? 'bg-warning' : 'bg-danger';
          return (
            <div key={d.name} className="bg-surface border border-border rounded-lg p-5 card-appear" style={{ animationDelay: `${i * 30}ms` }}>
              <div className="flex items-start justify-between gap-2 mb-4">
                <h3 className="text-[15px] font-medium break-words pr-2 leading-snug">{d.name}</h3>
                <div className={`w-2.5 h-2.5 rounded-full ${dot}`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-text-muted">Received</p><p className="text-sm font-medium">{d.received}</p></div>
                <div><p className="text-xs text-text-muted">Resolved</p><p className="text-sm font-medium">{d.resolved}</p></div>
                <div><p className="text-xs text-text-muted">Pending</p><p className="text-sm font-medium">{d.pending}</p></div>
                <div><p className="text-xs text-text-muted">Escalated</p><p className="text-sm font-medium text-danger">{d.escalated}</p></div>
                <div className="col-span-2"><p className="text-xs text-text-muted">Avg Resolution</p><p className="text-sm font-medium">{d.avgDays} days</p></div>
              </div>
            </div>
          );
        })}
      </div>
    </MainLayout>
  );
};

export default DepartmentPerformance;
