import React from 'react';
import type { Priority, Status } from '../../utils/constants';

const priorityStyles: Record<Priority, string> = {
  Urgent: 'bg-[#2C1515] text-[#FCA5A5]',
  High: 'bg-[#2C1D0A] text-[#FCD34D]',
  Medium: 'bg-[#2C2208] text-[#FDE68A]',
  Low: 'bg-[#0F2318] text-[#86EFAC]',
};

const statusStyles: Record<Status, string> = {
  Pending: 'bg-[#2C2208] text-[#FDE68A]',
  'In Progress': 'bg-[#0D1F3C] text-[#93C5FD]',
  Resolved: 'bg-[#0F2318] text-[#86EFAC]',
  Escalated: 'bg-[#2C1515] text-[#FCA5A5]',
};

export const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => (
  <span className={`inline-block rounded-sm px-2 py-0.5 text-xs font-medium ${priorityStyles[priority]}`}>
    {priority}
  </span>
);

export const StatusBadge: React.FC<{ status: Status }> = ({ status }) => (
  <span className={`inline-block rounded-sm px-2 py-0.5 text-xs font-medium ${statusStyles[status]} ${status === 'Escalated' ? 'badge-escalated-pulse' : ''}`}>
    {status}
  </span>
);

export const CategoryTag: React.FC<{ category: string }> = ({ category }) => (
  <span className="inline-block rounded-sm px-2 py-0.5 text-xs font-medium bg-elevated text-text-secondary">
    {category}
  </span>
);
