import React from 'react';
import { ShieldCheck, Mail, Phone, Users, Briefcase, Award } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import Avatar from '../../components/Avatar';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';

export const OwnerManagers = () => {
  const { employees, departments, projects, tasks } = useERP();
  const navigate = useNavigate();

  // Filter manager-level leaders
  const managers = employees.filter(e =>
    e.role === 'owner' ||
    e.role === 'manager' ||
    e.role === 'hr' ||
    e.designation.toLowerCase().includes('director') ||
    e.designation.toLowerCase().includes('vp') ||
    e.designation.toLowerCase().includes('lead')
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Leadership & Department Heads
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Executive directory of division directors, engineering managers, and people leads
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {managers.map((mgr) => {
          const managedDept = departments.find(d => d.head === mgr.fullName || d.name === mgr.department);
          const managedProjects = projects.filter(p => p.manager === mgr.fullName);
          const assignedTasks = tasks.filter(t => t.creator === mgr.fullName);

          return (
            <div
              key={mgr.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-start gap-3.5">
                  <Avatar src={mgr.avatar} name={mgr.fullName} size="lg" status="online" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                      {mgr.fullName}
                    </h3>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium truncate">
                      {mgr.designation}
                    </p>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {mgr.department}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{mgr.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{mgr.phone}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Projects Led</span>
                    <span className="text-base font-bold text-slate-900 dark:text-white">{managedProjects.length}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Sprint Tasks</span>
                    <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">{assignedTasks.length}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Badge variant={mgr.status === 'Active' ? 'success' : 'neutral'} size="sm" dot>
                  {mgr.status}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/owner/projects')}
                >
                  View Initiatives
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default OwnerManagers;
