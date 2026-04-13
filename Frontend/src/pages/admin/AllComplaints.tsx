import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { PriorityBadge, StatusBadge } from '../../components/shared/Badge';
import Input from '../../components/shared/Input';
import Select from '../../components/shared/Select';
import Table from '../../components/shared/Table';
import Button from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import { STATUS_OPTIONS, PRIORITY_LEVELS, type Complaint } from '../../utils/constants';
import { showToast } from '../../components/shared/Toast';
import { Search } from 'lucide-react';
import { assignComplaintApi, getAllComplaintsApi, getDepartmentsApi } from '../../api/adminApi';
import { mapComplaint } from '../../api/mappers';

const AdminAllComplaints: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [assignModal, setAssignModal] = useState<string | null>(null);
  const [assignDept, setAssignDept] = useState('');
  const [departments, setDepartments] = useState<string[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [page, setPage] = useState(1);
  const perPage = 20;

  useEffect(() => {
    getAllComplaintsApi()
      .then((items) => setComplaints(items.map(mapComplaint)))
      .catch(() => setComplaints([]));
    getDepartmentsApi()
      .then((items) => setDepartments(items))
      .catch(() => setDepartments([]));
  }, []);

  let filtered = [...complaints];
  if (search) filtered = filtered.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));
  if (statusFilter) filtered = filtered.filter((c) => c.status === statusFilter);
  if (priorityFilter) filtered = filtered.filter((c) => c.priority === priorityFilter);
  if (deptFilter) filtered = filtered.filter((c) => c.department === deptFilter);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const columns = [
    { key: 'title', header: 'Title', render: (r: Complaint) => <span className="text-sm font-medium">{r.title}</span> },
    { key: 'studentName', header: 'Student', render: (r: Complaint) => <span className="text-sm text-text-secondary">{r.studentName}</span> },
    { key: 'department', header: 'Dept', render: (r: Complaint) => <span className="text-sm text-text-secondary">{r.department}</span> },
    { key: 'priority', header: 'Priority', render: (r: Complaint) => <PriorityBadge priority={r.priority} /> },
    { key: 'status', header: 'Status', render: (r: Complaint) => <StatusBadge status={r.status} /> },
    { key: 'deadline', header: 'Deadline', render: (r: Complaint) => <span className="text-sm text-text-secondary">{r.deadline}</span> },
    { key: 'action', header: '', render: (r: Complaint) => (
      <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); setAssignModal(r.id); }}>Assign</Button>
    ), className: 'text-right' },
  ];

  return (
    <MainLayout>
      <h1 className="text-xl font-medium tracking-tight mb-6">All Complaints</h1>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          className="w-full h-9 rounded-md bg-elevated border border-border pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
          placeholder="Search complaints..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mb-6">
        <div className="w-full sm:w-36 sm:min-w-[9rem] sm:flex-1 sm:max-w-[14rem]"><Select placeholder="Department" options={departments.map((d) => ({ value: d, label: d }))} value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }} /></div>
        <div className="w-full sm:w-36 sm:min-w-[9rem] sm:flex-1 sm:max-w-[12rem]"><Select placeholder="Status" options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} /></div>
        <div className="w-full sm:w-36 sm:min-w-[9rem] sm:flex-1 sm:max-w-[12rem]"><Select placeholder="Priority" options={PRIORITY_LEVELS.map((p) => ({ value: p, label: p }))} value={priorityFilter} onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }} /></div>
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <Table columns={columns} data={paginated} keyExtractor={(r) => r.id} onRowClick={(r) => navigate(`/admin/complaints/${r.id}`)} />
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="text-sm text-text-secondary hover:text-text-primary disabled:opacity-30 px-3 py-1">Previous</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`text-sm px-3 py-1 rounded-md ${page === i + 1 ? 'bg-accent-subtle text-accent' : 'text-text-secondary'}`}>{i + 1}</button>
          ))}
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="text-sm text-text-secondary hover:text-text-primary disabled:opacity-30 px-3 py-1">Next</button>
        </div>
      )}

      <Modal isOpen={!!assignModal} onClose={() => setAssignModal(null)} title="Assign to Department">
        <div className="space-y-4">
          <Select label="Department" placeholder="Select department" options={departments.map((d) => ({ value: d, label: d }))} value={assignDept} onChange={(e) => setAssignDept(e.target.value)} />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setAssignModal(null)}>Cancel</Button>
            <Button onClick={async () => {
              if (!assignModal || !assignDept) return;
              try {
                await assignComplaintApi(assignModal, assignDept);
                showToast('Complaint assigned successfully', 'success');
                setAssignModal(null);
              } catch (e: any) {
                showToast(e?.response?.data?.message || 'Assign failed', 'error');
              }
            }}>Confirm</Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
};

export default AdminAllComplaints;
