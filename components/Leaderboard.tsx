import React, { useState } from 'react';
import { UserData, CHALLENGES } from '../types';

interface LeaderboardProps {
  currentUser: UserData;
  allUsers: UserData[];
  onToggleFriend: (targetUserId: string) => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ currentUser, allUsers, onToggleFriend }) => {
  const [filter, setFilter] = useState<'all' | 'friends'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate progress for everyone
  const rankings = allUsers.map(user => {
    if (!user.challengeId) return null;
    const challenge = CHALLENGES[user.challengeId];
    const total = user.activities.reduce((acc, curr) => acc + curr.value, 0);
    const percentage = Math.min(100, (total / challenge.target) * 100);
    
    return {
      ...user,
      total,
      percentage,
      challengeTitle: challenge.title,
      unit: challenge.unit
    };
  }).filter(u => u !== null).sort((a, b) => b.percentage - a.percentage);

  // Filter based on selection and search
  const displayList = rankings.filter(u => {
    // 1. Tab Filter
    if (filter === 'friends') {
        if (u.id !== currentUser.id && !currentUser.friends.includes(u.id)) return false;
    }

    // 2. Search Filter
    if (searchTerm) {
        return u.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    return true;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">Leaderboard</h2>
            <p className="text-sm text-gray-500">See who is leading the pack 🐿️</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Search runners..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none w-full sm:w-64"
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>

            {/* Toggle Switch */}
            <div className="bg-gray-100 p-1 rounded-lg flex text-sm font-medium shrink-0">
                <button 
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-md transition-all ${filter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    All
                </button>
                <button 
                    onClick={() => setFilter('friends')}
                    className={`px-4 py-2 rounded-md transition-all ${filter === 'friends' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Friends
                </button>
            </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                <tr>
                    <th className="px-6 py-4">Rank</th>
                    <th className="px-6 py-4">Runner</th>
                    <th className="px-6 py-4">Challenge</th>
                    <th className="px-6 py-4">Progress</th>
                    <th className="px-6 py-4 text-right">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {displayList.map((user, index) => {
                    const isMe = user.id === currentUser.id;
                    const isFriend = currentUser.friends.includes(user.id);
                    const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`;

                    return (
                        <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${isMe ? 'bg-red-50' : ''}`}>
                            <td className="px-6 py-4 font-bold text-gray-700 text-lg w-16 text-center">
                                {rankEmoji}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs mr-3 ${isMe ? 'bg-red-600' : 'bg-gray-400'}`}>
                                        {user.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <span className={`font-medium ${isMe ? 'text-gray-900' : 'text-gray-600'}`}>
                                        {user.name} {isMe && '(You)'}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                {user.challengeTitle}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-green-500 rounded-full" 
                                            style={{ width: `${user.percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-bold text-gray-700">{user.percentage.toFixed(0)}%</span>
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                    {user.total.toFixed(1)} / {CHALLENGES[user.challengeId!].target} {user.unit}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                {!isMe && (
                                    <button 
                                        onClick={() => onToggleFriend(user.id)}
                                        className={`text-xs font-bold px-3 py-1 rounded-full border transition-all ${
                                            isFriend 
                                            ? 'border-gray-300 text-gray-500 hover:bg-red-100 hover:text-red-600 hover:border-red-200' 
                                            : 'bg-gray-900 text-white border-transparent hover:bg-gray-700 shadow-sm'
                                        }`}
                                    >
                                        {isFriend ? 'Following ✓' : '+ Add Friend'}
                                    </button>
                                )}
                            </td>
                        </tr>
                    );
                })}
                {displayList.length === 0 && (
                    <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-400 italic">
                             {filter === 'friends' ? (
                                <div className="flex flex-col items-center gap-2">
                                     <p>{searchTerm ? `No friends named "${searchTerm}" found.` : "You haven't added any friends yet."}</p>
                                     <button 
                                        onClick={() => setFilter('all')}
                                        className="text-red-600 font-bold hover:underline"
                                     >
                                        Switch to 'All Runners' to find them!
                                     </button>
                                </div>
                            ) : (
                                "No runners found."
                            )}
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
};