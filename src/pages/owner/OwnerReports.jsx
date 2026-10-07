import React, { useState } from 'react';
import { BarChart3, Download, Printer, Filter, FileText, CheckCircle2 } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { useToast } from '../../context/ToastContext';

export const OwnerReports = () => {
  const { employees, attendance, leaves, payroll, projects } = useERP();
  const { addToast } = useToast();

  const [activeReport, setActiveReport] = useState('employee');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  const reportTabs = [
    { id: 'employee', label: 'Employee Headcount' },
    { id: 'attendance', label: 'Attendance & Punctuality' },
    { id: 'leave', label: 'Leave & Absence' },
    { id: 'payroll', label: 'Payroll & Compensation' },
    { id: 'project', label: 'Project Portfolio' }
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let headers = [];
    let rows = [];
    let filename = `NEXORA_${activeReport}_report.csv`;

    if (activeReport === 'employee') {
      headers = ['ID', 'Name', 'Department', 'Designation', 'Status', 'Salary'];
      rows = employees.map(e => [e.id, `"${e.fullName}"`, `"${e.department}"`, `"${e.designation}"`, e.status, e.salary]);
    } else if (activeReport === 'payroll') {
      headers = ['Payslip ID', 'Employee', 'Month', 'Basic', 'Allowances', 'Net'];
      rows = payroll.map(p => [p.id, `"${p.employeeName}"`, `"${p.month}"`, p.basicSalary, p.allowances, p.netSalary]);
    } else if (activeReport === 'project') {
      headers = ['Project ID', 'Name', 'Manager', 'Status', 'Progress', 'Budget'];
      rows = projects.map(p => [p.id, `"${p.name}"`, `"${p.manager}"`, p.status, `${p.progress}%`, p.budget]);
    } else {
      headers = ['Record ID', 'Employee', 'Date', 'Status'];
      rows = attendance.map(a => [a.id, `"${a.employeeName}"`, a.date, a.status]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast(`${activeReport.toUpperCase()} report exported successfully.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Enterprise Analytical Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Generate and export consolidated compliance, financial, and workforce intelligence
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={Printer} onClick={handlePrint}>
            Print Report
          </Button>
          <Button variant="primary" size="sm" icon={Download} onClick={handleExportCSV}>
            Download CSV
          </Button>
        </div>
      </div>

      {/* Report Switcher Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {reportTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveReport(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeReport === tab.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Summary Cards for Selected Report */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {activeReport === 'employee' && (
          <>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-bold uppercase">Total Registered Headcount</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{employees.length} Personnel</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-bold uppercase">Active Status Rate</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">98.2%</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-bold uppercase">Total Annual Payroll Cap</span>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                ₹{employees.reduce((acc, e) => acc + (e.salary || 0), 0).toLocaleString('en-IN')}
              </p>
            </div>
          </>
        )}

        {activeReport === 'payroll' && (
          <>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-bold uppercase">Monthly Gross Payroll</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                ₹{payroll.reduce((acc, p) => acc + (p.basicSalary || 0), 0).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-bold uppercase">Total Allowances</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                ₹{payroll.reduce((acc, p) => acc + (p.allowances || 0), 0).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-bold uppercase">Tax Withheld</span>
              <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
                ₹{payroll.reduce((acc, p) => acc + (p.tax || 0), 0).toLocaleString('en-IN')}
              </p>
            </div>
          </>
        )}

        {activeReport === 'project' && (
          <>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-bold uppercase">Active Projects</span>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                {projects.filter(p => p.status === 'In Progress').length} of {projects.length}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-bold uppercase">Total Budget Committed</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                ₹{projects.reduce((acc, p) => acc + (p.budget || 0), 0).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-bold uppercase">Average Completion</span>
              <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
                {Math.round(projects.reduce((acc, p) => acc + (p.progress || 0), 0) / (projects.length || 1))}%
              </p>
            </div>
          </>
        )}

        {(activeReport === 'attendance' || activeReport === 'leave') && (
          <>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-bold uppercase">Attendance SLA</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">96.4%</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-bold uppercase">Leaves Granted</span>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                {leaves.filter(l => l.status === 'Approved').length} Approved
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-bold uppercase">Pending Requests</span>
              <p className="text-2xl font-black text-amber-500 mt-1">
                {leaves.filter(l => l.status === 'Pending').length} Pending
              </p>
            </div>
          </>
        )}
      </div>

      {/* Generated Report Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Generated Data Feed ({activeReport.toUpperCase()})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[11px] pb-2 font-bold">
                <th className="py-2.5 px-3">Subject / Name</th>
                <th className="py-2.5 px-3">Category / Dept</th>
                <th className="py-2.5 px-3">Primary Metric</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {activeReport === 'employee' && employees.map(e => (
                <tr key={e.id}>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{e.fullName}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{e.department}</td>
                  <td className="py-3 px-3 font-mono font-semibold">₹{e.salary?.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3"><Badge variant="success" size="sm">{e.status}</Badge></td>
                </tr>
              ))}

              {activeReport === 'payroll' && payroll.map(p => (
                <tr key={p.id}>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{p.employeeName}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{p.month}</td>
                  <td className="py-3 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">₹{p.netSalary?.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3"><Badge variant={p.status === 'Paid' ? 'success' : 'warning'} size="sm">{p.status}</Badge></td>
                </tr>
              ))}

              {activeReport === 'project' && projects.map(pr => (
                <tr key={pr.id}>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{pr.name}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{pr.department}</td>
                  <td className="py-3 px-3 font-bold text-indigo-600">{pr.progress}% Complete</td>
                  <td className="py-3 px-3"><Badge variant="info" size="sm">{pr.status}</Badge></td>
                </tr>
              ))}

              {(activeReport === 'attendance' || activeReport === 'leave') && leaves.map(l => (
                <tr key={l.id}>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{l.employeeName}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{l.leaveType}</td>
                  <td className="py-3 px-3 font-semibold">{l.days} Days</td>
                  <td className="py-3 px-3"><Badge variant={l.status === 'Approved' ? 'success' : 'warning'} size="sm">{l.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default OwnerReports;
