import React, { useState } from 'react';
import {
  ShieldCheck,
  Home,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  Trash2,
  Calendar,
  Building2,
  Info
} from 'lucide-react';
import Modal from '../Modal';
import Button from '../Button';
import Badge from '../Badge';
import Avatar from '../Avatar';
import { useERP } from '../../context/ERPContext';

export const AdminWFHAuthorizationModal = ({ isOpen, onClose, initialEmployeeId = null }) => {
  const {
    employees,
    wfhAuthorizedEmployees,
    authorizeEmployeeWFH,
    revokeEmployeeWFH,
    isEmployeeWFHAuthorized
  } = useERP();

  const [selectedEmpId, setSelectedEmpId] = useState(initialEmployeeId || 'EMP-1004');
  const [reason, setReason] = useState('Project Sprint Delivery');
  const [validUntil, setValidUntil] = useState('2026-10-31');
  const [notes, setNotes] = useState('Official Admin ID card authorization for remote work');

  if (!isOpen) return null;

  const currentEmp = employees.find(e => e.id === selectedEmpId) || employees[0];
  const isAlreadyAuthorized = isEmployeeWFHAuthorized(currentEmp?.id);

  const handleAuthorize = (e) => {
    e.preventDefault();
    if (!currentEmp) return;

    authorizeEmployeeWFH({
      employeeId: currentEmp.id,
      reason,
      validUntil,
      notes
    });
  };

  const handleRevoke = (empId) => {
    revokeEmployeeWFH(empId);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Admin WFH ID Card Authorization & Registry"
      subtitle="Administrator access to authorize employee ID cards for Work From Home (WFH). HR can only mark attendance for authorized IDs."
      maxWidth="max-w-3xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Administrator Authority Control</span>
          </div>
          <Button variant="secondary" onClick={onClose}>
            Done
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Policy Notice */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed">
            <span className="font-bold block text-sm mb-0.5">Admin Exclusive Privilege: WFH ID Registry</span>
            Only the <strong>Administrator</strong> can add or register an employee's ID card for Work From Home. 
            Once registered here, <strong>HR</strong> will be granted permission to record remote attendance for that specific ID without office WiFi geofence restrictions.
          </div>
        </div>

        {/* Form: Authorize New or Existing Employee by ID */}
        <form onSubmit={handleAuthorize} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-600" />
            Authorize Employee ID Card for WFH
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Select Employee ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Select Employee ID Card
              </label>
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              >
                {employees.map(e => {
                  const authorized = isEmployeeWFHAuthorized(e.id);
                  return (
                    <option key={e.id} value={e.id}>
                      {e.id} — {e.fullName} ({e.department}) {authorized ? '★ [Authorized]' : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* WFH Reason */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Authorization Purpose / Reason
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Project Sprint Delivery">Project Sprint Delivery (Remote Focus)</option>
                <option value="Medical Exemption">Medical Exemption / Health Recovery</option>
                <option value="Relocation / Outstation Travel">Relocation / Outstation Travel</option>
                <option value="Flexible Hybrid Policy">Flexible Hybrid Policy Exemption</option>
                <option value="Executive Clearance">Executive Board Direct Approval</option>
              </select>
            </div>

            {/* Validity Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Authorization Valid Until
              </label>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Admin Clearance Reference Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Admin authorization remarks..."
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Selected Employee Preview */}
          {currentEmp && (
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar src={currentEmp.avatar} name={currentEmp.fullName} size="md" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{currentEmp.fullName}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                      ID: {currentEmp.id}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    {currentEmp.department} · {currentEmp.designation}
                  </span>
                </div>
              </div>

              <div>
                {isAlreadyAuthorized ? (
                  <Badge variant="success" size="sm" dot>
                    Currently Authorized
                  </Badge>
                ) : (
                  <Badge variant="neutral" size="sm">
                    Not Yet Authorized
                  </Badge>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              variant="primary"
              icon={ShieldCheck}
              className="bg-indigo-600 hover:bg-indigo-700 font-bold text-xs"
            >
              {isAlreadyAuthorized ? 'Update WFH Authorization' : 'Authorize This Employee ID'}
            </Button>
          </div>
        </form>

        {/* Current Registry List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Home className="w-4 h-4 text-emerald-500" />
              Active Admin-Authorized WFH ID Cards ({wfhAuthorizedEmployees.length})
            </h4>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              HR is permitted to mark attendance for these IDs
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
            {wfhAuthorizedEmployees.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No employee IDs have been authorized for Work From Home yet.
              </div>
            ) : (
              wfhAuthorizedEmployees.map((auth) => (
                <div
                  key={auth.id || auth.employeeId}
                  className="p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs font-mono">
                      {auth.employeeId}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {auth.employeeName}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
                          {auth.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <span>{auth.department}</span>
                        <span>•</span>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">{auth.reason}</span>
                        <span>•</span>
                        <span className="text-slate-400">Valid: {auth.validUntil}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                      HR Enabled
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRevoke(auth.employeeId)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                      title="Revoke WFH Authorization"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AdminWFHAuthorizationModal;
