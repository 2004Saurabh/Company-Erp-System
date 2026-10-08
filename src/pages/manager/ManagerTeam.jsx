import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Mail, Phone, Plus, CheckSquare, Award, Home, ShieldCheck, Contact, Eye } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import Avatar from '../../components/Avatar';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import TaskModal from '../../components/modals/TaskModal';
import EmployeeIDCard from '../../components/EmployeeIDCard';

export const ManagerTeam = () => {
  const { employees, tasks, attendance, getEmployeeIDCard } = useERP();
  const navigate = useNavigate();
  const [selectedEmpForTask, setSelectedEmpForTask] = useState(null);
  const [previewCardMember, setPreviewCardMember] = useState(null);

  const team = employees.filter(e => e.department === 'Engineering');
  const todayStr = '2026-10-01';

  // Team WFH statistics
  const teamWfhMembers = team.filter(member => {
    const record = (attendance || []).find(a => (a.employeeId === member.id || a.employeeName === member.fullName) && a.date === todayStr);
    return Boolean(record && (record.isWFH || record.workMode === 'Work From Home' || record.networkName?.includes('Work From Home')));
  });

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

        {/* Header Actions */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <Button
            variant="outline"
            size="sm"
            icon={Contact}
            onClick={() => navigate('/manager/id-cards')}
          >
            Team ID Cards Directory
          </Button>

          {/* Live Remote Status Pill */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-xs">
            <Home className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="font-medium text-slate-700 dark:text-slate-300">Remote:</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {teamWfhMembers.length}/{team.length} WFH
            </span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {team.map((member) => {
          const memberTasks = tasks.filter(t => t.assignedToId === member.id || t.assignedTo === member.fullName);
          const completedCount = memberTasks.filter(t => t.status === 'Completed').length;
          const memberAttendance = (attendance || []).find(a => (a.employeeId === member.id || a.employeeName === member.fullName) && a.date === todayStr);
          const isMemberWFH = Boolean(memberAttendance && (memberAttendance.isWFH || memberAttendance.workMode === 'Work From Home' || memberAttendance.networkName?.includes('Work From Home')));

          return (
            <div
              key={member.id}
              className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all flex flex-col justify-between hover:shadow-md ${
                isMemberWFH
                  ? 'border-indigo-200 dark:border-indigo-800/80 ring-1 ring-indigo-500/10'
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-start gap-3.5">
                  <Avatar src={member.avatar} name={member.fullName} size="lg" status="online" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                        {member.fullName}
                      </h3>
                      {isMemberWFH && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shrink-0">
                          <Home className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                          WFH
                        </span>
                      )}
                    </div>
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

                {/* ID Card Status */}
                {(() => {
                  const card = getEmployeeIDCard(member.id);
                  return (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                        <Contact className="w-3.5 h-3.5 text-indigo-500" /> Digital ID:
                      </span>
                      {card?.status === 'Approved' ? (
                        <button
                          type="button"
                          onClick={() => setPreviewCardMember({ member, card })}
                          className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                          title="Click to view official badge"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                          {card.badgeNumber}
                        </button>
                      ) : card?.status === 'Pending' ? (
                        <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                          Pending HR Review
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          Not Issued
                        </span>
                      )}
                    </div>
                  );
                })()}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Badge variant={member.status === 'Active' ? 'success' : 'neutral'} size="sm" dot>
                    {member.status}
                  </Badge>
                  {isMemberWFH && (
                    <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                      Remote ({memberAttendance?.checkIn || '09:00 AM'})
                    </span>
                  )}
                </div>
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

      {/* Team Member ID Card Preview Modal */}
      {previewCardMember && (
        <Modal
          isOpen={Boolean(previewCardMember)}
          onClose={() => setPreviewCardMember(null)}
          title="Team Member Corporate Credential"
          subtitle={`Official ID Dossier for ${previewCardMember.member.fullName} (${previewCardMember.member.id})`}
          maxWidth="max-w-md"
        >
          <div className="flex flex-col items-center py-2">
            <EmployeeIDCard
              employee={previewCardMember.member}
              idCardData={previewCardMember.card}
              showActions={true}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};
export default ManagerTeam;
