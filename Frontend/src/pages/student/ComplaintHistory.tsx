import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { PriorityBadge, StatusBadge, CategoryTag } from '../../components/shared/Badge';
import Select from '../../components/shared/Select';
import { STATUS_OPTIONS, CATEGORIES, type Complaint } from '../../utils/constants';
import { getMyComplaintsApi } from '../../api/complaintsApi';
import { mapComplaint } from '../../api/mappers';

const ComplaintHistory: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const perPage = 5;

  useEffect(() => {
    getMyComplaintsApi()
      .then((items) => setComplaints(items.map(mapComplaint)))
      .catch(() => setComplaints([]));
  }, []);

  let filtered = complaints;
  if (statusFilter) filtered = filtered.filter((c) => c.status === statusFilter);
  if (categoryFilter) filtered = filtered.filter((c) => c.category === categoryFilter);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <MainLayout>
      <h1 className="text-xl font-medium tracking-tight mb-6">My Complaints</h1>

      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end mb-6">
        <div className="w-full sm:w-40 sm:min-w-[10rem]">
          <Select placeholder="All Status" options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} />
        </div>
        <div className="w-full sm:w-40 sm:min-w-[10rem]">
          <Select placeholder="All Categories" options={CATEGORIES.map((c) => ({ value: c, label: c }))} value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} />
        </div>
      </div>

      <div className="space-y-0">
        {paginated.map((c) => {
          const isOverdue = new Date(c.deadline) < new Date() && c.status !== 'Resolved';
          return (
            <Link key={c.id} to={`/student/complaints/${c.id}`}
              className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-[hsl(var(--border-subtle))] hover:bg-elevated transition-colors px-3 rounded-md gap-2">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <span className="text-sm font-medium break-words sm:truncate min-w-0">{c.title}</span>
                <CategoryTag category={c.category} />
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
                <PriorityBadge priority={c.priority} />
                <StatusBadge status={c.status} />
                <span className="text-xs text-text-secondary">{c.createdAt}</span>
                {isOverdue && <span className="text-xs text-danger font-medium">Overdue</span>}
              </div>
            </Link>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
            className="text-sm text-text-secondary hover:text-text-primary disabled:opacity-30 px-3 py-1">Previous</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`text-sm px-3 py-1 rounded-md ${page === i + 1 ? 'bg-accent-subtle text-accent' : 'text-text-secondary hover:text-text-primary'}`}>{i + 1}</button>
          ))}
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
            className="text-sm text-text-secondary hover:text-text-primary disabled:opacity-30 px-3 py-1">Next</button>
        </div>
      )}
    </MainLayout>
  );
};

export default ComplaintHistory;
