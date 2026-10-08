import React, { useState } from 'react';
import {
  Home,
  Clock,
  UserCheck,
  Building2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Users,
  Plus
} from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import Badge from './Badge';
import Button from './Button';
import { MarkWFHAttendanceModal } from './modals/MarkWFHAttendanceModal';

export const WFHPersonnelWidget = ({
  title = "Work From Home (WFH) Today",
  subtitle = "Personnel authorized by HR to work remotely with geofence exemption",
  departmentFilter = null,
  showMarkButton = true,
  className = ""
}) => {
  const { attendance, employees } = useERP();
  const { role } = useAuth();
  const navigate = useNavigate();

  const [isWFHModalOpen, setIsWFHModalOpen] = useState(false);

  // Reference date used throughout system
  const todayStr = '2026-10-01';

  // Find all attendance records marked as WFH for today
  const todayWFHRecords = (attendance || []).filter(a => {
    const isToday = a.date === todayStr;
    const isWFH = a.isWFH || a.workMode === 'Work From Home' || a.networkName?.includes('Work From Home');
    if (!isToday || !isWFH) return false;

    if (departmentFilter && departmentFilter !== 'All') {
      return a.department === departmentFilter;
    }
    return true;
  });

  // Enrich with employee details from employee directory if needed
  const enrichedWFHList = todayWFHRecords.map(record => {
    const emp = employees.find(e => e.id === record.employeeId || e.fullName === record.employeeName);
    return {
      ...record,
      avatar: emp?.avatar || record.avatar,
      designation: emp?.designation || record.designation || 'Software Engineer',
      email: emp?.email || record.email,
      department: record.department || emp?.department || 'Engineering'
    };
  });

  const canMarkWFH = ['admin', 'owner', 'hr'].includes(role);

  return (
    <div className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between ${className}`}>
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Home className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {title}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {enrichedWFHList.length} Active
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {canMarkWFH && showMarkButton && (
              <Button
                variant="outline"
                size="sm"
                icon={Plus}
                onClick={() => setIsWFHModalOpen(true)}
                className="border-indigo-300 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-xs font-semibold"
              >
                Mark WFH
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              icon={ArrowRight}
              onClick={() => navigate(`/${role}/attendance`)}
              className="text-xs text-slate-600 dark:text-slate-300 hover:text-indigo-600"
            >
              Full Roster
            </Button>
          </div>
        </div>

        {/* Personnel List */}
        <div className="mt-4 space-y-3">
          {enrichedWFHList.length === 0 ? (
            <div className="p-6 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
              <Home className="w-8 h-8 mx-auto text-slate-400 dark:text-slate-500 mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No Employees on Remote Shift Today
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                All team members are scheduled on-premise or awaiting authorization.
              </p>
              {canMarkWFH && showMarkButton && (
                <button
                  onClick={() => setIsWFHModalOpen(true)}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Authorize Remote Attendance Now
                </button>
              )}
            </div>
          ) : (
            enrichedWFHList.map((item) => (
              <div
                key={item.id || item.employeeId}
                className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-indigo-200 dark:hover:border-indigo-800/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    src={item.avatar}
                    name={item.employeeName}
                    size="md"
                    className="ring-2 ring-indigo-500/20"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.employeeName}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                        {item.employeeId}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <span>{item.department}</span>
                      <span>•</span>
                      <span>{item.designation}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <div className="text-right mr-1">
                    <div className="flex items-center gap-1 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      <Clock className="w-3 h-3" />
                      <span>{item.checkIn || '09:00 AM'}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                      {item.checkOut ? `Out: ${item.checkOut}` : 'Shift Active'}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>WFH Verified</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer Banner */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Office WiFi geofence restriction bypassed for verified remote personnel</span>
        </span>
        <button
          onClick={() => navigate(`/${role}/attendance`)}
          className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          View Attendance Logs
        </button>
      </div>

      {/* WFH Modal */}
      <MarkWFHAttendanceModal
        isOpen={isWFHModalOpen}
        onClose={() => setIsWFHModalOpen(false)}
      />
    </div>
  );
};

export default WFHPersonnelWidget;
