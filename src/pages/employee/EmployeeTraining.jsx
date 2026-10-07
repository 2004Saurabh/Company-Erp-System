import React from 'react';
import { GraduationCap, Award, Play, CheckCircle2 } from 'lucide-react';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { useToast } from '../../context/ToastContext';

export const EmployeeTraining = () => {
  const { addToast } = useToast();

  const courses = [
    { id: 'CRS-01', title: 'Enterprise SOC2 Type II Security Compliance', progress: 100, hours: '4.0 hrs', status: 'Completed', cert: true },
    { id: 'CRS-02', title: 'Next-Gen Microservices Architecture & Kubernetes', progress: 65, hours: '16.0 hrs', status: 'In Progress', cert: false },
    { id: 'CRS-03', title: 'Generative AI Tools & LLM Prompting in Code Reviews', progress: 30, hours: '6.0 hrs', status: 'In Progress', cert: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          My Upskilling & Learning Tracks
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Complete mandatory annual compliance courses and technical skill certifications
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {courses.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <Badge variant={c.status === 'Completed' ? 'success' : 'info'} size="sm">
                  {c.status}
                </Badge>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-3 line-clamp-2">
                {c.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Estimated: {c.hours}
              </p>

              {/* Progress */}
              <div className="mt-4">
                <div className="flex justify-between items-center text-xs font-semibold mb-1">
                  <span className="text-slate-500">Progress</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{c.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              {c.status === 'Completed' ? (
                <Button
                  variant="outline"
                  size="sm"
                  icon={Award}
                  onClick={() => addToast('Digital verified certificate downloaded.', 'success')}
                >
                  Certificate
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  icon={Play}
                  onClick={() => addToast(`Resumed "${c.title}" module.`, 'info')}
                >
                  Resume Course
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default EmployeeTraining;
