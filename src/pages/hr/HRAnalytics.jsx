import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie
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
  Search,
  Filter,
  ArrowRight,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import EmployeeProductivityModal from '../../components/tasks/EmployeeProductivityModal';

export const HRAnalytics = () => {
  const { tasks, departments, employees, getEffectiveStatus, calculateCompletionRate, calculateProductivityScore } = useERP();

  const [drilldownEmployee, setDrilldownEmployee] = useState(null);
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Company Task Overview (Section 10)
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => getEffectiveStatus(t) === 'Completed');
  const inProgressTasks = tasks.filter(t => getEffectiveStatus(t) === 'In Progress');
  const pendingTasks = tasks.filter(t => getEffectiveStatus(t) === 'Pending');
  const overdueTasks = tasks.filter(t => getEffectiveStatus(t) === 'Overdue');
  const overallCompletionRate = calculateCompletionRate(tasks);

  // 2. Department-Wise Productivity BarChart & Table (Section 10)
  const departmentStats = useMemo(() => {
    return departments.map(d => {
      const deptTasks = tasks.filter(t => t.department === d.name);
      const total = deptTasks.length;
      const done = deptTasks.filter(t => getEffectiveStatus(t) === 'Completed').length;
      const pending = deptTasks.filter(t => getEffectiveStatus(t) === 'Pending').length;
      const overdue = deptTasks.filter(t => getEffectiveStatus(t) === 'Overdue').length;
      const rate = total > 0 ? Math.round((done / total) * 100) : 0;

      return {
        id: d.id,
        name: d.name,
        total,
        completed: done,
        pending,
        overdue,
        rate
      };
    });
  }, [departments, tasks, getEffectiveStatus]);

  // 3. Employee Productivity List (Section 10)
  const employeeProductivityList = useMemo(() => {
    return employees
      .filter(emp => emp.role !== 'owner') // Focus on staff and managers
      .map(emp => {
        const empTasks = tasks.filter(t => t.assignedToId === emp.id || t.assignedTo === emp.fullName);
        const total = empTasks.length;
        const done = empTasks.filter(t => getEffectiveStatus(t) === 'Completed').length;
        const overdue = empTasks.filter(t => getEffectiveStatus(t) === 'Overdue').length;
        const rate = total > 0 ? Math.round((done / total) * 100) : 0;
        const score = calculateProductivityScore(empTasks);

        return {
          ...emp,
          totalTasks: total,
          completedTasks: done,
          overdueTasks: overdue,
          rate,
          score
        };
      })
      .filter(emp => {
        if (filterDepartment !== 'All' && emp.department !== filterDepartment) return false;
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchName = emp.fullName.toLowerCase().includes(q);
          const matchDept = emp.department.toLowerCase().includes(q);
          if (!matchName && !matchDept) return false;
        }
        return true;
      })
      .sort((a, b) => b.rate - a.rate);
  }, [employees, tasks, filterDepartment, searchTerm, getEffectiveStatus, calculateProductivityScore]);

  const DEPT_COLORS = ['#6366f1', '#10b981', '#a855f7', '#f59e0b', '#0ea5e9', '#f43f5e'];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Workforce Intelligence
            </span>
            <span className="text-xs text-slate-400">Human Resources</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Workforce Productivity Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Cross-department delivery velocity, departmental benchmarks, and individual employee scorecards
          </p>
        </div>

        <NavLink
          to="/hr/tasks"
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 transition-all"
        >
          View All Tasks
          <ArrowRight className="w-3.5 h-3.5" />
        </NavLink>
      </div>

      {/* Company Task Overview (Section 10) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Tasks</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{totalTasks}</div>
          <span className="text-[10px] text-slate-500">Across 6 Departments</span>
        </div>

        <div className="p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Completed</span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{completedTasks.length}</div>
          <span className="text-[10px] text-emerald-600/80">{overallCompletionRate}% company rate</span>
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
          <span className="text-[10px] text-rose-600/80">Overdue SLA breaches</span>
        </div>

        <div className="p-4 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">Company Rate</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{overallCompletionRate}%</div>
          <span className="text-[10px] text-indigo-600/80 font-medium">{completedTasks.length} / {totalTasks} closed</span>
        </div>
      </div>

      {/* Department-Wise Productivity Chart & Department Status Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department-Wise Productivity BarChart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Department-Wise Productivity Rate (%)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Task completion rate comparison across business units
            </p>
          </div>

          <div className="w-full h-72 my-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentStats}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={45} />
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
                  {departmentStats.map((entry, index) => (
                    <Cell key={`dept-cell-${index}`} fill={DEPT_COLORS[index % DEPT_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Engineering & Finance lead the company</span>
            <span className="font-semibold text-emerald-600">Company Benchmark: 70%</span>
          </div>
        </div>

        {/* Department Task Status Table (Section 10) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Department Task Status Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Detailed task volume and completion breakdown by unit
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase text-slate-400">
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3 text-center">Total</th>
                  <th className="py-2.5 px-3 text-center text-emerald-600">Completed</th>
                  <th className="py-2.5 px-3 text-center text-amber-600">Pending</th>
                  <th className="py-2.5 px-3 text-center text-rose-600">Overdue</th>
                  <th className="py-2.5 px-3 text-right">Completion %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {departmentStats.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-extrabold text-slate-900 dark:text-white">
                      {d.name}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-700 dark:text-slate-300">
                      {d.total}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-emerald-600">
                      {d.completed}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-amber-600">
                      {d.pending}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-rose-600">
                      {d.overdue}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-indigo-600 dark:text-indigo-400">
                      {d.rate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Employee Productivity Section (Section 10) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Workforce Employee Productivity Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any employee to open productivity deep-dive scorecard
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search employee..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase text-slate-400">
              <tr>
                <th className="py-3 px-3">Employee</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3 text-center">Assigned</th>
                <th className="py-3 px-3 text-center text-emerald-600">Completed</th>
                <th className="py-3 px-3 text-center text-rose-600">Overdue</th>
                <th className="py-3 px-3">Completion Rate</th>
                <th className="py-3 px-3 text-center">Score</th>
                <th className="py-3 px-3 text-right">Drill-Down</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {employeeProductivityList.map(emp => (
                <tr
                  key={emp.id}
                  onClick={() => setDrilldownEmployee(emp)}
                  className="hover:bg-indigo-50/40 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
                >
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={emp.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt={emp.fullName}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                      <div>
                        <div className="font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                          {emp.fullName}
                        </div>
                        <span className="text-[10px] text-slate-400">{emp.designation}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-2.5 px-3 font-medium text-slate-600 dark:text-slate-300">
                    {emp.department}
                  </td>

                  <td className="py-2.5 px-3 text-center font-bold text-slate-700 dark:text-slate-200">
                    {emp.totalTasks}
                  </td>

                  <td className="py-2.5 px-3 text-center font-bold text-emerald-600">
                    {emp.completedTasks}
                  </td>

                  <td className="py-2.5 px-3 text-center font-bold text-rose-600">
                    {emp.overdueTasks}
                  </td>

                  <td className="py-2.5 px-3">
                    <div className="w-28">
                      <div className="flex justify-between text-[10px] font-bold mb-1">
                        <span>{emp.rate}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            emp.rate >= 80 ? 'bg-emerald-500' : emp.rate >= 50 ? 'bg-indigo-600' : 'bg-amber-500'
                          }`}
                          style={{ width: `${emp.rate}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded-full font-bold text-[11px] bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                      {emp.score}/100
                    </span>
                  </td>

                  <td className="py-2.5 px-3 text-right">
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all inline" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drill-down Modal */}
      {drilldownEmployee && (
        <EmployeeProductivityModal
          isOpen={Boolean(drilldownEmployee)}
          onClose={() => setDrilldownEmployee(null)}
          employee={drilldownEmployee}
        />
      )}
    </div>
  );
};

export default HRAnalytics;
