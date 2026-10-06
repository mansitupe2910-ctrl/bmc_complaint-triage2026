import React, { useState } from 'react';
import { Complaint, Language } from '../../types';
import { mumbaiWards } from '../../data/mockData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import {
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Layers,
  ChevronDown,
  ChevronUp,
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';

interface OfficerAnalyticsChartsProps {
  complaints: Complaint[];
  language: Language;
  selectedWard: string;
  onSelectWard?: (wardId: string) => void;
}

export const OfficerAnalyticsCharts: React.FC<OfficerAnalyticsChartsProps> = ({
  complaints,
  language,
  selectedWard,
  onSelectWard,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'both' | 'wards' | 'status'>('both');

  // Filter complaints if a ward is selected (or show full city data with selected highlight)
  const activeComplaints = selectedWard === 'all' 
    ? complaints 
    : complaints.filter(c => c.wardId === selectedWard);

  // 1. Compute Complaints by Ward Data for Bar Chart
  const wardMap: Record<string, { wardId: string; label: string; area: string; total: number; resolved: number; inProgress: number; pending: number }> = {};

  mumbaiWards.forEach(w => {
    wardMap[w.id] = {
      wardId: w.id,
      label: `W-${w.id}`,
      area: language === 'mr' ? w.name.mr : w.keyAreas.split(',')[0],
      total: 0,
      resolved: 0,
      inProgress: 0,
      pending: 0,
    };
  });

  complaints.forEach(c => {
    const wid = c.wardId || 'K/W';
    if (!wardMap[wid]) {
      wardMap[wid] = {
        wardId: wid,
        label: `W-${wid}`,
        area: wid,
        total: 0,
        resolved: 0,
        inProgress: 0,
        pending: 0,
      };
    }
    wardMap[wid].total += 1;
    if (c.status === 'resolved') {
      wardMap[wid].resolved += 1;
    } else if (c.status === 'in_progress' || c.status === 'verification_pending') {
      wardMap[wid].inProgress += 1;
    } else {
      wardMap[wid].pending += 1;
    }
  });

  // Include wards with complaints, sorted descending by total
  const wardChartData = Object.values(wardMap)
    .filter(w => w.total > 0)
    .sort((a, b) => b.total - a.total);

  // If few wards have complaints, include top 6 wards for visual balance
  if (wardChartData.length < 5) {
    const defaultWards = ['K/W', 'H/W', 'G/N', 'F/N', 'A', 'R/C'];
    defaultWards.forEach(wid => {
      if (!wardChartData.some(d => d.wardId === wid) && wardMap[wid]) {
        wardChartData.push(wardMap[wid]);
      }
    });
  }

  // 2. Compute Status Distribution Data for Pie Chart
  // Statuses: Pending (new/assigned), In-Progress (in_progress/verification_pending), Resolved
  const pendingCount = activeComplaints.filter(c => c.status === 'new' || c.status === 'assigned').length;
  const inProgressCount = activeComplaints.filter(c => c.status === 'in_progress' || c.status === 'verification_pending').length;
  const resolvedCount = activeComplaints.filter(c => c.status === 'resolved').length;
  const totalCount = activeComplaints.length;

  const statusDistributionData = [
    {
      name: language === 'mr' ? 'प्रलंबित (Pending)' : 'Pending',
      rawName: 'Pending',
      value: pendingCount,
      percentage: totalCount > 0 ? Math.round((pendingCount / totalCount) * 100) : 0,
      color: '#f59e0b', // Amber
    },
    {
      name: language === 'mr' ? 'प्रगतीत (In-Progress)' : 'In-Progress',
      rawName: 'In-Progress',
      value: inProgressCount,
      percentage: totalCount > 0 ? Math.round((inProgressCount / totalCount) * 100) : 0,
      color: '#3b82f6', // Blue
    },
    {
      name: language === 'mr' ? 'निकाली (Resolved)' : 'Resolved',
      rawName: 'Resolved',
      value: resolvedCount,
      percentage: totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0,
      color: '#10b981', // Emerald
    },
  ];

  // Custom Tooltip for Ward Bar Chart
  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 border border-slate-700 shadow-xl rounded-none text-xs font-mono space-y-1 z-50">
          <p className="font-bold text-amber-300 text-sm">{data.wardId} - {data.area}</p>
          <div className="space-y-0.5 text-[11px] pt-1 border-t border-slate-700">
            <p className="flex justify-between gap-4">
              <span className="text-slate-300">{language === 'mr' ? 'एकूण तक्रारी:' : 'Total:'}</span>
              <strong className="text-white font-bold">{data.total}</strong>
            </p>
            <p className="flex justify-between gap-4">
              <span className="text-amber-400">{language === 'mr' ? 'प्रलंबित:' : 'Pending:'}</span>
              <strong className="text-amber-400">{data.pending}</strong>
            </p>
            <p className="flex justify-between gap-4">
              <span className="text-blue-400">{language === 'mr' ? 'प्रगतीत:' : 'In-Progress:'}</span>
              <strong className="text-blue-400">{data.inProgress}</strong>
            </p>
            <p className="flex justify-between gap-4">
              <span className="text-emerald-400">{language === 'mr' ? 'निकाली:' : 'Resolved:'}</span>
              <strong className="text-emerald-400">{data.resolved}</strong>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Status Pie Chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-2.5 border border-slate-700 shadow-xl rounded-none text-xs font-mono z-50">
          <p className="font-bold" style={{ color: data.color }}>{data.name}</p>
          <p className="text-sm font-black text-white mt-0.5">
            {data.value} {language === 'mr' ? 'तक्रारी' : 'complaints'} ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border-2 border-slate-300 rounded-none shadow-xs text-left overflow-hidden">
      {/* Header Bar */}
      <div className="px-4 py-3 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-2">
              <span>{language === 'mr' ? 'तक्रार विश्लेषण व आलेख (Data Visualizations)' : 'Complaint Analytics & Visualizations'}</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-1.5 py-0.2 border border-emerald-500/40">
                Recharts Live
              </span>
            </h2>
            <p className="text-[11px] text-slate-300">
              {language === 'mr'
                ? 'वॉर्डनिहाय तक्रारींचा आलेख व स्थितीनुसार वर्गीकरण'
                : 'Complaints count by ward and status distribution overview'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* View Mode Chips */}
          <div className="hidden sm:flex items-center bg-slate-800 p-0.5 border border-slate-700 text-xs">
            <button
              onClick={() => setActiveTab('both')}
              className={`px-2 py-1 text-[11px] font-bold cursor-pointer transition-colors ${
                activeTab === 'both' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              {language === 'mr' ? 'दोन्ही आलेख' : 'Both'}
            </button>
            <button
              onClick={() => setActiveTab('wards')}
              className={`px-2 py-1 text-[11px] font-bold cursor-pointer transition-colors ${
                activeTab === 'wards' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              {language === 'mr' ? 'वॉर्ड आलेख' : 'Wards'}
            </button>
            <button
              onClick={() => setActiveTab('status')}
              className={`px-2 py-1 text-[11px] font-bold cursor-pointer transition-colors ${
                activeTab === 'status' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              {language === 'mr' ? 'स्थिती आलेख' : 'Status'}
            </button>
          </div>

          {/* Toggle Expand */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Charts Body */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          
          {/* High-level KPI Mini Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 bg-slate-50 border border-slate-200 text-left">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">{language === 'mr' ? 'एकूण तक्रारी:' : 'Total Complaints:'}</span>
              <strong className="text-lg font-black text-slate-900">{activeComplaints.length}</strong>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {selectedWard === 'all' ? (language === 'mr' ? '२४ वॉर्ड' : 'All Wards') : `Ward ${selectedWard}`}
              </span>
            </div>

            <div className="p-2.5 bg-amber-50/70 border border-amber-200 text-left">
              <span className="text-[10px] text-amber-800 uppercase font-bold block">{language === 'mr' ? 'प्रलंबित (Pending):' : 'Pending:'}</span>
              <strong className="text-lg font-black text-amber-900">{pendingCount}</strong>
              <span className="text-[10px] text-amber-700 block mt-0.5">
                {totalCount > 0 ? Math.round((pendingCount / totalCount) * 100) : 0}% of total
              </span>
            </div>

            <div className="p-2.5 bg-blue-50/70 border border-blue-200 text-left">
              <span className="text-[10px] text-blue-800 uppercase font-bold block">{language === 'mr' ? 'प्रगतीत (In-Progress):' : 'In-Progress:'}</span>
              <strong className="text-lg font-black text-blue-900">{inProgressCount}</strong>
              <span className="text-[10px] text-blue-700 block mt-0.5">
                {totalCount > 0 ? Math.round((inProgressCount / totalCount) * 100) : 0}% of total
              </span>
            </div>

            <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 text-left">
              <span className="text-[10px] text-emerald-800 uppercase font-bold block">{language === 'mr' ? 'निकाली (Resolved):' : 'Resolved:'}</span>
              <strong className="text-lg font-black text-emerald-950">{resolvedCount}</strong>
              <span className="text-[10px] text-emerald-700 block mt-0.5">
                {totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0}% resolution rate
              </span>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Chart 1: Bar Chart of Complaints by Ward */}
            {(activeTab === 'both' || activeTab === 'wards') && (
              <div className={`${activeTab === 'both' ? 'lg:col-span-7' : 'lg:col-span-12'} border border-slate-200 p-3 sm:p-4 bg-white space-y-2`}>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                      {language === 'mr' ? 'वॉर्डनिहाय तक्रारी (Complaints by Ward)' : 'Complaints by Administrative Ward'}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5">
                    Bar Chart
                  </span>
                </div>

                <div className="h-64 sm:h-72 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={wardChartData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis
                        dataKey="wardId"
                        tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
                        stroke="#94a3b8"
                        interval={0}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        stroke="#94a3b8"
                      />
                      <Tooltip content={<CustomBarTooltip />} />
                      <Bar
                        dataKey="total"
                        name={language === 'mr' ? 'तक्रारी संख्या' : 'Total Complaints'}
                        radius={[2, 2, 0, 0]}
                        onClick={(entry: any) => {
                          const wid = entry?.wardId || entry?.payload?.wardId;
                          if (onSelectWard && wid) {
                            onSelectWard(wid);
                          }
                        }}
                        className="cursor-pointer"
                      >
                        {wardChartData.map((entry) => {
                          const isSelected = selectedWard === entry.wardId;
                          return (
                            <Cell
                              key={`cell-${entry.wardId}`}
                              fill={isSelected ? '#059669' : '#0284c7'}
                            />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 bg-sky-600 inline-block"></span>
                      <span>{language === 'mr' ? 'वॉर्ड तक्रारी' : 'Ward Total'}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 bg-emerald-600 inline-block"></span>
                      <span>{language === 'mr' ? 'निवडलेला वॉर्ड' : 'Selected Ward'}</span>
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {language === 'mr' ? 'स्तंभावर क्लिक करून वॉर्ड निवडा' : 'Click bar to filter ward'}
                  </span>
                </div>
              </div>
            )}

            {/* Chart 2: Pie Chart of Status Distribution */}
            {(activeTab === 'both' || activeTab === 'status') && (
              <div className={`${activeTab === 'both' ? 'lg:col-span-5' : 'lg:col-span-12'} border border-slate-200 p-3 sm:p-4 bg-white space-y-2`}>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-1.5">
                    <PieChartIcon className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                      {language === 'mr' ? 'स्थितीनुसार वर्गीकरण (Status Distribution)' : 'Status Distribution'}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5">
                    Donut / Pie
                  </span>
                </div>

                <div className="h-56 sm:h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusDistributionData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={3}
                        label={(props: any) => {
                          const percent = props?.percent;
                          return percent ? `${Math.round(percent * 100)}%` : '';
                        }}
                        labelLine={false}
                      >
                        {statusDistributionData.map((entry, index) => (
                          <Cell
                            key={`cell-status-${index}`}
                            fill={entry.color}
                            stroke="#ffffff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Status Distribution Legend Details */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                  {statusDistributionData.map((s) => (
                    <div key={s.rawName} className="p-1.5 bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-center gap-1 text-[11px] font-bold" style={{ color: s.color }}>
                        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: s.color }}></span>
                        <span>{s.rawName}</span>
                      </div>
                      <p className="text-sm font-black text-slate-900 mt-0.5">{s.value}</p>
                      <span className="text-[10px] text-slate-500">{s.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      )}
    </div>
  );
};
