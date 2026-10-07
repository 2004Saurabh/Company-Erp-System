import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';
import {
  Building2,
  Users,
  Award,
  CheckCircle2,
  Clock,
  PlayCircle,
  AlertCircle,
  TrendingUp,
  FolderKanban,
  UserCheck,
  ChevronRight,
  Layers,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Search,
  RotateCcw
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import TaskStatusBadge from '../../components/tasks/TaskStatusBadge';
import TaskPriorityBadge from '../../components/tasks/TaskPriorityBadge';
import TaskDetailsModal from '../../components/tasks/TaskDetailsModal';
import EmployeeProductivityModal from '../../components/tasks/EmployeeProductivityModal';

const DEPT_COLORS = ['#6366f1', '#10b981', '#a855f7', '#f59e0b', '#0ea5e9', '#f43f5e'];

export const OwnerAnalytics = () => {
  const { tasks, departments, employees, projects, getEffectiveStatus, calculateCompletionRate, calculateProductivityScore } = useERP();

  // Selected drill-down hierarchy states:
  // Company -> Department -> Manager -> Employee -> Project -> Task
  const [drillDept, setDrillDept] = useState(null);
  const [drillManager, setDrillManager] = useState(null);
  const [drillEmployee, setDrillEmployee] = useState(null);
  const [drillProject, setDrillProject] = useState(null);

  // Modals
  const [inspectedTask, setInspectedTask] = useState(null);
  const [inspectedEmployee, setInspectedEmployee] = useState(null);

  // Overall Company Task Overview (Section 11)
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => getEffectiveStatus(t) === 'Completed');
  const inProgressTasks = tasks.filter(t => getEffectiveStatus(t) === 'In Progress');
  const pendingTasks = tasks.filter(t => getEffectiveStatus(t) === 'Pending');
  const overdueTasks = tasks.filter(t => getEffectiveStatus(t) === 'Overdue');
  const overallCompletionRate = calculateCompletionRate(tasks);

  // Company Productivity Across Departments Chart Data
  const companyDeptChartData = useMemo(() => {
    return departments.map(d => {
      const dTasks = tasks.filter(t => t.department === d.name);
      const done = dTasks.filter(t => getEffectiveStatus(t) === 'Completed').length;
      const rate = dTasks.length > 0 ? Math.round((done / dTasks.length) * 100) : 0;
      return {
        name: d.name,
        tasks: dTasks.length,
        completed: done,
        rate
      };
    });
  }, [departments, tasks, getEffectiveStatus]);

  // Hierarchical Filtered Tasks
  const currentHierarchyTasks = useMemo(() => {
    return tasks.filter(t => {
      if (drillDept && t.department !== drillDept) return false;
      if (drillManager && t.assignedManager !== drillManager) return false;
      if (drillEmployee && t.assignedTo !== drillEmployee) return false;
      if (drillProject && t.project !== drillProject) return false;
      return true;
    });
  }, [tasks, drillDept, drillManager, drillEmployee, drillProject]);

  // Available Managers in current hierarchy
  const availableManagers = useMemo(() => {
    const list = employees.filter(e => {
      if (drillDept && e.department !== drillDept) return false;
      return e.role === 'manager' || e.designation?.includes('Director') || e.designation?.includes('CEO') || e.designation?.includes('VP');
    });
    return list;
  }, [employees, drillDept]);

  // Available Employees in current hierarchy
  const availableEmployees = useMemo(() => {
    return employees.filter(e => {
      if (drillDept && e.department !== drillDept) return false;
      if (drillManager && e.manager !== drillManager) return false;
      return true;
    });
  }, [employees, drillDept, drillManager]);

  // Available Projects in current hierarchy
  const availableProjects = useMemo(() => {
    return projects.filter(p => {
      if (drillDept && p.department !== drillDept) return false;
      if (drillManager && p.manager !== drillManager) return false;
      return true;
    });
  }, [projects, drillDept, drillManager]);

  const resetHierarchy = () => {
    setDrillDept(null);
    setDrillManager(null);
    setDrillEmployee(null);
    setDrillProject(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              Executive Strategic Intelligence
            </span>
            <span className="text-xs text-slate-400">Chief Executive Office</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Company Task & Productivity Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Macro organizational velocity with full hierarchical drill-down to individual employee tasks
          </p>
        </div>

        <NavLink
          to="/owner/tasks"
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all"
        >
          View All Company Tasks
          <ArrowRight className="w-3.5 h-3.5" />
        </NavLink>
      </div>

      {/* Company Task Overview (Section 11) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Company Tasks</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{totalTasks}</div>
          <span className="text-[10px] text-slate-500">Corporate Enterprise</span>
        </div>

        <div className="p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Completed</span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{completedTasks.length}</div>
          <span className="text-[10px] text-emerald-600/80">{overallCompletionRate}% company rate</span>
        </div>

        <div className="p-4 rounded-3xl bg-blue-500/10 border border-blue-500/20 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">In Progress</span>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{inProgressTasks.length}</div>
          <span className="text-[10px] text-blue-600/80">Active deliverables</span>
        </div>

        <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">Pending</span>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{pendingTasks.length}</div>
          <span className="text-[10px] text-amber-600/80">Backlog queue</span>
        </div>

        <div className="p-4 rounded-3xl bg-rose-500/10 border border-rose-500/20 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">Overdue</span>
          <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">{overdueTasks.length}</div>
          <span className="text-[10px] text-rose-600/80">SLA breached</span>
        </div>

        <div className="p-4 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">Overall Rate</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{overallCompletionRate}%</div>
          <span className="text-[10px] text-indigo-600/80 font-medium">{completedTasks.length} / {totalTasks} closed</span>
        </div>
      </div>

      {/* Company Productivity Chart Across Departments */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Company Productivity by Department
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comparative completion percentage across organizational business units
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">Benchmark Target: 75%</span>
        </div>

        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={companyDeptChartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(val) => [`${val}% Completion`, 'Productivity Rate']}
                contentStyle={{
                  borderRadius: '16px',
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="rate" radius={[8, 8, 0, 0]}>
                {companyDeptChartData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={DEPT_COLORS[index % DEPT_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 11: OWNER DRILL-DOWN HIERARCHY */}
      {/* Company -> Department -> Manager -> Employee -> Project -> Task */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-500/20 shadow-md space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-1">
              <Layers className="w-3.5 h-3.5" />
              Hierarchical Organizational Drill-Down
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Executive Drill-Down Explorer
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Navigate from company-wide metrics down to departments, managers, employees, projects, and specific tasks
            </p>
          </div>

          {(drillDept || drillManager || drillEmployee || drillProject) && (
            <button
              onClick={resetHierarchy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset to Company Top-Level
            </button>
          )}
        </div>

        {/* Interactive Breadcrumb Bar */}
        <div className="flex flex-wrap items-center gap-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-bold">
          <button
            onClick={() => { setDrillDept(null); setDrillManager(null); setDrillEmployee(null); setDrillProject(null); }}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              !drillDept ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            🏢 Company
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />

          {drillDept ? (
            <button
              onClick={() => { setDrillManager(null); setDrillEmployee(null); setDrillProject(null); }}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                !drillManager ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              🏛️ {drillDept}
            </button>
          ) : (
            <span className="text-slate-400 font-normal">Select Department</span>
          )}

          {drillDept && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              {drillManager ? (
                <button
                  onClick={() => { setDrillEmployee(null); setDrillProject(null); }}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    !drillEmployee ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  👔 {drillManager}
                </button>
              ) : (
                <span className="text-slate-400 font-normal">Select Manager</span>
              )}
            </>
          )}

          {drillManager && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              {drillEmployee ? (
                <button
                  onClick={() => { setDrillProject(null); }}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    !drillProject ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  👤 {drillEmployee}
                </button>
              ) : (
                <span className="text-slate-400 font-normal">Select Employee</span>
              )}
            </>
          )}

          {drillEmployee && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              {drillProject ? (
                <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white">
                  📁 {drillProject}
                </span>
              ) : (
                <span className="text-slate-400 font-normal">All Assigned Projects</span>
              )}
            </>
          )}
        </div>

        {/* Step-by-Step Level Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Level 1: Departments */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              1. Department
            </span>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {departments.map(d => (
                <button
                  key={d.id}
                  onClick={() => {
                    setDrillDept(d.name);
                    setDrillManager(null);
                    setDrillEmployee(null);
                    setDrillProject(null);
                  }}
                  className={`w-full text-left p-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                    drillDept === d.name
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="truncate">{d.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Level 2: Managers */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              2. Manager
            </span>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {availableManagers.length > 0 ? (
                availableManagers.map(m => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setDrillManager(m.fullName);
                      setDrillEmployee(null);
                      setDrillProject(null);
                    }}
                    className={`w-full text-left p-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                      drillManager === m.fullName
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span className="truncate">{m.fullName}</span>
                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                  </button>
                ))
              ) : (
                <div className="text-xs text-slate-400 italic p-2">Select a department first</div>
              )}
            </div>
          </div>

          {/* Level 3: Employees */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              3. Employee
            </span>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {availableEmployees.length > 0 ? (
                availableEmployees.map(e => (
                  <button
                    key={e.id}
                    onClick={() => {
                      setDrillEmployee(e.fullName);
                      setDrillProject(null);
                    }}
                    className={`w-full text-left p-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                      drillEmployee === e.fullName
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span className="truncate">{e.fullName}</span>
                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                  </button>
                ))
              ) : (
                <div className="text-xs text-slate-400 italic p-2">Select department or manager</div>
              )}
            </div>
          </div>

          {/* Level 4: Project */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              4. Project
            </span>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {availableProjects.length > 0 ? (
                availableProjects.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setDrillProject(p.name)}
                    className={`w-full text-left p-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                      drillProject === p.name
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span className="truncate">{p.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                  </button>
                ))
              ) : (
                <div className="text-xs text-slate-400 italic p-2">No projects filtered</div>
              )}
            </div>
          </div>
        </div>

        {/* Level 5: Target Tasks in Current Hierarchy */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Filtered Scope Deliverables ({currentHierarchyTasks.length} Tasks)
            </h4>
            {drillEmployee && (
              <button
                onClick={() => {
                  const emp = employees.find(e => e.fullName === drillEmployee);
                  if (emp) setInspectedEmployee(emp);
                }}
                className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
              >
                Inspect {drillEmployee}'s Full Productivity Scorecard
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase text-slate-400">
                <tr>
                  <th className="py-2.5 px-3">Task ID</th>
                  <th className="py-2.5 px-3">Title</th>
                  <th className="py-2.5 px-3">Assignee</th>
                  <th className="py-2.5 px-3">Manager</th>
                  <th className="py-2.5 px-3">Project</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {currentHierarchyTasks.map(t => {
                  const eff = getEffectiveStatus(t);
                  return (
                    <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-500">{t.id}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white max-w-[200px] truncate">
                        {t.title}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{t.assignedTo}</td>
                      <td className="py-2.5 px-3 text-slate-500">{t.assignedManager}</td>
                      <td className="py-2.5 px-3 text-slate-500 truncate max-w-[140px]">{t.project}</td>
                      <td className="py-2.5 px-3"><TaskPriorityBadge priority={t.priority} size="sm" /></td>
                      <td className="py-2.5 px-3"><TaskStatusBadge status={eff} size="sm" /></td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => setInspectedTask(t)}
                          className="px-2.5 py-1 text-xs font-bold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-xl"
                        >
                          View
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

      {/* Drill-down Modals */}
      {inspectedTask && (
        <TaskDetailsModal
          isOpen={Boolean(inspectedTask)}
          onClose={() => setInspectedTask(null)}
          task={inspectedTask}
        />
      )}

      {inspectedEmployee && (
        <EmployeeProductivityModal
          isOpen={Boolean(inspectedEmployee)}
          onClose={() => setInspectedEmployee(null)}
          employee={inspectedEmployee}
        />
      )}
    </div>
  );
};

export default OwnerAnalytics;
