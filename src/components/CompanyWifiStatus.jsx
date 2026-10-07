import React, { useState } from 'react';
import {
  Wifi,
  WifiOff,
  ShieldCheck,
  ShieldAlert,
  Building2,
  Signal,
  CheckCircle2,
  RefreshCw,
  Radio,
  ChevronDown,
  Globe,
  Ban
} from 'lucide-react';
import { useERP } from '../context/ERPContext';
import Badge from './Badge';
import Button from './Button';

export const CompanyWifiStatus = ({ compact = false, className = '' }) => {
  const {
    currentNetwork,
    companyWifis,
    isCurrentWifiAuthorized,
    switchNetwork,
    availableNetworks,
    wifiEnforcementEnabled,
    getWifiNetworkInfo
  } = useERP();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isAuthorized = isCurrentWifiAuthorized();
  const currentCompanyInfo = getWifiNetworkInfo(currentNetwork?.ssid);
  const isCompanyNetwork = Boolean(currentCompanyInfo);
  const isDisabledByAdmin = isCompanyNetwork && currentCompanyInfo?.attendanceEnabled === false;

  const handleSelectNetwork = (net) => {
    switchNetwork(net);
    setIsDropdownOpen(false);
  };

  const handleConnectToOffice = () => {
    const approvedNet = availableNetworks.find(n => {
      const info = companyWifis.find(w => w.ssid === n.ssid);
      return info && info.attendanceEnabled !== false;
    }) || companyWifis[0];
    switchNetwork(approvedNet);
  };

  const getNetworkStatusBadge = (net) => {
    const info = companyWifis.find(w => w.ssid.toLowerCase() === net.ssid.toLowerCase());
    if (info) {
      if (info.attendanceEnabled !== false) {
        return <Badge variant="success" size="xs">Allowed ✓</Badge>;
      } else {
        return <Badge variant="danger" size="xs">Disabled by Admin ✕</Badge>;
      }
    }
    return <Badge variant="neutral" size="xs">External ❌</Badge>;
  };

  if (compact) {
    return (
      <div className={`relative inline-flex items-center gap-2 ${className}`}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            isAuthorized
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
              : isDisabledByAdmin
              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/40'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/40'
          }`}
          title="Click to switch simulated WiFi network"
        >
          {isAuthorized ? (
            <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          ) : isDisabledByAdmin ? (
            <Ban className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          )}
          <span className="font-mono truncate max-w-[140px]">{currentNetwork?.ssid || 'No WiFi'}</span>
          <span className={`w-2 h-2 rounded-full ${isAuthorized ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 space-y-1">
            <div className="p-2 border-b border-slate-100 dark:border-slate-800">
              <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Select WiFi Connection
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Admin controls which WiFi allows attendance check-ins
              </p>
            </div>
            {availableNetworks.map((net) => (
              <button
                key={net.ssid}
                onClick={() => handleSelectNetwork(net)}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                  currentNetwork?.ssid === net.ssid
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 font-bold text-indigo-600 dark:text-indigo-400'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  {net.isCompanyWifi ? (
                    <Building2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                  <span className="truncate">{net.ssid}</span>
                </div>
                {getNetworkStatusBadge(net)}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative p-5 rounded-3xl border transition-all overflow-hidden ${
        isAuthorized
          ? 'bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900 border-emerald-200 dark:border-emerald-800/60 shadow-sm'
          : isDisabledByAdmin
          ? 'bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40 dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 border-amber-200 dark:border-amber-800/60 shadow-sm'
          : 'bg-gradient-to-br from-rose-50/80 via-white to-amber-50/40 dark:from-rose-950/20 dark:via-slate-900 dark:to-slate-900 border-rose-200 dark:border-rose-800/60 shadow-sm'
      } ${className}`}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: WiFi Indicator & Status */}
        <div className="flex items-start sm:items-center gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
              isAuthorized
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                : isDisabledByAdmin
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
            }`}
          >
            {isAuthorized ? <Wifi className="w-6 h-6" /> : isDisabledByAdmin ? <Ban className="w-6 h-6" /> : <WifiOff className="w-6 h-6" />}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                WiFi Network: <span className="font-mono font-extrabold text-indigo-600 dark:text-indigo-400">{currentNetwork?.ssid}</span>
              </span>
              <Badge variant={isAuthorized ? 'success' : isDisabledByAdmin ? 'warning' : 'danger'} size="sm" dot>
                {isAuthorized ? 'Office WiFi Authorized' : isDisabledByAdmin ? 'Disabled by Admin' : 'Unauthorized External Network'}
              </Badge>
              {wifiEnforcementEnabled && (
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                  Admin Policy Active
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isAuthorized ? (
                <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Connected to authorized office WiFi ({currentNetwork?.location || 'HQ Office'}). Shift check-in is unlocked.
                </span>
              ) : isDisabledByAdmin ? (
                <span className="text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1">
                  <Ban className="w-3.5 h-3.5" />
                  This is a company network, but Admin has disabled attendance check-ins on this WiFi ({currentNetwork?.location}).
                </span>
              ) : (
                <span className="text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Outside company premises. You cannot check in until connected to an admin-approved company WiFi.
                </span>
              )}
            </p>

            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1.5 font-mono">
              <span>IP: {currentNetwork?.ip || '192.168.1.142'}</span>
              <span>•</span>
              <span>BSSID: {currentNetwork?.bssid || '74:83:C2:11:A9:01'}</span>
              <span>•</span>
              <span>Security: {currentNetwork?.security || 'WPA3 Enterprise'}</span>
            </div>
          </div>
        </div>

        {/* Right: Switcher / Quick Action */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {!isAuthorized && (
            <Button
              variant="primary"
              size="sm"
              icon={Wifi}
              onClick={handleConnectToOffice}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Connect to Approved WiFi
            </Button>
          )}

          {/* Network Switcher Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              icon={Radio}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              Switch Network <ChevronDown className="w-3.5 h-3.5 ml-1" />
            </Button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 space-y-1.5">
                <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Simulate Device Network
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    Admin selects which WiFi can mark attendance and which cannot:
                  </p>
                </div>

                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {availableNetworks.map((net) => {
                    const isCurrent = currentNetwork?.ssid === net.ssid;
                    return (
                      <button
                        key={net.ssid}
                        onClick={() => handleSelectNetwork(net)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all ${
                          isCurrent
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <div className={`p-1.5 rounded-lg ${net.isCompanyWifi ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                            {net.isCompanyWifi ? <Building2 className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold block truncate">
                              {net.ssid}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate">
                              {net.location}
                            </span>
                          </div>
                        </div>

                        {getNetworkStatusBadge(net)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyWifiStatus;
