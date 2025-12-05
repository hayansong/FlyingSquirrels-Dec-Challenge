import React, { useState, useEffect } from 'react';
import { UserData, CHALLENGES, ChallengeId, Activity, UserDatabase } from './types';
import { ChallengeCard } from './components/ChallengeCard';
import { ProgressBar } from './components/ProgressBar';
import { ActivityForm } from './components/ActivityForm';
import { ActivityList } from './components/ActivityList';
import { ProgressChart } from './components/ProgressChart';
import { Leaderboard } from './components/Leaderboard';

const DB_KEY = 'flying_squirrels_db_v1';
const SESSION_KEY = 'flying_squirrels_session_v1';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserDatabase>({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Load Data
  useEffect(() => {
    const savedDB = localStorage.getItem(DB_KEY);
    const savedSession = localStorage.getItem(SESSION_KEY);
    
    if (savedDB) {
      try {
        setUsers(JSON.parse(savedDB));
      } catch (e) { console.error("DB Parse Error", e); }
    }
    
    if (savedSession) {
      setCurrentUserId(savedSession);
    }

    setLoading(false);
  }, []);

  // Save Data
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(DB_KEY, JSON.stringify(users));
    }
  }, [users, loading]);

  // Save Session
  useEffect(() => {
    if (!loading) {
        if (currentUserId) {
            localStorage.setItem(SESSION_KEY, currentUserId);
        } else {
            localStorage.removeItem(SESSION_KEY);
        }
    }
  }, [currentUserId, loading]);

  // ACTIONS

  const handleRegister = (name: string, challengeId: ChallengeId) => {
    const newId = crypto.randomUUID();
    const newUser: UserData = {
        id: newId,
        name,
        challengeId,
        activities: [],
        friends: []
    };
    
    setUsers(prev => ({ ...prev, [newId]: newUser }));
    setCurrentUserId(newId);
  };

  const handleLogin = (userId: string) => {
      setCurrentUserId(userId);
  };

  const handleLogout = () => {
      if (confirm("Log out?")) {
        setCurrentUserId(null);
      }
  };

  const handleAddActivity = (newActivity: Omit<Activity, 'id' | 'timestamp'>) => {
    if (!currentUserId) return;
    
    const activity: Activity = {
      ...newActivity,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };

    setUsers(prev => ({
        ...prev,
        [currentUserId]: {
            ...prev[currentUserId],
            activities: [...prev[currentUserId].activities, activity]
        }
    }));
  };

  const handleDeleteActivity = (actId: string) => {
    if (!currentUserId) return;
    
    setUsers(prev => ({
        ...prev,
        [currentUserId]: {
            ...prev[currentUserId],
            activities: prev[currentUserId].activities.filter(a => a.id !== actId)
        }
    }));
  };

  const handleToggleFriend = (targetId: string) => {
    if (!currentUserId) return;

    setUsers(prev => {
        const currentUser = prev[currentUserId];
        const isFriend = currentUser.friends.includes(targetId);
        
        let newFriends;
        if (isFriend) {
            newFriends = currentUser.friends.filter(id => id !== targetId);
        } else {
            newFriends = [...currentUser.friends, targetId];
        }

        return {
            ...prev,
            [currentUserId]: {
                ...currentUser,
                friends: newFriends
            }
        };
    });
  };

  if (loading) return null;

  // VIEW: AUTH / SETUP
  if (!currentUserId || !users[currentUserId]) {
    return (
        <SetupView 
            existingUsers={Object.values(users)} 
            onRegister={handleRegister} 
            onLogin={handleLogin} 
        />
    );
  }

  // VIEW: DASHBOARD
  const currentUser = users[currentUserId];
  const currentChallenge = CHALLENGES[currentUser.challengeId!];
  const totalValue = currentUser.activities.reduce((sum, act) => sum + act.value, 0);

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-start justify-center bg-gray-50">
      <div className="w-full max-w-6xl space-y-8">
        
        {/* Header Card */}
        <header className="bg-white shadow-xl rounded-xl p-6 md:p-8 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
            <div className="text-center md:text-left">
                <h1 className="doto-style-h1 text-gray-900 leading-tight">December<br/>Challenge</h1>
                <p className="text-gray-500 font-medium mt-2">FlyingSquirrels Run 🐿️</p>
            </div>
            
            <div className="flex flex-col items-end gap-2">
                 <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                    <span className="text-sm font-bold text-gray-700 mr-1">Hi, {currentUser.name}</span>
                 </div>
                 <button 
                    onClick={handleLogout}
                    className="text-xs text-gray-400 hover:text-red-600 underline"
                 >
                    Sign Out
                 </button>
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Input & My Stats */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-gray-800 text-lg">My Target</h2>
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wider">
                        {currentChallenge.title}
                    </span>
                 </div>
                 <div className="text-center py-4">
                     <span className="text-5xl font-black text-gray-900 block">{currentChallenge.bigValue}</span>
                     <span className="text-gray-500 uppercase text-xs font-bold tracking-widest">{currentChallenge.unit} Goal</span>
                 </div>
            </div>

            <ActivityForm unit={currentChallenge.unit} onAdd={handleAddActivity} />
          </div>

          {/* Right Column: Visualization & Leaderboard */}
          <div className="lg:col-span-2 space-y-8">
            
            <ProgressBar 
              current={parseFloat(totalValue.toFixed(2))} 
              target={currentChallenge.target} 
              unit={currentChallenge.unit} 
            />

            <Leaderboard 
                currentUser={currentUser}
                allUsers={Object.values(users)}
                onToggleFriend={handleToggleFriend}
            />

            <ProgressChart activities={currentUser.activities} unit={currentChallenge.unit} />
            
            <ActivityList 
              activities={currentUser.activities} 
              unit={currentChallenge.unit} 
              onDelete={handleDeleteActivity} 
            />
          </div>
        </div>

      </div>
    </div>
  );
}

// --- SETUP / LOGIN COMPONENT ---

interface SetupViewProps {
    existingUsers: UserData[];
    onRegister: (name: string, id: ChallengeId) => void;
    onLogin: (id: string) => void;
}

const SetupView: React.FC<SetupViewProps> = ({ existingUsers, onRegister, onLogin }) => {
  const [view, setView] = useState<'login' | 'register'>(existingUsers.length > 0 ? 'login' : 'register');
  const [name, setName] = useState('');
  const [selectedId, setSelectedId] = useState<ChallengeId | null>(null);
  const [error, setError] = useState('');

  const handleRegisterSubmit = () => {
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!selectedId) { setError('Please select a challenge.'); return; }
    onRegister(name, selectedId);
  };

  return (
    <div className="min-h-screen p-4 flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Brand */}
        <div className="bg-gray-900 p-8 md:w-1/3 flex flex-col justify-between text-white relative overflow-hidden">
            <div className="relative z-10">
                <div className="text-5xl mb-4">🐿️</div>
                <h1 className="text-3xl font-black uppercase tracking-widest leading-none mb-2">Flying<br/>Squirrels</h1>
                <p className="text-gray-400 text-sm">December Challenge</p>
            </div>
            <div className="relative z-10 mt-12">
                <p className="text-gray-500 text-xs">Join the crew, log your miles, earn your coffee.</p>
            </div>
            {/* Decorative Circle */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-600 rounded-full opacity-20 blur-2xl"></div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:w-2/3">
            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-gray-100 pb-2">
                <button 
                    onClick={() => { setView('login'); setError(''); }}
                    className={`pb-2 text-sm font-bold transition-colors ${view === 'login' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Login
                </button>
                <button 
                    onClick={() => { setView('register'); setError(''); }}
                    className={`pb-2 text-sm font-bold transition-colors ${view === 'register' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Join Challenge
                </button>
            </div>

            {view === 'login' && (
                <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome back!</h2>
                    {existingUsers.length === 0 ? (
                        <p className="text-gray-500">No runners registered yet. Switch to "Join Challenge" to start.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                            {existingUsers.map(u => (
                                <button 
                                    key={u.id}
                                    onClick={() => onLogin(u.id)}
                                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-red-500 hover:bg-red-50 transition-all text-left group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold group-hover:bg-red-200 group-hover:text-red-700">
                                        {u.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="ml-3">
                                        <p className="font-bold text-gray-800">{u.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{CHALLENGES[u.challengeId!].title}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {view === 'register' && (
                <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Profile</h2>
                    <p className="text-gray-500 text-sm mb-6">Choose your challenge level.</p>
                    
                    <div className="grid grid-cols-3 gap-2 mb-6">
                        {(Object.values(CHALLENGES) as any[]).map((c) => (
                        <div 
                            key={c.id} 
                            onClick={() => { setSelectedId(c.id); setError(''); }} 
                            className={`
                                cursor-pointer rounded-lg border p-2 text-center transition-all
                                ${selectedId === c.id ? 'border-red-600 bg-red-50 ring-1 ring-red-600' : 'border-gray-200 hover:border-gray-300'}
                            `}
                        >
                            <span className={`block text-xl font-black ${selectedId === c.id ? 'text-red-600' : 'text-gray-800'}`}>{c.bigValue}</span>
                            <span className="text-[10px] uppercase font-bold text-gray-500">{c.unit}</span>
                        </div>
                        ))}
                    </div>

                    <div className="mb-6">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Your Name</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => { setName(e.target.value); setError(''); }}
                            placeholder="e.g. Speedy Gonzales" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                        />
                    </div>

                    <button 
                        onClick={handleRegisterSubmit}
                        className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition duration-300 shadow-md"
                    >
                        Start Running
                    </button>
                    {error && <p className="text-red-600 text-sm mt-3 text-center font-bold animate-pulse">{error}</p>}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};