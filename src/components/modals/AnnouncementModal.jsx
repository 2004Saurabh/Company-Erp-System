import React, { useState } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import Input from '../Input';
import Select from '../Select';
import { useERP } from '../../context/ERPContext';

export const AnnouncementModal = ({ isOpen, onClose }) => {
  const { addAnnouncement, departments } = useERP();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Normal',
    audience: 'All Employees',
    pinned: false
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required.';
    if (!formData.description.trim()) errs.description = 'Description is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    addAnnouncement(formData);
    setFormData({
      title: '',
      description: '',
      priority: 'Normal',
      audience: 'All Employees',
      pinned: false
    });
    onClose();
  };

  const audienceOptions = [
    { value: 'All Employees', label: 'All Employees (Company-Wide)' },
    ...departments.map(d => ({ value: d.name, label: `${d.name} Department Only` }))
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Publish Company Announcement"
      subtitle="Broadcast notifications, strategic updates, and memos"
      maxWidth="max-w-lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Broadcast Announcement
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Announcement Title *"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g. Q4 Company All-Hands & Strategy Briefing"
          error={errors.title}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Priority Level"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            options={[
              { value: 'Normal', label: 'Normal Priority' },
              { value: 'High', label: 'High Priority' },
              { value: 'Urgent', label: 'Urgent / Critical' }
            ]}
          />
          <Select
            label="Target Audience"
            value={formData.audience}
            onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
            options={audienceOptions}
          />
        </div>

        <div className="w-full flex flex-col gap-1.5 text-left">
          <label className="text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-300">
            Announcement Body *
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Write full communication body here..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          {errors.description && <p className="text-xs text-rose-500 font-medium">{errors.description}</p>}
        </div>

        <label className="flex items-center gap-2 cursor-pointer select-none pt-1">
          <input
            type="checkbox"
            checked={formData.pinned}
            onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
            className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
          />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Pin to top of employee dashboard noticeboard
          </span>
        </label>
      </form>
    </Modal>
  );
};
export default AnnouncementModal;
