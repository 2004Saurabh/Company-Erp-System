import React, { useState } from 'react';
import {
  Clock,
  UserCheck,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Home,
  Plus,
  ShieldCheck,
  Laptop
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import StatCard from '../../components/StatCard';
import Button from '../../components/Button';
import MarkWFHAttendanceModal from '../../components/modals/MarkWFHAttendanceModal';

export const OwnerAttendance = () => {
  const { attendance, employees } = useERP();
  const [filterStatus, setFilterStatus] = useState('All');
  const [isWFHModalOpen, setIsWFHModalOpen] = useState(false);
  const [targetEmployeeId, setTargetEmployeeId] = useState(null);

  const todayStr = '2026-10-01';
  const todayRecords = attendance.filter(a => a.date === todayStr);

  const presentCount = todayRecords.filter(a => a.status === 'Present').length;
  const lateCount = todayRecords.filter(a => a.status === 'Late').length;
  const onLeaveCount = todayRecords.filter(a => a.status === 'On Leave').length;
  const wfhCount = todayRecords.filter(a => a.isWFH || a.workMode === 'Work From Home').length;
  const attendanceRate = Math.round(((presentCount + lateCount) / (employees.length || 1)) * 100);

  const filteredAttendance = attendance.filter(a => {
    if (filterStatus === 'All') return true;
    if (filterStatus === 'WFH') return a.isWFH || a.workMode === 'Work From Home';
    return a.status === filterStatus;
  });

  const handleOpenWFHModal = (empId = null) => {
    setTargetEmployeeId(empId);
    setIsWFHModalOpen(true);
  };

  const columns = [
    {
      header: 'Employee',
      accessor: 'employeeName',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">{val}</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            {row.department} · {row.employeeId}
          </span>
        </div>
      )
    },
    {
      header: 'Date',
      accessor: 'date',
      sortable: true
    },
    {
      header: 'Clock In',
      accessor: 'checkIn',
      sortable: true,
      render: (val) => val ? <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{val}</span> : <span className="text-slate-400">—</span>
    },
    {
      header: 'Clock Out',
      accessor: 'checkOut',
      sortable: true,
      render: (val) => val ? <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{val}</span> : <span className="text-slate-400">In Progress</span>
    },
    {
      header: 'Working Hours',
      accessor: 'workHours',
      sortable: true,
      render: (val) => val ? <span className="font-semibold">{val} hrs</span> : <span className="text-slate-400">—</span>
    },
    {
      header: 'Work Mode & Network',
      accessor: 'networkName',
      sortable: true,
      render: (val, row) => {
        if (row.isWFH || row.workMode === 'Work From Home') {
          return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              <Home className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>WFH (HR Verified)</span>
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 font-mono text-xs text-slate-700 dark:text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {val || 'NEXORA-CORP-5G'}
          </span>
        );
      }
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (val, row) => {
        let variant = 'neutral';
        if (val === 'Present') variant = 'success';
        if (val === 'Late') variant = 'warning';
        if (val === 'On Leave') variant = 'info';
        if (val === 'Absent') variant = 'danger';
        return (
          <div className="flex items-center gap-1.5">
            <Badge variant={variant} size="sm" dot>{val}</Badge>
            {row.isWFH && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                WFH
              </span>
            )}
          </div>
        );
      }
    },
    {
      header: 'Actions',
      accessor: 'id',
      sortable: false,
      render: (val, row) => (
        <div className="flex items-center justify-end">
          <button
            onClick={() => handleOpenWFHModal(row.employeeId)}
            className="px-2.5 py-1 text-xs font-bold rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/50 hover:bg-indigo-600 hover:text-white text-indigo-700 dark:text-indigo-300 transition-colors flex items-center gap-1"
            title="Mark or update Work From Home attendance"
          >
            <Home className="w-3 h-3" />
            Mark WFH
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Company Attendance Governance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Daily attendance rosters, shift check-in timings, office WiFi verification, and HR remote WFH overrides
          </p>
        </div>

        {/* HR Action: Mark Work From Home Attendance */}
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            icon={Home}
            onClick={() => handleOpenWFHModal(null)}
            className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
          >
            Mark WFH Attendance (HR)
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Attendance Rate"
          value={attendanceRate}
          suffix="%"
          change={2.3}
          isPositive={true}
          comparisonText="Today's presence"
          icon={UserCheck}
        />
        <StatCard
          title="Present Today"
          value={presentCount}
          comparisonText="Clocked in on time"
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
        />
        <StatCard
          title="Work From Home (WFH)"
          value={wfhCount}
          comparisonText="HR Authorized Remote"
          icon={Home}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50 dark:bg-indigo-950/60"
        />
        <StatCard
          title="Late Arrivals"
          value={lateCount}
          comparisonText="After 09:30 AM"
          icon={AlertTriangle}
          iconColor="text-amber-600"
          iconBg="bg-amber-50 dark:bg-amber-950/60"
        />
        <StatCard
          title="On Scheduled Leave"
          value={onLeaveCount}
          comparisonText="Approved leaves"
          icon={Calendar}
          iconColor="text-sky-600"
          iconBg="bg-sky-50 dark:bg-sky-950/60"
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredAttendance}
        searchKey="employeeName"
        searchPlaceholder="Search by employee name or ID..."
        pageSize={8}
        filterComponent={
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Present">Present</option>
            <option value="WFH">Work From Home (WFH)</option>
            <option value="Late">Late</option>
            <option value="On Leave">On Leave</option>
            <option value="Absent">Absent</option>
          </select>
        }
      />

      {/* Mark WFH Attendance Modal */}
      {isWFHModalOpen && (
        <MarkWFHAttendanceModal
          isOpen={isWFHModalOpen}
          onClose={() => setIsWFHModalOpen(false)}
          initialEmployeeId={targetEmployeeId}
        />
      )}
    </div>
  );
};

export default OwnerAttendance;
