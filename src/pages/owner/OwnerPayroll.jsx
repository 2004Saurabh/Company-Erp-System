import React, { useState } from 'react';
import { CreditCard, IndianRupee, Download, Eye, CheckCircle2 } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import DataTable from '../../components/DataTable';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import PayslipViewModal from '../../components/modals/PayslipViewModal';
import { useToast } from '../../context/ToastContext';

export const OwnerPayroll = () => {
  const { payroll, markPayrollPaid } = useERP();
  const { addToast } = useToast();
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  const totalDisbursed = payroll.reduce((acc, p) => acc + (p.status === 'Paid' ? p.netSalary : 0), 0);
  const pendingProcessing = payroll.filter(p => p.status === 'Processing').length;

  const handleDisburseAll = () => {
    payroll.forEach(p => {
      if (p.status === 'Processing') markPayrollPaid(p.id);
    });
    addToast('All pending payroll cycles disbursed via Automated Clearing House.', 'success');
  };

  const columns = [
    {
      header: 'Employee',
      accessor: 'employeeName',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">{val}</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">{row.designation} · {row.department}</span>
        </div>
      )
    },
    {
      header: 'Pay Cycle',
      accessor: 'month',
      sortable: true
    },
    {
      header: 'Gross Base',
      accessor: 'basicSalary',
      sortable: true,
      render: (val) => `₹${val?.toLocaleString('en-IN')}`
    },
    {
      header: 'Allowances',
      accessor: 'allowances',
      sortable: true,
      render: (val) => <span className="text-emerald-600 dark:text-emerald-400">+₹{val?.toLocaleString('en-IN')}</span>
    },
    {
      header: 'Deductions & Tax',
      accessor: 'tax',
      sortable: true,
      render: (val, row) => <span className="text-rose-600 dark:text-rose-400">-₹{((row.deductions || 0) + (row.tax || 0)).toLocaleString('en-IN')}</span>
    },
    {
      header: 'Net Disbursed',
      accessor: 'netSalary',
      sortable: true,
      render: (val) => <span className="font-bold text-slate-900 dark:text-white font-mono">₹{val?.toLocaleString('en-IN')}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (val) => (
        <Badge variant={val === 'Paid' ? 'success' : 'warning'} size="sm" dot>
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
            Enterprise Payroll Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Compensation reconciliation, tax withholdings, and monthly direct deposit disbarments
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pendingProcessing > 0 && (
            <Button variant="primary" size="sm" icon={CheckCircle2} onClick={handleDisburseAll}>
              Disburse Pending ({pendingProcessing})
            </Button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">YTD Total Disbursed</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-2">
            ₹{totalDisbursed.toLocaleString('en-IN')}
          </h3>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">Processed on time</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Average Net Salary</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-2">
            ₹{Math.round(totalDisbursed / (payroll.filter(p => p.status === 'Paid').length || 1)).toLocaleString('en-IN')}
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">Monthly mean baseline</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Pending Transactions</span>
          <h3 className="text-2xl font-black text-amber-500 font-mono mt-2">
            {pendingProcessing} Cycles
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">Awaiting monthly payroll lock</span>
        </div>
      </div>

      {/* Ledger Table */}
      <DataTable
        columns={columns}
        data={payroll}
        searchKey="employeeName"
        searchPlaceholder="Search payslips by employee name..."
        pageSize={8}
        actions={(row) => (
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={() => setSelectedPayslip(row)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
              title="View & Print Official Payslip"
            >
              <Eye className="w-4 h-4" />
            </button>
            {row.status === 'Processing' && (
              <button
                onClick={() => markPayrollPaid(row.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
                title="Mark Paid"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      />

      {/* Payslip View Modal */}
      <PayslipViewModal
        isOpen={Boolean(selectedPayslip)}
        onClose={() => setSelectedPayslip(null)}
        payslip={selectedPayslip}
      />
    </div>
  );
};
export default OwnerPayroll;
