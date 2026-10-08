import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Wifi,
  Calendar,
  Building2,
  MapPin,
  Play,
  Square,
  ShieldCheck,
  X,
  UserCheck,
  Timer
} from 'lucide-react';
import Button from '../Button';
import Badge from '../Badge';

export const AttendanceStatusModal = ({
  isOpen,
  onClose,
  todayRecord,
  empId,
  employeeName,
  department,
  onCheckIn,
  onCheckOut,
  isCheckedIn,
  isCheckedOut,
  liveHours = 0
}) => {
  if (!isOpen) return null;

  // Determine attendance status
  let status = 'Absent';
  let statusColor = 'rose';
  let statusBadge = 'ABSENT / NOT MARKED';
  let statusTitle = 'Attendance Not Marked Yet';
  let statusDesc = 'You have not marked attendance for today yet. Please clock in to record your presence.';

  const isWFH = Boolean(todayRecord?.isWFH || todayRecord?.workMode === 'Work From Home');

  if (isCheckedIn || isWFH) {
    if (isWFH) {
      status = 'Present';
      statusColor = 'indigo';
      statusBadge = 'PRESENT (WORK FROM HOME · HR VERIFIED)';
      statusTitle = 'Work From Home Attendance Verified';
      statusDesc = 'Your remote shift has been officially authorized and logged by HR using your Employee ID. Office WiFi geofence restriction bypassed.';
    } else if (todayRecord?.status === 'Late') {
      status = 'Late';
      statusColor = 'amber';
      statusBadge = 'LATE PRESENT';
      statusTitle = 'Attendance Recorded (Marked Late)';
      statusDesc = 'Your attendance is logged, but was marked after the daily shift cutoff time (09:30 AM).';
    } else {
      status = 'Present';
      statusColor = 'emerald';
      statusBadge = 'PRESENT (VERIFIED)';
      statusTitle = 'Attendance Successfully Recorded';
      statusDesc = 'Your presence for today has been logged and verified through company office network.';
    }
  }

  const checkInTime = todayRecord?.checkIn || (isCheckedIn ? '08:58 AM' : null);
  const checkOutTime = todayRecord?.checkOut;
  const networkName = todayRecord?.networkName || 'NEXORA-CORP-5G';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Attendance Status Inspector
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Live Shift Verification · {employeeName || 'Elena Rostova'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Status Hero Card */}
            <div
              className={`p-5 rounded-2xl border text-center transition-all ${
                status === 'Present'
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-100'
                  : status === 'Late'
                  ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/80 text-amber-900 dark:text-amber-100'
                  : 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800/80 text-rose-900 dark:text-rose-100'
              }`}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3 shadow-sm bg-white dark:bg-slate-900">
                {status === 'Present' && <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />}
                {status === 'Late' && <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400" />}
                {status === 'Absent' && <AlertCircle className="w-8 h-8 text-rose-600 dark:text-rose-400" />}
              </div>

              <div className="flex items-center justify-center gap-2 mb-1">
                <span
                  className={`text-[11px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                    status === 'Present'
                      ? 'bg-emerald-200 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200'
                      : status === 'Late'
                      ? 'bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200'
                      : 'bg-rose-200 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200'
                  }`}
                >
                  {statusBadge}
                </span>
              </div>

              <h2 className="text-xl font-extrabold tracking-tight mt-1">
                {statusTitle}
              </h2>
              <p className="text-xs opacity-80 mt-1 max-w-sm mx-auto">
                {statusDesc}
              </p>

              {/* Instant Action inside Hero for Absent employees */}
              {!isCheckedIn && onCheckIn && (
                <div className="mt-4 pt-3 border-t border-rose-200 dark:border-rose-900/50">
                  <Button
                    variant="primary"
                    icon={Play}
                    onClick={() => {
                      onCheckIn();
                      onClose();
                    }}
                    className="w-full justify-center bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
                  >
                    👉 Clock In Now (Mark Attendance)
                  </Button>
                </div>
              )}
            </div>

            {/* Attendance Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-left">
              {/* Check In Time */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  Clock In Time
                </div>
                <div className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                  {checkInTime || 'Not Clocked In'}
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {checkInTime ? 'Marked today' : 'Pending clock-in'}
                </span>
              </div>

              {/* Clock Out Time */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
                  <Timer className="w-3.5 h-3.5 text-indigo-500" />
                  Clock Out Time
                </div>
                <div className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                  {checkOutTime || (isCheckedIn ? 'On Duty (Active)' : '—')}
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {isCheckedOut ? 'Shift completed' : isCheckedIn ? 'Currently on shift' : 'Shift not started'}
                </span>
              </div>

              {/* Working Hours */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
                  <Timer className="w-3.5 h-3.5 text-indigo-500" />
                  Working Duration
                </div>
                <div className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                  {isCheckedIn ? `${liveHours || todayRecord?.workHours || 4.2} hrs` : '0.0 hrs'}
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Today's logged hours
                </span>
              </div>

              {/* WiFi or Remote Verification */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
                  {isWFH ? <UserCheck className="w-3.5 h-3.5 text-indigo-500" /> : <Wifi className="w-3.5 h-3.5 text-emerald-500" />}
                  {isWFH ? 'Work Mode & Auth' : 'Office WiFi Status'}
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white font-mono truncate">
                  {isWFH ? (todayRecord?.networkName || 'Work From Home (HR)') : networkName}
                </div>
                <span className={`inline-flex items-center gap-1 text-[10px] mt-0.5 font-semibold ${
                  isWFH ? 'text-indigo-600 dark:text-indigo-400' : 'text-emerald-600 dark:text-emerald-400'
                }`}>
                  <ShieldCheck className="w-3 h-3" />
                  {isWFH ? 'HR Remote ID Authorized' : 'Office Geofence Verified'}
                </span>
              </div>
            </div>

            {/* Employee Profile Footer Note */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/70 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  {employeeName ? employeeName.charAt(0) : 'E'}
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    {employeeName || 'Elena Rostova'} ({empId || 'EMP-1004'})
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {department || 'Engineering'} · Today: Oct 01, 2026
                  </span>
                </div>
              </div>
              <Badge variant={status === 'Present' ? 'success' : status === 'Late' ? 'warning' : 'danger'}>
                {status}
              </Badge>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {isCheckedIn ? '✅ Live attendance recorded in ERP database' : '⚠️ Pending daily clock-in'}
            </span>

            <div className="flex items-center gap-2">
              {isCheckedIn && !isCheckedOut && onCheckOut && (
                <Button
                  variant="outline"
                  size="sm"
                  icon={Square}
                  onClick={() => {
                    onCheckOut();
                    onClose();
                  }}
                  className="text-rose-600 border-rose-300 dark:border-rose-800"
                >
                  Clock Out (Shift Over)
                </Button>
              )}
              <Button variant="primary" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AttendanceStatusModal;
