import React, { useState } from 'react';
import { CalendarDays, Check, X, Eye } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import DataTable from '../../components/DataTable';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';

export const OwnerLeave = () => {
  const { leaves, approveLeave, rejectLeave } = useERP();
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [rejectModalLeave, setRejectModalLeave] = useState(null);
  const [rejectRemarks, setRejectRemarks] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredLeaves = leaves.filter(l =>
    statusFilter === 'All' ? true : l.status === statusFilter
  );

  const handleConfirmReject = () => {
    if (rejectModalLeave) {
      rejectLeave(rejectModalLeave.id, rejectRemarks);
      setRejectModalLeave(null);
      setRejectRemarks('');
    }
  };

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
      header: 'Leave Type',
      accessor: 'leaveType',
      sortable: true,
      render: (val) => <span className="font-medium text-slate-800 dark:text-slate-200">{val}</span>
    },
    {
      header: 'Dates',
      accessor: 'startDate',
      sortable: true,
      render: (val, row) => (
        <span className="text-xs text-slate-600 dark:text-slate-300">{val} to {row.endDate}</span>
      )
    },
    {
      header: 'Duration',
      accessor: 'days',
      sortable: true,
      render: (val) => <span className="font-bold text-indigo-600 dark:text-indigo-400">{val} Day{val > 1 ? 's' : ''}</span>
    },
    {
      header: 'Reason',
      accessor: 'reason',
      render: (val) => <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-[200px]">{val}</span>
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
            Executive Leave Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review company-wide time-off requests, PTO balances, and executive sign-offs
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
        >
          <option value="All">All Requests</option>
          <option value="Pending">Pending Only</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredLeaves}
        searchKey="employeeName"
        searchPlaceholder="Search leave requests by name..."
        pageSize={8}
        actions={(row) => (
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={() => setSelectedLeave(row)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
              title="Inspect Request"
            >
              <Eye className="w-4 h-4" />
            </button>
            {row.status === 'Pending' && (
              <>
                <button
                  onClick={() => approveLeave(row.id, 'Approved by Executive Management')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
                  title="Approve Leave"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setRejectModalLeave(row);
                    setRejectRemarks('');
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                  title="Reject Leave"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        )}
      />

      {/* Inspect Leave Modal */}
      <Modal
        isOpen={Boolean(selectedLeave)}
        onClose={() => setSelectedLeave(null)}
        title="Leave Application Details"
        subtitle={`Request ID: ${selectedLeave?.id}`}
        maxWidth="max-w-md"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            {selectedLeave?.status === 'Pending' && (
              <>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setRejectModalLeave(selectedLeave);
                    setSelectedLeave(null);
                  }}
                >
                  Reject
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => {
                    approveLeave(selectedLeave.id, 'Approved by CEO');
                    setSelectedLeave(null);
                  }}
                >
                  Approve Leave
                </Button>
              </>
            )}
            <Button variant="secondary" size="sm" onClick={() => setSelectedLeave(null)}>
              Close
            </Button>
          </div>
        }
      >
        {selectedLeave && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-bold block">Applicant</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white block mt-0.5">{selectedLeave.employeeName}</span>
              <span className="text-slate-500">{selectedLeave.department}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Leave Type</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedLeave.leaveType}</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Duration</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">{selectedLeave.days} Days</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block text-[11px]">Date Range</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedLeave.startDate} to {selectedLeave.endDate}</span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block text-[11px] mb-1">Reason Stated</span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{selectedLeave.reason}</p>
            </div>

            {selectedLeave.remarks && (
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <span className="text-[11px] font-bold block mb-0.5">Manager Remarks:</span>
                {selectedLeave.remarks}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Reject Remarks Modal */}
      <Modal
        isOpen={Boolean(rejectModalLeave)}
        onClose={() => setRejectModalLeave(null)}
        title="Decline Leave Request"
        subtitle="Specify justification to notify the applicant"
        maxWidth="max-w-md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRejectModalLeave(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmReject}>
              Confirm Rejection
            </Button>
          </>
        }
      >
        <div className="space-y-3 py-2 text-left">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Rejection Feedback / Justification
          </label>
          <textarea
            rows={3}
            value={rejectRemarks}
            onChange={(e) => setRejectRemarks(e.target.value)}
            placeholder="e.g. Conflicts with scheduled client release milestones..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
        </div>
      </Modal>
    </div>
  );
};
export default OwnerLeave;
