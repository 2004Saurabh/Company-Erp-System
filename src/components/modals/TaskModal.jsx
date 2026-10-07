import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import Input from '../Input';
import Select from '../Select';
import { useERP } from '../../context/ERPContext';

export const TaskModal = ({ isOpen, onClose, taskToEdit = null, defaultAssignedTo = null }) => {
  const { addTask, updateTask, employees, projects } = useERP();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    assignedToId: '',
    priority: 'Medium',
    dueDate: '2026-10-15',
    project: '',
    projectId: '',
    status: 'Todo',
    tags: 'Frontend, Sprint'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        ...taskToEdit,
        tags: Array.isArray(taskToEdit.tags) ? taskToEdit.tags.join(', ') : (taskToEdit.tags || '')
      });
    } else {
      const firstEmp = defaultAssignedTo || employees[0];
      const firstPrj = projects[0];
      setFormData({
        title: '',
        description: '',
        assignedTo: firstEmp?.fullName || 'Elena Rostova',
        assignedToId: firstEmp?.id || 'EMP-1004',
        priority: 'Medium',
        dueDate: '2026-10-15',
        project: firstPrj?.name || 'Next-Gen Mobile App Overhaul',
        projectId: firstPrj?.id || 'PRJ-102',
        status: 'Todo',
        tags: 'Feature, Sprint'
      });
    }
    setErrors({});
  }, [taskToEdit, isOpen, defaultAssignedTo, employees, projects]);

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Task Title is required.';
    if (!formData.description.trim()) errs.description = 'Task Description is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAssigneeChange = (empName) => {
    const matched = employees.find(e => e.fullName === empName);
    setFormData(prev => ({
      ...prev,
      assignedTo: empName,
      assignedToId: matched?.id || ''
    }));
  };

  const handleProjectChange = (projectName) => {
    const matched = projects.find(p => p.name === projectName);
    setFormData(prev => ({
      ...prev,
      project: projectName,
      projectId: matched?.id || ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const parsedTags = typeof formData.tags === 'string'
      ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      : formData.tags;

    const payload = {
      ...formData,
      tags: parsedTags
    };

    if (taskToEdit) {
      updateTask(taskToEdit.id, payload);
    } else {
      addTask(payload);
    }
    onClose();
  };

  const employeeOptions = employees.map(e => ({ value: e.fullName, label: `${e.fullName} (${e.department})` }));
  const projectOptions = projects.map(p => ({ value: p.name, label: p.name }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? `Edit Task (${taskToEdit.id})` : 'Create New Task'}
      subtitle="Define deliverables, assignees, and target completion milestone"
      maxWidth="max-w-xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {taskToEdit ? 'Save Changes' : 'Create Task'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title *"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g. Audit Redis Sentinel Failover Policies"
          error={errors.title}
        />

        <div className="w-full flex flex-col gap-1.5 text-left">
          <label className="text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-300">
            Description *
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed requirements, acceptance criteria, or links..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
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
              { value: 'High', label: 'High Priority' },
              { value: 'Medium', label: 'Medium Priority' },
              { value: 'Low', label: 'Low Priority' }
            ]}
          />
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'Todo', label: 'Todo' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Review', label: 'Review' },
              { value: 'Completed', label: 'Completed' }
            ]}
          />
          <Input
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </div>

        <Input
          label="Tags (comma separated)"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="e.g. Backend, Security, Urgent"
        />
      </form>
    </Modal>
  );
};
export default TaskModal;
