import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { PriorityBadge, StatusBadge, CategoryTag } from '../../components/shared/Badge';
import type { Comment, Complaint } from '../../utils/constants';
import { CheckCircle2, Circle } from 'lucide-react';
import { getMyComplaintByIdApi } from '../../api/complaintsApi';
import { mapComment, mapComplaint } from '../../api/mappers';

const steps = ['Submitted', 'Acknowledged', 'In Progress', 'Resolved'];

const getStepIndex = (status: string) => {
  switch (status) {
    case 'Pending': return 0;
    case 'In Progress': return 2;
    case 'Resolved': return 3;
    case 'Escalated': return 2;
    default: return 0;
  }
};

const StudentComplaintDetail: React.FC = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (!id) return;
    getMyComplaintByIdApi(id)
      .then((data) => {
        setComplaint(mapComplaint(data.complaint));
        setComments(data.comments.map(mapComment));
      })
      .catch(() => setComplaint(null));
  }, [id]);

  if (!complaint) {
    return <MainLayout><p className="text-text-secondary">Complaint not found</p></MainLayout>;
  }

  const currentStep = getStepIndex(complaint.status);

  return (
    <MainLayout>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-[2]">
          <h1 className="text-lg font-medium tracking-tight mb-3">{complaint.title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            <CategoryTag category={complaint.category} />
            <PriorityBadge priority={complaint.priority} />
            <StatusBadge status={complaint.status} />
            <span className="text-xs text-text-secondary self-center">{complaint.createdAt}</span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed mb-8">{complaint.description}</p>

          {/* Timeline */}
          <div className="mb-8 min-w-0">
            <h3 className="text-xs uppercase tracking-[0.08em] text-text-secondary font-medium mb-4">Status Timeline</h3>
            <div className="overflow-x-auto pb-2 -mx-1 px-1">
              <div className="flex items-center gap-0 min-w-min">
                {steps.map((step, i) => (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center gap-1 shrink-0 w-[4.5rem] sm:w-auto sm:min-w-[4rem]">
                      {i <= currentStep ? (
                        <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-text-muted shrink-0" />
                      )}
                      <span className={`text-[10px] sm:text-xs text-center leading-tight ${i <= currentStep ? 'text-text-primary' : 'text-text-muted'}`}>{step}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`flex-1 min-w-[1.5rem] h-0.5 mx-1 sm:mx-2 ${i < currentStep ? 'bg-accent' : 'bg-border'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Comments */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.08em] text-text-secondary font-medium mb-4">Comments</h3>
            {comments.length === 0 ? (
              <p className="text-sm text-text-muted">No comments yet</p>
            ) : (
              <div className="space-y-4">
                {comments.map((c) => (
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
        </div>

        <div className="flex-1 min-w-0">
          <div className="bg-surface border border-border rounded-lg p-5 lg:sticky lg:top-7 space-y-4">
            <div>
              <p className="text-xs text-text-muted">Assigned Department</p>
              <p className="text-sm font-medium">{complaint.department}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Deadline</p>
              <p className={`text-sm font-medium ${new Date(complaint.deadline) < new Date() && complaint.status !== 'Resolved' ? 'text-danger' : ''}`}>{complaint.deadline}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Created</p>
              <p className="text-sm">{complaint.createdAt}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Last Updated</p>
              <p className="text-sm">{complaint.updatedAt}</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentComplaintDetail;
