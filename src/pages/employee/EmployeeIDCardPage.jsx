import React, { useState } from 'react';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Sparkles,
  Printer,
  Download,
  Building2,
  User,
  Droplets,
  Phone,
  FileText,
  Send,
  RefreshCw,
  QrCode
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Badge from '../../components/Badge';
import EmployeeIDCard from '../../components/EmployeeIDCard';

export const EmployeeIDCardPage = () => {
  const {
    employees,
    idCardRequests,
    requestIDCard,
    getEmployeeIDCard
  } = useERP();
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  // Find current employee record
  const currentEmp = (employees || []).find(
    e => e.email === currentUser?.email || e.fullName === currentUser?.name || e.id === currentUser?.id
  ) || employees[0] || {
    id: 'EMP-1004',
    fullName: 'Elena Rostova',
    designation: 'Senior Frontend Engineer',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    emergencyContact: '+1 (555) 666-4455'
  };

  const existingCard = getEmployeeIDCard(currentEmp?.id);

  // Form State for Request / Reissue
  const [bloodGroup, setBloodGroup] = useState(existingCard?.bloodGroup || 'O+');
  const [emergencyPhone, setEmergencyPhone] = useState(existingCard?.emergencyContact || currentEmp?.emergencyContact || '+1 (555) 666-4455');
  const [reason, setReason] = useState(existingCard ? 'Badge Information Update / Reissue' : 'Initial Employee Digital ID Card Generation');
  const [cardType, setCardType] = useState('Corporate Staff Badge');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEditForm, setShowEditForm] = useState(!existingCard);

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      requestIDCard({
        employeeId: currentEmp.id,
        bloodGroup,
        emergencyContact: emergencyPhone,
        reason,
        cardType,
        customPhoto: currentEmp.avatar
      });
      setShowEditForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Live draft preview for form
  const draftCardData = {
    employeeId: currentEmp.id,
    employeeName: currentEmp.fullName,
    department: currentEmp.department,
    designation: currentEmp.designation,
    avatar: currentEmp.avatar,
    bloodGroup,
    emergencyContact: emergencyPhone,
    status: existingCard?.status || 'Pending',
    badgeNumber: existingCard?.badgeNumber || 'NEX-ID-PENDING',
    issuedDate: existingCard?.issuedDate || '2026-10-08',
    validUntil: existingCard?.validUntil || '2028-10-08',
    approvedBy: existingCard?.approvedBy || 'Sophia Montgomery (HR)'
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <CreditCard className="w-3.5 h-3.5" /> Corporate Digital Credential
            </span>
            <span className="text-xs text-slate-400">Self-Service Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            My Employee ID Card
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Generate, preview, and download your official company ID badge with verified HR clearance, RFID access & turnstile QR code.
          </p>
        </div>

        {existingCard && !showEditForm && (
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              icon={Sparkles}
              className="text-white border-white/20 hover:bg-white/10"
              onClick={() => setShowEditForm(true)}
            >
              Request Reissue / Update
            </Button>
          </div>
        )}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Card Interactive Presentation */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Live Badge Preview
              </span>
              <Badge
                variant={
                  existingCard?.status === 'Approved'
                    ? 'success'
                    : existingCard?.status === 'Rejected'
                    ? 'danger'
                    : 'warning'
                }
                size="sm"
              >
                {existingCard?.status || 'Draft Preview'}
              </Badge>
            </div>

            <EmployeeIDCard
              employee={currentEmp}
              idCardData={existingCard || draftCardData}
              onReapply={existingCard?.status === 'Rejected' ? () => setShowEditForm(true) : null}
            />
          </div>
        </div>

        {/* Right Column: Status Banner, Workflow & Form */}
        <div className="lg:col-span-7 space-y-5">
          {/* Status Alert Banner */}
          {existingCard?.status === 'Approved' && !showEditForm && (
            <div className="p-5 rounded-3xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    Official ID Badge Verified & Issued by HR
                  </h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5 leading-relaxed">
                    Your digital credentials have been authorized by <strong>{existingCard.approvedBy}</strong>. This badge enables office turnstile access, attendance clocking, and official employee verification.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60 text-center">
                <div className="p-2 rounded-xl bg-white/60 dark:bg-slate-900/40">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono block">Badge Serial</span>
                  <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{existingCard.badgeNumber}</span>
                </div>
                <div className="p-2 rounded-xl bg-white/60 dark:bg-slate-900/40">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono block">Issued Date</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{existingCard.issuedDate}</span>
                </div>
                <div className="p-2 rounded-xl bg-white/60 dark:bg-slate-900/40">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono block">Valid Thru</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{existingCard.validUntil}</span>
                </div>
                <div className="p-2 rounded-xl bg-white/60 dark:bg-slate-900/40">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono block">Smart RFID</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">ACTIVE ✓</span>
                </div>
              </div>
            </div>
          )}

          {existingCard?.status === 'Pending' && !showEditForm && (
            <div className="p-5 rounded-3xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 animate-spin" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                    Awaiting HR Verification & Approval
                  </h3>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5 leading-relaxed">
                    Your request was received on <strong>{existingCard.requestDate}</strong>. HR Operations is verifying your records before issuing your official badge serial number. You will receive an instant notification once approved.
                  </p>
                </div>
              </div>

              {/* Approval Timeline Steps */}
              <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/40 space-y-2 text-xs">
                <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Step 1: ID Card Request Submitted by Employee ({existingCard.requestDate})</span>
                </div>
                <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400 font-semibold">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Step 2: HR Operations Verification & Badge Number Assignment (In Review)</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-400">
                  <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-700 shrink-0"></div>
                  <span>Step 3: Official Digital Badge Activation & Print Access</span>
                </div>
              </div>
            </div>
          )}

          {existingCard?.status === 'Rejected' && !showEditForm && (
            <div className="p-5 rounded-3xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 flex items-center justify-center shrink-0">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                    ID Card Request Requires Revision
                  </h3>
                  <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5 leading-relaxed">
                    Reason from HR: <em>"{existingCard.rejectionReason || 'Please verify emergency contact information and re-apply.'}"</em>
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                icon={RefreshCw}
                onClick={() => setShowEditForm(true)}
                className="bg-rose-600 hover:bg-rose-500 font-bold"
              >
                Update Details & Reapply to HR
              </Button>
            </div>
          )}

          {/* Generator Form Section */}
          {(showEditForm || !existingCard) ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    {existingCard ? 'Update & Reissue Request' : 'Generate New ID Card'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Submit your personal credentials to HR to obtain your official enterprise ID badge.
                  </p>
                </div>
                {existingCard && (
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setShowEditForm(false)}
                  >
                    Cancel
                  </Button>
                )}
              </div>

              <form onSubmit={handleSubmitRequest} className="space-y-4">
                {/* Read-Only Verified Employee Profile Summary */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Employee ID</span>
                    <strong className="text-indigo-600 dark:text-indigo-400 font-mono text-sm">{currentEmp.id}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Full Name</span>
                    <strong className="text-slate-900 dark:text-white">{currentEmp.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Department & Role</span>
                    <strong className="text-slate-900 dark:text-white truncate block">{currentEmp.department} · {currentEmp.designation}</strong>
                  </div>
                </div>

                {/* Editable Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Blood Group *"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    options={[
                      { value: 'O+', label: 'O+ (O Positive)' },
                      { value: 'O-', label: 'O- (O Negative)' },
                      { value: 'A+', label: 'A+ (A Positive)' },
                      { value: 'A-', label: 'A- (A Negative)' },
                      { value: 'B+', label: 'B+ (B Positive)' },
                      { value: 'B-', label: 'B- (B Negative)' },
                      { value: 'AB+', label: 'AB+ (AB Positive)' },
                      { value: 'AB-', label: 'AB- (AB Negative)' }
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Credential Type *"
                    value={cardType}
                    onChange={(e) => setCardType(e.target.value)}
                    options={[
                      { value: 'Corporate Staff Badge', label: 'Corporate Staff Badge (Standard RFID)' },
                      { value: 'Technical Engineering Pass', label: 'Technical Engineering Pass' },
                      { value: 'Executive Access Credential', label: 'Executive Access Credential' }
                    ]}
                  />

                  <Input
                    label="Request Purpose / Note *"
                    icon={FileText}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Initial Onboarding ID, Annual Renewal"
                    required
                  />
                </div>

                {/* Security Advisory */}
                <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/60 flex items-start gap-3 text-xs text-indigo-950 dark:text-indigo-200">
                  <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">HR Verification Policy:</span> Upon clicking submit, your request will be delivered to HR. HR will verify your photo and background records, assign your official badge serial number, and grant turnstile clearance.
                  </div>
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    icon={Send}
                    loading={isSubmitting}
                    className="bg-indigo-600 hover:bg-indigo-500 font-bold px-6 shadow-lg shadow-indigo-600/30"
                  >
                    Generate & Request ID Card from HR
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            /* Information Card if form is closed */
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Badge Features & Security Protocols
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Encrypted QR Code</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    Scannable at office turnstiles & verified against corporate database.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Emergency Medical</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    Blood group and next of kin contact for on-site health safety.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2">
                    <Printer className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Official Print Ready</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    High-res PDF & physical badge printer calibration dimensions.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeIDCardPage;
