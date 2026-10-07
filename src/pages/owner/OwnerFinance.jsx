import React from 'react';
import { IndianRupee, TrendingUp, CreditCard, PieChart as PieIcon, ArrowDownRight, ArrowUpRight, Download } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { useERP } from '../../context/ERPContext';
import StatCard from '../../components/StatCard';
import ChartCard from '../../components/ChartCard';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { useToast } from '../../context/ToastContext';

export const OwnerFinance = () => {
  const { departments, payroll } = useERP();
  const { addToast } = useToast();

  const financeData = [
    { month: 'Apr 2026', revenue: 420000, opex: 260000, net: 160000 },
    { month: 'May 2026', revenue: 460000, opex: 280000, net: 180000 },
    { month: 'Jun 2026', revenue: 510000, opex: 310000, net: 200000 },
    { month: 'Jul 2026', revenue: 580000, opex: 320000, net: 260000 },
    { month: 'Aug 2026', revenue: 640000, opex: 350000, net: 290000 },
    { month: 'Sep 2026', revenue: 720000, opex: 390000, net: 330000 },
  ];

  const deptBudgetData = departments.map(d => ({
    name: d.name.split(' ')[0],
    budget: d.budget,
    spent: Math.round(d.budget * 0.72)
  }));

  const handleExportStatement = () => {
    addToast('Financial ledger & P&L report exported to CSV.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Enterprise Financial Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time P&L analytics, burn rate telemetry, and divisional capital allocations
          </p>
        </div>

        <Button variant="primary" size="sm" icon={Download} onClick={handleExportStatement}>
          Download Statement
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Gross Revenue (Sep)"
          prefix="₹"
          value="720k"
          change={14.2}
          isPositive={true}
          comparisonText="Q3 Target exceeded"
          icon={IndianRupee}
        />
        <StatCard
          title="Operating Expenses"
          prefix="₹"
          value="390k"
          change={3.1}
          isPositive={false}
          comparisonText="SaaS & payroll burn"
          icon={CreditCard}
          iconColor="text-amber-500"
          iconBg="bg-amber-50 dark:bg-amber-950/60"
        />
        <StatCard
          title="Net Operating Profit"
          prefix="₹"
          value="330k"
          change={18.7}
          isPositive={true}
          comparisonText="EBITDA positive"
          icon={TrendingUp}
          iconColor="text-emerald-500"
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
        />
        <StatCard
          title="Profit Margin"
          value="45.8"
          suffix="%"
          change={4.5}
          isPositive={true}
          comparisonText="Industry leader"
          icon={PieIcon}
          iconColor="text-purple-500"
          iconBg="bg-purple-50 dark:bg-purple-950/60"
        />
      </div>

      {/* Financial Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Trailing EBITDA Growth"
          subtitle="Net monthly profit generation vs total operating burn"
        >
          <ResponsiveContainer width="100%" height={270}>
            <AreaChart data={financeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip
                formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, '']}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Area type="monotone" dataKey="net" name="Net Profit" stroke="#10b981" strokeWidth={2.5} fill="url(#netGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Departmental Capital vs. Spend"
          subtitle="Annual budget allocated vs current YTD committed funds"
        >
          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={deptBudgetData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
              <Tooltip
                formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, '']}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Bar dataKey="budget" name="Approved Budget" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="spent" name="Committed Spend" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};
export default OwnerFinance;
