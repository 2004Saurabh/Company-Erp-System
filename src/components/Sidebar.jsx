import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Building2,
  UserCheck,
  FolderKanban,
  IndianRupee,
  CreditCard,
  Clock,
  CalendarDays,
  Award,
  BarChart3,
  Megaphone,
  Settings,
  ShieldCheck,
  User,
  UserPlus,
  Briefcase,
  GraduationCap,
  FileText,
  Calendar,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const { role, currentUser, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully.', 'info');
    navigate('/login');
  };

  // Nav configurations by role
  const getNavItems = () => {
    switch (role) {
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'Employees', path: '/admin/employees', icon: Users },
          { name: 'Departments', path: '/admin/departments', icon: Building2 },
          { name: 'Managers', path: '/admin/managers', icon: UserCheck },
          { name: 'Projects', path: '/admin/projects', icon: FolderKanban },
          { name: 'Tasks', path: '/admin/tasks', icon: Briefcase },
          { name: 'Finance', path: '/admin/finance', icon: IndianRupee },
          { name: 'Payroll', path: '/admin/payroll', icon: CreditCard },
          { name: 'Attendance', path: '/admin/attendance', icon: Clock },
          { name: 'Leave Management', path: '/admin/leave', icon: CalendarDays },
          { name: 'Recruitment', path: '/admin/recruitment', icon: UserPlus },
          { name: 'Onboarding', path: '/admin/onboarding', icon: Briefcase },
          { name: 'Performance', path: '/admin/performance', icon: Award },
          { name: 'Training', path: '/admin/training', icon: GraduationCap },
          { name: 'Documents', path: '/admin/documents', icon: FileText },
          { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
          { name: 'Announcements', path: '/admin/announcements', icon: Megaphone },
          { name: 'Audit Logs', path: '/admin/audit-logs', icon: ShieldCheck },
          { name: 'Company Settings', path: '/admin/settings', icon: Settings },
          { name: 'Profile', path: '/admin/profile', icon: User },
        ];
      case 'owner':
        return [
          { name: 'Dashboard', path: '/owner/dashboard', icon: LayoutDashboard },
          { name: 'Employees', path: '/owner/employees', icon: Users },
          { name: 'Departments', path: '/owner/departments', icon: Building2 },
          { name: 'Managers', path: '/owner/managers', icon: UserCheck },
          { name: 'Projects', path: '/owner/projects', icon: FolderKanban },
          { name: 'Tasks', path: '/owner/tasks', icon: Briefcase },
          { name: 'Task Analytics', path: '/owner/analytics', icon: BarChart3 },
          { name: 'Finance', path: '/owner/finance', icon: IndianRupee },
          { name: 'Payroll', path: '/owner/payroll', icon: CreditCard },
          { name: 'Attendance', path: '/owner/attendance', icon: Clock },
          { name: 'Leave Management', path: '/owner/leave', icon: CalendarDays },
          { name: 'Performance', path: '/owner/performance', icon: Award },
          { name: 'Reports', path: '/owner/reports', icon: BarChart3 },
          { name: 'Announcements', path: '/owner/announcements', icon: Megaphone },
          { name: 'Company Settings', path: '/owner/settings', icon: Settings },
          { name: 'Audit Logs', path: '/owner/audit-logs', icon: ShieldCheck },
          { name: 'Profile', path: '/owner/profile', icon: User },
        ];
      case 'hr':
        return [
          { name: 'Dashboard', path: '/hr/dashboard', icon: LayoutDashboard },
          { name: 'Employees', path: '/hr/employees', icon: Users },
          { name: 'Departments', path: '/hr/departments', icon: Building2 },
          { name: 'Workforce Tasks', path: '/hr/tasks', icon: Briefcase },
          { name: 'Task Analytics', path: '/hr/analytics', icon: BarChart3 },
          { name: 'Attendance', path: '/hr/attendance', icon: Clock },
          { name: 'Leave Management', path: '/hr/leave', icon: CalendarDays },
          { name: 'Recruitment', path: '/hr/recruitment', icon: UserPlus },
          { name: 'Onboarding', path: '/hr/onboarding', icon: Briefcase },
          { name: 'Payroll', path: '/hr/payroll', icon: CreditCard },
          { name: 'Performance', path: '/hr/performance', icon: Award },
          { name: 'Training', path: '/hr/training', icon: GraduationCap },
          { name: 'Documents', path: '/hr/documents', icon: FileText },
          { name: 'Announcements', path: '/hr/announcements', icon: Megaphone },
          { name: 'Reports', path: '/hr/reports', icon: BarChart3 },
          { name: 'Profile', path: '/hr/profile', icon: User },
        ];
      case 'manager':
        return [
          { name: 'Dashboard', path: '/manager/dashboard', icon: LayoutDashboard },
          { name: 'My Team', path: '/manager/team', icon: Users },
          { name: 'Tasks', path: '/manager/tasks', icon: Briefcase },
          { name: 'Team Analytics', path: '/manager/analytics', icon: BarChart3 },
          { name: 'Projects', path: '/manager/projects', icon: FolderKanban },
          { name: 'Attendance', path: '/manager/attendance', icon: Clock },
          { name: 'Leave Requests', path: '/manager/leave', icon: CalendarDays },
          { name: 'Performance', path: '/manager/performance', icon: Award },
          { name: 'Team Calendar', path: '/manager/calendar', icon: Calendar },
          { name: 'Announcements', path: '/manager/announcements', icon: Megaphone },
          { name: 'Reports', path: '/manager/reports', icon: BarChart3 },
          { name: 'Profile', path: '/manager/profile', icon: User },
        ];
      case 'employee':
      default:
        return [
          { name: 'Dashboard', path: '/employee/dashboard', icon: LayoutDashboard },
          { name: 'My Tasks', path: '/employee/tasks', icon: Briefcase },
          { name: 'Productivity Analytics', path: '/employee/analytics', icon: BarChart3 },
          { name: 'My Projects', path: '/employee/projects', icon: FolderKanban },
          { name: 'Attendance', path: '/employee/attendance', icon: Clock },
          { name: 'Apply Leave', path: '/employee/leave', icon: CalendarDays },
          { name: 'Payslips', path: '/employee/payslips', icon: CreditCard },
          { name: 'Performance', path: '/employee/performance', icon: Award },
          { name: 'Training', path: '/employee/training', icon: GraduationCap },
          { name: 'Announcements', path: '/employee/announcements', icon: Megaphone },
          { name: 'Company Calendar', path: '/employee/calendar', icon: Calendar },
          { name: 'My Documents', path: '/employee/documents', icon: FileText },
          { name: 'Profile', path: '/employee/profile', icon: User },
          { name: 'Settings', path: '/employee/settings', icon: Settings },
        ];
    }
  };

  const navItems = getNavItems();

  const roleBadgeText = {
    admin: 'Super Administrator',
    owner: 'Owner / Executive',
    hr: 'Human Resources',
    manager: 'Team Manager',
    employee: 'Employee Self-Service'
  };

  const roleBadgeColor = {
    admin: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    owner: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    hr: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    manager: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    employee: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 flex-shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col min-w-0"
            >
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white leading-none">
                NEXORA
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-indigo-600 dark:text-indigo-400 mt-1 truncate">
                Enterprise ERP
              </span>
            </motion.div>
          )}
        </div>

        {/* Desktop Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Role Badge Indicator */}
      {!isCollapsed && (
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/60">
          <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${roleBadgeColor[role] || 'bg-slate-100 text-slate-700'}`}>
            {roleBadgeText[role] || 'Portal'}
          </div>
        </div>
      )}

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110" />
              {!isCollapsed && (
                <span className="truncate">{item.name}</span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User Info & Logout Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80">
        <div className={`flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 ${isCollapsed ? 'justify-center' : ''}`}>
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={currentUser?.name}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/20 flex-shrink-0"
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {currentUser?.name || 'Enterprise User'}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate capitalize">
                {currentUser?.title || role}
              </p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex-shrink-0"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block h-screen fixed left-0 top-0 z-30 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed top-0 bottom-0 left-0 w-72 z-10"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
export default Sidebar;
