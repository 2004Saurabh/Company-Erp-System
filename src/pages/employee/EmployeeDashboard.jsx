import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  CheckCircle2,
  Clock,
  CalendarDays,
  Award,
  Calendar,
  Briefcase,
  Play,
  Square,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Megaphone,
  Plus,
  WifiOff,
  Wifi,
  UserCheck,
  RotateCcw,
  LogIn,
  LogOut
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import LeaveRequestModal from '../../components/modals/LeaveRequestModal';
import PayslipViewModal from '../../components/modals/PayslipViewModal';
import WifiRestrictionModal from '../../components/modals/WifiRestrictionModal';
import AttendanceStatusModal from '../../components/modals/AttendanceStatusModal';
import CompanyWifiStatus from '../../components/CompanyWifiStatus';

export const EmployeeDashboard = () => {
  const {
    tasks,
    projects,
    attendance,
    checkInEmployee,
    checkOutEmployee,
    resetEmployeeAttendance,
    leaves,
    leaveBalances,
    announcements,
    payroll,
    isCurrentWifiAuthorized,
    wifiEnforcementEnabled,
    currentNetwork,
    getEffectiveStatus
  } = useERP();
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [isWifiModalOpen, setIsWifiModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  // Current employee identity (Elena Rostova EMP-1004)
  const empId = currentUser?.id === 'USR-004' ? 'EMP-1004' : (currentUser?.id || 'EMP-1004');
  const myTasks = tasks.filter(t => t.assignedToId === empId || t.assignedTo === 'Elena Rostova');
  const completedTasks = myTasks.filter(t => getEffectiveStatus(t) === 'Completed').length;
  const inProgressTasks = myTasks.filter(t => getEffectiveStatus(t) === 'In Progress').length;
  const pendingTasks = myTasks.filter(t => getEffectiveStatus(t) === 'Pending').length;
  const overdueTasks = myTasks.filter(t => getEffectiveStatus(t) === 'Overdue').length;

  const todayStr = '2026-10-01';
  const todayRecord = attendance.find(a => (a.employeeId === empId || a.employeeId === 'EMP-1004') && a.date === todayStr);

  const isCheckedIn = Boolean(todayRecord && todayRecord.checkIn);
  const isCheckedOut = Boolean(todayRecord && todayRecord.checkOut);

  // Live timer for current working duration
  const [liveHours, setLiveHours] = useState(todayRecord?.workHours || 4.2);

  useEffect(() => {
    if (isCheckedIn && !isCheckedOut) {
      const interval = setInterval(() => {
        setLiveHours(prev => Number((prev + 0.01).toFixed(2)));
      }, 36000); // simulated minute update
      return () => clearInterval(interval);
    }
  }, [isCheckedIn, isCheckedOut]);

  const myProjects = projects.filter(p => p.teamMembers?.includes(empId) || p.teamMembers?.includes('EMP-1004'));
  const myLeaves = leaves.filter(l => l.employeeId === empId || l.employeeName === 'Elena Rostova');
  const myPayslips = payroll.filter(p => p.employeeId === empId || p.employeeName === 'Elena Rostova');

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

  const handleCheckInToggle = () => {
    if (!isCheckedIn) {
      handleCheckIn();
    } else if (!isCheckedOut) {
      handleCheckOut();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-[11px] font-bold tracking-wider uppercase text-indigo-300">
              Employee Self-Service Portal
            </span>
            <span className="text-xs text-slate-400">Personal Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1.5">
            Good day, {currentUser?.name || 'Elena Rostova'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Senior Frontend Engineer · Engineering Team · Austin HQ / Remote
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Live WiFi Geofence Indicator */}
          <CompanyWifiStatus compact />

          {/* DEDICATED CHECK IN BUTTON */}
          <Button
            variant={!isCheckedIn ? (isCurrentWifiAuthorized() ? 'success' : 'secondary') : 'outline'}
            size="sm"
            icon={!isCheckedIn && !isCurrentWifiAuthorized() ? WifiOff : LogIn}
            onClick={handleCheckIn}
            disabled={isCheckedIn}
            className={
              !isCheckedIn
                ? isCurrentWifiAuthorized()
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400/30'
                  : 'border-rose-400/60 text-rose-300'
                : 'text-emerald-400 border-emerald-500/40 opacity-90 cursor-default bg-emerald-950/20'
            }
          >
            {isCheckedIn
              ? `Checked In (${todayRecord?.checkIn || 'Logged'})`
              : isCurrentWifiAuthorized()
              ? 'Check In'
              : 'WiFi Locked · Check In'}
          </Button>

          {/* DEDICATED CHECK OUT BUTTON */}
          <Button
            variant={isCheckedIn && !isCheckedOut ? 'danger' : 'secondary'}
            size="sm"
            icon={LogOut}
            onClick={handleCheckOut}
            disabled={!isCheckedIn || isCheckedOut}
            className={
              isCheckedIn && !isCheckedOut
                ? 'bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-600/30'
                : 'opacity-50 cursor-not-allowed'
            }
          >
            {isCheckedOut ? 'Checked Out (Done)' : 'Check Out'}
          </Button>

          {/* Reset Attendance Demo Helper */}
          <button
            type="button"
            onClick={() => resetEmployeeAttendance(empId)}
            title="Reset today's attendance (Allows testing Check In button again)"
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Check Attendance Status Button */}
          <Button
            variant="outline"
            size="sm"
            icon={UserCheck}
            onClick={handleOpenStatusModal}
            className="border-indigo-400/50 text-indigo-200 hover:bg-indigo-900/40 font-bold shadow-sm"
          >
            Check Attendance Status
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={CalendarDays}
            onClick={() => setIsLeaveModalOpen(true)}
          >
            Apply Leave
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={CheckSquare}
            onClick={() => navigate('/employee/tasks')}
          >
            My Tasks
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={CreditCard}
            onClick={() => {
              if (myPayslips.length > 0) setSelectedPayslip(myPayslips[0]);
              else navigate('/employee/payslips');
            }}
          >
            View Payslip
          </Button>
        </div>
      </div>

      {/* KPI Cards (Section 13 requirement: 7 KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Tasks"
          value={myTasks.length}
          comparisonText="In active sprint"
          icon={CheckSquare}
          linkTo="/employee/tasks"
        />
        <StatCard
          title="Completed Tasks"
          value={completedTasks}
          change={20.0}
          isPositive={true}
          comparisonText="Tasks verified"
          icon={CheckCircle2}
          iconColor="text-emerald-500"
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
          linkTo="/employee/tasks"
        />
        <StatCard
          title="Today's Shift Hours"
          value={liveHours}
          suffix=" hrs"
          comparisonText={isCheckedOut ? 'Shift finished' : isCheckedIn ? 'Currently active' : 'Not clocked in'}
          icon={Clock}
          iconColor="text-indigo-500"
          iconBg="bg-indigo-50 dark:bg-indigo-950/60"
          linkTo="/employee/attendance"
        />
        <StatCard
          title="PTO Balance Remaining"
          value="14"
          suffix=" Days"
          comparisonText="Paid Time Off"
          icon={CalendarDays}
          iconColor="text-amber-500"
          iconBg="bg-amber-50 dark:bg-amber-950/60"
          linkTo="/employee/leave"
        />
        <StatCard
          title="Performance Rating"
          value="94.2"
          suffix=" / 100"
          change={3.2}
          isPositive={true}
          comparisonText="Q3 Scorecard: Exemplary"
          icon={Award}
          iconColor="text-purple-500"
          iconBg="bg-purple-50 dark:bg-purple-950/60"
          linkTo="/employee/performance"
        />
        <StatCard
          title="Active Projects"
          value={myProjects.length || 2}
          comparisonText="Key deliverables"
          icon={Briefcase}
          iconColor="text-sky-500"
          iconBg="bg-sky-50 dark:bg-sky-950/60"
          linkTo="/employee/projects"
        />
        <StatCard
          title="Upcoming Deadlines"
          value="2"
          comparisonText="Due by Oct 12"
          icon={Calendar}
          iconColor="text-rose-500"
          iconBg="bg-rose-50 dark:bg-rose-950/60"
          linkTo="/employee/tasks"
        />
      </div>

      {/* Grid: Shift Attendance Clock Card + Today's Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Summary & Clock In Widget */}
        <div className="lg:col-span-1 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Daily Attendance Summary</h3>
              </div>
              <Badge variant={isCheckedOut ? 'neutral' : isCheckedIn ? 'success' : 'warning'} size="sm" dot>
                {isCheckedOut ? 'Clocked Out' : isCheckedIn ? 'Active On Duty' : 'Not Clocked In'}
              </Badge>
            </div>

            <div className="text-center py-6">
              <span className="text-xs uppercase font-bold text-slate-400 block tracking-wider">Session Duration</span>
              <div className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
                {liveHours} <span className="text-base font-normal text-slate-500">hours</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Clock In: {todayRecord?.checkIn || 'Pending'} · Clock Out: {todayRecord?.checkOut || 'In progress'}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={!isCheckedIn ? (isCurrentWifiAuthorized() ? 'success' : 'secondary') : 'outline'}
                size="md"
                icon={!isCheckedIn && !isCurrentWifiAuthorized() ? WifiOff : LogIn}
                onClick={handleCheckIn}
                disabled={isCheckedIn}
                className="justify-center"
              >
                {isCheckedIn ? 'Checked In' : 'Check In'}
              </Button>

              <Button
                variant={isCheckedIn && !isCheckedOut ? 'danger' : 'secondary'}
                size="md"
                icon={LogOut}
                onClick={handleCheckOut}
                disabled={!isCheckedIn || isCheckedOut}
                className="justify-center"
              >
                {isCheckedOut ? 'Done' : 'Check Out'}
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              icon={UserCheck}
              onClick={handleOpenStatusModal}
              className="w-full justify-center font-bold text-xs border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
            >
              Check Attendance Status
            </Button>
          </div>
        </div>

        {/* Today's Tasks Section */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Today's Sprint Tasks</h3>
              <p className="text-xs text-slate-500">Deliverables assigned to your engineering queue</p>
            </div>
            <Button variant="ghost" size="sm" icon={ArrowRight} onClick={() => navigate('/employee/tasks')}>
              All Tasks
            </Button>
          </div>

          <div className="space-y-2.5">
            {myTasks.slice(0, 4).map(tsk => (
              <div
                key={tsk.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 hover:border-slate-200 transition-colors"
              >
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{tsk.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{tsk.project} · Due {tsk.dueDate}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant={tsk.priority === 'High' ? 'danger' : 'warning'} size="sm">{tsk.priority}</Badge>
                  <Badge variant={tsk.status === 'Completed' ? 'success' : 'info'} size="sm">{tsk.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Recent Announcements & Leave Balances */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Noticeboard */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Company Announcements</h3>
            <Button variant="ghost" size="sm" icon={ArrowRight} onClick={() => navigate('/employee/announcements')}>
              Noticeboard
            </Button>
          </div>

          <div className="space-y-3">
            {announcements.slice(0, 2).map(anc => (
              <div key={anc.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <Badge variant={anc.priority === 'Urgent' ? 'danger' : 'info'} size="sm">{anc.priority}</Badge>
                  <span className="text-[10px] text-slate-400 font-mono">{anc.date}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">{anc.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{anc.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leave Balance Overview */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Time Off & Leave Balance</h3>
              <Button variant="ghost" size="sm" icon={Plus} onClick={() => setIsLeaveModalOpen(true)}>
                Apply Leave
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/40">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Casual Leave</span>
                <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono">9 Days</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">3 used of 12</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Sick Leave</span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">8 Days</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">2 used of 10</span>
              </div>
              <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/40">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Earned Leave</span>
                <span className="text-xl font-black text-purple-600 dark:text-purple-400 font-mono">11 Days</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">4 used of 15</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Emergency</span>
                <span className="text-xl font-black text-amber-600 dark:text-amber-400 font-mono">5 Days</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">0 used of 5</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Next Public Holiday:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">Thanksgiving (Nov 26)</span>
          </div>
        </div>
      </div>

      <LeaveRequestModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
      />

      <PayslipViewModal
        isOpen={Boolean(selectedPayslip)}
        onClose={() => setSelectedPayslip(null)}
        payslip={selectedPayslip}
      />

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
        liveHours={liveHours}
      />
    </div>
  );
};
export default EmployeeDashboard;
