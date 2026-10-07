import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, IndianRupee, User, FolderKanban, CheckCircle2, Eye } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import ProjectModal from '../../components/modals/ProjectModal';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';

export const OwnerProjects = () => {
  const { projects, deleteProjects, deleteProject, tasks, employees } = useERP();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [projectToView, setProjectToView] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredProjects = projects.filter(p => statusFilter === 'All' || p.status === statusFilter);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return <Badge variant="success" size="sm" dot>Completed</Badge>;
      case 'In Progress': return <Badge variant="info" size="sm" dot>In Progress</Badge>;
      case 'Planning': return <Badge variant="purple" size="sm" dot>Planning</Badge>;
      case 'On Hold': return <Badge variant="warning" size="sm" dot>On Hold</Badge>;
      default: return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Enterprise Project Portfolio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track technological deliverables, capital budgets, deadlines, and milestone completion
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Planning">Planning</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
          </select>

          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => {
              setProjectToEdit(null);
              setIsAddModalOpen(true);
            }}
          >
            Create Project
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((prj) => {
          const projectTasks = tasks.filter(t => t.projectId === prj.id || t.project === prj.name);
          const completedTasksCount = projectTasks.filter(t => t.status === 'Completed').length;

          return (
            <div
              key={prj.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    <FolderKanban className="w-5 h-5" />
                  </div>
                  {getStatusBadge(prj.status)}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3 line-clamp-1">
                  {prj.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {prj.description}
                </p>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between items-center text-xs font-semibold mb-1">
                    <span className="text-slate-600 dark:text-slate-400">Progress</span>
                    <span className="text-indigo-600 dark:text-indigo-400">{prj.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${prj.progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Lead
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">{prj.manager}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                      Budget
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">₹{prj.budget?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Deadline
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{prj.deadline}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Eye}
                  onClick={() => setProjectToView(prj)}
                >
                  Dossier
                </Button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setProjectToEdit(prj);
                      setIsAddModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setProjectToDelete(prj)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      <ProjectModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setProjectToEdit(null);
        }}
        projectToEdit={projectToEdit}
      />

      {/* Project Details Dossier Modal */}
      <Modal
        isOpen={Boolean(projectToView)}
        onClose={() => setProjectToView(null)}
        title={projectToView ? projectToView.name : 'Project'}
        subtitle={`Initiative Overview · ${projectToView?.category || 'General'}`}
        maxWidth="max-w-2xl"
        footer={
          <Button variant="secondary" onClick={() => setProjectToView(null)}>
            Close
          </Button>
        }
      >
        {projectToView && (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Description</span>
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{projectToView.description}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Director</span>
                <span className="font-bold text-slate-900 dark:text-white">{projectToView.manager}</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Capital Budget</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">₹{projectToView.budget?.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Target Launch</span>
                <span className="font-bold text-slate-900 dark:text-white">{projectToView.deadline}</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Sprint Progress</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{projectToView.progress}%</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Connected Tasks</span>
              <div className="space-y-1.5">
                {tasks.filter(t => t.projectId === projectToView.id || t.project === projectToView.name).map(t => (
                  <div key={t.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{t.title}</span>
                    <Badge variant={t.status === 'Completed' ? 'success' : 'info'} size="sm">{t.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(projectToDelete)}
        onClose={() => setProjectToDelete(null)}
        title="Delete Project"
        message={`Are you sure you want to remove project "${projectToDelete?.name}"? All progress tracking metrics will be wiped.`}
        confirmText="Delete Project"
        onConfirm={() => {
          if (projectToDelete) {
            deleteProject(projectToDelete.id);
            setProjectToDelete(null);
          }
        }}
      />
    </div>
  );
};
export default OwnerProjects;
