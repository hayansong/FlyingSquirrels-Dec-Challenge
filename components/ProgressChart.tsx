import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from '../types';

interface ProgressChartProps {
  activities: Activity[];
  unit: string;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ activities, unit }) => {
  // Prepare data: Cumulative sum over time
  const data = React.useMemo(() => {
    if (activities.length === 0) return [];

    // Sort activities by date
    const sorted = [...activities].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let cumulative = 0;
    const chartData = sorted.map(act => {
      cumulative += act.value;
      return {
        date: new Date(act.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        value: cumulative,
        rawDate: act.date
      };
    });

    // Ensure we start from 0 if needed, or just show progress points
    if (chartData.length > 0) {
        // Add a "Start" point if the first activity isn't day 1 (optional, keeping it simple for now)
    }

    return chartData;
  }, [activities]);

  if (data.length < 2) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200 border-dashed">
        <p className="text-gray-400 text-sm">Log at least 2 activities to see the trend graph.</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full mt-6">
       <h3 className="text-lg font-bold text-gray-800 mb-4">Progress Trend</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            tick={{fontSize: 12, fill: '#6b7280'}} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{fontSize: 12, fill: '#6b7280'}} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#dc2626" 
            fill="#fee2e2" 
            strokeWidth={3}
            activeDot={{ r: 6, fill: '#dc2626', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
