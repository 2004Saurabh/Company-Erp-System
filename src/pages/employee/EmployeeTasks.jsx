import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  PlayCircle,
  AlertCircle,
  Eye,
  BarChart3,
  Search,
  Filter,
  Check,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import TaskStatusBadge from '../../components/tasks/TaskStatusBadge';
import TaskPriorityBadge from '../../components/tasks/TaskPriorityBadge';
import TaskDetailsModal from '../../components/tasks/TaskDetailsModal';
import Button from '../../components/Button';

export const EmployeeTasks = () => {
  const { tasks, updateTaskStatus, getEffectiveStatus, calculateCompletionRate } = useERP();
  const { currentUser } = useAuth();

  const [selectedTask, setSelectedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Strict role isolation: employee only sees their own assigned tasks
  const empId = currentUser?.id === 'USR-004' ? 'EMP-1004' : (currentUser?.id || 'EMP-1004');
  const empName = currentUser?.name || 'Elena Rostova';

  const myTasks = useMemo(() => {
    return tasks.filter(t => t.assignedToId === empId || t.assignedTo === empName);
  }, [tasks, empId, empName]);

  // Derived metrics for summary cards
  const totalCount = myTasks.length;
  const completedCount = myTasks.filter(t => getEffectiveStatus(t) === 'Completed').length;
  const inProgressCount = myTasks.filter(t => getEffectiveStatus(t) === 'In Progress').length;
  const pendingCount = myTasks.filter(t => getEffectiveStatus(t) === 'Pending').length;
  const overdueCount = myTasks.filter(t => getEffectiveStatus(t) === 'Overdue').length;
  const completionRate = calculateCompletionRate(myTasks);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return myTasks.filter(t => {
      const effStatus = getEffectiveStatus(t);
      if (statusFilter !== 'All' && effStatus !== statusFilter) return false;
      if (priorityFilter !== 'All' && t.priority !== priorityFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesTitle = t.title?.toLowerCase().includes(q);
        const matchesDesc = t.description?.toLowerCase().includes(q);
        const matchesProject = t.project?.toLowerCase().includes(q);
        const matchesId = t.id?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesProject && !matchesId) return false;
      }
      return true;
    });
  }, [myTasks, statusFilter, priorityFilter, searchTerm, getEffectiveStatus]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              Employee Workspace
            </span>
            <span className="text-xs text-slate-400 font-mono">{empId}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            My Assigned Tasks
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track deliverables, update sprint statuses, and log actual progress hours
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <NavLink
            to="/employee/analytics"
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all"
          >
            <BarChart3 className="w-4 h-4" />
            Productivity Analytics
            <ArrowRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>
      </div>

      {/* Summary Stat Cards (Section 4) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Assigned</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{totalCount} Tasks</div>
          <span className="text-[10px] text-slate-500">All deliverables</span>
        </div>

        <div className="p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Completed</span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{completedCount} Tasks</div>
          <span className="text-[10px] text-emerald-600/80">Delivered successfully</span>
        </div>

        <div className="p-4 rounded-3xl bg-blue-500/10 border border-blue-500/20 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">In Progress</span>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{inProgressCount} Tasks</div>
          <span className="text-[10px] text-blue-600/80">Active in sprint</span>
        </div>

        <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">Pending</span>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{pendingCount} Tasks</div>
          <span className="text-[10px] text-amber-600/80">Queued in backlog</span>
        </div>

        <div className="p-4 rounded-3xl bg-rose-500/10 border border-rose-500/20 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">Overdue</span>
          <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">{overdueCount} Tasks</div>
          <span className="text-[10px] text-rose-600/80">Missed deadline</span>
        </div>

        <div className="p-4 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">Completion Rate</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{completionRate}%</div>
          <span className="text-[10px] text-indigo-600/80 font-medium">{completedCount} / {totalCount} completed</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search my tasks by title, project or Task ID..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Task Table (Section 6 & 7) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-4">Task</th>
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Progress / Hours</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((t) => {
                  const effectiveStatus = getEffectiveStatus(t);
                  const isDone = effectiveStatus === 'Completed';
                  const progressPct = t.estimatedHours > 0
                    ? Math.min(100, Math.round(((t.actualHours || 0) / t.estimatedHours) * 100))
                    : 0;

                  return (
                    <tr
                      key={t.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Task Info */}
                      <td className="py-3 px-4 max-w-[280px]">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                            {t.id}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white truncate block">
                            {t.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5 pl-1">
                          {t.description}
                        </p>
                      </td>

                      {/* Project */}
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                        {t.project}
                      </td>

                      {/* Priority */}
                      <td className="py-3 px-4">
                        <TaskPriorityBadge priority={t.priority} size="sm" />
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <TaskStatusBadge status={effectiveStatus} size="sm" />
                      </td>

                      {/* Due Date */}
                      <td className="py-3 px-4 font-mono">
                        <span className={effectiveStatus === 'Overdue' ? 'text-rose-600 font-bold underline' : 'text-slate-600 dark:text-slate-300'}>
                          {t.dueDate}
                        </span>
                      </td>

                      {/* Progress / Hours */}
                      <td className="py-3 px-4">
                        <div className="w-32">
                          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                            <span>{t.actualHours || 0}h / {t.estimatedHours || 16}h</span>
                            <span className="font-bold">{progressPct}%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isDone ? 'bg-emerald-500' : progressPct > 100 ? 'bg-rose-500' : 'bg-indigo-600'
                              }`}
                              style={{ width: `${Math.min(100, progressPct)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Mark Completed Button */}
                          {!isDone && (
                            <button
                              onClick={() => updateTaskStatus(t.id, 'Completed')}
                              title="Mark as Completed"
                              className="px-2.5 py-1 text-[11px] font-bold rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white transition-all flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              Done
                            </button>
                          )}

                          {/* Quick Status Dropdown */}
                          <select
                            value={t.status}
                            onChange={(e) => updateTaskStatus(t.id, e.target.value)}
                            className="text-[11px] py-1 px-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>

                          {/* View Details Modal Trigger */}
                          <button
                            onClick={() => setSelectedTask(t)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                            title="View Full Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-slate-400">
                    No tasks found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Details Modal */}
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

export default EmployeeTasks;
