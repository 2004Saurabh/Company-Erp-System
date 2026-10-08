import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CreditCard,
  User,
  Building2,
  Droplets,
  Phone,
  FileText,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Eye
} from 'lucide-react';
import Modal from '../Modal';
import Button from '../Button';
import Input from '../Input';
import Select from '../Select';
import Badge from '../Badge';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import EmployeeIDCard from '../EmployeeIDCard';

export const AdminDirectIDCardModal = ({
  isOpen,
  onClose,
  initialEmployeeId = null
}) => {
  const { employees, idCardRequests, adminGenerateIDCard, getEmployeeIDCard } = useERP();
  const { currentUser } = useAuth();

  const [selectedEmpId, setSelectedEmpId] = useState(initialEmployeeId || 'EMP-1004');
  const [badgeNumber, setBadgeNumber] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [emergencyPhone, setEmergencyPhone] = useState('+1 (555) 999-1122');
  const [cardType, setCardType] = useState('Corporate Staff Badge');
  const [validUntil, setValidUntil] = useState('2028-10-08');
  const [notes, setNotes] = useState('Direct Root Administrator security clearance and immediate badge authorization.');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (initialEmployeeId) {
      setSelectedEmpId(initialEmployeeId);
    }
  }, [initialEmployeeId, isOpen]);

  // When selected employee changes, update defaults
  useEffect(() => {
    if (!badgeNumber) {
      setBadgeNumber(`NEX-ID-${Math.floor(10000 + Math.random() * 90000)}`);
    }
    const emp = employees.find(e => e.id === selectedEmpId);
    const existing = getEmployeeIDCard(selectedEmpId);
    if (existing) {
      setBloodGroup(existing.bloodGroup || 'O+');
      setEmergencyPhone(existing.emergencyContact || emp?.emergencyContact || '+1 (555) 999-1122');
      setBadgeNumber(existing.badgeNumber || `NEX-ID-${Math.floor(10000 + Math.random() * 90000)}`);
    } else if (emp) {
      setEmergencyPhone(emp.emergencyContact || '+1 (555) 999-1122');
    }
  }, [selectedEmpId, isOpen]);

  if (!isOpen) return null;

  const currentEmp = employees.find(e => e.id === selectedEmpId) || employees[0];
  const existingCard = currentEmp ? getEmployeeIDCard(currentEmp.id) : null;

  const handleIssue = (e) => {
    e.preventDefault();
    if (!currentEmp) return;

    adminGenerateIDCard({
      employeeId: currentEmp.id,
      bloodGroup,
      emergencyContact: emergencyPhone,
      badgeNumber,
      validUntil,
      cardType,
      notes,
      customPhoto: currentEmp.avatar
    });

    onClose();
  };

  const employeeOptions = employees.map(e => {
    const card = getEmployeeIDCard(e.id);
    const statusText = card?.status === 'Approved' ? '✅ [Active Badge]' : card?.status === 'Pending' ? '⏳ [Pending HR]' : '⭕ [No Badge]';
    return {
      value: e.id,
      label: `${e.id} — ${e.fullName} (${e.department}) ${statusText}`
    };
  });

  const previewCardData = {
    employeeId: currentEmp?.id,
    employeeName: currentEmp?.fullName,
    department: currentEmp?.department,
    designation: currentEmp?.designation,
    avatar: currentEmp?.avatar,
    bloodGroup,
    emergencyContact: emergencyPhone,
    status: 'Approved',
    badgeNumber: badgeNumber || 'NEX-ID-ADMIN',
    issuedDate: '2026-10-08',
    validUntil,
    approvedBy: `Administrator (${currentUser?.name || 'Saurabh Kumar'})`
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span>Admin Direct ID Card Generator & Issuance Authority</span>
        </div>
      }
      subtitle="Issue, approve, or renew official credentials for any employee across the organization"
      maxWidth="max-w-2xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="outline"
            icon={Eye}
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Hide Card Preview' : 'Show Card Preview'}
          </Button>
          <Button
            variant="primary"
            icon={ShieldCheck}
            onClick={handleIssue}
            className="bg-indigo-600 hover:bg-indigo-500 font-bold shadow-lg shadow-indigo-600/30"
          >
            Issue Official ID Badge (Direct Clearance)
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Administrator Root Advisory */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/60 text-white flex items-start gap-3 text-xs">
          <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-indigo-300">Super Administrator Authority:</span> You have root permissions to issue approved corporate ID cards for any employee immediately. Bypasses HR approval queues, assigns digital security tokens, and activates turnstile RFID clearance.
          </div>
        </div>

        {/* Live Card Preview Section if toggled */}
        {showPreview && currentEmp && (
          <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col items-center">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-3">
              Generated Card Preview (Ready for Issue)
            </span>
            <EmployeeIDCard
              employee={currentEmp}
              idCardData={previewCardData}
              showActions={false}
            />
          </div>
        )}

        {/* Employee Selection */}
        <div className="space-y-2">
          <Select
            label="Select Employee (Any Department) *"
            value={selectedEmpId}
            onChange={(e) => setSelectedEmpId(e.target.value)}
            options={employeeOptions}
          />

          {/* Selected Employee Live Dossier */}
          {currentEmp && (
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={currentEmp.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={currentEmp.fullName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {currentEmp.fullName}
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold">
                      {currentEmp.id}
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {currentEmp.designation} · {currentEmp.department}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg border ${
                  existingCard?.status === 'Approved'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-emerald-200 dark:border-emerald-800'
                    : existingCard?.status === 'Pending'
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 border-amber-200 dark:border-amber-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                }`}>
                  {existingCard ? `Status: ${existingCard.status}` : 'No Badge Issued'}
                </span>
                {existingCard?.badgeNumber && (
                  <span className="block font-mono text-[10px] text-indigo-500 mt-0.5">
                    {existingCard.badgeNumber}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Badge Configuration Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Assigned Badge Serial Number *"
            icon={CreditCard}
            value={badgeNumber}
            onChange={(e) => setBadgeNumber(e.target.value)}
            placeholder="e.g. NEX-ID-88421"
            required
            helperText="Auto-generated or customize serial"
          />

          <Select
            label="Credential Security Tier *"
            value={cardType}
            onChange={(e) => setCardType(e.target.value)}
            options={[
              { value: 'Corporate Staff Badge', label: 'Corporate Staff Badge (Standard RFID)' },
              { value: 'Technical Engineering Pass', label: 'Technical Engineering Pass' },
              { value: 'Executive Access Credential', label: 'Executive Clear-Pass (Root Level)' },
              { value: 'Contractor & Partner Pass', label: 'Contractor & Partner Pass' }
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Blood Group *"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            options={[
              { value: 'O+', label: 'O+' },
              { value: 'O-', label: 'O-' },
              { value: 'A+', label: 'A+' },
              { value: 'A-', label: 'A-' },
              { value: 'B+', label: 'B+' },
              { value: 'B-', label: 'B-' },
              { value: 'AB+', label: 'AB+' },
              { value: 'AB-', label: 'AB-' }
            ]}
          />

          <Input
            label="Emergency Contact Phone *"
            icon={Phone}
            value={emergencyPhone}
            onChange={(e) => setEmergencyPhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
            required
          />

          <Input
            label="Valid Thru (Expiration) *"
            type="date"
            icon={Calendar}
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
            required
          />
        </div>

        <Input
          label="Administrator Authorization Notes"
          icon={FileText}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Official Admin verification remarks"
        />
      </div>
    </Modal>
  );
};

export default AdminDirectIDCardModal;
