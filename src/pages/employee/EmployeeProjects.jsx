import React from 'react';
import { FolderKanban, Calendar, User, Clock, CheckCircle2 } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/Badge';

export const EmployeeProjects = () => {
  const { projects, tasks } = useERP();
  const { currentUser } = useAuth();

  const empId = currentUser?.id === 'USR-004' ? 'EMP-1004' : (currentUser?.id || 'EMP-1004');
  const myProjects = projects.filter(p => p.teamMembers?.includes(empId) || p.department === 'Engineering');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          My Active Projects & Workstreams
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Initiatives in which you are an assigned engineering contributor
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {myProjects.map((prj) => {
          const myProjectTasks = tasks.filter(t => (t.projectId === prj.id || t.project === prj.name) && (t.assignedToId === empId || t.assignedTo === 'Elena Rostova'));

          return (
            <div
              key={prj.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    <FolderKanban className="w-5 h-5" />
                  </div>
                  <Badge variant={prj.status === 'Completed' ? 'success' : 'info'} size="sm" dot>
                    {prj.status}
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3">
                  {prj.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {prj.description}
                </p>

                {/* Progress */}
                <div className="mt-4">
                  <div className="flex justify-between items-center text-xs font-semibold mb-1">
                    <span className="text-slate-500">Initiative Progress</span>
                    <span className="text-indigo-600 dark:text-indigo-400">{prj.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${prj.progress}%` }}
                    />
                  </div>
                </div>

                {/* Connected Tasks by Elena */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Your Assigned Deliverables ({myProjectTasks.length})
                  </span>
                  {myProjectTasks.map(t => (
                    <div key={t.id} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs flex items-center justify-between">
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{t.title}</span>
                      <span className="text-[10px] text-indigo-500 font-semibold">{t.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Lead: <strong className="text-slate-700 dark:text-slate-300">{prj.manager}</strong></span>
                <span>Deadline: <strong className="text-slate-700 dark:text-slate-300">{prj.deadline}</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default EmployeeProjects;
