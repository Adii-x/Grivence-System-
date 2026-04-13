import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { PriorityBadge, StatusBadge, CategoryTag } from '../../components/shared/Badge';
import type { Complaint } from '../../utils/constants';
import { getAdminComplaintApi } from '../../api/adminApi';
import { mapComplaint } from '../../api/mappers';

const AdminComplaintDetail: React.FC = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    if (!id) return;
    getAdminComplaintApi(id)
      .then((item) => setComplaint(mapComplaint(item)))
      .catch(() => setComplaint(null));
  }, [id]);
  if (!complaint) return <MainLayout><p className="text-text-secondary">Complaint not found</p></MainLayout>;

  return (
    <MainLayout>
      <h1 className="text-lg font-medium tracking-tight mb-3">{complaint.title}</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        <CategoryTag category={complaint.category} />
        <PriorityBadge priority={complaint.priority} />
        <StatusBadge status={complaint.status} />
        <span className="text-xs text-text-secondary self-center">{complaint.createdAt}</span>
      </div>
      <p className="text-sm text-text-secondary leading-relaxed mb-6">{complaint.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-0">
        <div className="bg-surface border border-border rounded-lg p-5 min-w-0">
          <h3 className="text-xs uppercase tracking-[0.08em] text-text-secondary font-medium mb-3">Student Info</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="min-w-0"><p className="text-xs text-text-muted">Name</p><p className="text-sm break-words">{complaint.studentName}</p></div>
            <div className="min-w-0"><p className="text-xs text-text-muted">Student ID</p><p className="text-sm break-all">{complaint.studentId}</p></div>
            <div className="min-w-0"><p className="text-xs text-text-muted">Department</p><p className="text-sm break-words">{complaint.studentDepartment}</p></div>
            <div className="min-w-0"><p className="text-xs text-text-muted">Year</p><p className="text-sm">{complaint.studentYear}</p></div>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-lg p-5 min-w-0">
          <h3 className="text-xs uppercase tracking-[0.08em] text-text-secondary font-medium mb-3">Complaint Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="min-w-0"><p className="text-xs text-text-muted">Department</p><p className="text-sm break-words">{complaint.department}</p></div>
            <div className="min-w-0"><p className="text-xs text-text-muted">Deadline</p><p className="text-sm">{complaint.deadline}</p></div>
            <div className="min-w-0"><p className="text-xs text-text-muted">Created</p><p className="text-sm">{complaint.createdAt}</p></div>
            <div className="min-w-0"><p className="text-xs text-text-muted">Updated</p><p className="text-sm">{complaint.updatedAt}</p></div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xs uppercase tracking-[0.08em] text-text-secondary font-medium mb-4">Comments</h3>
        {!complaint.comments || complaint.comments.length === 0 ? (
          <p className="text-sm text-text-muted">No comments yet</p>
        ) : (
          <div className="space-y-4">
            {complaint.comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-accent-subtle flex items-center justify-center text-xs font-medium text-accent shrink-0">
                  {c.author.split(' ').map((w) => w[0]).join('')}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="text-sm font-medium">{c.author}</span>
                    <span className="text-xs text-text-muted capitalize">{c.role}</span>
                    <span className="text-xs text-text-muted">{c.timestamp}</span>
                  </div>
                  <p className="text-sm text-text-secondary mt-1">{c.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AdminComplaintDetail;
