import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
  Users2,
  BarChart4,
  User,
  Shield,
  Layers,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DEMO_CREDENTIALS } from '../data/users';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';

export const Login = () => {
  const { currentUser, role, login, logout, switchRole } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState('employee');
  const [email, setEmail] = useState('employee@company.com');
  const [password, setPassword] = useState('employee123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Role card data
  const roles = [
    {
      id: 'employee',
      title: 'Staff Employee',
      desc: 'Daily tasks, attendance & personal portal',
      icon: User,
      badge: 'Self-Service',
      color: 'from-violet-500 to-purple-600',
      border: 'border-violet-500/40',
      activeBg: 'bg-violet-500/10'
    },
    {
      id: 'owner',
      title: 'Company Owner',
      desc: 'Full company control & executive intelligence',
      icon: Crown,
      badge: 'Executive',
      color: 'from-amber-500 to-orange-600',
      border: 'border-amber-500/40',
      activeBg: 'bg-amber-500/10'
    },
    {
      id: 'manager',
      title: 'Team Manager',
      desc: 'Team delegation, tasks & project delivery',
      icon: BarChart4,
      badge: 'Management',
      color: 'from-blue-500 to-indigo-600',
      border: 'border-blue-500/40',
      activeBg: 'bg-blue-500/10'
    },
    {
      id: 'hr',
      title: 'HR Director',
      desc: 'Workforce recruitment, payroll & leaves',
      icon: Users2,
      badge: 'People Ops',
      color: 'from-emerald-500 to-teal-600',
      border: 'border-emerald-500/40',
      activeBg: 'bg-emerald-500/10'
    },
    {
      id: 'admin',
      title: 'Super Admin',
      desc: 'Master system controls across all operations & teams',
      icon: Shield,
      badge: 'Superuser',
      color: 'from-rose-500 to-red-600',
      border: 'border-rose-500/40',
      activeBg: 'bg-rose-500/10'
    }
  ];

  const handleSelectRole = (roleId) => {
    setSelectedRole(roleId);
    setFormError('');
    const demo = DEMO_CREDENTIALS.find(d => d.role === roleId);
    if (demo) {
      setEmail(demo.email);
      setPassword(demo.pass);
    }
  };

  const handleQuickLogin = (roleId) => {
    const res = switchRole(roleId);
    if (res.success) {
      addToast(`Signed in as ${res.user.name} (${roleId.toUpperCase()})!`, 'success');
      navigate(`/${roleId}/dashboard`, { replace: true });
    } else {
      addToast('Login failed', 'error');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = login(email, password, selectedRole);
    setIsSubmitting(false);

    if (result.success) {
      addToast(`Welcome back, ${result.user.name}! Accessing ${result.user.role.toUpperCase()} Workspace.`, 'success');
      navigate(`/${result.user.role}/dashboard`);
    } else {
      setFormError(result.message || 'Authentication failed. Please verify credentials.');
      addToast('Invalid credentials provided.', 'error');
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      addToast('Please enter your company email address.', 'warning');
      return;
    }
    setIsForgotModalOpen(false);
    addToast(`Password recovery link dispatched to ${forgotEmail}.`, 'info');
    setForgotEmail('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row text-slate-900 dark:text-slate-100 relative overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-violet-500/10 dark:bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Left Side: Brand Narrative & Enterprise Capabilities */}
      <div className="lg:w-5/12 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

        {/* Top Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight tracking-wider">NEXORA</span>
              <span className="block text-[11px] font-semibold text-indigo-400 tracking-widest uppercase">
                Enterprise Cloud
              </span>
            </div>
          </div>
        </div>

        {/* Center Tagline & Feature Highlights */}
        <div className="relative z-10 my-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Next-Gen Operating System
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            One Platform.<br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-white bg-clip-text text-transparent">
              Every Operation.
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-300/90 leading-relaxed max-w-md">
            Unify human capital, engineering task pipelines, multi-currency payroll, and company governance in a single reactive workspace.
          </p>

          <div className="mt-8 space-y-3">
            {[
              'Autonomous role-based permissions & secure audit logging',
              'Integrated check-in attendance & real-time work hours tracking',
              'Comprehensive project sprint delivery & payroll disbarment'
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Security Seal */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>SOC2 Type II Certified & End-to-End Encrypted</span>
          </div>
          <span>v2.8.4</span>
        </div>
      </div>

      {/* Right Side: Role Selector & Login Form */}
      <div className="lg:w-7/12 p-6 sm:p-10 lg:p-16 flex flex-col justify-center items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl"
        >
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Enterprise Sign In
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select your persona below to automatically load verified demo credentials.
            </p>
          </div>

          {/* Active Session Notice if already logged in */}
          {currentUser && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs">
              <div className="text-amber-800 dark:text-amber-200">
                <span className="font-bold">Active Session:</span> Signed in as <span className="font-bold">{currentUser.name}</span> (<span className="capitalize font-bold text-amber-600 dark:text-amber-400">{role}</span>).
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  addToast('Session cleared. Choose an account to sign in.', 'info');
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 transition-colors shrink-0 shadow-sm"
              >
                Log Out
              </button>
            </div>
          )}

          {/* Role Cards Grid (Section 4 requirement) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {roles.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.id;
              return (
                <motion.div
                  key={r.id}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => handleSelectRole(r.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? `border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 shadow-md ring-2 ring-indigo-500/20`
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${r.color} text-white shadow-sm`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {r.badge}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-3">
                      {r.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {r.desc}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-slate-400">
                      {isSelected ? 'Selected' : 'Select'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickLogin(r.id);
                      }}
                      className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline flex items-center gap-1"
                      title={`Instant login as ${r.title}`}
                    >
                      Instant Login →
                    </button>
                  </div>

                  {isSelected && (
                    <motion.div
                      layoutId="activeRoleIndicator"
                      className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                {formError}
              </div>
            )}

            <Input
              label="Company Email"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. name@company.com"
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 pl-10 pr-10 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400">Remember session</span>
              </label>

              <span className="text-[11px] text-slate-400">Role: <span className="font-semibold capitalize text-slate-600 dark:text-slate-300">{selectedRole}</span></span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              icon={ArrowRight}
              iconPosition="right"
              className="w-full mt-2"
            >
              Sign In to {roles.find(r => r.id === selectedRole)?.title}
            </Button>
          </form>

          {/* Quick Clickable Demo Accounts Footer (Section 44 requirement) */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              ⚡ Instant 1-Click Demo Logins:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {DEMO_CREDENTIALS.map((demo) => (
                <button
                  key={demo.role}
                  type="button"
                  onClick={() => handleQuickLogin(demo.role)}
                  className={`px-2.5 py-2 text-left rounded-xl text-xs transition-all border group shadow-2xs hover:scale-[1.02] ${
                    selectedRole === demo.role
                      ? 'bg-indigo-600 text-white border-indigo-600 font-semibold shadow-indigo-500/20 shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold truncate">{demo.title.split(' ')[0]}</span>
                    <span className="text-[9px] opacity-70 group-hover:opacity-100">↵</span>
                  </div>
                  <div className="text-[10px] opacity-75 truncate">{demo.email}</div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title="Reset Account Password"
        subtitle="Enter your verified work email address to receive reset instructions"
        maxWidth="max-w-md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsForgotModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleForgotPassword}>
              Send Recovery Link
            </Button>
          </>
        }
      >
        <div className="py-2 space-y-4">
          <Input
            label="Work Email Address"
            type="email"
            icon={Mail}
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            placeholder="e.g. employee@company.com"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            A temporary password recovery token will be simulated and sent to your address.
          </p>
        </div>
      </Modal>
    </div>
  );
};
export default Login;
