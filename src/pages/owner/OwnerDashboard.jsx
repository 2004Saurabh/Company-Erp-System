import React, { useState } from 'react';
import {
  Users,
  Building2,
  IndianRupee,
  TrendingUp,
  FolderKanban,
  Clock,
  CalendarDays,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  BarChart3,
  CreditCard,
  Home
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
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
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import ChartCard from '../../components/ChartCard';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import WFHPersonnelWidget from '../../components/WFHPersonnelWidget';
import EmployeeModal from '../../components/modals/EmployeeModal';
import ProjectModal from '../../components/modals/ProjectModal';
import DepartmentModal from '../../components/modals/DepartmentModal';

export const OwnerDashboard = () => {
  const { employees, departments, projects, leaves, attendance, payroll, auditLogs } = useERP();
  const navigate = useNavigate();

  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);

  // Calculations
  const activeEmployees = employees.filter(e => e.status === 'Active').length;
  const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
  const activeProjects = projects.filter(p => p.status === 'In Progress').length;
  const totalPayrollMonthly = payroll
    .filter(p => p.month.includes('September 2026'))
    .reduce((acc, curr) => acc + (curr.netSalary || 0), 0);

  const todayStr = '2026-10-01';
  const todayAttendance = (attendance || []).filter(a => a.date === todayStr);
  const wfhList = todayAttendance.filter(a => a.isWFH || a.workMode === 'Work From Home' || a.networkName?.includes('Work From Home'));
  const wfhCount = wfhList.length;

  // Chart Data: Revenue vs Expense
  const financialData = [
    { month: 'Apr', revenue: 420000, expenses: 260000, profit: 160000 },
    { month: 'May', revenue: 460000, expenses: 280000, profit: 180000 },
    { month: 'Jun', revenue: 510000, expenses: 310000, profit: 200000 },
    { month: 'Jul', revenue: 580000, expenses: 320000, profit: 260000 },
    { month: 'Aug', revenue: 640000, expenses: 350000, profit: 290000 },
    { month: 'Sep', revenue: 720000, expenses: 390000, profit: 330000 },
  ];

  // Employee Growth
  const employeeGrowthData = [
    { quarter: 'Q1 2025', count: 42 },
    { quarter: 'Q2 2025', count: 54 },
    { quarter: 'Q3 2025', count: 68 },
    { quarter: 'Q4 2025', count: 76 },
    { quarter: 'Q1 2026', count: 85 },
    { quarter: 'Q2 2026', count: 98 },
    { quarter: 'Q3 2026', count: 112 },
  ];

  // Department Distribution Data
  const deptColors = ['#6366f1', '#10b981', '#a855f7', '#f59e0b', '#0ea5e9', '#f43f5e'];
  const departmentPieData = departments.map((d, index) => ({
    name: d.name,
    value: d.employeeCount || 6,
    color: deptColors[index % deptColors.length]
  }));

  // Project Status Breakdown
  const projectStatusData = [
    { status: 'Planning', count: projects.filter(p => p.status === 'Planning').length },
    { status: 'In Progress', count: projects.filter(p => p.status === 'In Progress').length },
    { status: 'On Hold', count: projects.filter(p => p.status === 'On Hold').length },
    { status: 'Completed', count: projects.filter(p => p.status === 'Completed').length },
  ];

  // Monthly Performance Scores
  const monthlyPerformanceData = [
    { month: 'May', score: 88 },
    { month: 'Jun', score: 91 },
    { month: 'Jul', score: 89 },
    { month: 'Aug', score: 94 },
    { month: 'Sep', score: 96 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-[11px] font-bold tracking-wider uppercase text-indigo-300">
              Executive Command Center
            </span>
            <span className="text-xs text-slate-400">Live Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1.5">
            Welcome, Saurabh Kumar
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Global Enterprise Overview · Q3 2026 Operations & Financial Intelligence
          </p>
        </div>

        {/* Quick Action Buttons (Section 7 & 42 requirement) */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={Plus}
            onClick={() => setIsEmployeeModalOpen(true)}
          >
            Add Employee
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={Plus}
            onClick={() => setIsDeptModalOpen(true)}
          >
            Add Dept
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={Plus}
            onClick={() => setIsProjectModalOpen(true)}
          >
            Create Project
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={FileText}
            onClick={() => navigate('/owner/reports')}
          >
            View Reports
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid (Section 7 requirement: 8 KPI cards with icons, % change, comparison) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Workforce"
          value={employees.length}
          change={12.4}
          isPositive={true}
          comparisonText="vs last quarter"
          icon={Users}
          linkTo="/owner/employees"
        />
        <StatCard
          title="Active Employees"
          value={activeEmployees}
          change={4.8}
          isPositive={true}
          comparisonText="98% retention"
          icon={CheckCircle2}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
          linkTo="/owner/employees"
        />
        <StatCard
          title="Total Departments"
          value={departments.length}
          change={0}
          isPositive={true}
          comparisonText="6 active units"
          icon={Building2}
          iconColor="text-purple-600 dark:text-purple-400"
          iconBg="bg-purple-50 dark:bg-purple-950/60"
          linkTo="/owner/departments"
        />
        <StatCard
          title="Monthly Revenue"
          prefix="₹"
          value="720k"
          change={14.2}
          isPositive={true}
          comparisonText="vs last month"
          icon={IndianRupee}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
          linkTo="/owner/finance"
        />
        <StatCard
          title="Monthly Expenses"
          prefix="₹"
          value="390k"
          change={3.1}
          isPositive={false}
          comparisonText="Operational spend"
          icon={CreditCard}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-50 dark:bg-amber-950/60"
          linkTo="/owner/finance"
        />
        <StatCard
          title="Net Profit"
          prefix="₹"
          value="330k"
          change={18.7}
          isPositive={true}
          comparisonText="45.8% margin"
          icon={TrendingUp}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
          linkTo="/owner/finance"
        />
        <StatCard
          title="Pending Approvals"
          value={pendingLeaves}
          change={pendingLeaves > 0 ? 15 : 0}
          isPositive={pendingLeaves === 0}
          comparisonText="Action required"
          icon={Clock}
          iconColor="text-rose-600 dark:text-rose-400"
          iconBg="bg-rose-50 dark:bg-rose-950/60"
          linkTo="/owner/leave"
        />
        <StatCard
          title="Active Projects"
          value={activeProjects}
          change={8.5}
          isPositive={true}
          comparisonText="Across 4 teams"
          icon={FolderKanban}
          iconColor="text-sky-600 dark:text-sky-400"
          iconBg="bg-sky-50 dark:bg-sky-950/60"
          linkTo="/owner/projects"
        />
        <StatCard
          title="Work From Home (WFH)"
          value={wfhCount}
          comparisonText="Remote authorized personnel"
          icon={Home}
          iconColor="text-indigo-600 dark:text-indigo-400"
          iconBg="bg-indigo-50 dark:bg-indigo-950/60"
          linkTo="/owner/attendance"
        />
      </div>

      {/* Row 1: Charts (Revenue vs Expenses & Employee Growth) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Revenue vs Expense */}
        <ChartCard
          title="Revenue vs. Operating Expenses"
          subtitle="Trailing 6-month cash flow and bottom-line margin expansion"
          action={
            <Button variant="ghost" size="sm" icon={ArrowUpRight} onClick={() => navigate('/owner/finance')}>
              Finance
            </Button>
          }
        >
          <ResponsiveContainer width="100%" height={270}>
            <AreaChart data={financialData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip
                formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, '']}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#revenueGrad)" />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#expenseGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 2: Employee Growth */}
        <ChartCard
          title="Workforce Expansion Trend"
          subtitle="Net headcount progression over the previous 7 quarters"
          action={
            <Button variant="ghost" size="sm" icon={ArrowUpRight} onClick={() => navigate('/owner/employees')}>
              Staff
            </Button>
          }
        >
          <ResponsiveContainer width="100%" height={270}>
            <LineChart data={employeeGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="quarter" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} domain={[30, 130]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Line type="monotone" dataKey="count" name="Employees" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 2: Charts (Department Breakdown, Project Status, Monthly Performance) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chart 3: Department Distribution */}
        <ChartCard
          title="Department Distribution"
          subtitle="Resource allocation by division"
        >
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={departmentPieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {departmentPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val) => [`${val} staff`, 'Headcount']}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 4: Project Status */}
        <ChartCard
          title="Project Pipeline Status"
          subtitle="Current operational milestones"
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={projectStatusData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="status" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="count" name="Projects" fill="#a855f7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 5: Monthly Performance */}
        <ChartCard
          title="Company Performance Index"
          subtitle="Composite efficiency SLA rating"
        >
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={monthlyPerformanceData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis domain={[80, 100]} stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Line type="monotone" dataKey="score" name="Performance Score" stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 4, fill: '#0ea5e9' }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Live Remote Workforce / WFH Personnel Widget */}
      <WFHPersonnelWidget
        title="Enterprise Work From Home (WFH) Roster"
        subtitle="Remote personnel actively logged with verified HR authorization"
      />

      {/* Recent Strategic Activity & Approvals Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Executive Approvals */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Pending Executive Approvals</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Leave applications requiring executive authorization</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/owner/leave')}>
              Manage All
            </Button>
          </div>

          <div className="space-y-3">
            {leaves.filter(l => l.status === 'Pending').slice(0, 3).map((l) => (
              <div
                key={l.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{l.employeeName}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{l.leaveType} · {l.days} days ({l.startDate} to {l.endDate})</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="warning" size="sm">Pending</Badge>
                  <Button variant="outline" size="sm" onClick={() => navigate('/owner/leave')}>
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Audit Log Stream */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Live Enterprise Audit Log</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">System actions recorded in real-time</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/owner/audit-logs')}>
              Full Logs
            </Button>
          </div>

          <div className="space-y-3">
            {auditLogs.slice(0, 4).map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
              >
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{log.action}</span>
                    <span className="text-[10px] text-slate-400">{log.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{log.details}</p>
                  <span className="text-[10px] text-indigo-500 font-medium">By {log.user} ({log.role})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals for Quick Actions */}
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
    </div>
  );
};
export default OwnerDashboard;
