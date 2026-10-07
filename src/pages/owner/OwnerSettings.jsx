import React, { useState } from 'react';
import { Settings, Shield, Bell, Moon, Sun, Globe, Lock, Save, CheckCircle2, Wifi, Building2, Plus, Trash2, ShieldAlert } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { useERP } from '../../context/ERPContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Badge from '../../components/Badge';

export const OwnerSettings = () => {
  const { theme, setTheme } = useTheme();
  const { addToast } = useToast();
  const {
    companyWifis,
    addCompanyWifi,
    deleteCompanyWifi,
    wifiEnforcementEnabled,
    toggleWifiEnforcement,
    toggleWifiAttendance
  } = useERP();

  const [activeTab, setActiveTab] = useState('appearance');
  const [newWifiSsid, setNewWifiSsid] = useState('');
  const [newWifiLocation, setNewWifiLocation] = useState('');
  const [newWifiIp, setNewWifiIp] = useState('192.168.1.0/24');
  const [newWifiAllowAttendance, setNewWifiAllowAttendance] = useState(true);

  // Stored state
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('nexora_company_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currency && parsed.currency.includes('USD')) {
          parsed.currency = 'INR (₹)';
        }
        return parsed;
      }
      return {
        companyName: 'NEXORA Technologies Inc.',
        companyEmail: 'admin@nexora.corp',
        currency: 'INR (₹)',
        timezone: 'Asia/Kolkata (IST)',
        mfaEnforced: true,
        sessionTimeout: '60 minutes',
        emailNotifications: true,
        desktopAlerts: true,
        weeklyDigest: true
      };
    } catch {
      return {
        companyName: 'NEXORA Technologies Inc.',
        companyEmail: 'admin@nexora.corp',
        currency: 'INR (₹)',
        timezone: 'Asia/Kolkata (IST)',
        mfaEnforced: true,
        sessionTimeout: '60 minutes',
        emailNotifications: true,
        desktopAlerts: true,
        weeklyDigest: true
      };
    }
  });

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('nexora_company_settings', JSON.stringify(settings));
    addToast('Company system settings saved successfully!', 'success');
  };

  const tabs = [
    { id: 'appearance', label: 'Appearance & Theme', icon: Sun },
    { id: 'wifi', label: 'Office WiFi & Attendance', icon: Wifi },
    { id: 'account', label: 'Company Organization', icon: Settings },
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'notifications', label: 'Alert Preferences', icon: Bell }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            System & Enterprise Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure global company policies, security posture, interface theme, and notifications
          </p>
        </div>

        <Button variant="primary" size="sm" icon={Save} onClick={handleSave}>
          Save Configurations
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-3xl">
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Interface Theme Mode</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Select your preferred visual style across the ERP workspace.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setTheme('light')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center gap-3 ${
                  theme === 'light'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
                  <Sun className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <span className="text-sm font-bold text-slate-900 dark:text-white block">Light Mode</span>
                  <span className="text-xs text-slate-400">Crisp high-contrast daylight theme</span>
                </div>
              </div>

              <div
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center gap-3 ${
                  theme === 'dark'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="p-3 rounded-xl bg-slate-800 text-indigo-400">
                  <Moon className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <span className="text-sm font-bold text-slate-900 dark:text-white block">Dark Mode</span>
                  <span className="text-xs text-slate-400">Deep navy low-light night theme</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'wifi' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Wifi className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Office WiFi Geofence & Attendance Rules
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ensure employees are physically present on office premises by requiring connection to authorized company WiFi routers to mark attendance.
              </p>
            </div>

            {/* Master Enforcement Toggle */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Enforce Office WiFi for Shift Check-In
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5 max-w-lg">
                  When enabled, employees attempting to clock in from Home WiFi, Mobile Hotspot, or Public Networks will be automatically blocked.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={wifiEnforcementEnabled}
                  onChange={(e) => toggleWifiEnforcement(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* List of Authorized Company WiFis */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Authorized Company WiFi Networks ({companyWifis.length})
                </h4>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> All Authorized for Clock-In
                </span>
              </div>

              <div className="space-y-2.5">
                {companyWifis.map((wifi) => {
                  const isAllowed = wifi.attendanceEnabled !== false;
                  return (
                    <div
                      key={wifi.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isAllowed
                          ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800'
                          : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200/70 dark:border-rose-900/40'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isAllowed
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                              : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          <Wifi className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                              {wifi.ssid}
                            </span>
                            {wifi.isPrimary && (
                              <Badge variant="purple" size="xs">Primary HQ</Badge>
                            )}
                            <Badge variant={isAllowed ? 'success' : 'danger'} size="xs">
                              {isAllowed ? 'Attendance Allowed ✓' : 'Attendance Blocked ✕'}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                            {wifi.location} · Subnet: {wifi.ipRange} · {wifi.security || 'WPA3 Enterprise'}
                          </p>
                        </div>
                      </div>

                      {/* Admin Toggle Controls */}
                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                        <div className="flex items-center gap-2 pr-3 border-r border-slate-200 dark:border-slate-700">
                          <span className={`text-xs font-semibold ${isAllowed ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                            {isAllowed ? 'Allowed' : 'Blocked'}
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isAllowed}
                              onChange={() => toggleWifiAttendance(wifi.id)}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                          </label>
                        </div>

                        <button
                          onClick={() => deleteCompanyWifi(wifi.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Remove company WiFi network"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add New WiFi Access Point Form */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-indigo-600" />
                Register Additional Company WiFi Network
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="WiFi SSID / Network Name"
                  placeholder="e.g. NEXORA-BRANCH-5G"
                  value={newWifiSsid}
                  onChange={(e) => setNewWifiSsid(e.target.value)}
                />
                <Input
                  label="Office Location / Floor"
                  placeholder="e.g. Chicago Branch - 3rd Floor"
                  value={newWifiLocation}
                  onChange={(e) => setNewWifiLocation(e.target.value)}
                />
                <Input
                  label="Allowed Subnet / IP Range"
                  placeholder="e.g. 192.168.15.0/24"
                  value={newWifiIp}
                  onChange={(e) => setNewWifiIp(e.target.value)}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={newWifiAllowAttendance}
                    onChange={(e) => setNewWifiAllowAttendance(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Allow shift attendance check-ins on this WiFi</span>
                </label>

                <Button
                  variant="primary"
                  size="sm"
                  icon={Plus}
                  onClick={() => {
                    if (!newWifiSsid.trim()) {
                      addToast('Please enter a WiFi SSID / Network Name.', 'warning');
                      return;
                    }
                    addCompanyWifi({
                      ssid: newWifiSsid,
                      location: newWifiLocation,
                      ipRange: newWifiIp,
                      attendanceEnabled: newWifiAllowAttendance
                    });
                    setNewWifiSsid('');
                    setNewWifiLocation('');
                    setNewWifiIp('192.168.1.0/24');
                    setNewWifiAllowAttendance(true);
                  }}
                >
                  Authorize WiFi
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Organization Profile</h3>
            <Input
              label="Company Name"
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
            />
            <Input
              label="Primary Executive Email"
              value={settings.companyEmail}
              onChange={(e) => setSettings({ ...settings, companyEmail: e.target.value })}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Operating Currency"
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                options={[
                  { value: 'INR (₹)', label: 'INR - Indian Rupee (₹)' },
                  { value: 'USD ($)', label: 'USD - United States Dollar ($)' },
                  { value: 'EUR (€)', label: 'EUR - Euro (€)' },
                  { value: 'GBP (£)', label: 'GBP - British Pound (£)' }
                ]}
              />
              <Select
                label="Standard Timezone"
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                options={[
                  { value: 'Asia/Kolkata (IST)', label: 'India Standard Time (IST - Asia/Kolkata)' },
                  { value: 'America/Los_Angeles (PST)', label: 'Pacific Time (US/Los Angeles)' },
                  { value: 'America/New_York (EST)', label: 'Eastern Time (US/New York)' },
                  { value: 'Europe/London (GMT)', label: 'London Time (Europe/London)' }
                ]}
              />
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Security & Clearance Policy</h3>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">Enforce Multi-Factor Authentication (MFA)</span>
                <span className="text-xs text-slate-500">Require all manager and employee roles to verify authenticator tokens.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.mfaEnforced}
                onChange={(e) => setSettings({ ...settings, mfaEnforced: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </div>

            <Select
              label="Session Inactivity Timeout"
              value={settings.sessionTimeout}
              onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
              options={[
                { value: '30 minutes', label: '30 minutes' },
                { value: '60 minutes', label: '60 minutes (Standard)' },
                { value: '4 hours', label: '4 hours' }
              ]}
            />
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Dispatch Notification Rules</h3>
            <div className="space-y-3">
              {[
                { key: 'emailNotifications', label: 'Email Alerts on Leave Applications', desc: 'Notify executives whenever a team member requests PTO' },
                { key: 'desktopAlerts', label: 'Real-time System Desktop Toasts', desc: 'Instant UI toast popups on system mutations' },
                { key: 'weeklyDigest', label: 'Weekly Executive Financial Digest', desc: 'Receive consolidated P&L and payroll summaries every Friday' }
              ].map(item => (
                <div key={item.key} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block">{item.label}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings[item.key]}
                    onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <Button variant="primary" icon={Save} onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
export default OwnerSettings;
