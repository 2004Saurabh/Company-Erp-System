import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Building2,
  IndianRupee,
  Briefcase,
  FolderKanban,
  Clock,
  CalendarDays,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Activity,
  FileText,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Settings,
  Check,
  X,
  Eye,
  CheckSquare,
  Wifi,
  WifiOff,
  Radio,
  Home
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import ChartCard from '../../components/ChartCard';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import WFHPersonnelWidget from '../../components/WFHPersonnelWidget';
import EmployeeModal from '../../components/modals/EmployeeModal';
import ProjectModal from '../../components/modals/ProjectModal';
import DepartmentModal from '../../components/modals/DepartmentModal';
import TaskModal from '../../components/modals/TaskModal';
import AdminWFHAuthorizationModal from '../../components/modals/AdminWFHAuthorizationModal';

export const AdminDashboard = () => {
  const {
    employees,
    departments,
    projects,
    tasks,
    leaves,
    attendance,
    payroll,
    auditLogs,
    jobOpenings,
    candidates,
    approveLeave,
    rejectLeave,
    companyWifis,
    toggleWifiAttendance,
    wifiEnforcementEnabled,
    toggleWifiEnforcement,
    wfhAuthorizedEmployees
  } = useERP();

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAdminWFHModalOpen, setIsAdminWFHModalOpen] = useState(false);

  // Computations
  const activeEmployees = (employees || []).filter(e => e.status === 'Active').length;
  const pendingLeavesList = (leaves || []).filter(l => l.status === 'Pending');
  const pendingLeavesCount = pendingLeavesList.length;
  const activeProjects = (projects || []).filter(p => p.status === 'In Progress').length;
  const activeTasks = (tasks || []).filter(t => t.status !== 'Completed').length;
  const completedTasks = (tasks || []).filter(t => t.status === 'Completed').length;
  const openPositions = (jobOpenings || []).filter(j => j.status === 'Open').length;

  const todayStr = '2026-10-01';
  const todayAttendance = (attendance || []).filter(a => a.date === todayStr);
  const wfhList = todayAttendance.filter(a => a.isWFH || a.workMode === 'Work From Home' || a.networkName?.includes('Work From Home'));
  const wfhCount = wfhList.length;

  const totalPayrollMonthly = (payroll || [])
    .filter(p => p.month?.includes('September 2026'))
    .reduce((acc, curr) => acc + (curr.netSalary || 0), 0);

  // Financial Chart Data
  const financialData = [
    { month: 'Apr', revenue: 420000, expenses: 260000, profit: 160000 },
    { month: 'May', revenue: 460000, expenses: 280000, profit: 180000 },
    { month: 'Jun', revenue: 510000, expenses: 310000, profit: 200000 },
    { month: 'Jul', revenue: 580000, expenses: 320000, profit: 260000 },
    { month: 'Aug', revenue: 640000, expenses: 350000, profit: 290000 },
    { month: 'Sep', revenue: 720000, expenses: 390000, profit: 330000 },
  ];

  // Department Allocation Pie Data
  const deptColors = ['#6366f1', '#10b981', '#a855f7', '#f59e0b', '#0ea5e9', '#f43f5e'];
  const departmentPieData = (departments || []).map((d, index) => ({
    name: d.name,
    value: d.employeeCount || 6,
    color: deptColors[index % deptColors.length]
  }));

  // Task Status Distribution
  const taskStatusData = [
    { status: 'Todo', count: (tasks || []).filter(t => t.status === 'Todo').length || 4 },
    { status: 'In Progress', count: (tasks || []).filter(t => t.status === 'In Progress').length || 6 },
    { status: 'Review', count: (tasks || []).filter(t => t.status === 'Review').length || 3 },
    { status: 'Completed', count: completedTasks || 12 },
  ];

  return (
    <div className="space-y-6">
      {/* Super Admin Executive Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-10 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                <ShieldCheck className="w-3.5 h-3.5" /> Super Administrator Console
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Root Clearance · All Modules Active
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome, {currentUser?.name || 'System Administrator'}
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Cross-operational master panel. You have simultaneous full management access across Owner Executive Analytics, HR Talent Ops, and Team Manager Deliverables.
            </p>
          </div>

          {/* Quick Action Group */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="primary"
              icon={Plus}
              size="sm"
              onClick={() => setIsEmployeeModalOpen(true)}
            >
              Add Employee
            </Button>
            <Button
              variant="outline"
              icon={Plus}
              size="sm"
              className="text-white border-white/20 hover:bg-white/10"
              onClick={() => setIsProjectModalOpen(true)}
            >
              New Project
            </Button>
            <Button
              variant="outline"
              icon={Plus}
              size="sm"
              className="text-white border-white/20 hover:bg-white/10"
              onClick={() => setIsTaskModalOpen(true)}
            >
              Assign Task
            </Button>
            <Button
              variant="outline"
              icon={Building2}
              size="sm"
              className="text-white border-white/20 hover:bg-white/10"
              onClick={() => setIsDeptModalOpen(true)}
            >
              New Dept
            </Button>
            <Button
              variant="outline"
              icon={ShieldCheck}
              size="sm"
              className="text-white border-rose-400/50 bg-rose-500/20 hover:bg-rose-500/30"
              onClick={() => setIsAdminWFHModalOpen(true)}
            >
              Authorize WFH ID
            </Button>
          </div>
        </div>
      </div>

      {/* Row 1: Executive KPI Cards (Fixed props to prevent any render crashes) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <StatCard
          title="Total Workforce"
          value={employees?.length || 0}
          change={12.4}
          isPositive={true}
          comparisonText="vs last quarter"
          icon={Users}
          iconColor="text-indigo-600 dark:text-indigo-400"
          iconBg="bg-indigo-50 dark:bg-indigo-950/60"
          linkTo="/admin/employees"
        />
        <StatCard
          title="Active Projects"
          value={activeProjects}
          change={8.5}
          isPositive={true}
          comparisonText="Across 4 divisions"
          icon={FolderKanban}
          iconColor="text-sky-600 dark:text-sky-400"
          iconBg="bg-sky-50 dark:bg-sky-950/60"
          linkTo="/admin/projects"
        />
        <StatCard
          title="Ongoing Tasks"
          value={activeTasks}
          change={completedTasks}
          isPositive={true}
          comparisonText="completed this sprint"
          icon={Briefcase}
          iconColor="text-purple-600 dark:text-purple-400"
          iconBg="bg-purple-50 dark:bg-purple-950/60"
          linkTo="/admin/tasks"
        />
        <StatCard
          title="Monthly Revenue"
          prefix="₹"
          value="72,00,000"
          change={14.2}
          isPositive={true}
          comparisonText="vs previous month"
          icon={IndianRupee}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
          linkTo="/admin/finance"
        />
      </div>

      {/* Row 2: Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
        <StatCard
          title="Monthly Payroll"
          prefix="₹"
          value={(totalPayrollMonthly || 874000).toLocaleString('en-IN')}
          change={4.2}
          isPositive={true}
          comparisonText="Disbursed for Sep 2026"
          icon={TrendingUp}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-50 dark:bg-amber-950/60"
          linkTo="/admin/payroll"
        />
        <StatCard
          title="Remote Staff (WFH)"
          value={wfhCount}
          comparisonText="HR-authorized remote"
          icon={Home}
          iconColor="text-indigo-600 dark:text-indigo-400"
          iconBg="bg-indigo-50 dark:bg-indigo-950/60"
          linkTo="/admin/attendance"
        />
        <StatCard
          title="Pending Approvals"
          value={pendingLeavesCount}
          change={pendingLeavesCount > 0 ? 10 : 0}
          isPositive={pendingLeavesCount === 0}
          comparisonText={pendingLeavesCount > 0 ? "Requires review" : "Queue clear"}
          icon={CalendarDays}
          iconColor="text-rose-600 dark:text-rose-400"
          iconBg="bg-rose-50 dark:bg-rose-950/60"
          linkTo="/admin/leave"
        />
        <StatCard
          title="Open Job Openings"
          value={openPositions || 4}
          change={2}
          isPositive={true}
          comparisonText="Talent pipeline"
          icon={UserCheck}
          iconColor="text-teal-600 dark:text-teal-400"
          iconBg="bg-teal-50 dark:bg-teal-950/60"
          linkTo="/admin/recruitment"
        />
        <StatCard
          title="Audit Log Integrity"
          value={auditLogs?.length || 0}
          change={100}
          isPositive={true}
          comparisonText="System nominal"
          icon={ShieldCheck}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
          linkTo="/admin/audit-logs"
        />
      </div>

      {/* Main Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Flow Performance Area Chart */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Enterprise Revenue & Margin Expansion"
            subtitle="Trailing 6-month cash flow and bottom-line margin expansion"
            action={
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/finance')}>
                Finance Details <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            }
          >
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={financialData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="adminRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="adminProfitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#64748b20" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis
                    stroke="#94a3b8"
                    tickFormatter={(val) => `₹${val / 1000}k`}
                  />
                  <Tooltip
                    formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, '']}
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue (₹)"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#adminRevenueGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    name="Net Profit (₹)"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#adminProfitGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Department Workforce Distribution Donut Chart */}
        <div>
          <ChartCard
            title="Workforce Distribution"
            subtitle="Personnel allocation per enterprise division"
            action={
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/departments')}>
                Departments <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            }
          >
            <div className="h-72 w-full flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={departmentPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {departmentPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-2 text-xs">
                {departmentPieData.slice(0, 4).map((d) => (
                  <span key={d.name} className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                    {d.name}
                  </span>
                ))}
              </div>
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Task Lifecycle & Live Audit Logs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Burndown Progress BarChart */}
        <ChartCard
          title="Organization Task Distribution"
          subtitle="Work items workflow across active teams"
          action={
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/tasks')}>
              Tasks Board <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          }
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskStatusData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#64748b20" />
                <XAxis dataKey="status" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="count" fill="#818cf8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Live Admin Audit Activity */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-rose-500" />
                  Live Operational Audit Stream
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Recent activities across HR, Finance & Operations
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin/audit-logs')}
              >
                All Logs <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="space-y-3">
              {(auditLogs || []).slice(0, 4).map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {log.action}
                      </p>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {log.time || log.date || 'Recent'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {log.details || `Logged by ${log.user} (${log.role})`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Status: <strong className="text-emerald-600 dark:text-emerald-400">All Operations Nominal</strong></span>
            <Button
              variant="outline"
              size="xs"
              onClick={() => navigate('/admin/settings')}
              icon={Settings}
            >
              System Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Row 3: Actionable Operational Tables (Leave Approvals & Active Projects) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Executive Approvals (Leave Requests) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-amber-500" />
                Pending Leave & PTO Approvals
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Staff PTO requests requiring executive authorization
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/leave')}
            >
              Manage All <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {pendingLeavesList.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
              All leave requests have been reviewed and resolved.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingLeavesList.slice(0, 4).map((l) => (
                <div
                  key={l.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {l.employeeName}
                      </p>
                      <Badge variant="warning" size="xs">
                        {l.leaveType}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {l.days} days ({l.startDate} to {l.endDate}) · {l.department}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="primary"
                      size="xs"
                      icon={Check}
                      onClick={() => approveLeave(l.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="xs"
                      className="text-rose-600 border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      icon={X}
                      onClick={() => rejectLeave(l.id, 'Declined by Administrator')}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Projects Overview */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-sky-500" />
                Active Strategic Projects
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Current operational deliverables & completion rates
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/projects')}
            >
              View Projects <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="space-y-3.5">
            {(projects || []).slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {p.name}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-2">
                      {p.department}
                    </span>
                  </div>
                  <Badge
                    variant={p.status === 'Completed' ? 'success' : p.status === 'In Progress' ? 'primary' : 'neutral'}
                    size="xs"
                  >
                    {p.status}
                  </Badge>
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all"
                      style={{ width: `${p.progress || 40}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 shrink-0">
                    {p.progress || 40}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Admin WFH ID Registry Management Control Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/60 text-white shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shrink-0 mt-1 sm:mt-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-white">
                Admin WFH Employee ID Authorization Registry
              </h3>
              <Badge variant="purple" size="xs">Admin Clearance Exclusive</Badge>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {(wfhAuthorizedEmployees || []).length} Employee IDs Registered
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              HR is only permitted to record remote WFH attendance for Employee ID Cards that you (Administrator) have registered and approved below. Unregistered IDs will be blocked from remote attendance.
            </p>
            {/* Quick Preview of Authorized IDs */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Authorized IDs:</span>
              {(wfhAuthorizedEmployees || []).slice(0, 5).map(auth => (
                <span
                  key={auth.employeeId}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono bg-slate-800/80 border border-slate-700 text-indigo-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <strong>{auth.employeeId}</strong>
                  <span className="text-slate-400 font-sans text-[11px]">({auth.employeeName?.split(' ')[0]})</span>
                </span>
              ))}
              {(wfhAuthorizedEmployees || []).length > 5 && (
                <span className="text-xs text-slate-400">
                  +{(wfhAuthorizedEmployees || []).length - 5} more
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="primary"
            size="sm"
            icon={ShieldCheck}
            onClick={() => setIsAdminWFHModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 whitespace-nowrap"
          >
            Authorize / Revoke ID Cards
          </Button>
        </div>
      </div>

      {/* Live Remote Workforce / WFH Personnel Widget */}
      <WFHPersonnelWidget
        title="Active Work From Home (WFH) Staff"
        subtitle="Personnel currently operating on verified remote shift with office WiFi geofence bypass"
      />

      {/* Office WiFi Attendance Access Control (Admin Authority Panel) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Wifi className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Office WiFi Attendance Access Control
              </h3>
              <Badge variant="purple" size="xs">Admin Policy Control</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select precisely which company WiFi networks permit shift attendance and which networks block attendance:
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Global Geofence:</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={wifiEnforcementEnabled}
                  onChange={(e) => toggleWifiEnforcement(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
              <span className={`font-bold ${wifiEnforcementEnabled ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                {wifiEnforcementEnabled ? 'ON' : 'OFF'}
              </span>
            </div>

            <Button
              variant="outline"
              size="xs"
              onClick={() => navigate('/admin/settings')}
              icon={Settings}
            >
              WiFi Settings
            </Button>
          </div>
        </div>

        {/* List of Company WiFis with Live Admin Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {(companyWifis || []).map((wifi) => {
            const isAllowed = wifi.attendanceEnabled !== false;
            return (
              <div
                key={wifi.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isAllowed
                    ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800'
                    : 'bg-rose-50/30 dark:bg-rose-950/20 border-rose-200/60 dark:border-rose-900/40'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isAllowed
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    <Wifi className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-bold font-mono text-slate-900 dark:text-white truncate">
                        {wifi.ssid}
                      </span>
                      {wifi.isPrimary && (
                        <Badge variant="purple" size="xs">Primary HQ</Badge>
                      )}
                      <Badge variant={isAllowed ? 'success' : 'danger'} size="xs">
                        {isAllowed ? 'Allowed ✓' : 'Blocked ✕'}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      {wifi.location} · {wifi.ipRange}
                    </p>
                  </div>
                </div>

                {/* 1-Click Toggle Switch for Admin */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAllowed}
                      onChange={() => toggleWifiAttendance(wifi.id)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                  <span className={`text-[10px] font-bold ${isAllowed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                    {isAllowed ? 'Attendance ON' : 'Attendance OFF'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Universal Multi-Module Control Hub */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          Universal Departmental Modules
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          As Super Admin, navigate directly into any management module with full CRUD write permissions:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { label: 'Workforce Roster', path: '/admin/employees', icon: Users, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40' },
            { label: 'Projects Pipeline', path: '/admin/projects', icon: FolderKanban, color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/40' },
            { label: 'Team Tasks Board', path: '/admin/tasks', icon: Briefcase, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40' },
            { label: 'Payroll & Salary', path: '/admin/payroll', icon: IndianRupee, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' },
            { label: 'Recruitment LMS', path: '/admin/recruitment', icon: UserCheck, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40' },
            { label: 'Security & Audit', path: '/admin/audit-logs', icon: ShieldCheck, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all group bg-slate-50/50 dark:bg-slate-800/40"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 text-center">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Global Modals */}
      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
      />
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />
      <DepartmentModal
        isOpen={isDeptModalOpen}
        onClose={() => setIsDeptModalOpen(false)}
      />
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />
      <AdminWFHAuthorizationModal
        isOpen={isAdminWFHModalOpen}
        onClose={() => setIsAdminWFHModalOpen(false)}
      />
    </div>
  );
};

export default AdminDashboard;
