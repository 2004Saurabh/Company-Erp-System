import React, { useState } from 'react';
import {
  X,
  Award,
  CheckCircle2,
  Clock,
  PlayCircle,
  AlertCircle,
  TrendingUp,
  FolderKanban,
  Calendar,
  ExternalLink,
  Flame,
  User
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';
import Modal from '../Modal';
import Button from '../Button';
import TaskStatusBadge from './TaskStatusBadge';
import TaskPriorityBadge from './TaskPriorityBadge';
import TaskDetailsModal from './TaskDetailsModal';
import { useERP } from '../../context/ERPContext';

const COLORS = {
  Completed: '#10b981',
  'In Progress': '#3b82f6',
  Pending: '#f59e0b',
  Overdue: '#f43f5e'
};

export const EmployeeProductivityModal = ({ isOpen, onClose, employee }) => {
  const { tasks, getEffectiveStatus, calculateCompletionRate, calculateProductivityScore } = useERP();
  const [selectedTask, setSelectedTask] = useState(null);

  if (!employee) return null;

  // Filter tasks for this employee
  const empTasks = tasks.filter(t => t.assignedToId === employee.id || t.assignedTo === employee.fullName);

  const total = empTasks.length;
  const completedTasks = empTasks.filter(t => getEffectiveStatus(t) === 'Completed');
  const inProgressTasks = empTasks.filter(t => getEffectiveStatus(t) === 'In Progress');
  const pendingTasks = empTasks.filter(t => getEffectiveStatus(t) === 'Pending');
  const overdueTasks = empTasks.filter(t => getEffectiveStatus(t) === 'Overdue');

  const completionRate = calculateCompletionRate(empTasks);
  const productivityScore = calculateProductivityScore(empTasks);

  // Status Pie Data
  const statusPieData = [
    { name: 'Completed', value: completedTasks.length, color: COLORS.Completed },
    { name: 'In Progress', value: inProgressTasks.length, color: COLORS['In Progress'] },
    { name: 'Pending', value: pendingTasks.length, color: COLORS.Pending },
    { name: 'Overdue', value: overdueTasks.length, color: COLORS.Overdue }
  ].filter(d => d.value > 0);

  // Project breakdown
  const projectMap = {};
  empTasks.forEach(t => {
    if (!projectMap[t.project]) {
      projectMap[t.project] = { name: t.project, total: 0, completed: 0 };
    }
    projectMap[t.project].total += 1;
    if (getEffectiveStatus(t) === 'Completed') {
      projectMap[t.project].completed += 1;
    }
  });
  const projectList = Object.values(projectMap).map(p => ({
    ...p,
    rate: Math.round((p.completed / p.total) * 100)
  }));

  // Priority distribution
  const priorityData = [
    { priority: 'Critical', count: empTasks.filter(t => t.priority === 'Critical').length },
    { priority: 'High', count: empTasks.filter(t => t.priority === 'High').length },
    { priority: 'Medium', count: empTasks.filter(t => t.priority === 'Medium').length },
    { priority: 'Low', count: empTasks.filter(t => t.priority === 'Low').length }
  ];

  // Weekly productivity trend
  const weeklyTrend = [
    { day: 'Mon', completed: 2 },
    { day: 'Tue', completed: 3 },
    { day: 'Wed', completed: 1 },
    { day: 'Thu', completed: 4 },
    { day: 'Fri', completed: 2 }
  ];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={
          <div className="flex items-center gap-3">
            <img
              src={employee.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={employee.fullName}
              className="w-10 h-10 rounded-2xl object-cover ring-2 ring-indigo-500/30"
            />
            <div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                {employee.fullName}
                <span className="text-xs px-2 py-0.5 rounded-full font-normal bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  {employee.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                {employee.designation} • {employee.department}
              </p>
            </div>
          </div>
        }
        subtitle="Individual Productivity Scorecard & Sprint Delivery Drill-Down"
        maxWidth="max-w-5xl"
        footer={
          <Button variant="secondary" onClick={onClose}>
            Done
          </Button>
        }
      >
        <div className="space-y-6 max-h-[72vh] overflow-y-auto pr-1">
          {/* Top Performance Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 font-semibold uppercase">Total Assigned</span>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{total}</div>
              <span className="text-[10px] text-slate-400">All deliverables</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold uppercase">Completed</span>
              <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{completedTasks.length}</div>
              <span className="text-[10px] text-emerald-600/70">{completionRate}% Completion</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <span className="text-[11px] text-blue-700 dark:text-blue-400 font-semibold uppercase">In Progress</span>
              <div className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{inProgressTasks.length}</div>
              <span className="text-[10px] text-blue-600/70">Active sprint tasks</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold uppercase">Pending</span>
              <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{pendingTasks.length}</div>
              <span className="text-[10px] text-amber-600/70">In backlog queue</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20">
              <span className="text-[11px] text-rose-700 dark:text-rose-400 font-semibold uppercase">Overdue</span>
              <div className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">{overdueTasks.length}</div>
              <span className="text-[10px] text-rose-600/70">Needs attention</span>
            </div>

            {/* Productivity Score Radial Widget */}
            <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col justify-between">
              <span className="text-[11px] text-indigo-700 dark:text-indigo-400 font-semibold uppercase">Productivity</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{productivityScore}</span>
                <span className="text-xs text-indigo-400 font-bold">/100</span>
              </div>
              <span className="text-[10px] text-indigo-500/80 font-medium">Dynamic Score</span>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Status Pie Chart */}
            <div className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col items-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 w-full text-left mb-2">
                Status Distribution
              </h4>
              <div className="w-full h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={65}
                      paddingAngle={3}
                    >
                      {statusPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        backgroundColor: '#1e293b',
                        color: '#fff',
                        fontSize: '11px',
                        border: 'none'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-3 text-[11px] mt-1">
                {statusPieData.map(d => (
                  <div key={d.name} className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    {d.name}: {d.value}
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Productivity Trend */}
            <div className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Weekly Velocity (Completed Tasks)
              </h4>
              <div className="w-full h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyTrend}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        backgroundColor: '#1e293b',
                        color: '#fff',
                        fontSize: '11px',
                        border: 'none'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#10b981' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Priority Distribution */}
            <div className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Priority Distribution
              </h4>
              <div className="w-full h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="priority" tick={{ fontSize: 10 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        backgroundColor: '#1e293b',
                        color: '#fff',
                        fontSize: '11px',
                        border: 'none'
                      }}
                    />
                    <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Project-Wise Progress Breakdown */}
          <div className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Project Delivery Progress
            </h4>
            <div className="space-y-3">
              {projectList.map((prj) => (
                <div key={prj.name} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{prj.name}</span>
                    <span className="font-mono text-slate-500 font-medium">
                      {prj.completed} / {prj.total} completed ({prj.rate}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        prj.rate === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${prj.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Tasks Table */}
          <div className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Assigned Tasks ({empTasks.length})
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase text-slate-400">
                    <th className="py-2.5 px-3">Task ID</th>
                    <th className="py-2.5 px-3">Title</th>
                    <th className="py-2.5 px-3">Project</th>
                    <th className="py-2.5 px-3">Priority</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Due Date</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {empTasks.map(t => {
                    const eff = getEffectiveStatus(t);
                    return (
                      <tr key={t.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-2 px-3 font-mono font-bold text-slate-500">{t.id}</td>
                        <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white max-w-[200px] truncate">
                          {t.title}
                        </td>
                        <td className="py-2 px-3 text-slate-500 truncate max-w-[150px]">{t.project}</td>
                        <td className="py-2 px-3"><TaskPriorityBadge priority={t.priority} size="sm" /></td>
                        <td className="py-2 px-3"><TaskStatusBadge status={eff} size="sm" /></td>
                        <td className="py-2 px-3 font-mono text-slate-500">{t.dueDate}</td>
                        <td className="py-2 px-3 text-right">
                          <button
                            onClick={() => setSelectedTask(t)}
                            className="p-1 rounded text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 font-bold"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal>

      {/* Nested Task Detail Modal */}
      {selectedTask && (
        <TaskDetailsModal
          isOpen={Boolean(selectedTask)}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
        />
      )}
    </>
  );
};

export default EmployeeProductivityModal;
