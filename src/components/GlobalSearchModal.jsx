import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, CheckSquare, FolderKanban, Building2, Bell, X, ArrowRight } from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { employees, tasks, projects, departments, announcements } = useERP();
  const { role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  // Search results
  const matchedEmployees = q ? employees.filter(e =>
    e.fullName.toLowerCase().includes(q) ||
    e.email.toLowerCase().includes(q) ||
    e.designation.toLowerCase().includes(q) ||
    e.department.toLowerCase().includes(q)
  ).slice(0, 4) : [];

  const matchedTasks = q ? tasks.filter(t =>
    t.title.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.assignedTo.toLowerCase().includes(q)
  ).slice(0, 4) : [];

  const matchedProjects = q ? projects.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  ).slice(0, 4) : [];

  const matchedDepartments = q ? departments.filter(d =>
    d.name.toLowerCase().includes(q) ||
    d.head.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const matchedAnnouncements = q ? announcements.filter(a =>
    a.title.toLowerCase().includes(q) ||
    a.description.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const totalMatches = matchedEmployees.length + matchedTasks.length + matchedProjects.length + matchedDepartments.length + matchedAnnouncements.length;

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9990] flex items-start justify-center pt-20 px-4 sm:px-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10"
        >
          {/* Search Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <Search className="w-5 h-5 text-indigo-500 flex-shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search employees, tasks, projects, departments, announcements..."
              className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
              ESC
            </kbd>
          </div>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5">
            {!q ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Type something to search instantly across the entire enterprise system...
              </div>
            ) : totalMatches === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No matching results found for "{query}".
              </div>
            ) : (
              <>
                {matchedEmployees.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1.5">
                      Employees
                    </span>
                    <div className="space-y-1">
                      {matchedEmployees.map(emp => (
                        <div
                          key={emp.id}
                          onClick={() => handleSelect(`/${role}/employees`)}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                              <User className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-white">{emp.fullName}</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">{emp.designation} · {emp.department}</p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {matchedProjects.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1.5">
                      Projects
                    </span>
                    <div className="space-y-1">
                      {matchedProjects.map(prj => (
                        <div
                          key={prj.id}
                          onClick={() => handleSelect(`/${role}/projects`)}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                              <FolderKanban className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-white">{prj.name}</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">{prj.category} · {prj.progress}% Completed</p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {matchedTasks.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1.5">
                      Tasks
                    </span>
                    <div className="space-y-1">
                      {matchedTasks.map(tsk => (
                        <div
                          key={tsk.id}
                          onClick={() => handleSelect(`/${role}/tasks`)}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                              <CheckSquare className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-white">{tsk.title}</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">Assigned: {tsk.assignedTo} · Status: {tsk.status}</p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {matchedDepartments.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1.5">
                      Departments
                    </span>
                    <div className="space-y-1">
                      {matchedDepartments.map(dept => (
                        <div
                          key={dept.id}
                          onClick={() => handleSelect(`/${role}/departments`)}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-white">{dept.name}</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">Head: {dept.head} · Budget: ₹{dept.budget.toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {matchedAnnouncements.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1.5">
                      Announcements
                    </span>
                    <div className="space-y-1">
                      {matchedAnnouncements.map(anc => (
                        <div
                          key={anc.id}
                          onClick={() => handleSelect(`/${role}/announcements`)}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
                              <Bell className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-white">{anc.title}</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">By {anc.author} · {anc.date}</p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default GlobalSearchModal;
