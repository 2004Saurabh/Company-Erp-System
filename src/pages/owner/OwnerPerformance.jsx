import React from 'react';
import { Award, Star, CheckCircle, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useERP } from '../../context/ERPContext';
import DataTable from '../../components/DataTable';
import ChartCard from '../../components/ChartCard';
import Badge from '../../components/Badge';

export const OwnerPerformance = () => {
  const { performanceReviews } = useERP();

  const chartData = performanceReviews.map(r => ({
    name: r.employeeName.split(' ')[0],
    score: r.overallScore,
    productivity: r.productivity,
    teamwork: r.teamwork
  }));

  const columns = [
    {
      header: 'Employee',
      accessor: 'employeeName',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">{val}</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">{row.designation} · {row.department}</span>
        </div>
      )
    },
    {
      header: 'Period',
      accessor: 'reviewPeriod',
      sortable: true
    },
    {
      header: 'Goals Delivered',
      accessor: 'completedGoals',
      sortable: true,
      render: (val, row) => (
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{val} / {row.goals}</span>
      )
    },
    {
      header: 'Productivity',
      accessor: 'productivity',
      sortable: true,
      render: (val) => `${val}%`
    },
    {
      header: 'Teamwork',
      accessor: 'teamwork',
      sortable: true,
      render: (val) => `${val}%`
    },
    {
      header: 'Overall Rating',
      accessor: 'overallScore',
      sortable: true,
      render: (val) => (
        <span className="font-black text-sm text-indigo-600 dark:text-indigo-400 font-mono">
          {val} / 100
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (val) => <Badge variant="success" size="sm">{val}</Badge>
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Company Talent Performance
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Quarterly appraisals, milestone competencies, and leadership feedback evaluations
        </p>
      </div>

      {/* Chart */}
      <ChartCard
        title="Talent Productivity & Overall Rating Comparison"
        subtitle="Individual scorecard benchmarking for Q3 2026"
      >
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
            <YAxis domain={[70, 100]} stroke="#94a3b8" fontSize={11} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
            />
            <Bar dataKey="score" name="Overall Score" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="productivity" name="Productivity" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Table */}
      <DataTable
        columns={columns}
        data={performanceReviews}
        searchKey="employeeName"
        searchPlaceholder="Search performance evaluations..."
        pageSize={8}
      />
    </div>
  );
};
export default OwnerPerformance;
