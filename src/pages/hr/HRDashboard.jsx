import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Clock,
  CalendarDays,
  Briefcase,
  Cake,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  Award,
  Home
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { useERP } from '../../context/ERPContext';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import ChartCard from '../../components/ChartCard';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import WFHPersonnelWidget from '../../components/WFHPersonnelWidget';
import EmployeeModal from '../../components/modals/EmployeeModal';
import MarkWFHAttendanceModal from '../../components/modals/MarkWFHAttendanceModal';

export const HRDashboard = () => {
  const { employees, attendance, leaves, jobOpenings, candidates, departments } = useERP();
  const navigate = useNavigate();

  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isWFHModalOpen, setIsWFHModalOpen] = useState(false);

  // Stats
  const todayStr = '2026-10-01';
  const todayAttendance = attendance.filter(a => a.date === todayStr);
  const presentCount = todayAttendance.filter(a => a.status === 'Present').length;
  const lateCount = todayAttendance.filter(a => a.status === 'Late').length;
  const onLeaveCount = todayAttendance.filter(a => a.status === 'On Leave').length;
  const wfhList = todayAttendance.filter(a => a.isWFH || a.workMode === 'Work From Home' || a.networkName?.includes('Work From Home'));
  const wfhCount = wfhList.length;
  const attendanceRate = Math.round(((presentCount + lateCount) / (employees.length || 1)) * 100);

  const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
  const activeJobs = jobOpenings.filter(j => j.status === 'Open').length;

  // HR Charts
  const growthData = [
    { month: 'Apr', count: 92 },
    { month: 'May', count: 97 },
    { month: 'Jun', count: 101 },
    { month: 'Jul', count: 106 },
    { month: 'Aug', count: 109 },
    { month: 'Sep', count: 112 },
  ];

  const attendanceWeekly = [
    { day: 'Mon', rate: 97 },
    { day: 'Tue', rate: 98 },
    { day: 'Wed', rate: 95 },
    { day: 'Thu', rate: 96 },
    { day: 'Fri', rate: 94 },
  ];

  const hiringPipelineData = [
    { stage: 'Applied', count: candidates.filter(c => c.stage === 'Applied').length },
    { stage: 'Screening', count: candidates.filter(c => c.stage === 'Screening').length },
    { stage: 'Interview', count: candidates.filter(c => c.stage === 'Interview').length },
    { stage: 'Selected', count: candidates.filter(c => c.stage === 'Selected').length },
    { stage: 'Hired', count: candidates.filter(c => c.stage === 'Hired').length },
  ];

  const deptColors = ['#6366f1', '#10b981', '#a855f7', '#f59e0b', '#0ea5e9', '#f43f5e'];
  const departmentPieData = departments.map((d, index) => ({
    name: d.name,
    value: d.employeeCount || 6,
    color: deptColors[index % deptColors.length]
  }));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-[11px] font-bold tracking-wider uppercase text-emerald-300">
              Human Capital Operations
            </span>
            <span className="text-xs text-slate-400">People Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1.5">
            Welcome, Sophia Montgomery
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Workforce Wellness, Talent Acquisition, Attendance Monitoring & Benefits
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={Home}
            onClick={() => setIsWFHModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/30"
          >
            Mark WFH Attendance
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={Plus}
            onClick={() => setIsEmployeeModalOpen(true)}
          >
            Add Employee
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={Plus}
            onClick={() => navigate('/hr/recruitment')}
          >
            Create Job
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={CalendarDays}
            onClick={() => navigate('/hr/leave')}
          >
            Review Leaves
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={Clock}
            onClick={() => navigate('/hr/attendance')}
          >
            View Attendance
          </Button>
        </div>
      </div>

      {/* KPI Cards (Section 9 requirement: 8 HR KPI cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Workforce"
          value={employees.length}
          change={6.2}
          isPositive={true}
          comparisonText="12 active departments"
          icon={Users}
          linkTo="/hr/employees"
        />
        <StatCard
          title="New Hires (Q3)"
          value="4"
          change={33.3}
          isPositive={true}
          comparisonText="Onboarded this month"
          icon={UserPlus}
          iconColor="text-emerald-500"
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
          linkTo="/hr/onboarding"
        />
        <StatCard
          title="Present Today"
          value={presentCount}
          comparisonText={`${attendanceRate}% overall rate`}
          icon={CheckCircle2}
          iconColor="text-emerald-500"
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
          linkTo="/hr/attendance"
        />
        <StatCard
          title="On Leave Today"
          value={onLeaveCount}
          comparisonText="Scheduled absences"
          icon={CalendarDays}
          iconColor="text-sky-500"
          iconBg="bg-sky-50 dark:bg-sky-950/60"
          linkTo="/hr/leave"
        />
        <StatCard
          title="Pending Leave Requests"
          value={pendingLeaves}
          change={pendingLeaves > 0 ? 10 : 0}
          isPositive={pendingLeaves === 0}
          comparisonText="Requires review"
          icon={AlertCircle}
          iconColor="text-amber-500"
          iconBg="bg-amber-50 dark:bg-amber-950/60"
          linkTo="/hr/leave"
        />
        <StatCard
          title="Open Job Positions"
          value={activeJobs}
          comparisonText={`${candidates.length} active candidates`}
          icon={Briefcase}
          iconColor="text-purple-500"
          iconBg="bg-purple-50 dark:bg-purple-950/60"
          linkTo="/hr/recruitment"
        />
        <StatCard
          title="Work From Home (WFH)"
          value={wfhCount}
          comparisonText="HR-authorized remote shifts"
          icon={Home}
          iconColor="text-indigo-600 dark:text-indigo-400"
          iconBg="bg-indigo-50 dark:bg-indigo-950/60"
          linkTo="/hr/attendance"
        />
        <StatCard
          title="Attendance SLA"
          value={attendanceRate}
          suffix="%"
          change={1.8}
          isPositive={true}
          comparisonText="Punctuality index"
          icon={Clock}
          iconColor="text-emerald-500"
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
          linkTo="/hr/attendance"
        />
      </div>

      {/* Live Remote Workforce / WFH Personnel Widget */}
      <WFHPersonnelWidget
        title="Active Work From Home (WFH) Staff"
        subtitle="Staff members authorized to clock in remotely with office WiFi geofence bypass"
      />

      {/* Row 1: Charts (Employee Growth & Weekly Attendance) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Headcount Growth Trajectory"
          subtitle="Monthly net employee additions"
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="hrGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} domain={[80, 120]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="count" name="Staff Count" stroke="#10b981" strokeWidth={2.5} fill="url(#hrGrowthGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Weekly Attendance Punctuality Rate"
          subtitle="Daily percentages of staff presence"
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={attendanceWeekly} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
              <YAxis domain={[90, 100]} stroke="#94a3b8" fontSize={11} />
              <Tooltip
                formatter={(v) => [`${v}%`, 'Attendance Rate']}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Line type="monotone" dataKey="rate" name="Rate" stroke="#6366f1" strokeWidth={3} dot={{ r: 5, fill: '#6366f1' }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 2: Charts (Department Headcount & Recruitment Funnel) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard
          title="Department Headcount Distribution"
          subtitle="Organizational personnel spread"
        >
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={departmentPieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {departmentPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Active Candidate Recruitment Pipeline"
          subtitle="Talent progression across hiring gates"
          action={
            <Button variant="ghost" size="sm" icon={ArrowRight} onClick={() => navigate('/hr/recruitment')}>
              Kanban
            </Button>
          }
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={hiringPipelineData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="stage" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="count" name="Candidates" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
      />

      <MarkWFHAttendanceModal
        isOpen={isWFHModalOpen}
        onClose={() => setIsWFHModalOpen(false)}
      />
    </div>
  );
};
export default HRDashboard;
