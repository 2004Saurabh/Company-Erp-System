import React, { useState } from 'react';
import { Clock, UserCheck, AlertTriangle, Calendar, CheckCircle2 } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import StatCard from '../../components/StatCard';

export const OwnerAttendance = () => {
  const { attendance, employees } = useERP();
  const [filterStatus, setFilterStatus] = useState('All');

  const todayStr = '2026-10-01';
  const todayRecords = attendance.filter(a => a.date === todayStr);

  const presentCount = todayRecords.filter(a => a.status === 'Present').length;
  const lateCount = todayRecords.filter(a => a.status === 'Late').length;
  const onLeaveCount = todayRecords.filter(a => a.status === 'On Leave').length;
  const attendanceRate = Math.round(((presentCount + lateCount) / (employees.length || 1)) * 100);

  const filteredAttendance = attendance.filter(a =>
    filterStatus === 'All' ? true : a.status === filterStatus
  );

  const columns = [
    {
      header: 'Employee',
      accessor: 'employeeName',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">{val}</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">{row.department} · {row.employeeId}</span>
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
      render: (val) => val ? <span className="font-mono text-emerald-600 dark:text-emerald-400">{val}</span> : <span className="text-slate-400">—</span>
    },
    {
      header: 'Clock Out',
      accessor: 'checkOut',
      sortable: true,
      render: (val) => val ? <span className="font-mono text-indigo-600 dark:text-indigo-400">{val}</span> : <span className="text-slate-400">In Progress</span>
    },
    {
      header: 'Working Hours',
      accessor: 'workHours',
      sortable: true,
      render: (val) => val ? <span className="font-semibold">{val} hrs</span> : <span className="text-slate-400">—</span>
    },
    {
      header: 'WiFi Network',
      accessor: 'networkName',
      sortable: true,
      render: (val) => (
        <span className="inline-flex items-center gap-1 font-mono text-xs text-slate-700 dark:text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {val || 'NEXORA-CORP-5G'}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (val) => {
        let variant = 'neutral';
        if (val === 'Present') variant = 'success';
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
          Company Attendance Governance
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Daily attendance rosters, shift check-in timings, and punctuality monitoring
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
        searchPlaceholder="Search attendance records..."
        pageSize={8}
        filterComponent={
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Late">Late</option>
            <option value="On Leave">On Leave</option>
            <option value="Absent">Absent</option>
          </select>
        }
      />
    </div>
  );
};
export default OwnerAttendance;
