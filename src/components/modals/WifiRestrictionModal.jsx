import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, ShieldAlert, CheckCircle2, ArrowRight, X, AlertTriangle, Building2, Ban } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import Button from '../Button';
import Badge from '../Badge';

export const WifiRestrictionModal = ({ isOpen, onClose, onConnectedAndCheckIn }) => {
  const { currentNetwork, companyWifis, switchNetwork, availableNetworks, getWifiNetworkInfo } = useERP();

  if (!isOpen) return null;

  // Find the primary/first company WiFi that has attendance enabled
  const allowedCompanyWifi = companyWifis.find(w => w.attendanceEnabled !== false) || { ssid: 'NEXORA-CORP-5G' };
  const currentCompanyInfo = getWifiNetworkInfo(currentNetwork?.ssid);
  const isCompanyNetworkDisabledByAdmin = Boolean(currentCompanyInfo && currentCompanyInfo.attendanceEnabled === false);

  const handleConnectToCompany = () => {
    // Switch network to the authorized attendance company WiFi
    const officeNet = availableNetworks.find(n => n.ssid === allowedCompanyWifi.ssid) || allowedCompanyWifi;
    switchNetwork(officeNet);
    if (onConnectedAndCheckIn) {
      setTimeout(() => {
        onConnectedAndCheckIn();
      }, 300);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Top Banner Accent */}
          <div className="h-2 bg-gradient-to-r from-amber-500 via-rose-500 to-red-600" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 md:p-8 space-y-6">
            {/* Header Icon & Title */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 shadow-inner">
                {isCompanyNetworkDisabledByAdmin ? <Ban className="w-7 h-7" /> : <WifiOff className="w-7 h-7" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    {isCompanyNetworkDisabledByAdmin ? 'Admin Policy Restricted' : 'Security Geofence Enforced'}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {isCompanyNetworkDisabledByAdmin
                    ? 'Attendance Disabled on This WiFi'
                    : 'Company WiFi Required'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {isCompanyNetworkDisabledByAdmin
                    ? `Admin has configured "${currentNetwork?.ssid}" as a non-attendance WiFi. You must connect to an approved office attendance WiFi.`
                    : 'Attendance can only be marked while physically present in the office and connected to an admin-approved company WiFi network.'}
                </p>
              </div>
            </div>

            {/* Diagnostic Box: Current vs Required */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700/60">
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Your Current Connection:
                </span>
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 font-mono bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-900">
                  {currentNetwork?.ssid || 'External Network'} ❌
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-2 font-medium">
                  Admin-Approved Attendance Networks:
                </span>
                <div className="space-y-2">
                  {companyWifis.map((wifi) => {
                    const isAllowed = wifi.attendanceEnabled !== false;
                    return (
                      <div
                        key={wifi.id}
                        className={`flex items-center justify-between p-2 rounded-xl border text-xs ${
                          isAllowed
                            ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                            : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200/60 dark:border-rose-900/40 opacity-75'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Building2 className={`w-4 h-4 ${isAllowed ? 'text-indigo-500' : 'text-slate-400'}`} />
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {wifi.ssid}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {wifi.location} · {wifi.ipRange}
                            </span>
                          </div>
                        </div>
                        <Badge variant={isAllowed ? 'success' : 'danger'} size="xs">
                          {isAllowed ? 'Attendance Allowed ✓' : 'Disabled by Admin ✕'}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Info Message */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200">
              <ShieldAlert className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Admin Policy Control:</strong> System administrators select exactly which office routers/SSIDs permit shift attendance to prevent proxy check-ins.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Button
                variant="primary"
                icon={Wifi}
                className="w-full sm:flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-lg shadow-indigo-600/20"
                onClick={handleConnectToCompany}
              >
                Connect to Approved WiFi ({allowedCompanyWifi.ssid})
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WifiRestrictionModal;
