import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Sparkles,
  Search,
  Compass,
  BookOpen,
  Users,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Award,
  Building2,
  FileText,
  Calendar,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  MapPin,
  ExternalLink,
  Laptop,
  Check,
  Star,
} from 'lucide-react';
import api from '../services/api';
import { Institution, Course } from '../types';

export const Home: React.FC = () => {
  const [stats, setStats] = useState({
    colleges: 6,
    courses: 8,
    resources: 12,
    students: 24,
  });
  const [popularColleges, setPopularColleges] = useState<Institution[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    // Fetch real metrics and colleges
    const loadHomeData = async () => {
      try {
        const [instRes] = await Promise.all([
          api.get('/institutions?limit=4'),
        ]);
        if (instRes.data.success) {
          setPopularColleges(instRes.data.data);
          setStats((prev) => ({
            ...prev,
            colleges: instRes.data.pagination.total || 6,
          }));
        }
      } catch (err) {
        console.error('Home data fetch error:', err);
      }
    };
    loadHomeData();
  }, []);

  const faqs = [
    {
      q: 'What is NEXORA and who can use it?',
      a: 'NEXORA is a comprehensive academic and admission management ecosystem unifying Students, Faculty, Universities, and Administrators. Students can discover verified Indian colleges, compare fee structures, access academic notes and question papers, apply for admission online, and get AI academic guidance.',
    },
    {
      q: 'How does NEXORA ensure course fee transparency?',
      a: 'Every course fee on NEXORA is verified against official government gazettes, NIRF disclosures, and university admissions notifications. We break down annual tuition, admission, examination, laboratory, and hostel charges with verifiable sources.',
    },
    {
      q: 'How does the online 7-step admission application work?',
      a: 'Students complete personal, academic, and guardian records, select target universities and programs, attach certificates, agree to the declaration, and submit. NEXORA generates a unique reference number (e.g. NEXORA-2026-XXXXXX) for official tracking.',
    },
    {
      q: 'Can institutions and faculty manage their own content?',
      a: 'Yes. Verified universities have dedicated dashboards to manage departments, course matrices, and official announcements. Faculty members can upload syllabi, notes, previous year question papers, and create assignments.',
    },
    {
      q: 'How does the AI Assistant adapt to different user roles?',
      a: 'The NEXORA AI Assistant provides role-aware assistance: students get concept explanations and study schedules, faculty get lesson planning and quiz drafting tools, universities get admission brochure structuring, and administrators get governance insights.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#021814] text-slate-100 overflow-hidden pt-20">
      {/* ===================== HERO SECTION ===================== */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        {/* Animated Glow Blobs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-forest-900/20 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Heading, Subheading & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Pill Tag */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>All-In-One AI Academic & Admission Ecosystem</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight font-display text-white leading-[1.1]">
              Your Education.{' '}
              <span className="text-gradient-emerald">Your Future.</span>
            </h1>

            {/* Supporting Heading */}
            <h2 className="text-xl sm:text-2xl font-medium text-slate-300">
              One Intelligent Platform.{' '}
              <span className="text-gold-400 font-semibold">Endless Possibilities.</span>
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Discover colleges, explore admissions, access academic resources, connect with study partners, and learn with personalized AI assistance.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/universities"
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-base shadow-glow-emerald hover:shadow-emerald-500/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
              >
                <GraduationCap className="w-5 h-5" />
                <span>Explore Universities</span>
              </Link>

              <Link
                to="/colleges"
                className="px-7 py-3.5 rounded-2xl glass-panel bg-forest-900/60 hover:bg-forest-800/80 border border-emerald-500/40 text-emerald-200 font-semibold text-base transition-all hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Compass className="w-5 h-5 text-emerald-400" />
                <span>Find Colleges</span>
              </Link>

              <Link
                to="/admission"
                className="px-7 py-3.5 rounded-2xl glass-card-gold bg-amber-950/30 hover:bg-amber-900/40 border border-gold-500/40 text-gold-300 font-semibold text-base transition-all hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-gold-400" />
                <span>Apply for Admission</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Verified Indian Universities
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Transparent Fee Gazettes
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Role-Aware AI Mentorship
              </span>
            </div>
          </motion.div>

          {/* Right Column: Floating Interactive Cards Composition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative w-full max-w-lg mx-auto">
              {/* Background Backdrop Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-teal-400/20 rounded-3xl blur-2xl"></div>

              {/* Central Main Showcase Card */}
              <div className="relative rounded-3xl glass-panel bg-[#03231c]/90 border border-emerald-500/30 p-6 shadow-2xl space-y-5">
                {/* Header of Preview */}
                <div className="flex items-center justify-between border-b border-emerald-800/40 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">NIT Calicut — JoSAA Allotment</h4>
                      <p className="text-xs text-emerald-400">B.Tech Computer Science & Eng</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    VERIFIED
                  </span>
                </div>

                {/* Course Fee Structure Highlights */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Annual Tuition Fee:</span>
                    <span className="font-semibold text-white">₹1,25,000 / yr</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Hostel & Mess Charges:</span>
                    <span className="font-semibold text-white">₹35,000 / yr</span>
                  </div>
                  <div className="flex justify-between text-xs text-emerald-300 font-bold pt-1 border-t border-emerald-900/60">
                    <span>Total Verified Package:</span>
                    <span>₹1,78,000</span>
                  </div>
                </div>

                {/* AI Assistant Live Interaction Preview */}
                <div className="rounded-2xl bg-forest-950/80 border border-emerald-800/50 p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-xs text-gold-400 font-semibold">
                    <Sparkles className="w-4 h-4" />
                    <span>EDUNEXA AI Mentor</span>
                  </div>
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    “Based on your interest in Graph Algorithms and GATE, I recommend the Semester 4 module on Dijkstra's Fibonacci heap optimization in the Study Resources library.”
                  </p>
                </div>

                {/* Floating Micro Badge 1 */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-6 -right-6 rounded-2xl glass-panel bg-[#042d24] border border-emerald-500/40 px-4 py-2.5 shadow-xl flex items-center gap-2.5 text-xs text-white"
                >
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
                  <div>
                    <p className="font-bold text-emerald-300">96% Study Match</p>
                    <p className="text-[10px] text-slate-400">Algorithms & ML Peer Found</p>
                  </div>
                </motion.div>

                {/* Floating Micro Badge 2 */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -bottom-6 -left-6 rounded-2xl glass-card-gold bg-[#1e1707] border border-gold-500/40 px-4 py-2.5 shadow-xl flex items-center gap-2.5 text-xs text-gold-200"
                >
                  <FileText className="w-4 h-4 text-gold-400" />
                  <div>
                    <p className="font-bold text-gold-300">End-Sem 2025 Paper</p>
                    <p className="text-[10px] text-gold-200/70">OS & DBMS Verified PDF</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================== PLATFORM STATISTICS ===================== */}
      <section className="py-12 border-y border-emerald-900/40 bg-[#021310]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl glass-panel bg-forest-900/30 border border-emerald-800/30">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-display">
                {stats.colleges}+
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-300 mt-1">
                Verified Indian Institutions
              </p>
              <span className="text-[10px] text-slate-500">Kerala, Karnataka, TN, MH, DL</span>
            </div>

            <div className="p-6 rounded-2xl glass-panel bg-forest-900/30 border border-emerald-800/30">
              <p className="text-3xl sm:text-4xl font-extrabold text-teal-400 font-display">
                100%
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-300 mt-1">
                Fee Gazette Transparency
              </p>
              <span className="text-[10px] text-slate-500">Official Institutional Audits</span>
            </div>

            <div className="p-6 rounded-2xl glass-panel bg-forest-900/30 border border-emerald-800/30">
              <p className="text-3xl sm:text-4xl font-extrabold text-mint-400 font-display">
                10+
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-300 mt-1">
                Resource Categories
              </p>
              <span className="text-[10px] text-slate-500">Syllabi, Question Papers, Notes</span>
            </div>

            <div className="p-6 rounded-2xl glass-panel bg-forest-900/30 border border-emerald-800/30">
              <p className="text-3xl sm:text-4xl font-extrabold text-gold-400 font-display">
                4-Role
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-300 mt-1">
                Unified Ecosystem
              </p>
              <span className="text-[10px] text-slate-500">Student, Faculty, Univ, Admin</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== POPULAR COLLEGES SECTION ===================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-semibold mb-3">
              <Building2 className="w-3.5 h-3.5" />
              <span>Multi-State Directory</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
              Discover Premier Indian Colleges
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              Verified admission requirements, NIRF rankings, and transparent course-specific fee breakdowns.
            </p>
          </div>
          <Link
            to="/colleges"
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>View All Institutions</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularColleges.map((inst) => (
            <div
              key={inst.id}
              className="rounded-3xl glass-panel glass-panel-hover p-6 flex flex-col justify-between border border-emerald-900/50"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/60 mb-2">
                      {inst.institutionType}
                    </span>
                    <h3 className="text-lg font-bold text-white line-clamp-1">{inst.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      {inst.city}, {inst.state}
                    </p>
                  </div>
                  {inst.nirfRank && (
                    <div className="text-right flex-shrink-0">
                      <span className="text-[10px] font-bold text-gold-400 bg-amber-950/60 border border-amber-800/50 px-2 py-1 rounded-lg">
                        NIRF #{inst.nirfRank}
                      </span>
                    </div>
                  )}
                </div>

                {/* Facilities Preview */}
                <p className="text-xs text-slate-400 mt-4 line-clamp-2">
                  <span className="font-semibold text-slate-300">Facilities: </span>
                  {inst.facilities}
                </p>

                {/* Course count */}
                <div className="mt-4 pt-4 border-t border-emerald-950 flex items-center justify-between text-xs text-slate-300">
                  <span>Available Programs:</span>
                  <span className="font-semibold text-emerald-400">
                    {inst._count?.courses || inst.courses?.length || 3} Courses
                  </span>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  to={`/colleges/${inst.slug || inst.id}`}
                  className="w-full py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 border border-emerald-600/30 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>View Fee Matrix & Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== HOW EDUNEXA WORKS ===================== */}
      <section className="py-20 bg-[#011410] border-t border-emerald-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/60">
              Streamlined Lifecycle
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-3">
              How EDUNEXA Empowers Your Academic Path
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              From college discovery to graduation, EDUNEXA coordinates every educational milestone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="rounded-2xl glass-panel p-6 space-y-3 relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-lg border border-emerald-500/30">
                1
              </div>
              <h3 className="text-base font-bold text-white">Discover & Compare</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Filter accredited institutions across Indian states by cutoffs, NIRF rank, and verified tuition fee gazettes.
              </p>
            </div>

            <div className="rounded-2xl glass-panel p-6 space-y-3 relative">
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-lg border border-teal-500/30">
                2
              </div>
              <h3 className="text-base font-bold text-white">Track Admissions</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Maintain application statuses from “Interested” to “Accepted” with document readiness reminders.
              </p>
            </div>

            <div className="rounded-2xl glass-panel p-6 space-y-3 relative">
              <div className="w-12 h-12 rounded-xl bg-mint-500/20 text-mint-300 flex items-center justify-center font-bold text-lg border border-mint-500/30">
                3
              </div>
              <h3 className="text-base font-bold text-white">Collaborate & Match</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect with compatible peers for GATE and semester exams using intelligent study partner matching.
              </p>
            </div>

            <div className="rounded-2xl glass-panel p-6 space-y-3 relative">
              <div className="w-12 h-12 rounded-xl bg-gold-500/20 text-gold-300 flex items-center justify-center font-bold text-lg border border-gold-500/30">
                4
              </div>
              <h3 className="text-base font-bold text-white">AI-Powered Learning</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Access lecture notes, previous question papers, and query role-aware AI assistants for step-by-step guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== DEVELOPER TEAM SHOWCASE ===================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="team">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-gold-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800/60">
            Meet the Developers
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-3">
            Architects of EDUNEXA
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            The core engineering and design team dedicated to transforming academic technology in India.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Profile 1: Fana Jathin */}
          <div className="rounded-3xl glass-panel p-6 text-center border border-emerald-800/40 hover:border-emerald-500/50 transition-all hover:-translate-y-1">
            <div className="w-20 h-20 rounded-2xl mx-auto bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 mb-4 shadow-glow-emerald">
              <div className="w-full h-full bg-[#021814] rounded-[14px] flex items-center justify-center text-xl font-extrabold text-emerald-300">
                FJ
              </div>
            </div>
            <h3 className="text-base font-bold text-white">Fana Jathin</h3>
            <p className="text-xs font-semibold text-emerald-400 mt-0.5">
              Project Lead & Lead Full-Stack Developer
            </p>
            <div className="mt-4 pt-3 border-t border-emerald-950 text-left space-y-1 text-xs text-slate-400">
              <p className="font-semibold text-slate-300">Responsibilities:</p>
              <p>• Overall project coordination</p>
              <p>• Core architecture & integration</p>
              <p>• Feature implementation</p>
              <p>• Code review & technical planning</p>
            </div>
          </div>

          {/* Profile 2: Mohammed Safwan */}
          <div className="rounded-3xl glass-panel p-6 text-center border border-emerald-800/40 hover:border-emerald-500/50 transition-all hover:-translate-y-1">
            <div className="w-20 h-20 rounded-2xl mx-auto bg-gradient-to-tr from-teal-500 to-mint-400 p-0.5 mb-4 shadow-glow-emerald">
              <div className="w-full h-full bg-[#021814] rounded-[14px] flex items-center justify-center text-xl font-extrabold text-teal-300">
                MS
              </div>
            </div>
            <h3 className="text-base font-bold text-white">Mohammed Safwan</h3>
            <p className="text-xs font-semibold text-teal-400 mt-0.5">
              UI/UX Designer & Frontend Developer
            </p>
            <div className="mt-4 pt-3 border-t border-emerald-950 text-left space-y-1 text-xs text-slate-400">
              <p className="font-semibold text-slate-300">Responsibilities:</p>
              <p>• Interface & homepage design</p>
              <p>• Animations & user experience</p>
              <p>• Responsive component system</p>
              <p>• Visual branding guidelines</p>
            </div>
          </div>

          {/* Profile 3: Shibil */}
          <div className="rounded-3xl glass-panel p-6 text-center border border-emerald-800/40 hover:border-emerald-500/50 transition-all hover:-translate-y-1">
            <div className="w-20 h-20 rounded-2xl mx-auto bg-gradient-to-tr from-emerald-600 to-forest-800 p-0.5 mb-4 shadow-glow-emerald">
              <div className="w-full h-full bg-[#021814] rounded-[14px] flex items-center justify-center text-xl font-extrabold text-emerald-400">
                SH
              </div>
            </div>
            <h3 className="text-base font-bold text-white">Shibil</h3>
            <p className="text-xs font-semibold text-emerald-400 mt-0.5">
              Backend & Database Developer
            </p>
            <div className="mt-4 pt-3 border-t border-emerald-950 text-left space-y-1 text-xs text-slate-400">
              <p className="font-semibold text-slate-300">Responsibilities:</p>
              <p>• REST API architecture</p>
              <p>• PostgreSQL / Prisma schema</p>
              <p>• Authentication & authorization</p>
              <p>• Data validation & server security</p>
            </div>
          </div>

          {/* Profile 4: Anwar */}
          <div className="rounded-3xl glass-panel p-6 text-center border border-emerald-800/40 hover:border-emerald-500/50 transition-all hover:-translate-y-1">
            <div className="w-20 h-20 rounded-2xl mx-auto bg-gradient-to-tr from-amber-500 to-gold-400 p-0.5 mb-4 shadow-glow-gold">
              <div className="w-full h-full bg-[#021814] rounded-[14px] flex items-center justify-center text-xl font-extrabold text-gold-300">
                AN
              </div>
            </div>
            <h3 className="text-base font-bold text-white">Anwar</h3>
            <p className="text-xs font-semibold text-gold-400 mt-0.5">
              QA & Integration Developer
            </p>
            <div className="mt-4 pt-3 border-t border-emerald-950 text-left space-y-1 text-xs text-slate-400">
              <p className="font-semibold text-slate-300">Responsibilities:</p>
              <p>• Workflow verification & testing</p>
              <p>• Bug fixing & test automation</p>
              <p>• Cross-browser testing</p>
              <p>• System documentation</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FREQUENTLY ASKED QUESTIONS ===================== */}
      <section className="py-20 bg-[#011410] border-t border-emerald-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/60">
              Questions & Answers
            </span>
            <h2 className="text-3xl font-extrabold font-display text-white mt-3">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl glass-panel border border-emerald-900/50 overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between text-slate-200 hover:text-emerald-300 font-semibold text-sm sm:text-base transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronRight
                      className={`w-5 h-5 text-emerald-400 transform transition-transform duration-200 ${
                        isOpen ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-emerald-950 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== BOTTOM CTA BANNER ===================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-[#032d24] via-[#043c30] to-[#02241d] border border-emerald-500/40 p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-display mb-4">
            Begin Your Academic Journey with EDUNEXA
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8">
            Join thousands of students and faculty members collaborating, tracking admissions, and mastering coursework together.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-base shadow-glow-emerald transition-all"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 rounded-2xl glass-panel bg-forest-950/60 hover:bg-forest-900 border border-emerald-500/30 text-emerald-300 font-semibold text-base transition-all"
            >
              Sign In to Portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
