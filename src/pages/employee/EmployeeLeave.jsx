import React, { useState } from 'react';
import { CalendarDays, Plus, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import DataTable from '../../components/DataTable';
import LeaveRequestModal from '../../components/modals/LeaveRequestModal';

export const EmployeeLeave = () => {
  const { leaves } = useERP();
  const { currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const empId = currentUser?.id === 'USR-004' ? 'EMP-1004' : (currentUser?.id || 'EMP-1004');
  const myLeaves = leaves.filter(l => l.employeeId === empId || l.employeeName === 'Elena Rostova');

  const columns = [
    {
      header: 'Leave Type',
      accessor: 'leaveType',
      sortable: true,
      render: (val) => <span className="font-bold text-slate-900 dark:text-white">{val}</span>
    },
    {
      header: 'Schedule',
      accessor: 'startDate',
      sortable: true,
      render: (val, row) => `${val} to ${row.endDate}`
    },
    {
      header: 'Days',
      accessor: 'days',
      sortable: true,
      render: (val) => <span className="font-bold text-indigo-600 dark:text-indigo-400">{val} Day{val > 1 ? 's' : ''}</span>
    },
    {
      header: 'Reason',
      accessor: 'reason',
      render: (val) => <span className="text-xs text-slate-500 line-clamp-1">{val}</span>
    },
    {
      header: 'Manager Remarks',
      accessor: 'remarks',
      render: (val) => <span className="text-xs text-slate-500 italic">{val || 'Awaiting review'}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (val) => (
        <Badge
          variant={val === 'Approved' ? 'success' : val === 'Rejected' ? 'danger' : 'warning'}
          size="sm"
          dot
        >
          {val}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Time-Off & Leave Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review allocated PTO quotas, submit absence requests, and track supervisor decisions
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
        >
          Apply for Leave
        </Button>
      </div>

      {/* Quotas Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <span className="text-xs font-bold uppercase text-slate-400 block">Casual Leave</span>
          <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1 block">9 Days</span>
          <span className="text-[11px] text-slate-400">3 utilized of 12</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <span className="text-xs font-bold uppercase text-slate-400 block">Sick Leave</span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1 block">8 Days</span>
          <span className="text-[11px] text-slate-400">2 utilized of 10</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <span className="text-xs font-bold uppercase text-slate-400 block">Earned Vacation</span>
          <span className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono mt-1 block">11 Days</span>
          <span className="text-[11px] text-slate-400">4 utilized of 15</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <span className="text-xs font-bold uppercase text-slate-400 block">Emergency Leave</span>
          <span className="text-2xl font-black text-amber-500 font-mono mt-1 block">5 Days</span>
          <span className="text-[11px] text-slate-400">0 utilized of 5</span>
        </div>
      </div>

      {/* Leave Application History */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          My Absence Applications History
        </h3>
        <DataTable
          columns={columns}
          data={myLeaves}
          searchKey="leaveType"
          searchPlaceholder="Search leave requests..."
          pageSize={6}
        />
      </div>

      <LeaveRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
export default EmployeeLeave;
