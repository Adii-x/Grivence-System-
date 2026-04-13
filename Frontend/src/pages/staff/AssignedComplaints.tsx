import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { PriorityBadge, StatusBadge } from '../../components/shared/Badge';
import Select from '../../components/shared/Select';
import Table from '../../components/shared/Table';
import Button from '../../components/shared/Button';
import { STATUS_OPTIONS, PRIORITY_LEVELS, type Complaint } from '../../utils/constants';
import { AlertTriangle } from 'lucide-react';
import { getStaffComplaintsApi } from '../../api/staffApi';
import { mapComplaint } from '../../api/mappers';

const AssignedComplaints: React.FC = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    getStaffComplaintsApi()
      .then((items) => setComplaints(items.map(mapComplaint)))
      .catch(() => setComplaints([]));
  }, []);

  let filtered = [...complaints];
  if (statusFilter) filtered = filtered.filter((c) => c.status === statusFilter);
  if (priorityFilter) filtered = filtered.filter((c) => c.priority === priorityFilter);

  // Sort urgent first, then by deadline
  const priorityOrder = { Urgent: 0, High: 1, Medium: 2, Low: 3 };
  filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority] || new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  const columns = [
    { key: 'title', header: 'Title', render: (r: Complaint) => <span className="text-sm font-medium">{r.title}</span> },
    { key: 'studentName', header: 'Student', render: (r: Complaint) => <span className="text-sm text-text-secondary">{r.studentName}</span> },
    { key: 'priority', header: 'Priority', render: (r: Complaint) => <PriorityBadge priority={r.priority} /> },
    { key: 'status', header: 'Status', render: (r: Complaint) => <StatusBadge status={r.status} /> },
    {
      key: 'deadline', header: 'Deadline', render: (r: Complaint) => {
        const overdue = new Date(r.deadline) < new Date() && r.status !== 'Resolved';
        return <span className={`text-sm ${overdue ? 'text-danger flex items-center gap-1' : 'text-text-secondary'}`}>
          {overdue && <AlertTriangle className="w-3 h-3" />}{r.deadline}
        </span>;
      }
    },
    { key: 'action', header: '', render: (r: Complaint) => <Button size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/staff/complaints/${r.id}`); }}>View</Button>, className: 'text-right' },
  ];

  return (
    <MainLayout>
      <h1 className="text-xl font-medium tracking-tight mb-6">Assigned Complaints</h1>
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end mb-6">
        <div className="w-full sm:w-40 sm:min-w-[10rem]"><Select placeholder="All Status" options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} /></div>
        <div className="w-full sm:w-40 sm:min-w-[10rem]"><Select placeholder="All Priority" options={PRIORITY_LEVELS.map((p) => ({ value: p, label: p }))} value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} /></div>
      </div>
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <Table columns={columns} data={filtered} keyExtractor={(r) => r.id} onRowClick={(r) => navigate(`/staff/complaints/${r.id}`)} />
      </div>
      {filtered.length === 0 && (
        <p className="text-xs text-text-muted mt-3">
          No complaints are currently assigned to your department. Ask admin to assign complaints to your department.
        </p>
      )}
    </MainLayout>
  );
};

export default AssignedComplaints;
