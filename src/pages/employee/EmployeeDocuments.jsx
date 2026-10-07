import React from 'react';
import { FileText, Download, ShieldCheck, ExternalLink } from 'lucide-react';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { useToast } from '../../context/ToastContext';

export const EmployeeDocuments = () => {
  const { addToast } = useToast();

  const documents = [
    { id: 'MY-DOC-01', name: 'Employment_Agreement_Elena_Rostova.pdf', category: 'Contract', size: '1.8 MB', date: '2022-04-18' },
    { id: 'MY-DOC-02', name: 'W-4_Tax_Withholding_Election_2026.pdf', category: 'Tax Form', size: '420 KB', date: '2026-01-05' },
    { id: 'MY-DOC-03', name: 'Equity_Incentive_Stock_Option_Grant.pdf', category: 'Stock & Equity', size: '2.1 MB', date: '2022-04-20' },
    { id: 'MY-DOC-04', name: 'Comprehensive_Healthcare_Enrollment.pdf', category: 'Insurance', size: '3.4 MB', date: '2026-01-15' },
  ];

  const handleDownload = (name) => {
    addToast(`Downloading verified personal document "${name}"...`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          My Personnel Records & Documents
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Access your verified employment agreement, tax records, equity plans, and medical cards
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <FileText className="w-5 h-5" />
                </div>
                <Badge variant="success" size="sm" dot>Verified</Badge>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-3 line-clamp-1">
                {doc.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {doc.category} · {doc.size} · Filed {doc.date}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Tamper-Proof
              </span>
              <Button
                variant="outline"
                size="sm"
                icon={Download}
                onClick={() => handleDownload(doc.name)}
              >
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default EmployeeDocuments;
