import React, { useState } from 'react';
import { ShieldCheck, Search, Filter, Clock, Download } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { useToast } from '../../context/ToastContext';

export const OwnerAuditLogs = () => {
  const { auditLogs } = useERP();
  const { addToast } = useToast();
  const [moduleFilter, setModuleFilter] = useState('All');

  const filteredLogs = auditLogs.filter(l =>
    moduleFilter === 'All' ? true : l.module === moduleFilter
  );

  const modulesList = Array.from(new Set(auditLogs.map(l => l.module)));

  const handleExportCSV = () => {
    const headers = ['Log ID', 'User', 'Role', 'Action', 'Module', 'Date', 'Time', 'Status', 'Details'];
    const rows = filteredLogs.map(l => [
      l.id,
      `"${l.user}"`,
      l.role,
      `"${l.action}"`,
      `"${l.module}"`,
      l.date,
      l.time,
      l.status,
      `"${l.details}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NEXORA_AuditLogs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Audit log ledger exported to CSV.', 'success');
  };

  const columns = [
    {
      header: 'Log Ref',
      accessor: 'id',
      sortable: true,
      render: (val) => <span className="font-mono text-xs text-slate-500 font-semibold">{val}</span>
    },
    {
      header: 'User & Role',
      accessor: 'user',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">{val}</span>
          <span className="text-[10px] uppercase font-semibold text-indigo-500">{row.role}</span>
        </div>
      )
    },
    {
      header: 'Action Taken',
      accessor: 'action',
      sortable: true,
      render: (val) => <span className="font-semibold text-slate-800 dark:text-slate-200">{val}</span>
    },
    {
      header: 'Module',
      accessor: 'module',
      sortable: true,
      render: (val) => <Badge variant="neutral" size="sm">{val}</Badge>
    },
    {
      header: 'Details',
      accessor: 'details',
      render: (val) => <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-[280px]">{val}</span>
    },
    {
      header: 'Timestamp',
      accessor: 'time',
      sortable: true,
      render: (val, row) => (
        <span className="font-mono text-[11px] text-slate-500">{row.date} {val}</span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (val) => <Badge variant="success" size="sm" dot>{val}</Badge>
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Enterprise Security Audit Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Immutable system event trail, administrative mutations, and governance records
          </p>
        </div>

        <Button variant="outline" size="sm" icon={Download} onClick={handleExportCSV}>
          Export Audit Trail
        </Button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredLogs}
        searchKey="action"
        searchPlaceholder="Search audit events by action or user..."
        pageSize={10}
        filterComponent={
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="All">All Modules</option>
            {modulesList.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        }
      />
    </div>
  );
};
export default OwnerAuditLogs;
