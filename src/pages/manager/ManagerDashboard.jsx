import React, { useState } from 'react';
import {
  Users,
  CheckSquare,
  FolderKanban,
  Clock,
  CalendarDays,
  Plus,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
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
import TaskModal from '../../components/modals/TaskModal';
import ProjectModal from '../../components/modals/ProjectModal';

export const ManagerDashboard = () => {
  const { employees, tasks, projects, attendance, leaves, getEffectiveStatus } = useERP();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Manager's team: Engineering department
  const teamMembers = employees.filter(e => e.department === 'Engineering');
  const teamTasks = tasks.filter(t => t.assignedManager === 'Marcus Sterling' || teamMembers.some(tm => tm.fullName === t.assignedTo || tm.id === t.assignedToId));
  const completedTasks = teamTasks.filter(t => getEffectiveStatus(t) === 'Completed').length;
  const inProgressTasks = teamTasks.filter(t => getEffectiveStatus(t) === 'In Progress').length;
  const pendingTasks = teamTasks.filter(t => getEffectiveStatus(t) === 'Pending').length;
  const overdueTasks = teamTasks.filter(t => getEffectiveStatus(t) === 'Overdue').length;

  const todayStr = '2026-10-01';
  const teamAttendance = attendance.filter(a => a.date === todayStr && teamMembers.some(tm => tm.id === a.employeeId));
  const presentCount = teamAttendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
  const teamWfhRecords = teamAttendance.filter(a => a.isWFH || a.workMode === 'Work From Home' || a.networkName?.includes('Work From Home'));
  const teamWfhCount = teamWfhRecords.length;

  const teamProjects = projects.filter(p => p.manager === 'Marcus Sterling' || p.department === 'Engineering');
  const pendingLeaveCount = leaves.filter(l => l.status === 'Pending' && teamMembers.some(tm => tm.id === l.employeeId)).length;

  // Manager Charts
  const productivityData = [
    { week: 'W36', velocity: 32, planned: 30 },
    { week: 'W37', velocity: 38, planned: 35 },
    { week: 'W38', velocity: 41, planned: 40 },
    { week: 'W39', velocity: 45, planned: 42 },
    { week: 'W40', velocity: 48, planned: 45 },
  ];

  const taskCompletionData = [
    { status: 'Completed', count: completedTasks },
    { status: 'In Progress', count: inProgressTasks },
    { status: 'Pending', count: pendingTasks },
    { status: 'Overdue', count: overdueTasks },
  ];

  const projectProgressData = teamProjects.map(p => ({
    name: p.name.split(' ')[0],
    progress: p.progress
  }));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 border border-blue-400/40 text-[11px] font-bold tracking-wider uppercase text-blue-300">
              Engineering Director Command
            </span>
            <span className="text-xs text-slate-400">Team Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1.5">
            Welcome, Marcus Sterling
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Core Engineering & Infrastructure Sprint Delivery Hub
          </p>
        </div>

        {/* Quick Actions (Section 42 requirement) */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={Plus}
            onClick={() => setIsTaskModalOpen(true)}
          >
            Create Task
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
            variant="secondary"
            size="sm"
            icon={CalendarDays}
            onClick={() => navigate('/manager/leave')}
          >
            Review Leaves
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Award}
            onClick={() => navigate('/manager/performance')}
          >
            Team Performance
          </Button>
        </div>
      </div>

      {/* KPI Cards (Section 11 requirement: 8 Manager KPI cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Engineering Team"
          value={teamMembers.length}
          comparisonText="Engineers & Designers"
          icon={Users}
          linkTo="/manager/team"
        />
        <StatCard
          title="Present Today"
          value={presentCount || teamMembers.length}
          comparisonText="On-track for standup"
          icon={CheckCircle2}
          iconColor="text-emerald-500"
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
          linkTo="/manager/attendance"
        />
        <StatCard
          title="Pending Sprint Tasks"
          value={pendingTasks}
          comparisonText="In active backlog"
          icon={CheckSquare}
          iconColor="text-amber-500"
          iconBg="bg-amber-50 dark:bg-amber-950/60"
          linkTo="/manager/tasks"
        />
        <StatCard
          title="Completed Tasks"
          value={completedTasks}
          change={14.5}
          isPositive={true}
          comparisonText="This sprint iteration"
          icon={CheckCircle2}
          iconColor="text-emerald-500"
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
          linkTo="/manager/tasks"
        />
        <StatCard
          title="Active Projects"
          value={teamProjects.length}
          comparisonText="Across 3 workstreams"
          icon={FolderKanban}
          iconColor="text-sky-500"
          iconBg="bg-sky-50 dark:bg-sky-950/60"
          linkTo="/manager/projects"
        />
        <StatCard
          title="Pending Approvals"
          value={pendingLeaveCount}
          comparisonText="Leave requests"
          icon={AlertCircle}
          iconColor="text-rose-500"
          iconBg="bg-rose-50 dark:bg-rose-950/60"
          linkTo="/manager/leave"
        />
        <StatCard
          title="Team Velocity Index"
          value="94.2"
          suffix="%"
          change={5.1}
          isPositive={true}
          comparisonText="High delivery rate"
          icon={TrendingUp}
          iconColor="text-indigo-500"
          iconBg="bg-indigo-50 dark:bg-indigo-950/60"
          linkTo="/manager/performance"
        />
        <StatCard
          title="Team WFH Today"
          value={teamWfhCount}
          comparisonText="Engineers on remote shift"
          icon={Home}
          iconColor="text-indigo-600 dark:text-indigo-400"
          iconBg="bg-indigo-50 dark:bg-indigo-950/60"
          linkTo="/manager/attendance"
        />
        <StatCard
          title="Upcoming Deadlines"
          value="3"
          comparisonText="Next 7 days"
          icon={Clock}
          iconColor="text-purple-500"
          iconBg="bg-purple-50 dark:bg-purple-950/60"
          linkTo="/manager/calendar"
        />
      </div>

      {/* Row 1: Charts (Team Productivity & Task Status) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Team Sprint Velocity & Productivity"
          subtitle="Story points delivered vs planned sprint capacity"
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={productivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Area type="monotone" dataKey="velocity" name="Completed Velocity" stroke="#6366f1" strokeWidth={2.5} fill="url(#velocityGrad)" />
              <Area type="monotone" dataKey="planned" name="Planned Target" stroke="#94a3b8" strokeWidth={2} fillOpacity={0} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Sprint Task Breakdown"
          subtitle="Real-time task state distribution"
          action={
            <Button variant="ghost" size="sm" icon={ArrowRight} onClick={() => navigate('/manager/tasks')}>
              Tasks Kanban
            </Button>
          }
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={taskCompletionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="status" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="count" name="Tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Engineering Team Remote / WFH Status */}
      <WFHPersonnelWidget
        departmentFilter="Engineering"
        title="Engineering Team WFH Today"
        subtitle="Direct reports currently active on remote shift with verified HR authorization"
        showMarkButton={false}
      />

      {/* Row 2: Projects Overview */}
      <ChartCard
        title="Active Team Initiatives Progress"
        subtitle="Completion percentages across core workstreams"
      >
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={projectProgressData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${v}%`} />
            <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} />
            <Tooltip
              formatter={(v) => [`${v}% Complete`, 'Progress']}
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
            />
            <Bar dataKey="progress" fill="#10b981" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />
    </div>
  );
};
export default ManagerDashboard;
