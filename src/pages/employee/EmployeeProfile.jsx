import React, { useState } from 'react';
import { User, Mail, Phone, Building, Briefcase, Calendar, Save, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Avatar from '../../components/Avatar';
import Badge from '../../components/Badge';

export const EmployeeProfile = () => {
  const { currentUser, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Elena Rostova',
    email: currentUser?.email || 'employee@company.com',
    phone: currentUser?.phone || '+1 (555) 567-8901',
    title: currentUser?.title || 'Senior Frontend Engineer',
    department: currentUser?.department || 'Engineering',
    location: currentUser?.location || 'Remote, Seattle, WA',
    avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    emergencyContact: currentUser?.emergencyContact || '+1 (555) 666-4455'
  });

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    addToast('Profile details updated successfully!', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          My Employee Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review your employee record dossier and update your active contact channels
        </p>
      </div>

      {/* Header Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <Avatar src={formData.avatar} name={formData.name} size="xl" status="online" />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{formData.name}</h2>
            <Badge variant="info" size="sm">Staff Engineer</Badge>
          </div>
          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">{formData.title}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{formData.department} · {formData.location}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Legal Name"
            icon={User}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Work Email Address"
            type="email"
            icon={Mail}
            value={formData.email}
            disabled
            helperText="Managed by corporate directory (IT Operations)"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Primary Contact Phone"
            icon={Phone}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <Input
            label="Emergency Contact Number"
            icon={Phone}
            value={formData.emergencyContact}
            onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Designation (Read-only)"
            icon={Briefcase}
            value={formData.title}
            disabled
          />
          <Input
            label="Department"
            icon={Building}
            value={formData.department}
            disabled
          />
        </div>

        <Input
          label="Profile Picture URL"
          value={formData.avatar}
          onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
          placeholder="https://..."
        />

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <Button type="submit" variant="primary" icon={Save}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
export default EmployeeProfile;
