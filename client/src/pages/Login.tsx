import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  AlertCircle,
  Building2,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Please provide your username or email address and password.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await api.post('/auth/login', {
        identifier: identifier.trim(),
        password,
      });

      if (res.data.success) {
        login(res.data.token, res.data.user);

        // Redirect based on role
        const role = res.data.user.role;
        switch (role) {
          case 'STUDENT':
            navigate('/student');
            break;
          case 'FACULTY':
            navigate('/faculty');
            break;
          case 'UNIVERSITY':
            navigate('/university');
            break;
          case 'ADMIN':
            navigate('/admin');
            break;
          default:
            navigate('/');
        }
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Login failed. Please verify your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (ident: string, pass: string) => {
    setIdentifier(ident);
    setPassword(pass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#021814] text-slate-100 flex items-center justify-center px-4 py-28 relative overflow-hidden">
      {/* Glow Backdrops */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-forest-800 p-0.5 shadow-glow-emerald">
              <div className="w-full h-full bg-[#021814] rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <span className="font-display font-extrabold text-2xl tracking-wider text-white">
              EDU<span className="text-emerald-400">NEXA</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold font-display text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400">
            Sign in to access your customized academic portal
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl glass-panel bg-[#03241e]/90 border border-emerald-500/30 p-8 shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email or Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="student@edunexa.org or username"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-forest-900/90 border border-emerald-800/60 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-forest-900/90 border border-emerald-800/60 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-glow-emerald transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to EDUNEXA</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Bar for Easy Testing */}
          <div className="pt-4 border-t border-emerald-950 space-y-2">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">
              Quick One-Click Demo Credentials:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => fillDemoAccount('student@edunexa.org', 'Student@12345')}
                className="p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/50 text-emerald-300 text-left transition-colors"
              >
                <span className="font-bold block">🎓 Student Demo</span>
                <span className="text-[10px] text-slate-400">aaravsharma</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('faculty@edunexa.org', 'Faculty@12345')}
                className="p-2 rounded-lg bg-teal-950/60 hover:bg-teal-900 border border-teal-800/50 text-teal-300 text-left transition-colors"
              >
                <span className="font-bold block">👨‍🏫 Faculty Demo</span>
                <span className="text-[10px] text-slate-400">drradhakrishnan</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('university@edunexa.org', 'University@12345')}
                className="p-2 rounded-lg bg-purple-950/60 hover:bg-purple-900 border border-purple-800/50 text-purple-300 text-left transition-colors"
              >
                <span className="font-bold block">🏛️ University Demo</span>
                <span className="text-[10px] text-slate-400">nitcofficial</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('admin@edunexa.org', 'Admin@12345')}
                className="p-2 rounded-lg bg-amber-950/60 hover:bg-amber-900 border border-amber-800/50 text-amber-300 text-left transition-colors"
              >
                <span className="font-bold block">👑 Admin Demo</span>
                <span className="text-[10px] text-slate-400">edunexaadmin</span>
              </button>
            </div>
          </div>

          {/* Signup Link */}
          <div className="text-center text-xs text-slate-400 pt-2">
            Don't have an account yet?{' '}
            <Link to="/signup" className="text-emerald-400 hover:text-emerald-300 font-semibold underline">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
