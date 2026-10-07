import React, { useState, useEffect } from 'react';
import {
  Clock,
  Play,
  Square,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Wifi,
  WifiOff,
  Building2,
  UserCheck,
  LogIn,
  LogOut,
  RotateCcw
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import DataTable from '../../components/DataTable';
import CompanyWifiStatus from '../../components/CompanyWifiStatus';
import WifiRestrictionModal from '../../components/modals/WifiRestrictionModal';
import AttendanceStatusModal from '../../components/modals/AttendanceStatusModal';

export const EmployeeAttendance = () => {
  const {
    attendance,
    checkInEmployee,
    checkOutEmployee,
    resetEmployeeAttendance,
    isCurrentWifiAuthorized,
    wifiEnforcementEnabled,
    currentNetwork
  } = useERP();
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const [isWifiModalOpen, setIsWifiModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const empId = currentUser?.id === 'USR-004' ? 'EMP-1004' : (currentUser?.id || 'EMP-1004');
  const todayStr = '2026-10-01';

  const todayRecord = attendance.find(a => (a.employeeId === empId || a.employeeId === 'EMP-1004') && a.date === todayStr);
  const isCheckedIn = Boolean(todayRecord && todayRecord.checkIn);
  const isCheckedOut = Boolean(todayRecord && todayRecord.checkOut);

  // Live Real-Time Time
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const myHistory = attendance.filter(a => a.employeeId === empId || a.employeeName === 'Elena Rostova');

  const handleOpenStatusModal = () => {
    setIsStatusModalOpen(true);
    if (isCheckedIn) {
      if (todayRecord?.status === 'Late') {
        addToast(`Attendance Status: Marked LATE today (Clocked in at ${todayRecord?.checkIn || '08:58 AM'})`, 'warning');
      } else {
        addToast(`Attendance Status: Marked PRESENT today (Clocked in at ${todayRecord?.checkIn || '08:58 AM'})`, 'success');
      }
    } else {
      addToast('Attendance Alert: You have NOT marked attendance today (ABSENT / Pending)', 'error');
    }
  };

  const handleCheckIn = () => {
    if (wifiEnforcementEnabled && !isCurrentWifiAuthorized()) {
      setIsWifiModalOpen(true);
      return;
    }
    checkInEmployee(empId, currentUser?.name, currentUser?.department);
  };

  const handleCheckOut = () => {
    if (!isCheckedIn) {
      addToast('Please Check In first before checking out.', 'warning');
      return;
    }
    if (isCheckedOut) {
      addToast('Shift already completed for today.', 'info');
      return;
    }
    checkOutEmployee(empId);
  };

  const columns = [
    { header: 'Date', accessor: 'date', sortable: true },
    {
      header: 'Clock In',
      accessor: 'checkIn',
      sortable: true,
      render: (val) => val ? <span className="font-mono text-emerald-600 font-semibold">{val}</span> : '—'
    },
    {
      header: 'Clock Out',
      accessor: 'checkOut',
      sortable: true,
      render: (val) => val ? <span className="font-mono text-indigo-600 font-semibold">{val}</span> : 'In Progress'
    },
    {
      header: 'Logged Hours',
      accessor: 'workHours',
      sortable: true,
      render: (val) => <span className="font-bold">{val} hrs</span>
    },
    {
      header: 'Network Verification',
      accessor: 'networkName',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-1.5 text-xs">
          <Wifi className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
            {val || 'NEXORA-CORP-5G'}
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
            Office Verified
          </span>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (val) => {
        let variant = 'success';
        if (val === 'Late') variant = 'warning';
        if (val === 'On Leave') variant = 'info';
        if (val === 'Absent') variant = 'danger';
        return <Badge variant={variant} size="sm" dot>{val}</Badge>;
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          My Shift Attendance & Work Log
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Record daily shift clock-ins with office WiFi verification and review compliance history
        </p>
      </div>

      {/* Real-time WiFi Verification Card */}
      <CompanyWifiStatus />

      {/* Clock in / out Interactive Terminal */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              Current Shift Terminal
            </span>
            <span className="text-slate-400">•</span>
            <span className={`text-[11px] font-semibold flex items-center gap-1 ${isCurrentWifiAuthorized() ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isCurrentWifiAuthorized() ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" /> Office WiFi Verified ({currentNetwork?.ssid})
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" /> WiFi Geofence Blocked ({currentNetwork?.ssid})
                </>
              )}
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono mt-1">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <p className="text-xs text-slate-300 mt-1">
            {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center md:justify-end gap-3">
          <div className="p-3 px-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center min-w-[140px]">
            <span className="text-[11px] text-slate-300 block">Today's Duration</span>
            <span className="text-2xl font-bold font-mono text-emerald-400 mt-0.5 block">
              {todayRecord?.workHours || (isCheckedIn ? 4.2 : 0)} hrs
            </span>
            <span className="text-[10px] text-slate-300">
              {isCheckedOut ? 'Shift Done' : isCheckedIn ? 'Timer Active' : 'Not Started'}
            </span>
          </div>

          {/* DEDICATED CHECK IN BUTTON */}
          <Button
            variant={!isCheckedIn ? (isCurrentWifiAuthorized() ? 'success' : 'secondary') : 'outline'}
            size="lg"
            icon={!isCheckedIn && !isCurrentWifiAuthorized() ? WifiOff : LogIn}
            onClick={handleCheckIn}
            disabled={isCheckedIn}
            className={`shadow-lg min-w-[160px] ${
              !isCheckedIn
                ? isCurrentWifiAuthorized()
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-emerald-600/30 ring-2 ring-emerald-400/30'
                  : 'bg-rose-600/90 hover:bg-rose-600 text-white border-rose-500'
                : 'text-emerald-300 border-emerald-500/40 opacity-90 cursor-default bg-emerald-950/40'
            }`}
          >
            {isCheckedIn
              ? `Checked In (${todayRecord?.checkIn || '08:58 AM'})`
              : isCurrentWifiAuthorized()
              ? 'Check In'
              : 'WiFi Locked · Check In'}
          </Button>

          {/* DEDICATED CHECK OUT BUTTON */}
          <Button
            variant={isCheckedIn && !isCheckedOut ? 'danger' : 'secondary'}
            size="lg"
            icon={LogOut}
            onClick={handleCheckOut}
            disabled={!isCheckedIn || isCheckedOut}
            className={`shadow-lg min-w-[160px] ${
              isCheckedIn && !isCheckedOut
                ? 'bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-rose-600/30'
                : 'opacity-50 cursor-not-allowed bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {isCheckedOut ? 'Checked Out (Done)' : 'Check Out'}
          </Button>

          {/* Reset Attendance Demo Helper */}
          <button
            type="button"
            onClick={() => {
              resetEmployeeAttendance(empId);
              addToast("Attendance reset for demo testing. You can Check In now!", "info");
            }}
            title="Reset today's attendance for demo testing (allows testing Check In again)"
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors border border-white/10 flex items-center justify-center"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Check Attendance Status Button */}
          <Button
            variant="outline"
            size="lg"
            icon={UserCheck}
            onClick={handleOpenStatusModal}
            className="border-indigo-400 text-indigo-100 hover:bg-white/10 font-bold shadow-lg min-w-[170px]"
          >
            Check Attendance Status
          </Button>
        </div>
      </div>

      {/* Past Attendance Records Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Personal Attendance Logs
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            All records stamped with Company WiFi verification
          </span>
        </div>
        <DataTable
          columns={columns}
          data={myHistory}
          searchKey="date"
          searchPlaceholder="Search by date (YYYY-MM-DD)..."
          pageSize={6}
        />
      </div>

      {/* Modals */}
      <WifiRestrictionModal
        isOpen={isWifiModalOpen}
        onClose={() => setIsWifiModalOpen(false)}
        onConnectedAndCheckIn={() => checkInEmployee(empId, currentUser?.name, currentUser?.department)}
      />

      {/* Attendance Status Inspector Modal */}
      <AttendanceStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        todayRecord={todayRecord}
        empId={empId}
        employeeName={currentUser?.name || 'Elena Rostova'}
        department={currentUser?.department || 'Engineering'}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        isCheckedIn={isCheckedIn}
        isCheckedOut={isCheckedOut}
        liveHours={todayRecord?.workHours || (isCheckedIn ? 4.2 : 0)}
      />
    </div>
  );
};

export default EmployeeAttendance;
