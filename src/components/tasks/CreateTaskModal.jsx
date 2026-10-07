import React, { useState } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import Input from '../Input';
import Select from '../Select';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';

export const CreateTaskModal = ({ isOpen, onClose, defaultAssigneeId = null }) => {
  const { createTask, employees, projects, departments } = useERP();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: 'Elena Rostova',
    assignedToId: 'EMP-1004',
    assignedManager: 'Marcus Sterling',
    assignedManagerId: 'EMP-1003',
    department: 'Engineering',
    project: 'Next-Gen Mobile App Overhaul',
    projectId: 'PRJ-102',
    priority: 'Medium',
    status: 'Pending',
    startDate: '2026-10-07',
    dueDate: '2026-10-21',
    estimatedHours: 20
  });

  const [errors, setErrors] = useState({});

  const handleAssigneeChange = (empName) => {
    const emp = employees.find(e => e.fullName === empName);
    const mgr = employees.find(e => e.fullName === emp?.manager) || employees.find(e => e.role === 'manager');
    setFormData(prev => ({
      ...prev,
      assignedTo: empName,
      assignedToId: emp?.id || '',
      department: emp?.department || prev.department,
      assignedManager: emp?.manager || mgr?.fullName || 'Marcus Sterling',
      assignedManagerId: mgr?.id || 'EMP-1003'
    }));
  };

  const handleProjectChange = (projectName) => {
    const prj = projects.find(p => p.name === projectName);
    setFormData(prev => ({
      ...prev,
      project: projectName,
      projectId: prj?.id || ''
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required.';
    if (!formData.description.trim()) errs.description = 'Description is required.';
    if (!formData.dueDate) errs.dueDate = 'Due date is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    createTask(formData);
    onClose();
  };

  const employeeOptions = employees.map(e => ({ value: e.fullName, label: `${e.fullName} (${e.department})` }));
  const projectOptions = projects.map(p => ({ value: p.name, label: p.name }));
  const departmentOptions = departments.map(d => ({ value: d.name, label: d.name }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create & Assign New Task"
      subtitle="Define task parameters, assign to workforce members, and track completion"
      maxWidth="max-w-2xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create Deliverable
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title *"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g. Implement Native Push Notification Handler"
          error={errors.title}
        />

        <div className="w-full flex flex-col gap-1.5 text-left">
          <label className="text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-300">
            Description & Acceptance Criteria *
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed description of deliverables..."
            className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.description && <p className="text-xs text-rose-500 font-medium">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Assigned Employee"
            value={formData.assignedTo}
            onChange={(e) => handleAssigneeChange(e.target.value)}
            options={employeeOptions}
          />
          <Select
            label="Associated Project"
            value={formData.project}
            onChange={(e) => handleProjectChange(e.target.value)}
            options={projectOptions}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            options={[
              { value: 'Critical', label: 'Critical' },
              { value: 'High', label: 'High' },
              { value: 'Medium', label: 'Medium' },
              { value: 'Low', label: 'Low' }
            ]}
          />
          <Select
            label="Initial Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'Pending', label: 'Pending' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Completed', label: 'Completed' }
            ]}
          />
          <Input
            label="Estimated Hours"
            type="number"
            min="1"
            value={formData.estimatedHours}
            onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
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
            label="Due Date *"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            error={errors.dueDate}
          />
        </div>
      </form>
    </Modal>
  );
};

export default CreateTaskModal;
