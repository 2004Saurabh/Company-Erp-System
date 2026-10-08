import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  Building2,
  Calendar,
  Phone,
  Droplets,
  RotateCw,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Wifi
} from 'lucide-react';
import Button from './Button';
import Badge from './Badge';
import { useToast } from '../context/ToastContext';

export const EmployeeIDCard = ({
  employee,
  idCardData,
  onReapply = null,
  showActions = true,
  className = ''
}) => {
  const { addToast } = useToast();
  const [isFlipped, setIsFlipped] = useState(false);

  // Merge employee info with ID card request data
  const empName = idCardData?.employeeName || employee?.fullName || employee?.name || 'Staff Member';
  const empId = idCardData?.employeeId || employee?.id || 'EMP-1004';
  const empRole = idCardData?.designation || employee?.designation || employee?.title || 'Staff Specialist';
  const empDept = idCardData?.department || employee?.department || 'Operations';
  const empAvatar = idCardData?.avatar || employee?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
  const bloodGroup = idCardData?.bloodGroup || employee?.bloodGroup || 'O+';
  const emergencyPhone = idCardData?.emergencyContact || employee?.emergencyContact || '+1 (555) 999-1122';
  const status = idCardData?.status || 'Pending';
  const badgeNumber = idCardData?.badgeNumber || 'NEX-ID-PENDING';
  const issuedDate = idCardData?.issuedDate || '2026-10-08';
  const validUntil = idCardData?.validUntil || '2028-10-08';
  const approvedBy = idCardData?.approvedBy || 'Sophia Montgomery (HR)';

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    addToast(`Exporting digital badge for ${empName} (${empId})...`, 'success');
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Print-specific style */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-id-card, #printable-id-card * {
            visibility: visible;
          }
          #printable-id-card {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(1.1);
            box-shadow: none;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      {/* ID Card Wrapper */}
      <div className="relative w-full max-w-[370px] sm:max-w-[400px] perspective-1000">
        <div
          id="printable-id-card"
          className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white transition-all duration-500"
          style={{ minHeight: '560px' }}
        >
          {/* Holographic Watermark / Status Overlay */}
          {status === 'Pending' && (
            <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
              <div className="rotate-[-32deg] py-2 px-10 border-4 border-amber-400/80 bg-amber-500/20 backdrop-blur-[2px] rounded-2xl shadow-xl text-center">
                <span className="text-xl sm:text-2xl font-black tracking-widest text-amber-300 uppercase drop-shadow-md">
                  PENDING HR APPROVAL
                </span>
                <p className="text-[10px] font-mono tracking-wider text-amber-200 mt-0.5">
                  OFFICIAL BADGE ISSUANCE IN PROGRESS
                </p>
              </div>
            </div>
          )}

          {status === 'Rejected' && (
            <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
              <div className="rotate-[-32deg] py-2 px-10 border-4 border-rose-500/80 bg-rose-500/20 backdrop-blur-[2px] rounded-2xl shadow-xl text-center">
                <span className="text-xl sm:text-2xl font-black tracking-widest text-rose-300 uppercase drop-shadow-md">
                  REQUEST DECLINED
                </span>
                <p className="text-[10px] font-mono tracking-wider text-rose-200 mt-0.5">
                  PLEASE RE-APPLY VIA HR PORTAL
                </p>
              </div>
            </div>
          )}

          {!isFlipped ? (
            /* ===================== FRONT SIDE ===================== */
            <div className="flex flex-col h-full justify-between p-6 relative">
              {/* Top Accent Light & Lanyard Notch */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-3 bg-slate-800 rounded-full border border-slate-700/80 mb-3 shadow-inner"></div>

                {/* Company Header */}
                <div className="w-full flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                      <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-indigo-400" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold tracking-wider bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                        NEXORA
                      </h2>
                      <p className="text-[9px] font-mono uppercase tracking-widest text-indigo-300 -mt-0.5">
                        Enterprise Solutions
                      </p>
                    </div>
                  </div>

                  {/* Smart Card Chip & RFID */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-6 rounded-md bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-600 p-0.5 shadow-sm border border-yellow-200/40">
                      <div className="w-full h-full border border-yellow-700/40 grid grid-cols-2 grid-rows-2"></div>
                    </div>
                    <Wifi className="w-4 h-4 text-slate-400 rotate-90" />
                  </div>
                </div>
              </div>

              {/* Middle Section: Photo & Identity Details */}
              <div className="flex flex-col items-center text-center my-4">
                {/* Avatar with Metallic Halo */}
                <div className="relative mb-3 group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full blur-sm opacity-70 group-hover:opacity-100 transition duration-1000"></div>
                  <img
                    src={empAvatar}
                    alt={empName}
                    className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-slate-900 shadow-2xl"
                  />
                  {status === 'Approved' && (
                    <div className="absolute bottom-1 right-2 w-7 h-7 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {empName}
                </h3>
                <p className="text-xs font-semibold text-indigo-400 mt-0.5">
                  {empRole}
                </p>
                <div className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] font-medium text-slate-300">
                  <span>{empDept}</span>
                </div>

                {/* Primary ID Badge Banner */}
                <div className="mt-4 w-full py-2.5 px-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 backdrop-blur-sm flex items-center justify-around">
                  <div className="text-center">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
                      Employee ID
                    </span>
                    <span className="text-base sm:text-lg font-black font-mono tracking-wider text-white">
                      {empId}
                    </span>
                  </div>

                  <div className="h-8 w-[1px] bg-white/10"></div>

                  <div className="text-center">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
                      Blood Group
                    </span>
                    <span className="text-sm sm:text-base font-black text-rose-400 flex items-center justify-center gap-1">
                      <Droplets className="w-3.5 h-3.5 text-rose-500" />
                      {bloodGroup}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Meta & Security Barcode */}
              <div className="pt-3 border-t border-white/10 space-y-3">
                <div className="grid grid-cols-2 text-[11px] font-mono text-slate-400">
                  <div>
                    <span className="block text-[9px] uppercase text-slate-500">Issued Date</span>
                    <span className="text-slate-200 font-semibold">{status === 'Approved' ? issuedDate : 'Pending'}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[9px] uppercase text-slate-500">Valid Thru</span>
                    <span className="text-slate-200 font-semibold">{status === 'Approved' ? validUntil : 'Pending'}</span>
                  </div>
                </div>

                {/* Badge Serial Strip */}
                <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[10px] font-mono">
                  <span className="text-slate-400">BADGE:</span>
                  <span className="font-bold text-indigo-300">{badgeNumber}</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {status === 'Approved' ? 'VERIFIED' : status}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* ===================== BACK SIDE ===================== */
            <div className="flex flex-col h-full justify-between p-6 relative">
              {/* Lanyard Notch */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-3 bg-slate-800 rounded-full border border-slate-700/80 mb-3 shadow-inner"></div>
                <div className="w-full text-center pb-2 border-b border-white/10">
                  <h4 className="text-xs uppercase font-mono tracking-widest text-indigo-300 font-bold">
                    Official Corporate Identity Credential
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Property of Nexora Corporation · Non-Transferable
                  </p>
                </div>
              </div>

              {/* Middle Section: Security QR Code & Contact */}
              <div className="my-auto space-y-4 text-center">
                {/* High-res Scannable SVG QR Code */}
                <div className="inline-block p-3.5 rounded-2xl bg-white shadow-xl ring-4 ring-indigo-500/20">
                  <svg
                    className="w-32 h-32 sm:w-36 sm:h-36 text-slate-900"
                    viewBox="0 0 100 100"
                    fill="currentColor"
                  >
                    {/* Visual QR Pattern */}
                    <path d="M10 10h24v24h-24z m4 4v16h16v-16z m4 4h8v8h-8z" />
                    <path d="M66 10h24v24h-24z m4 4v16h16v-16z m4 4h8v8h-8z" />
                    <path d="M10 66h24v24h-24z m4 4v16h16v-16z m4 4h8v8h-8z" />
                    <circle cx="50" cy="50" r="7" />
                    <path d="M42 20h6v8h-6z M52 20h6v8h-6z M42 32h16v6h-16z M20 42h8v6h-8z M32 42h6v6h-6z" />
                    <path d="M66 42h8v8h-8z M80 42h10v6h-10z M42 66h6v12h-6z M52 74h8v8h-8z M66 66h12v6h-12z" />
                    <path d="M66 78h8v12h-8z M80 72h10v8h-10z M82 86h8v6h-8z" />
                  </svg>
                  <span className="block text-[9px] font-mono text-slate-700 font-bold mt-1 tracking-wider">
                    SCAN TO VERIFY CREDENTIAL
                  </span>
                </div>

                {/* Emergency Details */}
                <div className="text-left p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Emergency Hotline:</span>
                    <span className="font-mono font-bold text-white text-[11px]">+1 (800) 555-NEXORA</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Next of Kin Contact:</span>
                    <span className="font-mono font-bold text-indigo-300 text-[11px]">{emergencyPhone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Corporate HQ:</span>
                    <span className="text-slate-300 text-[11px]">San Francisco, CA</span>
                  </div>
                </div>

                {/* Simulated HR Signatory */}
                <div className="pt-2 text-center">
                  <div className="inline-block border-b border-indigo-400/50 pb-1 px-4">
                    <span className="text-base italic font-serif text-indigo-300 tracking-wider">
                      Sophia Montgomery
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider mt-0.5">
                    Authorized Signatory · Human Resources
                  </p>
                </div>
              </div>

              {/* Bottom Return Notice */}
              <div className="pt-3 border-t border-white/10 text-center">
                <p className="text-[9px] text-slate-400 leading-tight">
                  If found, please deposit in any official mail drop or return to Nexora Headquarters HR Department.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Control Actions & Toolbar */}
      {showActions && (
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5 print:hidden">
          <Button
            variant="outline"
            size="sm"
            icon={RotateCw}
            onClick={() => setIsFlipped(!isFlipped)}
            className="text-white border-slate-700 bg-slate-800/80 hover:bg-slate-700"
          >
            {isFlipped ? 'Show Front' : 'Show Back (QR)'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={Printer}
            onClick={handlePrint}
            className="text-white border-slate-700 bg-slate-800/80 hover:bg-slate-700"
          >
            Print Card
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={Download}
            onClick={handleDownload}
            className="bg-indigo-600 hover:bg-indigo-500 font-bold shadow-md shadow-indigo-600/30"
          >
            Download Badge
          </Button>

          {onReapply && (
            <Button
              variant="secondary"
              size="sm"
              icon={Sparkles}
              onClick={onReapply}
            >
              Update / Reissue
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeIDCard;
