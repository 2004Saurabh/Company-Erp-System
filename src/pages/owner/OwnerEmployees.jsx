import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Power, Eye, Filter, Download } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import DataTable from '../../components/DataTable';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Avatar from '../../components/Avatar';
import EmployeeModal from '../../components/modals/EmployeeModal';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useToast } from '../../context/ToastContext';

export const OwnerEmployees = () => {
  const { employees, departments, deleteEmployee, toggleEmployeeStatus } = useERP();
  const { addToast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [employeeToView, setEmployeeToView] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  // Filters
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchDept = departmentFilter === 'All' || emp.department === departmentFilter;
      const matchStatus = statusFilter === 'All' || emp.status === statusFilter;
      return matchDept && matchStatus;
    });
  }, [employees, departmentFilter, statusFilter]);

  const handleExportCSV = () => {
    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Department', 'Designation', 'Status', 'Salary', 'Joining Date'];
    const rows = filteredEmployees.map(e => [
      e.id,
      `"${e.fullName}"`,
      `"${e.email}"`,
      `"${e.phone}"`,
      `"${e.department}"`,
      `"${e.designation}"`,
      e.status,
      e.salary,
      e.joiningDate
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NEXORA_Employees_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Employee roster exported to CSV.', 'success');
  };

  const columns = [
    {
      header: 'Employee',
      accessor: 'fullName',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.avatar} name={row.fullName} size="sm" />
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">{row.fullName}</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{row.id} · {row.email}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Department',
      accessor: 'department',
      sortable: true,
      render: (val) => (
        <span className="font-medium text-slate-700 dark:text-slate-300">{val}</span>
      )
    },
    {
      header: 'Designation',
      accessor: 'designation',
      sortable: true,
      render: (val) => <span className="text-slate-600 dark:text-slate-400">{val}</span>
    },
    {
      header: 'Compensation',
      accessor: 'salary',
      sortable: true,
      render: (val) => <span className="font-semibold text-slate-900 dark:text-white">${Number(val || 0).toLocaleString()}/yr</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (val) => (
        <Badge
          variant={val === 'Active' ? 'success' : val === 'On Leave' ? 'warning' : 'neutral'}
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
            Workforce Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage employee identities, compensation, job architectures, and active status
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" icon={Download} onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => {
              setEmployeeToEdit(null);
              setIsAddModalOpen(true);
            }}
          >
            Add Employee
          </Button>
        </div>
      </div>

      {/* Filter Component */}
      <DataTable
        columns={columns}
        data={filteredEmployees}
        searchKey="fullName"
        searchPlaceholder="Search employees by name, email, designation..."
        pageSize={8}
        filterComponent={
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
        }
        actions={(row) => (
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={() => setEmployeeToView(row)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
              title="View Profile Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setEmployeeToEdit(row);
                setIsAddModalOpen(true);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors"
              title="Edit Employee"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleEmployeeStatus(row.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                row.status === 'Active'
                  ? 'text-emerald-500 hover:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-slate-800'
              }`}
              title={row.status === 'Active' ? 'Deactivate' : 'Activate'}
            >
              <Power className="w-4 h-4" />
            </button>
            <button
              onClick={() => setEmployeeToDelete(row)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
              title="Delete Record"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      {/* Add / Edit Modal */}
      <EmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEmployeeToEdit(null);
        }}
        employeeToEdit={employeeToEdit}
      />

      {/* View Employee Detail Modal */}
      <Modal
        isOpen={Boolean(employeeToView)}
        onClose={() => setEmployeeToView(null)}
        title={employeeToView ? `${employeeToView.fullName} (${employeeToView.id})` : 'Employee'}
        subtitle="Comprehensive personnel record dossier"
        maxWidth="max-w-2xl"
        footer={
          <Button variant="secondary" onClick={() => setEmployeeToView(null)}>
            Close
          </Button>
        }
      >
        {employeeToView && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <Avatar src={employeeToView.avatar} name={employeeToView.fullName} size="xl" />
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{employeeToView.fullName}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{employeeToView.designation} · {employeeToView.department}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={employeeToView.status === 'Active' ? 'success' : 'warning'} size="sm" dot>
                    {employeeToView.status}
                  </Badge>
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{employeeToView.employmentType}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Email</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 break-all">{employeeToView.email}</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Phone</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{employeeToView.phone}</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Joining Date</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{employeeToView.joiningDate}</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Annual Salary</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">₹{employeeToView.salary?.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Reporting Manager</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{employeeToView.manager || 'Saurabh Kumar'}</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Emergency Contact</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{employeeToView.emergencyContact || 'None'}</span>
              </div>
            </div>

            {employeeToView.address && (
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-400 block text-[11px]">Address</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{employeeToView.address}</span>
              </div>
            )}

            {employeeToView.skills && (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Verified Competencies</span>
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(employeeToView.skills) ? employeeToView.skills : [employeeToView.skills]).map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-medium border border-indigo-200 dark:border-indigo-800/30">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(employeeToDelete)}
        onClose={() => setEmployeeToDelete(null)}
        title="Remove Employee"
        message={`Are you sure you want to remove ${employeeToDelete?.fullName} (${employeeToDelete?.id})? This will detach assigned projects and task allocations.`}
        confirmText="Remove Record"
        onConfirm={() => {
          if (employeeToDelete) {
            deleteEmployee(employeeToDelete.id);
            setEmployeeToDelete(null);
          }
        }}
      />
    </div>
  );
};
export default OwnerEmployees;
