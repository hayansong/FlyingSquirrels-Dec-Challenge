import React from 'react';

interface ProgressBarProps {
  current: number;
  target: number;
  unit: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, target, unit }) => {
  const percentage = Math.min(100, Math.max(0, (current / target) * 100));
  
  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-end mb-6">
        <div>
          <span className="text-4xl font-black text-red-600">{current}</span>
          <span className="text-gray-500 ml-1 font-medium">/ {target} {unit}</span>
        </div>
        <span className="text-sm font-bold text-gray-600">{percentage.toFixed(1)}% Completed</span>
      </div>
      
      {/* Progress Track */}
      <div className="relative w-full bg-gray-200 rounded-full h-4">
        
        {/* Acorn Goal at Finish Line */}
        <div 
          className="absolute -right-1 top-1/2 -translate-y-1/2 translate-x-1/2 text-2xl z-10 select-none" 
          title="Finish Line!"
        >
          🌰
        </div>

        {/* Filled Progress Bar */}
        <div 
          className="bg-red-600 h-4 rounded-full transition-all duration-1000 ease-out relative"
          style={{ width: `${percentage}%` }}
        >
          {/* Squirrel Marker */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 select-none">
            {/* Flip the squirrel to face right */}
            <div className="text-3xl transform -scale-x-100 pb-1">
              🐿️
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-between text-xs text-gray-400">
        <span>Start</span>
        <span className="mr-2">Finish Line 🏁</span>
      </div>
    </div>
  );
};