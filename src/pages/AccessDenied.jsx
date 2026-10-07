import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, LogOut, ArrowRightCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';

export const AccessDenied = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, currentUser, logout, switchRole } = useAuth();
  const { addToast } = useToast();

  const getDashboardRoute = () => {
    switch (role) {
      case 'admin': return '/admin/dashboard';
      case 'owner': return '/owner/dashboard';
      case 'hr': return '/hr/dashboard';
      case 'manager': return '/manager/dashboard';
      case 'employee': return '/employee/dashboard';
      default: return '/login';
    }
  };

  // Detect which role is needed for this path
  const currentPath = location.pathname;
  let targetRole = null;
  let targetRoleName = '';
  if (currentPath.startsWith('/employee')) {
    targetRole = 'employee';
    targetRoleName = 'Staff Employee (Elena Rostova)';
  } else if (currentPath.startsWith('/manager')) {
    targetRole = 'manager';
    targetRoleName = 'Team Manager (Marcus Sterling)';
  } else if (currentPath.startsWith('/hr')) {
    targetRole = 'hr';
    targetRoleName = 'HR Director (Sophia Montgomery)';
  } else if (currentPath.startsWith('/owner')) {
    targetRole = 'owner';
    targetRoleName = 'Company Owner (Saurabh Kumar)';
  } else if (currentPath.startsWith('/admin')) {
    targetRole = 'admin';
    targetRoleName = 'Super Admin';
  }

  const handleInstantSwitch = () => {
    if (targetRole) {
      const res = switchRole(targetRole);
      if (res.success) {
        addToast(`Switched account to ${res.user.name} (${targetRole.toUpperCase()})!`, 'success');
        navigate(currentPath, { replace: true });
      }
    }
  };

  const handleSwitchAccount = () => {
    logout();
    addToast('Logged out. Please select another persona to sign in.', 'info');
    navigate('/login');
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-lg w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl"
      >
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-5 shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Access Restricted
        </h1>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6 leading-relaxed">
          You are currently signed in as <span className="font-semibold text-slate-800 dark:text-slate-200">{currentUser?.name || 'User'}</span> (<span className="capitalize font-semibold text-indigo-600 dark:text-indigo-400">{role || 'Guest'}</span>). This module requires <span className="font-semibold text-slate-800 dark:text-slate-200">{targetRoleName || 'different permissions'}</span>.
        </p>

        {targetRole && targetRole !== role && (
          <div className="mb-6 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
              Quick Role Switch:
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
              Instantly activate the required account for this section without retyping passwords.
            </p>
            <Button
              variant="primary"
              icon={ArrowRightCircle}
              onClick={handleInstantSwitch}
              className="w-full justify-center"
            >
              Sign In as {targetRoleName}
            </Button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="outline"
            icon={ArrowLeft}
            onClick={() => navigate(getDashboardRoute())}
            className="w-full sm:w-auto"
          >
            My Dashboard
          </Button>
          <Button
            variant="secondary"
            icon={LogOut}
            onClick={handleSwitchAccount}
            className="w-full sm:w-auto text-rose-600 hover:text-rose-700 dark:text-rose-400"
          >
            Log Out / Switch Account
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
export default AccessDenied;
