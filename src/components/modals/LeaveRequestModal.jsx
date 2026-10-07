import React, { useState } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import Input from '../Input';
import Select from '../Select';
import { useERP } from '../../context/ERPContext';

export const LeaveRequestModal = ({ isOpen, onClose }) => {
  const { applyLeave } = useERP();

  const [formData, setFormData] = useState({
    leaveType: 'Casual Leave',
    startDate: '2026-10-12',
    endDate: '2026-10-14',
    reason: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.startDate) errs.startDate = 'Start date required.';
    if (!formData.endDate) errs.endDate = 'End date required.';
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      errs.endDate = 'End date cannot be prior to start date.';
    }
    if (!formData.reason.trim()) errs.reason = 'Reason explanation is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 1;
    const s = new Date(formData.startDate);
    const e = new Date(formData.endDate);
    const diffTime = Math.abs(e - s);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return isNaN(diffDays) ? 1 : diffDays;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    applyLeave({
      ...formData,
      days: calculateDays()
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Apply for Leave"
      subtitle="Submit formal time-off request for managerial review"
      maxWidth="max-w-lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit Leave Request ({calculateDays()} day{calculateDays() > 1 ? 's' : ''})
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Leave Type"
          value={formData.leaveType}
          onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
          options={[
            { value: 'Casual Leave', label: 'Casual Leave (12 days/yr)' },
            { value: 'Sick Leave', label: 'Sick Leave (10 days/yr)' },
            { value: 'Earned Leave', label: 'Earned Leave (15 days/yr)' },
            { value: 'Emergency Leave', label: 'Emergency Leave (5 days/yr)' },
            { value: 'Unpaid Leave', label: 'Unpaid Leave / Sabbatical' }
          ]}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Start Date *"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            error={errors.startDate}
          />
          <Input
            label="End Date *"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            error={errors.endDate}
          />
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">Total Requested Duration:</span>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">{calculateDays()} Calendar Day(s)</span>
        </div>

        <div className="w-full flex flex-col gap-1.5 text-left">
          <label className="text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-300">
            Reason for Absence *
          </label>
          <textarea
            rows={3}
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            placeholder="Briefly state the context (e.g. personal matters, doctor consultation, vacation)..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          {errors.reason && <p className="text-xs text-rose-500 font-medium">{errors.reason}</p>}
        </div>
      </form>
    </Modal>
  );
};
export default LeaveRequestModal;
