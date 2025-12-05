import React from 'react';
import { Challenge } from '../types';

interface ChallengeCardProps {
  challenge: Challenge;
  isSelected: boolean;
  onClick: () => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, isSelected, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 
        flex flex-col items-center text-center space-y-1 bg-white hover:shadow-lg
        ${isSelected ? 'border-red-600 shadow-md ring-1 ring-red-600' : 'border-gray-300 hover:border-gray-400'}
      `}
    >
      <span className={`text-5xl font-extrabold ${isSelected ? 'text-red-600' : 'text-gray-900'}`}>
        {challenge.bigValue}
      </span>
      <h3 className="font-bold text-lg text-gray-800 mt-1">{challenge.title}</h3>
      <p className="text-sm text-gray-500">{challenge.description}</p>
      <span className="text-xs text-gray-600 mt-2 block">Trophy: {challenge.trophy}</span>
    </div>
  );
};
