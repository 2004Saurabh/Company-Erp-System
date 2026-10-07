import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import Input from '../Input';
import Select from '../Select';
import { useERP } from '../../context/ERPContext';

export const DepartmentModal = ({ isOpen, onClose, departmentToEdit = null }) => {
  const { addDepartment, updateDepartment, employees } = useERP();

  const [formData, setFormData] = useState({
    name: '',
    head: 'Saurabh Kumar',
    headEmail: 'owner@company.com',
    budget: 350000,
    status: 'Active',
    description: '',
    color: 'indigo'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (departmentToEdit) {
      setFormData({ ...departmentToEdit });
    } else {
      setFormData({
        name: '',
        head: employees[0]?.fullName || 'Saurabh Kumar',
        headEmail: employees[0]?.email || 'owner@company.com',
        budget: 350000,
        status: 'Active',
        description: '',
        color: 'indigo'
      });
    }
    setErrors({});
  }, [departmentToEdit, isOpen, employees]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Department name is required.';
    if (!formData.budget || Number(formData.budget) <= 0) errs.budget = 'Enter valid annual budget.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleHeadChange = (headName) => {
    const matched = employees.find(e => e.fullName === headName);
    setFormData(prev => ({
      ...prev,
      head: headName,
      headEmail: matched?.email || ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      budget: Number(formData.budget)
    };

    if (departmentToEdit) {
      updateDepartment(departmentToEdit.id, payload);
    } else {
      addDepartment(payload);
    }
    onClose();
  };

  const headOptions = employees.map(e => ({ value: e.fullName, label: `${e.fullName} (${e.designation})` }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={departmentToEdit ? `Edit Department (${departmentToEdit.name})` : 'Create Department'}
      subtitle="Establish organizational division, leadership, and budget allocation"
      maxWidth="max-w-lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {departmentToEdit ? 'Save Changes' : 'Create Department'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Department Name *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Artificial Intelligence & R&D"
          error={errors.name}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Department Head"
            value={formData.head}
            onChange={(e) => handleHeadChange(e.target.value)}
            options={headOptions}
          />
          <Input
            label="Annual Operational Budget (₹) *"
            type="number"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            placeholder="e.g. 5000000"
            error={errors.budget}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Restructuring', label: 'Restructuring' },
              { value: 'Archived', label: 'Archived' }
            ]}
          />
          <Select
            label="Badge Color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            options={[
              { value: 'indigo', label: 'Indigo' },
              { value: 'emerald', label: 'Emerald' },
              { value: 'purple', label: 'Purple' },
              { value: 'amber', label: 'Amber' },
              { value: 'sky', label: 'Sky' },
              { value: 'rose', label: 'Rose' }
            ]}
          />
        </div>

        <div className="w-full flex flex-col gap-1.5 text-left">
          <label className="text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-300">
            Description & Charter
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Key functional scope, missions, and department mandate..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </form>
    </Modal>
  );
};
export default DepartmentModal;
