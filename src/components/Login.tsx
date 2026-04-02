import React, { useState } from 'react';
import { ShieldCheck, Lock, User, AlertCircle } from 'lucide-react';
import { api } from '../api/client';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await api.login(username, password);
      localStorage.setItem('soc_token', res.data.token);
      localStorage.setItem('soc_user', JSON.stringify(res.data.user));
      onLoginSuccess(res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-soc-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-soc-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-soc-blue/20">
            <ShieldCheck className="w-10 h-10 text-soc-blue" />
          </div>
          <h1 className="text-2xl font-bold text-soc-text tracking-tight">CyberSOC Platform</h1>
          <p className="text-soc-muted text-sm mt-2">Secure Analyst Authentication</p>
        </div>

        <div className="bg-soc-surface border border-soc-border rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-soc-red/10 border border-soc-red/20 rounded-xl flex items-center gap-3 text-soc-red text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-soc-muted uppercase tracking-widest mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-soc-muted" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-soc-bg border border-soc-border rounded-xl py-3 pl-11 pr-4 text-soc-text focus:outline-none focus:border-soc-blue transition-colors"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-soc-muted uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-soc-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-soc-bg border border-soc-border rounded-xl py-3 pl-11 pr-4 text-soc-text focus:outline-none focus:border-soc-blue transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-soc-blue text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-soc-blue/20"
            >
              {isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-soc-border text-center">
            <p className="text-xs text-soc-muted">
              Default credentials: <span className="text-soc-text font-mono">admin / admin123</span>
            </p>
          </div>
        </div>

        <p className="text-center text-[10px] text-soc-muted mt-8 uppercase tracking-widest">
          Authorized Personnel Only • System Monitored
        </p>
      </div>
    </div>
  );
}
