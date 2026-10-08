import React, { useState } from 'react';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Eye,
  Printer,
  Plus,
  Send,
  Users,
  Search,
  Droplets,
  Phone,
  Mail,
  Building2,
  Sparkles
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Select from '../../components/Select';
import StatCard from '../../components/StatCard';
import EmployeeIDCard from '../../components/EmployeeIDCard';

export const ManagerTeamIDCardsPage = () => {
  const { employees, idCardRequests, requestIDCard, getEmployeeIDCard } = useERP();
  const { currentUser } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Approved' | 'Pending' | 'NotIssued'
  const [previewMember, setPreviewMember] = useState(null);
  const [requestingMember, setRequestingMember] = useState(null);

  // Form for requesting ID card on behalf of team member
  const [reqBloodGroup, setReqBloodGroup] = useState('O+');
  const [reqEmergencyPhone, setReqEmergencyPhone] = useState('+1 (555) 999-1122');
  const [reqReason, setReqReason] = useState('Team Manager ID Card Onboarding Request');

  // Engineering Team Members
  const teamMembers = employees.filter(e => e.department === 'Engineering');

  // Compute statistics
  const teamWithCard = teamMembers.map(member => {
    const card = getEmployeeIDCard(member.id);
    return {
      member,
      card,
      status: card ? card.status : 'NotIssued'
    };
  });

  const totalTeam = teamMembers.length;
  const approvedTeamCount = teamWithCard.filter(t => t.status === 'Approved').length;
  const pendingTeamCount = teamWithCard.filter(t => t.status === 'Pending').length;
  const notIssuedCount = teamWithCard.filter(t => t.status === 'NotIssued').length;

  const filteredTeam = teamWithCard.filter(({ member, card, status }) => {
    const matchesFilter =
      activeFilter === 'All' ? true :
      activeFilter === 'Approved' ? status === 'Approved' :
      activeFilter === 'Pending' ? status === 'Pending' :
      activeFilter === 'NotIssued' ? status === 'NotIssued' : true;

    const term = searchTerm.toLowerCase();
    const matchesSearch =
      member.fullName.toLowerCase().includes(term) ||
      member.id.toLowerCase().includes(term) ||
      member.designation.toLowerCase().includes(term) ||
      (card?.badgeNumber || '').toLowerCase().includes(term);

    return matchesFilter && matchesSearch;
  });

  const handleOpenRequestModal = (member) => {
    setRequestingMember(member);
    setReqEmergencyPhone(member.emergencyContact || '+1 (555) 999-1122');
    setReqBloodGroup(member.bloodGroup || 'O+');
    setReqReason(`Manager requested official ID badge for ${member.fullName}`);
  };

  const handleConfirmRequest = (e) => {
    e.preventDefault();
    if (!requestingMember) return;

    requestIDCard({
      employeeId: requestingMember.id,
      bloodGroup: reqBloodGroup,
      emergencyContact: reqEmergencyPhone,
      reason: reqReason,
      cardType: 'Corporate Staff Badge',
      customPhoto: requestingMember.avatar
    });

    setRequestingMember(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <CreditCard className="w-3.5 h-3.5" /> Team Credential Monitoring
            </span>
            <span className="text-xs text-slate-400">Engineering Division</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Team Member Digital ID Cards
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Monitor which engineers have active company ID cards, track pending HR authorizations, and initiate badge requests for newly onboarded team members.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-2xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            {approvedTeamCount} of {totalTeam} Active Badges
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Team Engineers"
          value={totalTeam}
          comparisonText="Engineering roster"
          icon={Users}
          iconColor="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-50 dark:bg-blue-950/60"
        />
        <StatCard
          title="Active Approved Badges"
          value={approvedTeamCount}
          comparisonText="Turnstile & RFID Active"
          isPositive={true}
          icon={CheckCircle2}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
        />
        <StatCard
          title="Pending HR Reviews"
          value={pendingTeamCount}
          comparisonText="Badge generation in review"
          icon={Clock}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-50 dark:bg-amber-950/60"
        />
        <StatCard
          title="Awaiting ID Issuance"
          value={notIssuedCount}
          comparisonText={notIssuedCount > 0 ? "Requires badge request" : "All staff badged"}
          isPositive={notIssuedCount === 0}
          icon={AlertTriangle}
          iconColor="text-slate-600 dark:text-slate-400"
          iconBg="bg-slate-100 dark:bg-slate-800/60"
        />
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'All', label: 'All Engineers', count: totalTeam },
            { id: 'Approved', label: 'Active Badges', count: approvedTeamCount },
            { id: 'Pending', label: 'Pending HR', count: pendingTeamCount },
            { id: 'NotIssued', label: 'Unissued', count: notIssuedCount }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                activeFilter === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search team member or badge..."
            className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Team ID Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeam.map(({ member, card, status }) => {
          const isApproved = status === 'Approved';
          const isPending = status === 'Pending';
          const isNotIssued = status === 'NotIssued';

          return (
            <div
              key={member.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Header: ID & Badge Status */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700">
                    {member.id}
                  </span>
                  <Badge
                    variant={isApproved ? 'success' : isPending ? 'warning' : 'neutral'}
                    size="xs"
                    dot
                  >
                    {isApproved ? 'Badge Active' : isPending ? 'Pending HR' : 'No Badge'}
                  </Badge>
                </div>

                {/* Profile Card */}
                <div className="flex items-center gap-3.5 mb-3.5">
                  <img
                    src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={member.fullName}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-500/20 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {member.fullName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {member.designation}
                    </p>
                    <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                      Engineering Team
                    </p>
                  </div>
                </div>

                {/* ID Card Dossier Details */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2 text-xs mb-3">
                  {isApproved && (
                    <>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-mono">Badge Serial:</span>
                        <strong className="font-mono text-indigo-600 dark:text-indigo-400">{card.badgeNumber}</strong>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Authorized By:</span>
                        <span className="text-slate-700 dark:text-slate-300 truncate max-w-[170px]">{card.approvedBy}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Valid Through:</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{card.validUntil}</span>
                      </div>
                    </>
                  )}

                  {isPending && (
                    <>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Request Date:</span>
                        <span className="text-amber-600 dark:text-amber-400 font-semibold">{card.requestDate}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                        "{card.reason || 'Pending HR review and badge issuance'}"
                      </div>
                    </>
                  )}

                  {isNotIssued && (
                    <div className="py-1 text-center text-slate-400 text-[11px]">
                      No digital badge issued yet for this team member.
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5 text-rose-500" /> Blood Group:
                    </span>
                    <strong className="text-rose-600 dark:text-rose-400">{card?.bloodGroup || member.bloodGroup || 'O+'}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                {card ? (
                  <Button
                    variant="outline"
                    size="xs"
                    icon={Eye}
                    onClick={() => setPreviewMember({ member, card })}
                    className="w-full justify-center"
                  >
                    View Official Badge
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="xs"
                    icon={Plus}
                    onClick={() => handleOpenRequestModal(member)}
                    className="w-full justify-center bg-blue-600 hover:bg-blue-500 font-semibold"
                  >
                    Request ID Card from HR
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal 1: Preview ID Card */}
      {previewMember && (
        <Modal
          isOpen={Boolean(previewMember)}
          onClose={() => setPreviewMember(null)}
          title="Team Member Corporate Credential"
          subtitle={`Official ID Dossier for ${previewMember.member.fullName} (${previewMember.member.id})`}
          maxWidth="max-w-md"
        >
          <div className="flex flex-col items-center py-2">
            <EmployeeIDCard
              employee={previewMember.member}
              idCardData={previewMember.card}
              showActions={true}
            />
          </div>
        </Modal>
      )}

      {/* Modal 2: Manager Requesting ID Card on Behalf of Employee */}
      {requestingMember && (
        <Modal
          isOpen={Boolean(requestingMember)}
          onClose={() => setRequestingMember(null)}
          title="Request ID Card for Team Member"
          subtitle={`Initiate badge issuance request to HR for ${requestingMember.fullName} (${requestingMember.id})`}
          maxWidth="max-w-md"
          footer={
            <>
              <Button variant="secondary" onClick={() => setRequestingMember(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                icon={Send}
                onClick={handleConfirmRequest}
                className="bg-blue-600 hover:bg-blue-500 font-bold"
              >
                Submit Request to HR
              </Button>
            </>
          }
        >
          <form onSubmit={handleConfirmRequest} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs text-blue-950 dark:text-blue-200 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Manager Sponsorship:</span> As Engineering Manager, you are sponsoring the digital badge issuance for <strong>{requestingMember.fullName}</strong>. HR will verify and assign their badge serial.
              </div>
            </div>

            <Select
              label="Blood Group *"
              value={reqBloodGroup}
              onChange={(e) => setReqBloodGroup(e.target.value)}
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
              value={reqEmergencyPhone}
              onChange={(e) => setReqEmergencyPhone(e.target.value)}
              required
            />

            <Input
              label="Manager Justification / Purpose *"
              value={reqReason}
              onChange={(e) => setReqReason(e.target.value)}
              required
            />
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ManagerTeamIDCardsPage;
