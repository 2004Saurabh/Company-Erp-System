import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import Input from '../Input';
import Select from '../Select';
import { useERP } from '../../context/ERPContext';

export const ProjectModal = ({ isOpen, onClose, projectToEdit = null }) => {
  const { addProject, updateProject, employees, departments } = useERP();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    manager: 'Marcus Sterling',
    managerId: 'EMP-1003',
    department: 'Engineering',
    startDate: '2026-10-01',
    deadline: '2026-12-31',
    priority: 'High',
    budget: 150000,
    status: 'In Progress',
    progress: 10,
    category: 'Core Engineering'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (projectToEdit) {
      setFormData({ ...projectToEdit });
    } else {
      setFormData({
        name: '',
        description: '',
        manager: 'Marcus Sterling',
        managerId: 'EMP-1003',
        department: departments[0]?.name || 'Engineering',
        startDate: '2026-10-01',
        deadline: '2026-12-31',
        priority: 'High',
        budget: 150000,
        status: 'Planning',
        progress: 0,
        category: 'Engineering'
      });
    }
    setErrors({});
  }, [projectToEdit, isOpen, departments]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Project name is required.';
    if (!formData.description.trim()) errs.description = 'Description is required.';
    if (!formData.budget || Number(formData.budget) <= 0) errs.budget = 'Enter valid budget amount.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleManagerChange = (managerName) => {
    const matched = employees.find(e => e.fullName === managerName);
    setFormData(prev => ({
      ...prev,
      manager: managerName,
      managerId: matched?.id || 'EMP-1003'
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      budget: Number(formData.budget),
      progress: Number(formData.progress)
    };

    if (projectToEdit) {
      updateProject(projectToEdit.id, payload);
    } else {
      addProject(payload);
    }
    onClose();
  };

  const managerOptions = employees.map(e => ({ value: e.fullName, label: `${e.fullName} (${e.department})` }));
  const departmentOptions = departments.map(d => ({ value: d.name, label: d.name }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={projectToEdit ? `Edit Project (${projectToEdit.id})` : 'Create New Project'}
      subtitle="Establish initiative parameters, allocation budget, and timeline"
      maxWidth="max-w-2xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {projectToEdit ? 'Save Changes' : 'Launch Project'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Project Name *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Next-Gen Enterprise Billing Engine"
          error={errors.name}
        />

        <div className="w-full flex flex-col gap-1.5 text-left">
          <label className="text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-300">
            Description *
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Core objectives, technological approach, and high-level deliverables..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          {errors.description && <p className="text-xs text-rose-500 font-medium">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Project Manager"
            value={formData.manager}
            onChange={(e) => handleManagerChange(e.target.value)}
            options={managerOptions}
          />
          <Select
            label="Department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            options={departmentOptions}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
          <Input
            label="Deadline Date"
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Allocated Budget (₹) *"
            type="number"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            placeholder="e.g. 1500000"
            error={errors.budget}
          />
          <Select
            label="Priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            options={[
              { value: 'High', label: 'High Priority' },
              { value: 'Medium', label: 'Medium Priority' },
              { value: 'Low', label: 'Low Priority' }
            ]}
          />
          <Select
            label="Current Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'Planning', label: 'Planning' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'On Hold', label: 'On Hold' },
              { value: 'Completed', label: 'Completed' }
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="w-full flex flex-col gap-1.5 text-left">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Progress Percentage ({formData.progress}%)
              </label>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.progress}
              onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
              className="w-full accent-indigo-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer mt-2"
            />
          </div>
          <Input
            label="Category Tag"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="e.g. Security, Mobile, AI"
          />
        </div>
      </form>
    </Modal>
  );
};
export default ProjectModal;
