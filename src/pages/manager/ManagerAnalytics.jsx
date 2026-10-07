import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import {
  Users,
  Award,
  CheckCircle2,
  Clock,
  PlayCircle,
  AlertCircle,
  TrendingUp,
  FolderKanban,
  ArrowRight,
  UserCheck,
  ChevronRight,
  Flame
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import EmployeeProductivityModal from '../../components/tasks/EmployeeProductivityModal';
import TaskStatusBadge from '../../components/tasks/TaskStatusBadge';
import TaskPriorityBadge from '../../components/tasks/TaskPriorityBadge';
import TaskDetailsModal from '../../components/tasks/TaskDetailsModal';

const STATUS_COLORS = {
  Completed: '#10b981',
  'In Progress': '#3b82f6',
  Pending: '#f59e0b',
  Overdue: '#f43f5e'
};

export const ManagerAnalytics = () => {
  const { tasks, employees, projects, getEffectiveStatus, calculateCompletionRate, calculateProductivityScore } = useERP();
  const { currentUser } = useAuth();

  const [drilldownEmployee, setDrilldownEmployee] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  // Manager's team: Engineering department & direct reports
  const teamEmployees = useMemo(() => {
    return employees.filter(e => e.department === 'Engineering' || e.manager === 'Marcus Sterling');
  }, [employees]);

  const teamEmployeeIds = useMemo(() => new Set(teamEmployees.map(e => e.id)), [teamEmployees]);
  const teamEmployeeNames = useMemo(() => new Set(teamEmployees.map(e => e.fullName)), [teamEmployees]);

  const teamTasks = useMemo(() => {
    return tasks.filter(t => {
      const isTeamAssignee = teamEmployeeIds.has(t.assignedToId) || teamEmployeeNames.has(t.assignedTo);
      const isMyManaged = t.assignedManager === 'Marcus Sterling' || t.assignedManagerId === 'EMP-1003';
      const isEngineering = t.department === 'Engineering';
      return isTeamAssignee || isMyManaged || isEngineering;
    });
  }, [tasks, teamEmployeeIds, teamEmployeeNames]);

  // Team Overview Metrics
  const totalTeamTasks = teamTasks.length;
  const completedTasks = teamTasks.filter(t => getEffectiveStatus(t) === 'Completed');
  const inProgressTasks = teamTasks.filter(t => getEffectiveStatus(t) === 'In Progress');
  const pendingTasks = teamTasks.filter(t => getEffectiveStatus(t) === 'Pending');
  const overdueTasks = teamTasks.filter(t => getEffectiveStatus(t) === 'Overdue');
  const teamCompletionRate = calculateCompletionRate(teamTasks);

  // Team Task Status Donut Data
  const teamStatusPieData = [
    { name: 'Completed', value: completedTasks.length, color: STATUS_COLORS.Completed },
    { name: 'In Progress', value: inProgressTasks.length, color: STATUS_COLORS['In Progress'] },
    { name: 'Pending', value: pendingTasks.length, color: STATUS_COLORS.Pending },
    { name: 'Overdue', value: overdueTasks.length, color: STATUS_COLORS.Overdue }
  ].filter(d => d.value > 0);

  // Employee-Wise Performance Breakdown
  const employeePerformanceList = useMemo(() => {
    return teamEmployees.map(emp => {
      const empTasks = teamTasks.filter(t => t.assignedToId === emp.id || t.assignedTo === emp.fullName);
      const done = empTasks.filter(t => getEffectiveStatus(t) === 'Completed').length;
      const rate = empTasks.length > 0 ? Math.round((done / empTasks.length) * 100) : 0;
      const score = calculateProductivityScore(empTasks);
      return {
        ...emp,
        total: empTasks.length,
        completed: done,
        rate,
        score
      };
    }).sort((a, b) => b.rate - a.rate);
  }, [teamEmployees, teamTasks, getEffectiveStatus, calculateProductivityScore]);

  // Team Productivity Trend (LineChart)
  const teamTrendData = [
    { week: 'Wk 37', completed: 6, planned: 5 },
    { week: 'Wk 38', completed: 8, planned: 7 },
    { week: 'Wk 39', completed: 11, planned: 10 },
    { week: 'Wk 40', completed: 15, planned: 14 },
    { week: 'Wk 41', completed: Math.max(12, completedTasks.length), planned: 16 }
  ];

  // Project Progress for Manager's Team
  const teamProjects = useMemo(() => {
    const projectMap = {};
    teamTasks.forEach(t => {
      if (!projectMap[t.project]) {
        projectMap[t.project] = { name: t.project, total: 0, completed: 0 };
      }
      projectMap[t.project].total += 1;
      if (getEffectiveStatus(t) === 'Completed') {
        projectMap[t.project].completed += 1;
      }
    });

    return Object.values(projectMap).map(p => ({
      ...p,
      rate: Math.round((p.completed / p.total) * 100)
    }));
  }, [teamTasks, getEffectiveStatus]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-600 dark:text-blue-400">
              Team Productivity Analytics
            </span>
            <span className="text-xs text-slate-400">Marcus Sterling</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Engineering Team Performance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time delivery analytics, engineer drill-downs, and project milestone completion
          </p>
        </div>

        <NavLink
          to="/manager/tasks"
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all"
        >
          View Team Tasks
          <ArrowRight className="w-3.5 h-3.5" />
        </NavLink>
      </div>

      {/* Team Task Overview Cards (Section 8) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Team Tasks</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{totalTeamTasks}</div>
          <span className="text-[10px] text-slate-500">Across {teamEmployees.length} engineers</span>
        </div>

        <div className="p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Completed</span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{completedTasks.length}</div>
          <span className="text-[10px] text-emerald-600/80">{teamCompletionRate}% team rate</span>
        </div>

        <div className="p-4 rounded-3xl bg-blue-500/10 border border-blue-500/20 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">In Progress</span>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{inProgressTasks.length}</div>
          <span className="text-[10px] text-blue-600/80">Active in sprint</span>
        </div>

        <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">Pending</span>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{pendingTasks.length}</div>
          <span className="text-[10px] text-amber-600/80">Backlog queue</span>
        </div>

        <div className="p-4 rounded-3xl bg-rose-500/10 border border-rose-500/20 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">Overdue</span>
          <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">{overdueTasks.length}</div>
          <span className="text-[10px] text-rose-600/80">Require escalation</span>
        </div>

        <div className="p-4 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">Team Rate</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{teamCompletionRate}%</div>
          <span className="text-[10px] text-indigo-600/80 font-medium">{completedTasks.length} / {totalTeamTasks} closed</span>
        </div>
      </div>

      {/* Row 1: Employee-Wise Performance & Team Status Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee-Wise Performance Ranking & Drill-Down (Section 8 & 9) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Employee-Wise Delivery Performance
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click any engineer to open individual task drill-down and productivity metrics
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
              {employeePerformanceList.length} Engineers
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {employeePerformanceList.map((emp) => (
              <div
                key={emp.id}
                onClick={() => setDrilldownEmployee(emp)}
                className="p-3.5 rounded-2xl bg-slate-50/70 hover:bg-indigo-50/50 dark:bg-slate-800/40 dark:hover:bg-slate-800 border border-slate-200/80 hover:border-indigo-400 dark:border-slate-800 transition-all cursor-pointer flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={emp.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={emp.fullName}
                    className="w-10 h-10 rounded-2xl object-cover ring-2 ring-indigo-500/20 group-hover:ring-indigo-500 transition-all"
                  />
                  <div>
                    <div className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                      {emp.fullName}
                      <span className="font-mono text-[10px] text-slate-400 font-normal">({emp.id})</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {emp.designation}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Progress bar */}
                  <div className="w-32 hidden sm:block">
                    <div className="flex justify-between text-[11px] mb-1 font-semibold">
                      <span className="text-slate-500">{emp.completed}/{emp.total} Tasks</span>
                      <span className="text-slate-900 dark:text-white font-bold">{emp.rate}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          emp.rate >= 80 ? 'bg-emerald-500' : emp.rate >= 50 ? 'bg-indigo-600' : 'bg-amber-500'
                        }`}
                        style={{ width: `${emp.rate}%` }}
                      />
                    </div>
                  </div>

                  {/* Score pill */}
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Score</span>
                    <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                      {emp.score}/100
                    </span>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Task Status Donut Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Team Task Status
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active engineering deliverables by status
            </p>
          </div>

          <div className="w-full h-56 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={teamStatusPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {teamStatusPieData.map((entry, index) => (
                    <Cell key={`pie-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val} Tasks`, name]}
                  contentStyle={{
                    borderRadius: '16px',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            {teamStatusPieData.map(d => (
              <div key={d.name} className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-slate-700 dark:text-slate-300 font-medium">{d.name}: {d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Team Productivity Trend & Project Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Productivity Trend LineChart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Team Productivity Trend
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sprint deliverables velocity vs planned sprint commitments
            </p>
          </div>

          <div className="w-full h-64 my-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={teamTrendData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                <XAxis dataKey="week" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '16px',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#10b981' }}
                  name="Completed"
                />
                <Line
                  type="monotone"
                  dataKey="planned"
                  stroke="#6366f1"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#6366f1' }}
                  name="Planned"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Completed
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 ml-2" /> Planned
            </span>
            <span className="font-semibold text-emerald-600">On Track for Sprint Target</span>
          </div>
        </div>

        {/* Project Progress Cards */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Project Delivery Milestones
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Assigned deliverables vs completed per engineering initiative
            </p>
          </div>

          <div className="space-y-4 pt-1">
            {teamProjects.map((prj) => (
              <div key={prj.name} className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-slate-900 dark:text-white">{prj.name}</span>
                  <span className="font-mono text-slate-600 dark:text-slate-300 font-bold">
                    {prj.completed} / {prj.total} Completed ({prj.rate}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      prj.rate >= 80 ? 'bg-emerald-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${prj.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Overdue Tasks Alert Section */}
      {overdueTasks.length > 0 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-rose-500/20 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Team Overdue Tasks Alert ({overdueTasks.length})
              </h3>
            </div>
            <span className="text-xs font-bold text-rose-600">Immediate Action Required</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase text-slate-400">
                  <th className="py-2.5 px-3">Task ID</th>
                  <th className="py-2.5 px-3">Title</th>
                  <th className="py-2.5 px-3">Assignee</th>
                  <th className="py-2.5 px-3">Due Date</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {overdueTasks.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-500">{t.id}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{t.title}</td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{t.assignedTo}</td>
                    <td className="py-2.5 px-3 font-mono text-rose-600 font-bold underline">{t.dueDate}</td>
                    <td className="py-2.5 px-3"><TaskPriorityBadge priority={t.priority} size="sm" /></td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => setSelectedTask(t)}
                        className="px-2.5 py-1 text-xs font-bold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-xl"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Drill-down Modals */}
      {drilldownEmployee && (
        <EmployeeProductivityModal
          isOpen={Boolean(drilldownEmployee)}
          onClose={() => setDrilldownEmployee(null)}
          employee={drilldownEmployee}
        />
      )}

      {selectedTask && (
        <TaskDetailsModal
          isOpen={Boolean(selectedTask)}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
        />
      )}
    </div>
  );
};

export default ManagerAnalytics;
