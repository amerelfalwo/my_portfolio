import { useState } from 'react';
import { m } from 'framer-motion';
import { Lock, User, ArrowRight, ShieldAlert, Hexagon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, username, password }),
      });

      const data = await res.json();

      if (!res.ok || (!data.success && !data.token)) {
        throw new Error(data.error || 'Authentication failed. Invalid credentials.');
      }

      if (data.token) {
        localStorage.setItem('aura_token', data.token);
      }

      // Successful login -> Redirect to Admin Dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Login Error:', err.message);
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden px-4 font-sans selection:bg-purple-500/30">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <m.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 p-8 md:p-10 rounded-[2.5rem] shadow-[0_0_80px_rgba(168,85,247,0.15)] relative z-10"
      >
        <div className="text-center mb-8">
          <m.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)]"
          >
            <Hexagon className="text-cyan-400 w-8 h-8 animate-pulse" />
          </m.div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 uppercase tracking-widest mb-2">
            Aura CMS
          </h2>
          <p className="text-slate-400 text-xs font-bold tracking-[0.2em] uppercase font-mono">
            Admin Authentication Protocol
          </p>
        </div>

        {error && (
          <m.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-xs font-bold tracking-wider uppercase font-mono"
          >
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </m.div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1 font-mono">
              Username
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-400 focus:bg-slate-900 transition-all text-sm font-bold placeholder:text-slate-600" 
                placeholder="admin" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1 font-mono">
              Passkey / Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-purple-400 focus:bg-slate-900 transition-all text-sm font-bold placeholder:text-slate-600" 
                placeholder="••••••••••••" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-4 mt-6 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 transition-all outline-none disabled:opacity-50 group shadow-lg shadow-purple-500/25 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Initialize Session'}
            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
      </m.div>
    </div>
  );
};

export default Login;
