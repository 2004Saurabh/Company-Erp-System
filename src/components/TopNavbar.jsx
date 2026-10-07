import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, Sun, Moon, User, Settings, HelpCircle, LogOut, ChevronDown, Shield, Crown, Users2, BarChart4, UserCheck, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import NotificationPanel from './NotificationPanel';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const TopNavbar = ({ onOpenMobileSidebar, onOpenSearch }) => {
  const { currentUser, role, logout, switchRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Current real-time Clock
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully.', 'info');
    navigate('/login');
  };

  const handleRoleSwitch = (targetRole) => {
    setIsProfileOpen(false);
    const res = switchRole(targetRole);
    if (res.success) {
      addToast(`Switched account to ${res.user.name} (${targetRole.toUpperCase()})`, 'success');
      navigate(`/${targetRole}/dashboard`);
    }
  };

  const formattedDate = currentDateTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedTime = currentDateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const allRoles = [
    { id: 'admin', label: 'Super Admin', icon: Shield, color: 'text-rose-500' },
    { id: 'owner', label: 'Company Owner', icon: Crown, color: 'text-amber-500' },
    { id: 'hr', label: 'HR Director', icon: Users2, color: 'text-emerald-500' },
    { id: 'manager', label: 'Team Manager', icon: BarChart4, color: 'text-blue-500' },
    { id: 'employee', label: 'Staff Employee', icon: UserCheck, color: 'text-violet-500' },
  ];

  return (
    <header className="h-16 px-4 sm:px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-20 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu & Global Search Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-750 text-xs sm:text-sm w-44 sm:w-64 md:w-80 transition-all border border-transparent hover:border-slate-300 dark:hover:border-slate-700"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="truncate">Search system...</span>
          <kbd className="hidden sm:inline-block ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Current Active Persona Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="capitalize">{role || 'User'}</span> Workspace
        </div>

        {/* 1-Click Instant Persona Switch Button */}
        {role !== 'employee' && (
          <button
            onClick={() => handleRoleSwitch('employee')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-sm hover:scale-105 active:scale-95"
            title="Instant switch to Staff Employee portal"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Switch to</span> Staff Portal (1-Click)
          </button>
        )}

        {role === 'employee' && (
          <button
            onClick={() => handleRoleSwitch('owner')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-sm hover:scale-105 active:scale-95"
            title="Instant switch to Owner portal"
          >
            <Crown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Switch to</span> Owner Portal (1-Click)
          </button>
        )}

        {/* Date / Time Display */}
        <div className="hidden md:flex flex-col text-right pr-2 border-r border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {formattedDate}
          </span>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            {formattedTime}
          </span>
        </div>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
        </button>

        {/* Notification Panel */}
        <NotificationPanel />

        {/* User Profile Menu */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
          >
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser?.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
            />
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-1.5 overflow-hidden"
              >
                <div className="p-2.5 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {currentUser?.name || 'Enterprise User'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {currentUser?.email}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 capitalize">
                    {role}
                  </span>
                </div>

                {/* Quick Role Switcher within Profile Menu */}
                <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 rounded-xl my-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1 px-1">
                    ⚡ Quick Switch Persona:
                  </span>
                  <div className="space-y-0.5">
                    {allRoles.map((r) => {
                      const Icon = r.icon;
                      const isActive = role === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => handleRoleSwitch(r.id)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            isActive
                              ? 'bg-indigo-600 text-white font-bold'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : r.color}`} />
                            <span className="truncate">{r.label}</span>
                          </div>
                          {isActive && <Check className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate(`/${role}/profile`);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    View Profile
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate(`/${role}/settings`);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    Account Settings
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      addToast('Enterprise Helpdesk: Support portal online. SLA Response time < 15 mins.', 'info');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 text-slate-400" />
                    Help & Support
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
export default TopNavbar;
