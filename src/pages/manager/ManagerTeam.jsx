import React, { useState } from 'react';
import { Users, Mail, Phone, Plus, CheckSquare, Award } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import Avatar from '../../components/Avatar';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import TaskModal from '../../components/modals/TaskModal';

export const ManagerTeam = () => {
  const { employees, tasks } = useERP();
  const [selectedEmpForTask, setSelectedEmpForTask] = useState(null);

  const team = employees.filter(e => e.department === 'Engineering');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Engineering Team Roster
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Direct reports, technical specializations, workload balances, and active task queues
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {team.map((member) => {
          const memberTasks = tasks.filter(t => t.assignedToId === member.id || t.assignedTo === member.fullName);
          const completedCount = memberTasks.filter(t => t.status === 'Completed').length;

          return (
            <div
              key={member.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-start gap-3.5">
                  <Avatar src={member.avatar} name={member.fullName} size="lg" status="online" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                      {member.fullName}
                    </h3>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium truncate">
                      {member.designation}
                    </p>
                    <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                      {member.id}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{member.phone}</span>
                  </div>
                </div>

                {/* Workload metric */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Tasks</span>
                    <span className="text-base font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                      {memberTasks.length - completedCount}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Completed</span>
                    <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      {completedCount}
                    </span>
                  </div>
                </div>

                {member.skills && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {(Array.isArray(member.skills) ? member.skills : [member.skills]).slice(0, 3).map((s, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Badge variant={member.status === 'Active' ? 'success' : 'neutral'} size="sm" dot>
                  {member.status}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  icon={Plus}
                  onClick={() => setSelectedEmpForTask(member)}
                >
                  Assign Task
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <TaskModal
        isOpen={Boolean(selectedEmpForTask)}
        onClose={() => setSelectedEmpForTask(null)}
        defaultAssignedTo={selectedEmpForTask}
      />
    </div>
  );
};
export default ManagerTeam;
