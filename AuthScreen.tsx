import React, { useState } from 'react';

interface AuthScreenProps {
  onLogin: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Regular Expression to validate email structure
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // 2. Extract the text before the '@' using Split
    const emailPrefix = email.split('@')[0];

    // 3. Match password to the prefix
    if (password === emailPrefix) {
      onLogin();
    } else {
      setError(`Access Denied: Enter correct password!`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://picsum.photos/1920/1080?blur=10')] bg-cover">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>
      
      <div className="relative z-10 glass p-10 rounded-2xl w-full max-w-md shadow-2xl border border-cyan-500/30">
        <div className="text-center mb-10">
          <div className="inline-block p-4 rounded-full bg-cyan-500/10 mb-4 ring-1 ring-cyan-500/50 glow-cyan">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
          <h1 className="text-4xl font-black font-orbitron text-cyan-400 tracking-widest mb-2 uppercase">PULSEAI</h1>
          <p className="text-slate-400 tracking-tighter">Multimodal HCI Interface v4.0.2</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs p-3 rounded-lg text-center font-mono">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-cyan-500 uppercase tracking-widest mb-2">User Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-slate-100 focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="name@domain.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-cyan-500 uppercase tracking-widest mb-2">Security Hash (Email Prefix)</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-slate-100 focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="Enter password"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-lg shadow-lg shadow-cyan-900/40 transition-all font-orbitron tracking-widest uppercase mt-4"
          >
            Authenticate Session
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          SECURE CHANNEL ENCRYPTED [256-BIT AES]
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
