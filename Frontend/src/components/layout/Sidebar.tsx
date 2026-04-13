import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard, FileText, Send, Users, Building2, LogOut, Menu, X, AlertTriangle
} from 'lucide-react';

const studentLinks = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/student/submit', label: 'Submit Complaint', icon: Send },
  { to: '/student/complaints', label: 'My Complaints', icon: FileText },
];

const staffLinks = [
  { to: '/staff/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/staff/complaints', label: 'Assigned', icon: FileText },
];

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/complaints', label: 'All Complaints', icon: FileText },
  { to: '/admin/departments', label: 'Departments', icon: Building2 },
];

const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = user?.role === 'admin' ? adminLinks : user?.role === 'staff' ? staffLinks : studentLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleBadge = user?.role === 'admin' ? 'bg-[#2C1515] text-[#FCA5A5]' : user?.role === 'staff' ? 'bg-[#0D1F3C] text-[#93C5FD]' : 'bg-[#0F2318] text-[#86EFAC]';

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-accent" />
          <span className="text-[15px] font-medium text-text-primary">Nexus</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 h-9 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-accent-subtle text-accent' : 'text-text-secondary hover:bg-elevated'
              }`
            }
          >
            <link.icon className="w-4 h-4" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-border">
        <div className="mb-3">
          <p className="text-sm font-medium text-text-primary truncate">{user?.name}</p>
          <span className={`inline-block mt-1 rounded-sm px-2 py-0.5 text-xs font-medium capitalize ${roleBadge}`}>
            {user?.role}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed z-[100] lg:hidden p-2 rounded-md bg-surface border border-border"
        style={{ top: 'max(1rem, env(safe-area-inset-top))', left: 'max(1rem, env(safe-area-inset-left))' }}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[90] bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-[95] h-[100dvh] w-[min(100vw,220px)] max-w-[85vw] bg-surface border-r border-border
        pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]
        transition-transform duration-200
        lg:translate-x-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
