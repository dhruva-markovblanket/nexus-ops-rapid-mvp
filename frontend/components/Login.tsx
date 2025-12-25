
import React, { useState } from 'react';
import { UserRole } from '../types';
import { MOCK_USERS, LOGO_URL } from '../constants';
import { UserCircle, Shield, Wrench, Map } from 'lucide-react';

interface LoginProps {
  onLogin: (userId: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.STUDENT);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login by finding first user of that role
    const user = MOCK_USERS.find(u => u.role === selectedRole);
    if (user) {
      onLogin(user.id);
    }
  };

  const roles = [
    { id: UserRole.STUDENT, label: 'Student', icon: UserCircle, color: 'bg-blue-500' },
    { id: UserRole.STAFF, label: 'Faculty', icon: Wrench, color: 'bg-amber-500' },
    { id: UserRole.ADMIN, label: 'Admin', icon: Shield, color: 'bg-indigo-600' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="bg-indigo-600 p-8 text-center">
            <div className="flex justify-center mb-6">
                 <img src={LOGO_URL} alt="University Logo" className="h-24 w-auto object-contain bg-white/10 backdrop-blur-sm rounded-xl p-2" />
            </div>
            <h1 className="text-2xl font-bold text-white">Sapthagiri NPS University</h1>
            <p className="text-indigo-200 mt-2">Campus Portal Login</p>
        </div>
        
        <div className="p-8">
            <div className="grid grid-cols-3 gap-3 mb-8">
                {roles.map((role) => {
                    const Icon = role.icon;
                    const isSelected = selectedRole === role.id;
                    return (
                        <button
                            key={role.id}
                            type="button"
                            onClick={() => setSelectedRole(role.id)}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                                isSelected 
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                                : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                            }`}
                        >
                            <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-indigo-600' : 'text-gray-400'}`} />
                            <span className="text-xs font-semibold">{role.label}</span>
                        </button>
                    )
                })}
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                        type="email" 
                        value={`${selectedRole.toLowerCase()}@sapthagiri.edu`}
                        readOnly
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 cursor-not-allowed"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input 
                        type="password" 
                        value="password"
                        readOnly
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 cursor-not-allowed"
                    />
                </div>
                
                <button 
                    type="submit" 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-95"
                >
                    Sign In as {selectedRole === UserRole.STAFF ? 'Faculty' : selectedRole.charAt(0) + selectedRole.slice(1).toLowerCase()}
                </button>
            </form>
            
            <div className="mt-6 pt-6 border-t border-gray-100">
                <button 
                    onClick={() => onLogin('guest')}
                    className="w-full flex items-center justify-center px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl border border-gray-200 transition-all group"
                >
                    <Map className="w-5 h-5 mr-2 text-gray-400 group-hover:text-indigo-500" />
                    Continue as Guest
                </button>
                <p className="text-center text-xs text-gray-400 mt-3">
                    Guest Mode provides access to Campus Map & Navigation only.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;