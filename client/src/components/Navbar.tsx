import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  BookOpen,
  Users,
  Compass,
  Building2,
  ChevronDown,
  PhoneCall,
  FileText,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'STUDENT':
        return '/student';
      case 'FACULTY':
        return '/faculty';
      case 'UNIVERSITY':
        return '/university';
      case 'ADMIN':
        return '/admin';
      default:
        return '/student';
    }
  };

  // Navigation Destinations
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Universities', path: '/universities' },
    { name: 'Colleges', path: '/colleges' },
    { name: 'Schools', path: '/schools' },
    { name: 'Courses', path: '/courses' },
    { name: 'Admissions', path: '/admission' },
    { name: 'Study Resources', path: '/study-resources' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'FACULTY':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'UNIVERSITY':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#021814]/95 backdrop-blur-md border-b border-emerald-900/40 shadow-lg py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* NEXORA Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-forest-800 p-0.5 shadow-glow-emerald group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#021814] rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-emerald-400 group-hover:text-mint-300 transition-colors" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-2xl tracking-wider text-white flex items-center gap-1.5">
                NEX<span className="text-emerald-400">ORA</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-ping"></span>
              </span>
              <span className="text-[10px] text-emerald-300/70 font-medium tracking-widest uppercase -mt-1 hidden sm:block">
                Education Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-1.5 text-xs xl:text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'text-emerald-300 bg-emerald-950/80 border border-emerald-800/40 shadow-sm font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-emerald-950/30'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* User Account / Auth Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2.5 px-3.5 py-1.5 rounded-xl bg-forest-900/80 border border-emerald-800/50 hover:border-emerald-500/60 transition-all text-sm"
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300 text-xs font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white font-medium text-xs">{user.username}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${getRoleBadgeColor(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-forest-900 border border-emerald-900/60 shadow-2xl p-2 z-50 animate-fadeIn">
                    <Link
                      to={getDashboardPath()}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-950/60 rounded-xl transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                      <span>
                        {user.role === 'STUDENT' ? 'Student Dashboard' : `${user.role} Dashboard`}
                      </span>
                    </Link>

                    <Link
                      to="/admission"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-emerald-950/60 rounded-xl transition-colors"
                    >
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span>Apply for Admission</span>
                    </Link>

                    <div className="my-1 border-t border-emerald-900/40" />

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/40 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-forest-900/60 rounded-xl transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-forest-700 hover:from-emerald-400 hover:to-forest-600 text-[#021814] font-extrabold text-xs shadow-glow-emerald transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-forest-900 text-slate-300 hover:text-white border border-emerald-900/40"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#021814]/98 border-b border-emerald-900/50 px-4 pt-4 pb-6 space-y-3 backdrop-blur-xl animate-fadeIn">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-xl text-xs font-medium ${
                  location.pathname === link.path
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'bg-forest-900/50 text-slate-300 hover:bg-forest-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-emerald-900/40 space-y-2">
            {user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-forest-800 text-white font-semibold text-xs border border-emerald-500/30"
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                  {user.role === 'STUDENT' ? 'Student Dashboard' : `${user.role} Dashboard`}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-red-950/40 text-red-300 text-xs font-semibold border border-red-900/40"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 rounded-xl bg-forest-900 text-center text-xs font-bold text-white border border-emerald-900/40"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-forest-700 text-center text-xs font-extrabold text-[#021814]"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
