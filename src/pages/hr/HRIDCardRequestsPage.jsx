import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Filter,
  ShieldCheck,
  Eye,
  Check,
  X,
  Printer,
  Sparkles,
  Building2,
  Calendar,
  User,
  Droplets,
  Phone,
  FileText,
  AlertTriangle,
  QrCode
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import EmployeeIDCard from '../../components/EmployeeIDCard';
import StatCard from '../../components/StatCard';

export const HRIDCardRequestsPage = () => {
  const {
    employees,
    idCardRequests,
    approveIDCardRequest,
    rejectIDCardRequest
  } = useERP();
  const { currentUser, role } = useAuth();

  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Pending' | 'Approved' | 'Rejected'
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [previewRequest, setPreviewRequest] = useState(null);
  const [approvingRequest, setApprovingRequest] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState('Official employee credentials verified and authorized by HR.');
  const [rejectingRequest, setRejectingRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('Photo unclear or details need verification. Please update and reapply.');

  // Counts
  const totalCount = (idCardRequests || []).length;
  const pendingCount = (idCardRequests || []).filter(r => r.status === 'Pending').length;
  const approvedCount = (idCardRequests || []).filter(r => r.status === 'Approved').length;
  const rejectedCount = (idCardRequests || []).filter(r => r.status === 'Rejected').length;

  // Filtering
  const filteredRequests = (idCardRequests || []).filter(r => {
    const matchesTab =
      activeTab === 'All' ? true :
      activeTab === 'Pending' ? r.status === 'Pending' :
      activeTab === 'Approved' ? r.status === 'Approved' :
      activeTab === 'Rejected' ? r.status === 'Rejected' : true;

    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (r.employeeName || '').toLowerCase().includes(term) ||
      (r.employeeId || '').toLowerCase().includes(term) ||
      (r.department || '').toLowerCase().includes(term) ||
      (r.badgeNumber || '').toLowerCase().includes(term);

    return matchesTab && matchesSearch;
  });

  const handleConfirmApproval = () => {
    if (!approvingRequest) return;
    approveIDCardRequest(approvingRequest.id, approvalNotes);
    setApprovingRequest(null);
  };

  const handleConfirmRejection = () => {
    if (!rejectingRequest) return;
    rejectIDCardRequest(rejectingRequest.id, rejectionReason);
    setRejectingRequest(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <ShieldCheck className="w-3.5 h-3.5" /> HR Credential Issuing Authority
            </span>
            <span className="text-xs text-slate-400">Identity & Access Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Employee ID Card Generation & Approval
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Review digital ID requests submitted by staff members. Verify their identity, allocate official badge numbers, and issue active smartcards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-2xl bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            {pendingCount} Pending Approvals
          </span>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Card Requests"
          value={totalCount}
          comparisonText="All employee submissions"
          icon={CreditCard}
          iconColor="text-indigo-600 dark:text-indigo-400"
          iconBg="bg-indigo-50 dark:bg-indigo-950/60"
        />
        <StatCard
          title="Pending HR Review"
          value={pendingCount}
          comparisonText={pendingCount > 0 ? "Requires action" : "Queue clear"}
          isPositive={pendingCount === 0}
          icon={Clock}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-50 dark:bg-amber-950/60"
        />
        <StatCard
          title="Active Approved Badges"
          value={approvedCount}
          comparisonText="Authorized & Issued"
          isPositive={true}
          icon={CheckCircle2}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
        />
        <StatCard
          title="Declined Requests"
          value={rejectedCount}
          comparisonText="Pending employee re-apply"
          icon={XCircle}
          iconColor="text-rose-600 dark:text-rose-400"
          iconBg="bg-rose-50 dark:bg-rose-950/60"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'All', label: 'All Requests', count: totalCount },
            { id: 'Pending', label: 'Pending Review', count: pendingCount, highlight: pendingCount > 0 },
            { id: 'Approved', label: 'Approved Badges', count: approvedCount },
            { id: 'Rejected', label: 'Declined', count: rejectedCount }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : tab.highlight
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, Name or Badge..."
            className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Requests Grid / List */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6">
          <CreditCard className="w-12 h-12 mx-auto text-slate-400 mb-3" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No ID Card Requests Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            There are no requests matching the selected filter criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRequests.map((req) => {
            const isPending = req.status === 'Pending';
            const isApproved = req.status === 'Approved';
            const isRejected = req.status === 'Rejected';

            return (
              <div
                key={req.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Top Header: ID badge & status */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700">
                      {req.employeeId}
                    </span>
                    <Badge
                      variant={isApproved ? 'success' : isRejected ? 'danger' : 'warning'}
                      size="xs"
                      dot
                    >
                      {req.status}
                    </Badge>
                  </div>

                  {/* Profile info */}
                  <div className="flex items-center gap-3.5 mb-3">
                    <img
                      src={req.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={req.employeeName}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/20 shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {req.employeeName}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {req.designation}
                      </p>
                      <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 truncate">
                        {req.department}
                      </p>
                    </div>
                  </div>

                  {/* Request Specifics */}
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 space-y-2 text-xs mb-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5 text-rose-500" /> Blood Group:
                      </span>
                      <strong className="text-rose-600 dark:text-rose-400">{req.bloodGroup}</strong>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" /> Emergency:
                      </span>
                      <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{req.emergencyContact}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> Request Date:
                      </span>
                      <span className="text-slate-700 dark:text-slate-300">{req.requestDate}</span>
                    </div>

                    {isApproved && (
                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-mono">Badge Serial:</span>
                        <strong className="font-mono text-indigo-600 dark:text-indigo-400">{req.badgeNumber}</strong>
                      </div>
                    )}

                    {isRejected && (
                      <div className="pt-2 border-t border-rose-200/60 dark:border-rose-900/40 text-[11px] text-rose-600 dark:text-rose-400">
                        <strong>Reason:</strong> {req.rejectionReason}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="xs"
                    icon={Eye}
                    onClick={() => setPreviewRequest(req)}
                  >
                    Preview Badge
                  </Button>

                  <div className="flex items-center gap-1.5">
                    {isPending ? (
                      <>
                        <Button
                          variant="primary"
                          size="xs"
                          icon={Check}
                          onClick={() => setApprovingRequest(req)}
                          className="bg-emerald-600 hover:bg-emerald-500 font-bold"
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="xs"
                          icon={X}
                          onClick={() => setRejectingRequest(req)}
                          className="text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        >
                          Decline
                        </Button>
                      </>
                    ) : isApproved ? (
                      <Button
                        variant="ghost"
                        size="xs"
                        icon={Printer}
                        onClick={() => setPreviewRequest(req)}
                        className="text-indigo-600 dark:text-indigo-400 font-semibold"
                      >
                        Print Card
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="xs"
                        icon={Check}
                        onClick={() => setApprovingRequest(req)}
                      >
                        Re-Approve
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal 1: Approve ID Card & Issue Badge */}
      {approvingRequest && (
        <Modal
          isOpen={Boolean(approvingRequest)}
          onClose={() => setApprovingRequest(null)}
          title="Approve ID Card Request & Issue Badge"
          subtitle={`Authorize official credentials for ${approvingRequest.employeeName} (${approvingRequest.employeeId})`}
          maxWidth="max-w-lg"
          footer={
            <>
              <Button variant="secondary" onClick={() => setApprovingRequest(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                icon={CheckCircle2}
                onClick={handleConfirmApproval}
                className="bg-emerald-600 hover:bg-emerald-500 font-bold"
              >
                Confirm & Issue Badge
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-200 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Credential Authorization:</span> Approving this request will generate an official badge serial number, digital security hash QR code, and grant turnstile clearance for 2 years (valid through October 2028).
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
              <img
                src={approvingRequest.avatar}
                alt={approvingRequest.employeeName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/20"
              />
              <div className="text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white">
                  {approvingRequest.employeeName} ({approvingRequest.employeeId})
                </h4>
                <p className="text-slate-500 dark:text-slate-400">
                  {approvingRequest.designation} · {approvingRequest.department}
                </p>
                <p className="text-rose-600 dark:text-rose-400 font-semibold mt-0.5">
                  Blood Group: {approvingRequest.bloodGroup} · Contact: {approvingRequest.emergencyContact}
                </p>
              </div>
            </div>

            <Input
              label="Official HR Approval Notes & Clearance Remarks"
              value={approvalNotes}
              onChange={(e) => setApprovalNotes(e.target.value)}
              placeholder="e.g. Identity verified via corporate roster."
            />
          </div>
        </Modal>
      )}

      {/* Modal 2: Reject ID Card Request */}
      {rejectingRequest && (
        <Modal
          isOpen={Boolean(rejectingRequest)}
          onClose={() => setRejectingRequest(null)}
          title="Decline ID Card Generation Request"
          subtitle={`Provide feedback to ${rejectingRequest.employeeName} (${rejectingRequest.employeeId})`}
          maxWidth="max-w-lg"
          footer={
            <>
              <Button variant="secondary" onClick={() => setRejectingRequest(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                icon={XCircle}
                onClick={handleConfirmRejection}
                className="bg-rose-600 hover:bg-rose-500 font-bold"
              >
                Decline & Request Revision
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-950 dark:text-rose-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Revision Notice:</span> The employee will be notified with your feedback and will be asked to update their details and reapply.
              </div>
            </div>

            <Input
              label="Rejection Reason & Required Changes *"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Specify what details need correction..."
              required
            />
          </div>
        </Modal>
      )}

      {/* Modal 3: High-Res ID Card Preview */}
      {previewRequest && (
        <Modal
          isOpen={Boolean(previewRequest)}
          onClose={() => setPreviewRequest(null)}
          title="Official Digital Employee ID Badge"
          subtitle={`Credential Dossier for ${previewRequest.employeeName} (${previewRequest.employeeId})`}
          maxWidth="max-w-md"
        >
          <div className="flex flex-col items-center py-2">
            <EmployeeIDCard
              idCardData={previewRequest}
              showActions={true}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default HRIDCardRequestsPage;
