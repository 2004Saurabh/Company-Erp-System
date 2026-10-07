import React from 'react';
import Modal from '../Modal';
import Button from '../Button';
import Badge from '../Badge';
import { Printer, Download, CheckCircle, Building } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const PayslipViewModal = ({ isOpen, onClose, payslip }) => {
  const { addToast } = useToast();

  if (!payslip) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    const headers = ['Payslip ID', 'Month', 'Employee', 'Department', 'Basic', 'Allowances', 'Deductions', 'Tax', 'Net Salary', 'Status'];
    const row = [
      payslip.id,
      payslip.month,
      `"${payslip.employeeName}"`,
      `"${payslip.department}"`,
      payslip.basicSalary,
      payslip.allowances,
      payslip.deductions,
      payslip.tax,
      payslip.netSalary,
      payslip.status
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), row.join(',')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Payslip_${payslip.employeeName.replace(/\s+/g, '_')}_${payslip.month}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Payslip CSV downloaded successfully.', 'success');
  };

  const grossEarnings = (payslip.basicSalary || 0) + (payslip.allowances || 0);
  const totalDeductions = (payslip.deductions || 0) + (payslip.tax || 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Salary Payslip & Statement"
      subtitle={`Official remittance record for ${payslip.month}`}
      maxWidth="max-w-2xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline" icon={Download} onClick={handleDownloadCSV}>
            Download CSV
          </Button>
          <Button variant="primary" icon={Printer} onClick={handlePrint}>
            Print Payslip
          </Button>
        </>
      }
    >
      <div className="p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 print:border-none print:p-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                N
              </div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white">NEXORA Technologies Inc.</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              500 Howard Street, Suite 400 · San Francisco, CA 94105
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Payslip Ref</span>
            <span className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200">{payslip.id}</span>
            <div className="mt-1">
              <Badge variant={payslip.status === 'Paid' ? 'success' : 'warning'} size="sm" dot>
                {payslip.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Employee Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Employee Name</span>
            <span className="font-bold text-slate-900 dark:text-white">{payslip.employeeName}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Employee ID</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">{payslip.employeeId}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Department</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">{payslip.department}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Pay Period</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">{payslip.month}</span>
          </div>
        </div>

        {/* Breakdown Breakdown Table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Earnings */}
          <div className="bg-white dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200/60 dark:border-slate-700">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3">
              Earnings & Allowances
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
                <span className="text-slate-500 dark:text-slate-400">Basic Salary</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">₹{payslip.basicSalary?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
                <span className="text-slate-500 dark:text-slate-400">Special Allowances</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">₹{payslip.allowances?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 pt-2 font-bold text-slate-900 dark:text-white">
                <span>Total Gross Earnings</span>
                <span>₹{grossEarnings.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="bg-white dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200/60 dark:border-slate-700">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-3">
              Deductions & Withholding
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
                <span className="text-slate-500 dark:text-slate-400">Standard Deductions (PF / EPF)</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">₹{payslip.deductions?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
                <span className="text-slate-500 dark:text-slate-400">TDS / Income Tax Withholding</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">₹{payslip.tax?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 pt-2 font-bold text-slate-900 dark:text-white">
                <span>Total Deductions</span>
                <span>₹{totalDeductions.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Take Home Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border border-indigo-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400">
              Net Disbursed Take-Home Pay
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Disbursed via {payslip.paymentMethod || 'Direct Deposit'}
            </p>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
            ₹{payslip.netSalary?.toLocaleString('en-IN')}
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default PayslipViewModal;
