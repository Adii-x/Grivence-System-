import React, { useEffect, useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { DEPARTMENTS } from '../../utils/constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Button from '../../components/shared/Button';
import { getAllComplaintsApi, getAnalyticsApi } from '../../api/adminApi';
import { mapComplaint } from '../../api/mappers';

const CHART_COLORS = ['#3B82F6', '#16A34A', '#D97706', '#DC2626'];

const AdminDashboard: React.FC = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [totals, setTotals] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0, escalated: 0 });
  useEffect(() => {
    getAllComplaintsApi().then((items) => setComplaints(items.map(mapComplaint))).catch(() => setComplaints([]));
    getAnalyticsApi().then((data) => setTotals(data.totals)).catch(() => undefined);
  }, []);
  const escalated = complaints.filter((c) => c.status === 'Escalated');

  const stats = [
    { label: 'Total Today', value: totals.total || complaints.length },
    { label: 'Pending', value: totals.pending },
    { label: 'Resolved', value: totals.resolved },
    { label: 'Escalated', value: totals.escalated || escalated.length, highlight: true },
  ];

  // Chart data
  const deptData = DEPARTMENTS.slice(0, 5).map((d) => ({
    name: d.length > 12 ? d.slice(0, 12) + '…' : d,
    count: Math.floor(Math.random() * 20) + 3,
  }));

  const statusData = [
    { name: 'Pending', value: 2 },
    { name: 'In Progress', value: 2 },
    { name: 'Resolved', value: 1 },
    { name: 'Escalated', value: 1 },
  ];

  const weeklyData = Array.from({ length: 8 }, (_, i) => ({
    week: `W${i + 1}`,
    count: Math.floor(Math.random() * 15) + 5,
  }));

  const resolutionData = DEPARTMENTS.slice(0, 5).map((d) => ({
    name: d.length > 12 ? d.slice(0, 12) + '…' : d,
    days: Math.floor(Math.random() * 10) + 2,
  }));

  const chartStyle = { fontSize: 11, fill: '#888888' };

  return (
    <MainLayout>
      <h1 className="text-xl font-medium tracking-tight mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className={`border border-border rounded-lg p-5 card-appear ${s.highlight ? 'bg-[#2C1515]' : 'bg-surface'}`} style={{ animationDelay: `${i * 30}ms` }}>
            <p className="text-[28px] font-semibold">{s.value}</p>
            <p className="text-xs text-text-secondary">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 min-w-0">
        <div className="bg-surface border border-border rounded-lg p-3 sm:p-5 min-w-0">
          <h3 className="text-sm font-medium mb-4">Complaints per Department</h3>
          <div className="h-[220px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deptData}><CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" /><XAxis dataKey="name" tick={chartStyle} /><YAxis tick={chartStyle} /><Tooltip contentStyle={{ background: '#171717', border: '1px solid #1E1E1E', borderRadius: 6, fontSize: 12 }} /><Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-lg p-3 sm:p-5 min-w-0">
          <h3 className="text-sm font-medium mb-4">Status Breakdown</h3>
          <div className="h-[220px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart><Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
              {statusData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
            </Pie><Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #2e2e2e', borderRadius: 6, fontSize: 12 }} itemStyle={{ color: '#F0F0F0' }} labelStyle={{ color: '#F0F0F0' }} /></PieChart>
          </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-lg p-3 sm:p-5 min-w-0">
          <h3 className="text-sm font-medium mb-4">Weekly Trend</h3>
          <div className="h-[220px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData}><CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" /><XAxis dataKey="week" tick={chartStyle} /><YAxis tick={chartStyle} /><Tooltip contentStyle={{ background: '#171717', border: '1px solid #1E1E1E', borderRadius: 6, fontSize: 12 }} /><Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', r: 3 }} /></LineChart>
          </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-lg p-3 sm:p-5 min-w-0">
          <h3 className="text-sm font-medium mb-4">Avg Resolution Time (days)</h3>
          <div className="h-[220px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={resolutionData}><CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" /><XAxis dataKey="name" tick={chartStyle} /><YAxis tick={chartStyle} /><Tooltip contentStyle={{ background: '#171717', border: '1px solid #1E1E1E', borderRadius: 6, fontSize: 12 }} /><Bar dataKey="days" fill="#1E3A5F" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Escalation */}
      {escalated.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-danger mb-4">Needs Attention</h3>
          <div className="bg-surface border border-border rounded-lg overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead><tr className="bg-elevated">
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-medium text-text-secondary">Title</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-medium text-text-secondary">Department</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-medium text-text-secondary">Days Overdue</th>
                <th className="px-4 py-3"></th>
              </tr></thead>
              <tbody>
                {escalated.map((c) => {
                  const daysOverdue = Math.max(0, Math.floor((Date.now() - new Date(c.deadline).getTime()) / 86400000));
                  return (
                    <tr key={c.id} className="border-b border-[hsl(var(--border-subtle))]">
                      <td className="px-4 py-3 font-medium">{c.title}</td>
                      <td className="px-4 py-3 text-text-secondary">{c.department}</td>
                      <td className="px-4 py-3 text-danger">{daysOverdue}</td>
                      <td className="px-4 py-3 text-right"><Button size="sm">Assign</Button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default AdminDashboard;
