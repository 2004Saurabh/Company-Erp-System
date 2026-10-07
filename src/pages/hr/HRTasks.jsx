import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Eye,
  BarChart3,
  Building2,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import TaskStatusBadge from '../../components/tasks/TaskStatusBadge';
import TaskPriorityBadge from '../../components/tasks/TaskPriorityBadge';
import TaskDetailsModal from '../../components/tasks/TaskDetailsModal';
import CreateTaskModal from '../../components/tasks/CreateTaskModal';
import TaskFilters from '../../components/tasks/TaskFilters';
import Button from '../../components/Button';

export const HRTasks = () => {
  const { tasks, employees, departments, updateTaskStatus, getEffectiveStatus, calculateCompletionRate } = useERP();
  const { currentUser } = useAuth();

  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    status: 'All',
    priority: 'All',
    department: 'All',
    manager: 'All',
    employee: 'All',
    project: 'All'
  });

  // HR has complete company workforce visibility
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const eff = getEffectiveStatus(t);
      if (filters.status !== 'All' && eff !== filters.status) return false;
      if (filters.priority !== 'All' && t.priority !== filters.priority) return false;
      if (filters.department !== 'All' && t.department !== filters.department) return false;
      if (filters.manager !== 'All' && t.assignedManager !== filters.manager) return false;
      if (filters.employee !== 'All' && t.assignedTo !== filters.employee) return false;
      if (filters.project !== 'All' && t.project !== filters.project) return false;
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const matchesTitle = t.title?.toLowerCase().includes(q);
        const matchesDesc = t.description?.toLowerCase().includes(q);
        const matchesAssignee = t.assignedTo?.toLowerCase().includes(q);
        const matchesDept = t.department?.toLowerCase().includes(q);
        const matchesId = t.id?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesAssignee && !matchesDept && !matchesId) return false;
      }
      return true;
    });
  }, [tasks, filters, getEffectiveStatus]);

  // Overall Workforce Metrics
  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => getEffectiveStatus(t) === 'Completed').length;
  const inProgressCount = tasks.filter(t => getEffectiveStatus(t) === 'In Progress').length;
  const pendingCount = tasks.filter(t => getEffectiveStatus(t) === 'Pending').length;
  const overdueCount = tasks.filter(t => getEffectiveStatus(t) === 'Overdue').length;
  const workforceCompletionRate = calculateCompletionRate(tasks);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Human Resources Command
            </span>
            <span className="text-xs text-slate-400">Sophia Montgomery</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Workforce Task Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Cross-department workforce task allocation, SLA compliance, and deliverable status
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <NavLink
            to="/hr/analytics"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
            Task Analytics
          </NavLink>

          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Assign Deliverable
          </Button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Company Tasks</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{totalCount} Tasks</div>
          <span className="text-[10px] text-slate-500">All departments</span>
        </div>

        <div className="p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Completed</span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{completedCount} Tasks</div>
          <span className="text-[10px] text-emerald-600/80">{workforceCompletionRate}% overall</span>
        </div>

        <div className="p-4 rounded-3xl bg-blue-500/10 border border-blue-500/20 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">In Progress</span>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{inProgressCount} Tasks</div>
          <span className="text-[10px] text-blue-600/80">Active workflows</span>
        </div>

        <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">Pending</span>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{pendingCount} Tasks</div>
          <span className="text-[10px] text-amber-600/80">Backlog queue</span>
        </div>

        <div className="p-4 rounded-3xl bg-rose-500/10 border border-rose-500/20 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">Overdue</span>
          <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">{overdueCount} Tasks</div>
          <span className="text-[10px] text-rose-600/80">Overdue SLA</span>
        </div>

        <div className="p-4 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">Completion Rate</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{workforceCompletionRate}%</div>
          <span className="text-[10px] text-indigo-600/80 font-medium">{completedCount} / {totalCount} completed</span>
        </div>
      </div>

      {/* Multi-Parameter Filters */}
      <TaskFilters
        filters={filters}
        setFilters={setFilters}
        showDepartment={true}
        showManager={true}
        showEmployee={true}
        showProject={true}
      />

      {/* Workforce Task Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-4">Task</th>
                <th className="py-3.5 px-4">Assignee & Dept</th>
                <th className="py-3.5 px-4">Manager</th>
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((t) => {
                  const effectiveStatus = getEffectiveStatus(t);

                  return (
                    <tr
                      key={t.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="py-3 px-4 max-w-[240px]">
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

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{t.assignedTo}</div>
                        <span className="text-[10px] text-slate-400">{t.department}</span>
                      </td>

                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {t.assignedManager}
                      </td>

                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium max-w-[140px] truncate">
                        {t.project}
                      </td>

                      <td className="py-3 px-4">
                        <TaskPriorityBadge priority={t.priority} size="sm" />
                      </td>

                      <td className="py-3 px-4">
                        <TaskStatusBadge status={effectiveStatus} size="sm" />
                      </td>

                      <td className="py-3 px-4 font-mono">
                        <span className={effectiveStatus === 'Overdue' ? 'text-rose-600 font-bold underline' : 'text-slate-600 dark:text-slate-300'}>
                          {t.dueDate}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <select
                            value={t.status}
                            onChange={(e) => updateTaskStatus(t.id, e.target.value)}
                            className="text-[11px] py-1 px-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>

                          <button
                            onClick={() => setSelectedTask(t)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                            title="View Full Task Details"
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
                  <td colSpan={8} className="py-12 text-center text-xs text-slate-400">
                    No workforce tasks found matching filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {selectedTask && (
        <TaskDetailsModal
          isOpen={Boolean(selectedTask)}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
        />
      )}

      {isCreateModalOpen && (
        <CreateTaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </div>
  );
};

export default HRTasks;
