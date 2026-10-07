import React, { useState } from 'react';
import { Sun, Moon, Bell, Shield, Save } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/Button';
import Input from '../../components/Input';

export const EmployeeSettings = () => {
  const { theme, setTheme } = useTheme();
  const { addToast } = useToast();

  const [notifications, setNotifications] = useState({
    taskAssigned: true,
    leaveApproved: true,
    announcements: true,
    payrollAlerts: true
  });

  const handleSave = () => {
    addToast('Preferences saved to local device.', 'success');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Preferences & Workspace Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your theme interface, desktop notifications, and alert frequency
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        {/* Theme */}
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Interface Theme Mode</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Choose light or dark workspace appearance</p>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div
              onClick={() => setTheme('light')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 ${
                theme === 'light' ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-md' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <Sun className="w-6 h-6 text-amber-500" />
              <span className="text-sm font-bold text-slate-900 dark:text-white">Light Mode</span>
            </div>

            <div
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 ${
                theme === 'dark' ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-md' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <Moon className="w-6 h-6 text-indigo-400" />
              <span className="text-sm font-bold text-slate-900 dark:text-white">Dark Mode</span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Notification Inboxes</h3>
          {[
            { key: 'taskAssigned', label: 'New Task Assignment Alerts' },
            { key: 'leaveApproved', label: 'Leave Request Status Changes' },
            { key: 'announcements', label: 'Company Townhall & Notice Broadcasts' },
            { key: 'payrollAlerts', label: 'Monthly Payslip Remittance Notifications' }
          ].map(item => (
            <div key={item.key} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">{item.label}</span>
              <input
                type="checkbox"
                checked={notifications[item.key]}
                onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600"
              />
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <Button variant="primary" icon={Save} onClick={handleSave}>
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};
export default EmployeeSettings;
