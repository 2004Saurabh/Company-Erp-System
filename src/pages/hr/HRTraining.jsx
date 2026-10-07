import React, { useState } from 'react';
import { GraduationCap, Award, CheckCircle2, Clock, BookOpen, Plus } from 'lucide-react';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { useToast } from '../../context/ToastContext';

export const HRTraining = () => {
  const { addToast } = useToast();

  const [programs, setPrograms] = useState([
    {
      id: 'TRN-101',
      title: 'Enterprise SOC2 Type II Security Protocols',
      category: 'Compliance & Cyber',
      enrolled: 42,
      completed: 38,
      duration: '4 Hours',
      deadline: '2026-10-31',
      status: 'Mandatory'
    },
    {
      id: 'TRN-102',
      title: 'Next-Gen Microservices Architecture & Kubernetes',
      category: 'Technical Engineering',
      enrolled: 18,
      completed: 12,
      duration: '16 Hours',
      deadline: '2026-11-15',
      status: 'Elective'
    },
    {
      id: 'TRN-103',
      title: 'Inclusive Leadership & High-Performance Team Coaching',
      category: 'Leadership & People',
      enrolled: 8,
      completed: 7,
      duration: '8 Hours',
      deadline: '2026-10-25',
      status: 'Leadership'
    },
    {
      id: 'TRN-104',
      title: 'Generative AI Tools & Prompt Engineering in Dev Workflows',
      category: 'Innovation',
      enrolled: 35,
      completed: 20,
      duration: '6 Hours',
      deadline: '2026-12-01',
      status: 'Elective'
    }
  ]);

  const handleEnrollAll = (title) => {
    addToast(`All engineering and product team members enrolled in "${title}".`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Talent Upskilling & Training LMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Corporate compliance certifications, technical engineering tracks, and leadership workshops
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => addToast('New course creation curriculum builder opened.', 'info')}
        >
          Create Program
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {programs.map((p) => {
          const completionPct = Math.round((p.completed / (p.enrolled || 1)) * 100);

          return (
            <div
              key={p.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <Badge variant={p.status === 'Mandatory' ? 'danger' : 'purple'} size="sm">
                    {p.status}
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Track: {p.category} · Duration: {p.duration}
                </p>

                {/* Progress */}
                <div className="mt-4">
                  <div className="flex justify-between items-center text-xs font-semibold mb-1">
                    <span className="text-slate-500">Cohort Completion Rate</span>
                    <span className="text-emerald-600 font-bold">{completionPct}% ({p.completed}/{p.enrolled})</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Deadline: {p.deadline}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEnrollAll(p.title)}
                >
                  Enroll Team
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default HRTraining;
