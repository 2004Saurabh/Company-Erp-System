import React, { useState, useEffect } from 'react';
import {
  Home,
  UserCheck,
  Clock,
  Calendar,
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';
import Modal from '../Modal';
import Button from '../Button';
import Input from '../Input';
import Select from '../Select';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';

export const MarkWFHAttendanceModal = ({
  isOpen,
  onClose,
  initialEmployeeId = null
}) => {
  const {
    employees,
    markWFHAttendance,
    getEmployeeWFHAuthInfo,
    isEmployeeWFHAuthorized,
    authorizeEmployeeWFH
  } = useERP();
  const { role } = useAuth();

  const [selectedEmpId, setSelectedEmpId] = useState(initialEmployeeId || 'EMP-1004');
  const [date, setDate] = useState('2026-10-01');
  const [checkIn, setCheckIn] = useState('09:00 AM');
  const [checkOut, setCheckOut] = useState('05:30 PM');
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [status, setStatus] = useState('Present');
  const [workHours, setWorkHours] = useState(8.5);
  const [notes, setNotes] = useState('Approved Work From Home (Remote Shift)');

  useEffect(() => {
    if (initialEmployeeId) {
      setSelectedEmpId(initialEmployeeId);
    }
  }, [initialEmployeeId, isOpen]);

  if (!isOpen) return null;

  const currentEmployee = employees.find(e => e.id === selectedEmpId) || employees[0];
  const authInfo = currentEmployee ? getEmployeeWFHAuthInfo(currentEmployee.id) : null;
  const isAuthorized = Boolean(authInfo);

  const handleEmployeeChange = (empId) => {
    setSelectedEmpId(empId);
  };

  const handleQuickAuthorizeAsAdmin = () => {
    if (currentEmployee) {
      authorizeEmployeeWFH({
        employeeId: currentEmployee.id,
        reason: 'Direct Administrator Approval',
        notes: 'Pre-authorized for HR remote attendance entry'
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentEmployee) return;

    const res = markWFHAttendance({
      employeeId: currentEmployee.id,
      date,
      checkIn,
      checkOut: isShiftActive ? null : checkOut,
      status,
      workHours: isShiftActive ? 4.0 : workHours,
      notes
    });

    if (res?.success) {
      onClose();
    }
  };

  const employeeOptions = employees.map(e => {
    const auth = isEmployeeWFHAuthorized(e.id);
    return {
      value: e.id,
      label: `${e.id} — ${e.fullName} (${e.department}) ${auth ? '✅ [Admin Authorized]' : '⚠️ [Pending Admin Auth]'}`
    };
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Home className="w-4 h-4" />
          </div>
          <span>Mark Work From Home (WFH) Attendance</span>
        </div>
      }
      subtitle="HR Remote Attendance Override · Restricted to Admin-Authorized Employee ID Cards"
      maxWidth="max-w-xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            icon={UserCheck}
            disabled={!isAuthorized}
            className={!isAuthorized ? 'opacity-50 cursor-not-allowed bg-slate-600' : ''}
          >
            Confirm & Mark Attendance
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Notice Info Callout */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed">
            <span className="font-bold">WiFi Geofence Exemption:</span> Marking attendance via HR authorizes Work From Home (WFH) and removes the office WiFi lock for this employee. Their shift status will update to <strong className="underline">PRESENT</strong> immediately.
          </div>
        </div>

        {/* Employee Selection by ID */}
        <div className="space-y-2">
          <Select
            label="Select Employee (By ID or Name) *"
            value={selectedEmpId}
            onChange={(e) => handleEmployeeChange(e.target.value)}
            options={employeeOptions}
          />

          {/* Quick Preview Card */}
          {currentEmployee && (
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={currentEmployee.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={currentEmployee.fullName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {currentEmployee.fullName}
                    <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold">
                      {currentEmployee.id}
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {currentEmployee.designation} · {currentEmployee.department}
                  </p>
                </div>
              </div>
              <span className={`text-[11px] font-semibold px-2 py-1 rounded-lg border ${
                isAuthorized
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border-rose-200 dark:border-rose-800'
              }`}>
                {isAuthorized ? 'Admin WFH Authorized' : 'Pending Admin Auth'}
              </span>
            </div>
          )}

          {/* Admin Verification Status Banner */}
          {currentEmployee && (
            isAuthorized ? (
              <div className="p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold">Admin ID Verified:</span> Pre-authorized by {authInfo?.authorizedBy || 'Admin'}
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-300 block">
                      Purpose: {authInfo?.reason || 'Approved Remote Assignment'} · Valid: {authInfo?.validUntil || '2026-10-31'}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-bold border border-emerald-200 dark:border-emerald-700">
                  {authInfo?.id}
                </span>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                <div className="flex items-start gap-2 text-rose-900 dark:text-rose-200">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Admin WFH Authorization Required</span>
                    <span>Employee ID <strong>"{currentEmployee?.id}"</strong> is not authorized for Work From Home by Administrator. HR cannot record attendance until Admin registers this ID.</span>
                  </div>
                </div>
                {role === 'admin' && (
                  <Button
                    type="button"
                    variant="primary"
                    size="xs"
                    onClick={handleQuickAuthorizeAsAdmin}
                    className="shrink-0 bg-indigo-600 font-bold"
                  >
                    Authorize Now (Admin)
                  </Button>
                )}
              </div>
            )
          )}
        </div>

        {/* Date and Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Attendance Date *"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <Select
            label="Attendance Status *"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: 'Present', label: 'Present (On-Time WFH Shift)' },
              { value: 'Late', label: 'Late (Late Remote Shift)' }
            ]}
          />
        </div>

        {/* Timings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Check-In Time *"
            type="text"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            placeholder="e.g. 09:00 AM"
          />

          <div>
            <Input
              label="Check-Out Time"
              type="text"
              value={isShiftActive ? 'In Progress' : checkOut}
              disabled={isShiftActive}
              onChange={(e) => setCheckOut(e.target.value)}
              placeholder="e.g. 05:30 PM"
            />
            <label className="flex items-center gap-2 mt-1.5 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={isShiftActive}
                onChange={(e) => setIsShiftActive(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Shift currently active (Check out at end of day)</span>
            </label>
          </div>
        </div>

        {/* Work Hours and Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Input
              label="Logged Hours"
              type="number"
              step="0.5"
              min="1"
              max="24"
              value={workHours}
              disabled={isShiftActive}
              onChange={(e) => setWorkHours(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <Input
              label="Authorization Reason / Note"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Approved Remote Work / Client Assignment"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default MarkWFHAttendanceModal;
