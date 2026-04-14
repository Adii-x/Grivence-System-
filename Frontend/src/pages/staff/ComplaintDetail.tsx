import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { PriorityBadge, StatusBadge, CategoryTag } from '../../components/shared/Badge';
import Input from '../../components/shared/Input';
import Select from '../../components/shared/Select';
import Button from '../../components/shared/Button';
import { STATUS_OPTIONS, type Comment, type Complaint } from '../../utils/constants';
import { showToast } from '../../components/shared/Toast';
import { AlertTriangle } from 'lucide-react';
import { addStaffCommentApi, getStaffComplaintApi, updateStaffComplaintApi } from '../../api/staffApi';
import { mapComment, mapComplaint } from '../../api/mappers';

const StaffComplaintDetail: React.FC = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [status, setStatus] = useState('');
  const [deadline, setDeadline] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (!id) return;
    getStaffComplaintApi(id)
      .then((data) => {
        const mapped = mapComplaint(data.complaint);
        setComplaint(mapped);
        setStatus(mapped.status);
        setDeadline(mapped.deadline);
        setComments(data.comments.map(mapComment));
      })
      .catch(() => setComplaint(null));
  }, [id]);

  if (!complaint) return <MainLayout><p className="text-text-secondary">Complaint not found</p></MainLayout>;

  const isOverdue = new Date(complaint.deadline) < new Date() && complaint.status !== 'Resolved';

  return (
    <MainLayout>
      {/* Section 1 — Complaint Info */}
      <div className="mb-8">
        <h1 className="text-lg font-medium tracking-tight mb-3">{complaint.title}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          <CategoryTag category={complaint.category} />
          <PriorityBadge priority={complaint.priority} />
          <StatusBadge status={complaint.status} />
          <span className="text-xs text-text-secondary self-center">{complaint.createdAt}</span>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">{complaint.description}</p>
        <div className="mt-4">
          <p className="text-xs text-text-muted mb-1">Attachment</p>
          {complaint.attachmentUrl ? (
            <a
              href={complaint.attachmentUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-accent hover:underline break-all"
            >
              View uploaded file
            </a>
          ) : (
            <p className="text-sm text-text-secondary">No attachment provided</p>
          )}
        </div>
      </div>

      {/* Section 2 — Student Info */}
      <div className="bg-surface border border-border rounded-lg p-5 mb-8">
        <h3 className="text-xs uppercase tracking-[0.08em] text-text-secondary font-medium mb-3">Student Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="min-w-0"><p className="text-xs text-text-muted">Name</p><p className="text-sm break-words">{complaint.studentName}</p></div>
          <div className="min-w-0"><p className="text-xs text-text-muted">Student ID</p><p className="text-sm break-all">{complaint.studentId}</p></div>
          <div className="min-w-0"><p className="text-xs text-text-muted">Department</p><p className="text-sm break-words">{complaint.studentDepartment}</p></div>
          <div className="min-w-0"><p className="text-xs text-text-muted">Year</p><p className="text-sm">{complaint.studentYear}</p></div>
        </div>
      </div>

      {/* Section 3 — Update Panel */}
      <div className="bg-surface border border-border rounded-lg p-5 mb-8">
        <h3 className="text-xs uppercase tracking-[0.08em] text-text-secondary font-medium mb-4">Update Complaint</h3>
        {isOverdue && (
          <div className="bg-danger rounded-md px-4 py-3 mb-4 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-white shrink-0 mt-0.5" />
            <p className="text-sm text-white leading-snug">This complaint is overdue and needs immediate attention</p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Select label="Status" options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))} value={status} onChange={(e) => setStatus(e.target.value)} />
          <Input label="Deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </div>
        <Button onClick={async () => {
          if (!id) return;
          try {
            await updateStaffComplaintApi(id, { status, deadline });
            showToast('Complaint updated successfully', 'success');
          } catch (e: any) {
            showToast(e?.response?.data?.message || 'Update failed', 'error');
          }
        }}>Save Changes</Button>
      </div>

      {/* Section 4 — Comments */}
      <div>
        <h3 className="text-xs uppercase tracking-[0.08em] text-text-secondary font-medium mb-4">Comments</h3>
        <div className="space-y-4 mb-4">
          {comments.map((c) => (
            <div key={c.id} className={`flex gap-3 ${c.role === 'staff' ? 'pl-0' : 'pl-4'}`}>
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <textarea
            className="flex-1 min-h-[80px] min-w-0 rounded-md bg-elevated border border-border px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors resize-y"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button className="shrink-0 sm:self-end w-full sm:w-auto" onClick={async () => {
            if (!id || !comment.trim()) return;
            try {
              const response = await addStaffCommentApi(id, comment);
              setComments((prev) => [...prev, mapComment(response.comment)]);
              showToast('Comment added', 'success');
              setComment('');
            } catch (e: any) {
              showToast(e?.response?.data?.message || 'Comment failed', 'error');
            }
          }}>Send</Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default StaffComplaintDetail;
