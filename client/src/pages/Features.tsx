import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  Building2,
  ShieldCheck,
  Compass,
  BookOpen,
  Calendar,
  Sparkles,
  FileCheck,
  CheckCircle,
  BarChart3,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const Features: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'STUDENT' | 'FACULTY' | 'UNIVERSITY' | 'ADMIN'>('STUDENT');

  const featureTabs = [
    { id: 'STUDENT', label: 'Student Ecosystem', icon: GraduationCap, color: 'text-emerald-400' },
    { id: 'FACULTY', label: 'Faculty Portal', icon: Users, color: 'text-teal-400' },
    { id: 'UNIVERSITY', label: 'University Console', icon: Building2, color: 'text-purple-400' },
    { id: 'ADMIN', label: 'Admin Control Center', icon: ShieldCheck, color: 'text-amber-400' },
  ];

  return (
    <div className="min-h-screen bg-[#021814] text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800/60 text-emerald-400 text-xs font-semibold">
            <Layers className="w-4 h-4" />
            <span>Platform Capabilities</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-white">
            Tailored Experiences for Every{' '}
            <span className="text-gradient-emerald">Academic Stakeholder</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            EDUNEXA provides role-specific tools built specifically for students, faculty, universities, and enterprise administrators.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {featureTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2.5 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-glow-emerald border border-emerald-400/30'
                    : 'glass-panel bg-forest-900/40 text-slate-300 hover:text-white hover:bg-forest-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${tab.color}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        {activeTab === 'STUDENT' && (
          <div className="space-y-10">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
                Student Learning & Discovery Suite
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Everything an aspirant and enrolled scholar needs to excel academically and navigate higher education.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-3xl glass-panel p-6 space-y-3 border border-emerald-800/40">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Multi-State College Discovery</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Search across Kerala, Karnataka, Tamil Nadu, Maharashtra, and Delhi. Filter by NIRF rank, accreditation, affiliation, and state quota eligibility.
                </p>
              </div>

              <div className="rounded-3xl glass-panel p-6 space-y-3 border border-emerald-800/40">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Fee Structure Transparency</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Compare exact tuition, exam, lab, and hostel expenses side-by-side with verified official gazette citations.
                </p>
              </div>

              <div className="rounded-3xl glass-panel p-6 space-y-3 border border-emerald-800/40">
                <div className="w-10 h-10 rounded-xl bg-mint-500/20 text-mint-400 flex items-center justify-center">
                  <FileCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Admission Tracker</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Track your journey through 8 clear application stages with personalized document readiness checklists.
                </p>
              </div>

              <div className="rounded-3xl glass-panel p-6 space-y-3 border border-emerald-800/40">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Academic Resource Repository</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Navigate syllabus files, handwritten faculty notes, question banks, and verified previous year question papers.
                </p>
              </div>

              <div className="rounded-3xl glass-panel p-6 space-y-3 border border-emerald-800/40">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Study Partner Matching</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Intelligent compatibility matching based on shared subjects, schedule availability, and preferred learning styles.
                </p>
              </div>

              <div className="rounded-3xl glass-panel p-6 space-y-3 border border-emerald-800/40">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">AI Learning Assistant</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Ask conceptual doubts, generate practice quizzes, explain complex formulas, and receive 7-day exam revision plans.
                </p>
              </div>
            </div>

            <div className="text-center pt-4">
              <Link
                to="/signup"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-glow-emerald transition-all"
              >
                <span>Register as Student</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'FACULTY' && (
          <div className="space-y-10">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
                Faculty Pedagogical & Course Management
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Equipping educators with modern curriculum management, assignment workflows, and AI instructional aid.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-3xl glass-panel p-6 space-y-3 border border-teal-800/40">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Course & Syllabus Control</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Manage assigned courses, upload official syllabi, and organize lecture modules per semester.
                </p>
              </div>

              <div className="rounded-3xl glass-panel p-6 space-y-3 border border-teal-800/40">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <FileCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Assignment & Grading Hub</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Create structured assignments, collect student solution submissions, record marks, and provide constructive feedback.
                </p>
              </div>

              <div className="rounded-3xl glass-panel p-6 space-y-3 border border-teal-800/40">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">AI Teaching Assistant</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Draft 60-minute lesson plans, formulate Bloom’s taxonomy questions, prepare quiz banks, and design assessment rubrics.
                </p>
              </div>
            </div>

            <div className="text-center pt-4">
              <Link
                to="/signup"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-glow-emerald transition-all"
              >
                <span>Register as Faculty</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'UNIVERSITY' && (
          <div className="space-y-10">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
                University & Campus Administration Console
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Centralized profile management, department directories, course fee matrices, and admission announcements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-3xl glass-panel p-6 space-y-3 border border-purple-800/40">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Institution Profile & Accreditation</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Manage official campus profile, accreditation disclosures, contact hotlines, and campus facility listings.
                </p>
              </div>

              <div className="rounded-3xl glass-panel p-6 space-y-3 border border-purple-800/40">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Official Fee Gazette Publishing</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Configure approved annual tuition, semester charges, and scholarship waivers with official circular references.
                </p>
              </div>

              <div className="rounded-3xl glass-panel p-6 space-y-3 border border-purple-800/40">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">AI Institutional Communications</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Draft intake announcements, campus advisories, admission prospectuses, and candidate FAQ documents.
                </p>
              </div>
            </div>

            <div className="text-center pt-4">
              <Link
                to="/signup"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all"
              >
                <span>Register as University</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'ADMIN' && (
          <div className="space-y-10">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
                Enterprise Platform Governance & Control Center
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Zero fake metrics, comprehensive audit logging, user status moderation, and verification queues.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-3xl glass-panel p-6 space-y-3 border border-amber-800/40">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Real-Time Metrics & Auditing</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Real database counts of registered students, faculty, institutions, courses, and an immutable log of every administrative action.
                </p>
              </div>

              <div className="rounded-3xl glass-panel p-6 space-y-3 border border-amber-800/40">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">User Moderation & Suspension</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Search across users, filter by role, activate or suspend accounts with recorded justification reasons.
                </p>
              </div>

              <div className="rounded-3xl glass-panel p-6 space-y-3 border border-amber-800/40">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                  <FileCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Institution Verification Queues</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Review submitted university credentials, verify official websites, and toggle verification seals.
                </p>
              </div>
            </div>

            <div className="text-center pt-4">
              <p className="text-xs text-slate-400">
                Note: Administrator accounts are created exclusively through secure backend provisioning.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Features;
