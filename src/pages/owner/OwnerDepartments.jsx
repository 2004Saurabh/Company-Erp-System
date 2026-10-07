import React, { useState } from 'react';
import { Plus, Edit, Trash2, Building2, Users, IndianRupee, Shield } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import DepartmentModal from '../../components/modals/DepartmentModal';
import ConfirmDialog from '../../components/ConfirmDialog';

export const OwnerDepartments = () => {
  const { departments, deleteDepartment, employees } = useERP();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [departmentToEdit, setDepartmentToEdit] = useState(null);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Department Governance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organize functional business units, operational budgets, and leadership mandates
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => {
            setDepartmentToEdit(null);
            setIsAddModalOpen(true);
          }}
        >
          Add Department
        </Button>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map((dept) => {
          const deptEmployees = employees.filter(e => e.department === dept.name);
          const totalHeadcount = deptEmployees.length || dept.employeeCount || 0;

          return (
            <div
              key={dept.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{dept.name}</h3>
                      <span className="text-[11px] font-mono text-slate-400">{dept.id}</span>
                    </div>
                  </div>
                  <Badge variant={dept.status === 'Active' ? 'success' : 'warning'} size="sm" dot>
                    {dept.status}
                  </Badge>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                  {dept.description || 'Core operational mandate driving business objectives.'}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-indigo-500" />
                      Department Head
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{dept.head}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-500" />
                      Headcount
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{totalHeadcount} Staff</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <IndianRupee className="w-3.5 h-3.5 text-amber-500" />
                      Annual Budget
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      ₹{dept.budget?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Edit}
                  onClick={() => {
                    setDepartmentToEdit(dept);
                    setIsAddModalOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  onClick={() => setDepartmentToDelete(dept)}
                >
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      <DepartmentModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setDepartmentToEdit(null);
        }}
        departmentToEdit={departmentToEdit}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(departmentToDelete)}
        onClose={() => setDepartmentToDelete(null)}
        title="Delete Department"
        message={`Are you sure you want to remove the ${departmentToDelete?.name} department? You may need to reassign ${departmentToDelete?.employeeCount || 0} employees.`}
        confirmText="Delete Department"
        onConfirm={() => {
          if (departmentToDelete) {
            deleteDepartment(departmentToDelete.id);
            setDepartmentToDelete(null);
          }
        }}
      />
    </div>
  );
};
export default OwnerDepartments;
