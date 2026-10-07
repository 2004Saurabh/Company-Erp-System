import React, { useState } from 'react';
import { CreditCard, IndianRupee, Download, Eye, Printer, Calendar } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import DataTable from '../../components/DataTable';
import PayslipViewModal from '../../components/modals/PayslipViewModal';

export const EmployeePayslips = () => {
  const { payroll } = useERP();
  const { currentUser } = useAuth();
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  const empId = currentUser?.id === 'USR-004' ? 'EMP-1004' : (currentUser?.id || 'EMP-1004');
  const myPayslips = payroll.filter(p => p.employeeId === empId || p.employeeName === 'Elena Rostova');

  const latestSlip = myPayslips[0];

  const columns = [
    {
      header: 'Pay Period',
      accessor: 'month',
      sortable: true,
      render: (val) => <span className="font-bold text-slate-900 dark:text-white">{val}</span>
    },
    {
      header: 'Basic Gross',
      accessor: 'basicSalary',
      sortable: true,
      render: (val) => `₹${val?.toLocaleString('en-IN')}`
    },
    {
      header: 'Allowances',
      accessor: 'allowances',
      sortable: true,
      render: (val) => <span className="text-emerald-600 font-semibold">+₹{val?.toLocaleString('en-IN')}</span>
    },
    {
      header: 'Tax Withheld',
      accessor: 'tax',
      sortable: true,
      render: (val, row) => <span className="text-rose-600">-₹{((row.deductions || 0) + (row.tax || 0)).toLocaleString('en-IN')}</span>
    },
    {
      header: 'Net Disbursed Pay',
      accessor: 'netSalary',
      sortable: true,
      render: (val) => <span className="font-black text-indigo-600 dark:text-indigo-400 font-mono">₹{val?.toLocaleString('en-IN')}</span>
    },
    {
      header: 'Disbursal Date',
      accessor: 'paymentDate',
      sortable: true
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
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          My Salary Compensation & Payslips
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review monthly remittance statements, tax withholdings, and downloadable pay stubs
        </p>
      </div>

      {/* Current Salary Banner Card */}
      {latestSlip && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Latest Disbursed Compensation ({latestSlip.month})
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono mt-1">
              ₹{latestSlip.netSalary?.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Transferred via {latestSlip.paymentMethod}
            </p>
          </div>

          <Button
            variant="secondary"
            size="md"
            icon={Eye}
            onClick={() => setSelectedPayslip(latestSlip)}
          >
            Inspect Official Statement
          </Button>
        </div>
      )}

      {/* Past Payslips Table */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Remittance Statement History
        </h3>
        <DataTable
          columns={columns}
          data={myPayslips}
          searchKey="month"
          searchPlaceholder="Search statement cycles..."
          pageSize={6}
          actions={(row) => (
            <Button
              variant="outline"
              size="sm"
              icon={Eye}
              onClick={() => setSelectedPayslip(row)}
            >
              View
            </Button>
          )}
        />
      </div>

      <PayslipViewModal
        isOpen={Boolean(selectedPayslip)}
        onClose={() => setSelectedPayslip(null)}
        payslip={selectedPayslip}
      />
    </div>
  );
};
export default EmployeePayslips;
