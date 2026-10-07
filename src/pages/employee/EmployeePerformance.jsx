import React from 'react';
import { Award, CheckCircle2, TrendingUp, MessageSquare, Star, Target } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/Badge';

export const EmployeePerformance = () => {
  const { performanceReviews } = useERP();
  const { currentUser } = useAuth();

  const empId = currentUser?.id === 'USR-004' ? 'EMP-1004' : (currentUser?.id || 'EMP-1004');
  const myReview = performanceReviews.find(r => r.employeeId === empId || r.employeeName === 'Elena Rostova') || performanceReviews[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          My Performance Scorecard & Appraisal
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Quarterly review results, goal fulfillment rates, and leadership mentorship notes
        </p>
      </div>

      {myReview && (
        <div className="space-y-6">
          {/* Top Overall Rating Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Evaluation Period: {myReview.reviewPeriod}
              </span>
              <div className="text-4xl font-black font-mono mt-1">
                {myReview.overallScore} <span className="text-lg font-normal text-slate-400">/ 100</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Conducted by {myReview.manager} on {myReview.date}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
                <span className="text-[11px] text-slate-300 block">Status</span>
                <span className="text-sm font-bold text-emerald-400">{myReview.status}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
                <span className="text-[11px] text-slate-300 block">Goals Completed</span>
                <span className="text-sm font-bold text-indigo-300">{myReview.completedGoals} / {myReview.goals}</span>
              </div>
            </div>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Productivity</span>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1">{myReview.productivity}%</p>
              <span className="text-[10px] text-slate-400">Sprint output</span>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Team Collaboration</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">{myReview.teamwork}%</p>
              <span className="text-[10px] text-slate-400">Peer reviews</span>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Communication</span>
              <p className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono mt-1">{myReview.communication}%</p>
              <span className="text-[10px] text-slate-400">Documentation SLA</span>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Attendance Score</span>
              <p className="text-2xl font-black text-amber-500 font-mono mt-1">{myReview.attendanceScore}%</p>
              <span className="text-[10px] text-slate-400">Punctuality rate</span>
            </div>
          </div>

          {/* Manager Qualitative Feedback Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Managerial Appraisal & Growth Notes</h3>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 italic">
              "{myReview.feedback}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
export default EmployeePerformance;
