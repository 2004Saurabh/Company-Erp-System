import React, { useState } from 'react';
import { Plus, UserPlus, Briefcase, Star, MoveRight, ChevronRight, Eye, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Select from '../../components/Select';
import { useToast } from '../../context/ToastContext';

export const HRRecruitment = () => {
  const { jobOpenings, candidates, moveCandidateStage, addCandidate, addJobOpening } = useERP();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('kanban'); // 'kanban' | 'jobs'
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isAddCandModalOpen, setIsAddCandModalOpen] = useState(false);
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);

  // New Candidate Form State
  const [candForm, setCandForm] = useState({
    name: '',
    email: '',
    phone: '',
    jobId: jobOpenings[0]?.id || 'JOB-401',
    experience: '4 years',
    currentCompany: '',
    notes: ''
  });

  // New Job Form State
  const [jobForm, setJobForm] = useState({
    title: '',
    department: 'Engineering',
    location: 'Remote (US)',
    type: 'Full-Time',
    experience: '3+ years',
    salaryRange: '₹12L - ₹15L'
  });

  const stages = ['Applied', 'Screening', 'Interview', 'Selected', 'Hired', 'Rejected'];

  const handleCreateCandidate = (e) => {
    e.preventDefault();
    if (!candForm.name || !candForm.email) {
      addToast('Name and email required.', 'warning');
      return;
    }
    const job = jobOpenings.find(j => j.id === candForm.jobId);
    addCandidate({
      ...candForm,
      position: job?.title || 'Engineer'
    });
    setIsAddCandModalOpen(false);
    setCandForm({
      name: '',
      email: '',
      phone: '',
      jobId: jobOpenings[0]?.id || 'JOB-401',
      experience: '4 years',
      currentCompany: '',
      notes: ''
    });
  };

  const handleCreateJob = (e) => {
    e.preventDefault();
    if (!jobForm.title) {
      addToast('Job title required.', 'warning');
      return;
    }
    addJobOpening(jobForm);
    setIsAddJobModalOpen(false);
    setJobForm({
      title: '',
      department: 'Engineering',
      location: 'Remote (US)',
      type: 'Full-Time',
      experience: '3+ years',
      salaryRange: '₹12L - ₹15L'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Talent Acquisition & Recruitment Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage requisition postings, candidate pipelines, interview rounds, and offers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Plus}
            onClick={() => setIsAddJobModalOpen(true)}
          >
            Create Job Opening
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={UserPlus}
            onClick={() => setIsAddCandModalOpen(true)}
          >
            Add Candidate
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('kanban')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'kanban'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Hiring Pipeline Kanban ({candidates.length})
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'jobs'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Active Job Requisitions ({jobOpenings.length})
        </button>
      </div>

      {/* Kanban Board View */}
      {activeTab === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-3.5 items-start">
          {stages.map((stage) => {
            const stageCandidates = candidates.filter(c => c.stage === stage);

            const stageBorder =
              stage === 'Hired' ? 'border-emerald-500/40' :
              stage === 'Rejected' ? 'border-rose-500/40' :
              stage === 'Selected' ? 'border-purple-500/40' :
              'border-slate-200 dark:border-slate-800';

            return (
              <div
                key={stage}
                className={`p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border ${stageBorder} flex flex-col min-h-[500px]`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {stage}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {stageCandidates.length}
                  </span>
                </div>

                {/* Candidate Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {stageCandidates.map((cand) => (
                    <div
                      key={cand.id}
                      onClick={() => setSelectedCandidate(cand)}
                      className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-md cursor-pointer transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                          {cand.name}
                        </span>
                        <div className="flex items-center text-[11px] text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                          {cand.rating}
                        </div>
                      </div>

                      <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium line-clamp-1">
                        {cand.position}
                      </p>

                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {cand.experience} · Prev: {cand.currentCompany || 'N/A'}
                      </p>

                      {/* Quick Move Stage Select */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                        <span className="text-[10px] text-slate-400">Move:</span>
                        <select
                          value={cand.stage}
                          onChange={(e) => moveCandidateStage(cand.id, e.target.value)}
                          className="text-[10px] py-0.5 px-1.5 rounded-md border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none"
                        >
                          {stages.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  {stageCandidates.length === 0 && (
                    <div className="py-8 text-center text-[11px] text-slate-400 italic">
                      Empty stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Requisitions List View */}
      {activeTab === 'jobs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobOpenings.map(job => (
            <div
              key={job.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <Badge variant={job.status === 'Open' ? 'success' : 'neutral'} size="sm" dot>
                    {job.status}
                  </Badge>
                  <span className="text-xs font-mono text-slate-400">{job.id}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                  {job.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {job.department} · {job.location}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Experience:</span>
                    <span className="font-semibold">{job.experience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Salary Band:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{job.salaryRange}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active Applicants:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{job.applicantsCount} candidates</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCandForm(prev => ({ ...prev, jobId: job.id }));
                    setIsAddCandModalOpen(true);
                  }}
                >
                  + Add Applicant
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Candidate Dossier Modal */}
      <Modal
        isOpen={Boolean(selectedCandidate)}
        onClose={() => setSelectedCandidate(null)}
        title={selectedCandidate ? selectedCandidate.name : 'Candidate'}
        subtitle={`Applied for ${selectedCandidate?.position}`}
        maxWidth="max-w-lg"
        footer={
          <Button variant="secondary" onClick={() => setSelectedCandidate(null)}>
            Close
          </Button>
        }
      >
        {selectedCandidate && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block text-[11px]">Email</span>
                <span className="font-semibold text-slate-900 dark:text-white break-all">{selectedCandidate.email}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block text-[11px]">Phone</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedCandidate.phone}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block text-[11px]">Experience</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedCandidate.experience}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block text-[11px]">Previous Organization</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedCandidate.currentCompany}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-400 block text-[11px] mb-1">Recruiter Interview Notes</span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{selectedCandidate.notes || 'None logged.'}</p>
            </div>

            <div className="p-3 rounded-xl border border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20 flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-200">Current Pipeline Stage:</span>
              <Badge variant="purple" size="md">{selectedCandidate.stage}</Badge>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Candidate Modal */}
      <Modal
        isOpen={isAddCandModalOpen}
        onClose={() => setIsAddCandModalOpen(false)}
        title="Register Job Applicant"
        subtitle="Add candidate into the hiring pipeline"
        maxWidth="max-w-md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAddCandModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreateCandidate}>Save Candidate</Button>
          </>
        }
      >
        <form onSubmit={handleCreateCandidate} className="space-y-3">
          <Input
            label="Candidate Full Name *"
            value={candForm.name}
            onChange={(e) => setCandForm({ ...candForm, name: e.target.value })}
            placeholder="e.g. Maya Patel"
            required
          />
          <Input
            label="Email Address *"
            type="email"
            value={candForm.email}
            onChange={(e) => setCandForm({ ...candForm, email: e.target.value })}
            placeholder="maya.patel@outlook.com"
            required
          />
          <Input
            label="Phone Number"
            value={candForm.phone}
            onChange={(e) => setCandForm({ ...candForm, phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
          />
          <Select
            label="Requisition Applied For"
            value={candForm.jobId}
            onChange={(e) => setCandForm({ ...candForm, jobId: e.target.value })}
            options={jobOpenings.map(j => ({ value: j.id, label: `${j.title} (${j.id})` }))}
          />
          <Input
            label="Current / Previous Company"
            value={candForm.currentCompany}
            onChange={(e) => setCandForm({ ...candForm, currentCompany: e.target.value })}
            placeholder="e.g. Snowflake"
          />
        </form>
      </Modal>

      {/* Add Job Requisition Modal */}
      <Modal
        isOpen={isAddJobModalOpen}
        onClose={() => setIsAddJobModalOpen(false)}
        title="Open New Requisition"
        subtitle="Post vacancy to internal talent boards"
        maxWidth="max-w-md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAddJobModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreateJob}>Publish Job Opening</Button>
          </>
        }
      >
        <form onSubmit={handleCreateJob} className="space-y-3">
          <Input
            label="Job Title *"
            value={jobForm.title}
            onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
            placeholder="e.g. Principal Site Reliability Engineer"
            required
          />
          <Select
            label="Department"
            value={jobForm.department}
            onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
            options={[
              { value: 'Engineering', label: 'Engineering' },
              { value: 'Human Resources', label: 'Human Resources' },
              { value: 'Product & Design', label: 'Product & Design' },
              { value: 'Sales & Marketing', label: 'Sales & Marketing' }
            ]}
          />
          <Input
            label="Target Salary Range"
            value={jobForm.salaryRange}
            onChange={(e) => setJobForm({ ...jobForm, salaryRange: e.target.value })}
            placeholder="₹13L - ₹16L"
          />
          <Input
            label="Experience Required"
            value={jobForm.experience}
            onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
            placeholder="4+ years"
          />
        </form>
      </Modal>
    </div>
  );
};
export default HRRecruitment;
