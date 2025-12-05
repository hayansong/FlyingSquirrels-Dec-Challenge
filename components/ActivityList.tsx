import React from 'react';
import { Activity } from '../types';

interface ActivityListProps {
  activities: Activity[];
  unit: string;
  onDelete: (id: string) => void;
}

export const ActivityList: React.FC<ActivityListProps> = ({ activities, unit, onDelete }) => {
  // Sort by date descending
  const sortedActivities = [...activities].sort((a, b) => b.timestamp - a.timestamp);

  if (sortedActivities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 italic">
        No activities logged yet. Time to run! 🏃‍♂️
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold text-gray-800 mb-3">Recent Logs</h3>
      <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
        {sortedActivities.map((activity) => (
          <div key={activity.id} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex justify-between items-center group">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-lg">{activity.value} {unit}</span>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{activity.date}</span>
              </div>
              {activity.note && (
                <p className="text-sm text-gray-500 mt-1">{activity.note}</p>
              )}
            </div>
            <button
              onClick={() => onDelete(activity.id)}
              className="text-gray-300 hover:text-red-500 transition-colors p-2"
              title="Delete log"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
