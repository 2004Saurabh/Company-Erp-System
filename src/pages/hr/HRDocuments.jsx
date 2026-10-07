import React, { useState } from 'react';
import { FileText, Download, Upload, ShieldCheck, Search, Trash2 } from 'lucide-react';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { useToast } from '../../context/ToastContext';

export const HRDocuments = () => {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const [docs, setDocs] = useState([
    { id: 'DOC-101', name: 'NEXORA_Employee_Handbook_2026.pdf', category: 'Policy', size: '2.4 MB', date: '2026-09-15', verified: true },
    { id: 'DOC-102', name: 'Executive_Proprietary_Invention_NDA.pdf', category: 'Legal', size: '1.1 MB', date: '2026-08-20', verified: true },
    { id: 'DOC-103', name: 'W-4_Federal_Tax_Withholding_Template.pdf', category: 'Tax', size: '640 KB', date: '2026-01-10', verified: true },
    { id: 'DOC-104', name: 'Comprehensive_Medical_PPO_Summary.pdf', category: 'Benefits', size: '3.8 MB', date: '2026-09-01', verified: true },
    { id: 'DOC-105', name: 'Enterprise_Code_of_Ethics_Charter.pdf', category: 'Compliance', size: '1.5 MB', date: '2026-07-12', verified: true },
  ]);

  const handleDownload = (name) => {
    addToast(`Downloading encrypted archive "${name}"...`, 'success');
  };

  const handleUpload = () => {
    addToast('Document successfully uploaded into secure personnel cloud.', 'success');
  };

  const filteredDocs = docs.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Employee Legal & Compliance Repository
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Centrally governed policy charters, benefit packages, NDAs, and tax withholdings
          </p>
        </div>

        <Button variant="primary" size="sm" icon={Upload} onClick={handleUpload}>
          Upload Document
        </Button>
      </div>

      {/* List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search policies or forms..."
            className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
          />
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-3 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{doc.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span>{doc.category}</span>
                    <span>•</span>
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span>Updated {doc.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <Badge variant="success" size="sm" dot>Verified</Badge>
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
    </div>
  );
};
export default HRDocuments;
