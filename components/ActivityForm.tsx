import React, { useState } from 'react';
import { Activity } from '../types';

interface ActivityFormProps {
  unit: string;
  onAdd: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({ unit, onAdd }) => {
  const [value, setValue] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numValue = parseFloat(value);
    if (!numValue || numValue <= 0) return;

    onAdd({
      value: numValue,
      date,
      note
    });

    setValue('');
    setNote('');
  };

  return (
    <div className="bg-gray-100 p-6 rounded-xl shadow-inner border border-gray-200 h-full">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">👟</span> Log Activity
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
            Distance / Count ({unit})
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
            placeholder={`e.g. ${unit === 'km' ? '5.2' : '1'}`}
          />
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
            Date
          </label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
            Note (Optional)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
            placeholder="Morning run, treadmill, etc."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition duration-300 shadow-md transform active:scale-95"
        >
          Log Run
        </button>
      </form>
    </div>
  );
};
