import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  LayoutDashboard,
  ShieldCheck,
  BookOpen,
  DollarSign,
  FileCheck,
  Users,
  Sparkles,
  LogOut,
  Plus,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Institution, Course, AdmissionApplication } from '../../types';

export const UniversityDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'COURSES' | 'FEES' | 'ADMISSIONS' | 'PROFILE'>('OVERVIEW');
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [loading, setLoading] = useState(true);

  // New Course Modal
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    code: '',
    level: 'UNDERGRADUATE',
    durationYears: 4,
    description: '',
    eligibility: '',
    totalSeats: 60,
    tuitionFee: 100000,
    hostelFee: 35000,
  });

  const profile = user?.profile || user?.universityProfile;

  const loadUnivData = async () => {
    setLoading(true);
    try {
      const [instRes, courseRes, appRes] = await Promise.all([
        api.get('/institutions'),
        api.get('/courses'),
        api.get('/admissions/my-applications'),
      ]);

      if (instRes.data.success) setInstitutions(instRes.data.data);
      if (courseRes.data.success) setCourses(courseRes.data.data);
      if (appRes.data.success) setApplications(appRes.data.data);
    } catch (err) {
      console.error('Univ dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUnivData();
  }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const targetInst = institutions[0];
      if (!targetInst) return;

      const res = await api.post('/courses', {
        institutionId: targetInst.id,
        departmentId: targetInst.departments?.[0]?.id || targetInst.id,
        title: newCourse.title,
        code: newCourse.code,
        level: newCourse.level,
        durationYears: newCourse.durationYears,
        description: newCourse.description,
        eligibility: newCourse.eligibility,
        totalSeats: newCourse.totalSeats,
        fees: {
          tuitionFee: newCourse.tuitionFee,
          hostelFee: newCourse.hostelFee,
          totalFee: newCourse.tuitionFee + newCourse.hostelFee,
        },
      });

      if (res.data.success) {
        setCourseModalOpen(false);
        loadUnivData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create course.');
    }
  };

  const handleUpdateAppStatus = async (appId: string, status: string) => {
    try {
      const res = await api.put(`/admissions/${appId}/status`, { status });
      if (res.data.success) {
        setApplications((prev) =>
          prev.map((a) => (a.id === appId ? { ...a, status } : a))
        );
      }
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  return (
    <div className="min-h-screen bg-[#021814] text-slate-100 pt-24 pb-16 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#011411] border-r border-emerald-950/80 p-5 hidden md:flex flex-col justify-between flex-shrink-0">
        <div className="space-y-6">
          <div className="p-3.5 rounded-2xl bg-forest-950 border border-emerald-900/60 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-400/30 flex items-center justify-center font-bold text-purple-300 text-sm">
              <Building2 className="w-5 h-5 text-purple-400" />
            </div>
            <div className="truncate">
              <h4 className="text-xs font-bold text-white truncate">{profile?.institutionName || user?.username}</h4>
              <span className="text-[10px] text-purple-400 font-semibold px-2 py-0.5 rounded-full bg-purple-950 border border-purple-800">
                UNIVERSITY PORTAL
              </span>
            </div>
          </div>

          <nav className="space-y-1 text-xs">
            <button
              onClick={() => setActiveTab('OVERVIEW')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'OVERVIEW'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-forest-900/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-purple-400" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('COURSES')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'COURSES'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-forest-900/60'
              }`}
            >
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>Course Catalog</span>
            </button>

            <button
              onClick={() => setActiveTab('FEES')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'FEES'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-forest-900/60'
              }`}
            >
              <DollarSign className="w-4 h-4 text-purple-400" />
              <span>Course Fee Gazettes</span>
            </button>

            <button
              onClick={() => setActiveTab('ADMISSIONS')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'ADMISSIONS'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-forest-900/60'
              }`}
            >
              <FileCheck className="w-4 h-4 text-purple-400" />
              <span>Admission Intake Applications</span>
            </button>
          </nav>
        </div>

        <button
          onClick={logout}
          className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-rose-400 hover:bg-rose-950/40 transition-colors text-xs font-semibold"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-6xl mx-auto space-y-8">
        {/* Header Hero */}
        <div className="rounded-3xl glass-panel bg-gradient-to-r from-[#21092e] via-[#2d123d] to-[#021c17] border border-purple-500/40 p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                Institutional Administration Console
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
                {profile?.institutionName || 'Institutional Campus Portal'}
              </h1>
              <p className="text-xs text-purple-200">
                {profile?.state || 'National Accredited Directory'} • Official Contact: {profile?.officialEmail || user?.email}
              </p>
            </div>

            <button
              onClick={() => setCourseModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Program & Fees</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl glass-panel border border-purple-900/50 space-y-1">
                <span className="text-xs text-slate-400 font-medium">Offered Programs</span>
                <p className="text-2xl font-bold text-purple-400 font-display">{courses.length}</p>
                <span className="text-[10px] text-slate-500">Degree pathways registered</span>
              </div>

              <div className="p-5 rounded-2xl glass-panel border border-purple-900/50 space-y-1">
                <span className="text-xs text-slate-400 font-medium">Received Applications</span>
                <p className="text-2xl font-bold text-emerald-400 font-display">{applications.length}</p>
                <span className="text-[10px] text-slate-500">Student tracking portal</span>
              </div>

              <div className="p-5 rounded-2xl glass-panel border border-purple-900/50 space-y-1">
                <span className="text-xs text-slate-400 font-medium">Verification Status</span>
                <p className="text-2xl font-bold text-teal-400 font-display">VERIFIED</p>
                <span className="text-[10px] text-slate-500">Gazette Seal Active</span>
              </div>
            </div>

            {/* Program Catalog Snapshot */}
            <div className="rounded-3xl glass-panel p-6 border border-emerald-900/60 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Active Academic Offerings</h3>
                <button
                  onClick={() => setActiveTab('COURSES')}
                  className="text-xs font-semibold text-purple-400 hover:underline"
                >
                  Manage All →
                </button>
              </div>

              <div className="space-y-3">
                {courses.slice(0, 4).map((c) => (
                  <div key={c.id} className="p-4 rounded-xl bg-forest-950 border border-emerald-900/50 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="text-sm font-bold text-white">{c.title}</h4>
                      <p className="text-slate-400">{c.durationYears} Years • {c.totalSeats} Seats</p>
                    </div>
                    <span className="font-bold text-emerald-400">
                      {c.fees?.[0] ? `₹${c.fees[0].tuitionFee.toLocaleString()}/yr` : 'Verified Fee'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Courses */}
        {activeTab === 'COURSES' && (
          <div className="rounded-3xl glass-panel p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-display text-white">Institutional Course Catalog</h2>
              <button
                onClick={() => setCourseModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
              >
                + Register New Program
              </button>
            </div>

            <div className="space-y-4">
              {courses.map((c) => (
                <div key={c.id} className="p-5 rounded-2xl bg-forest-950 border border-emerald-900/50 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                      {c.code}
                    </span>
                    <span className="text-slate-400">{c.level}</span>
                  </div>
                  <h4 className="text-base font-bold text-white">{c.title}</h4>
                  <p className="text-slate-300">{c.description}</p>
                  <p className="text-slate-400 pt-2"><span className="text-white font-semibold">Eligibility: </span>{c.eligibility}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Fees */}
        {activeTab === 'FEES' && (
          <div className="rounded-3xl glass-panel p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold font-display text-white">Course Fee Gazette Schedule</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-emerald-900 text-slate-400 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Program</th>
                    <th className="py-3 px-4">Tuition</th>
                    <th className="py-3 px-4">Hostel</th>
                    <th className="py-3 px-4">Total Verified Package</th>
                    <th className="py-3 px-4">Official Circular</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950">
                  {courses.map((c) => {
                    const f = c.fees?.[0];
                    return (
                      <tr key={c.id}>
                        <td className="py-3 px-4 font-semibold text-white">{c.title}</td>
                        <td className="py-3 px-4">{f ? `₹${f.tuitionFee.toLocaleString()}` : 'N/A'}</td>
                        <td className="py-3 px-4">{f && f.hostelFee > 0 ? `₹${f.hostelFee.toLocaleString()}` : 'Optional'}</td>
                        <td className="py-3 px-4 font-bold text-emerald-400">{f ? `₹${f.totalFee.toLocaleString()}/yr` : 'Verified'}</td>
                        <td className="py-3 px-4 text-[11px] text-slate-400">{f?.officialSource || 'Gazetted'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Admissions */}
        {activeTab === 'ADMISSIONS' && (
          <div className="rounded-3xl glass-panel p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold font-display text-white">Tracked Admission Applications</h2>
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="p-5 rounded-2xl bg-forest-950 border border-emerald-900/50 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="text-sm font-bold text-white">{app.course?.title}</h4>
                    <p className="text-slate-400">Application Number: {app.applicationNumber}</p>
                    <p className="text-emerald-400 font-semibold mt-1">Status: {app.status}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateAppStatus(app.id, 'ACCEPTED')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleUpdateAppStatus(app.id, 'WAITLISTED')}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold"
                    >
                      Waitlist
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Add Course Modal */}
      {courseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="rounded-3xl glass-panel bg-[#02221b] border border-purple-500/40 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Register New Program & Fee</h3>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Program Title *
                </label>
                <input
                  type="text"
                  required
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  placeholder="e.g. M.Tech in Cyber Security"
                  className="w-full px-3.5 py-2 rounded-xl bg-forest-900 border border-emerald-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Course Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCourse.code}
                    onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                    placeholder="CS501"
                    className="w-full px-3.5 py-2 rounded-xl bg-forest-900 border border-emerald-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Total Seats
                  </label>
                  <input
                    type="number"
                    value={newCourse.totalSeats}
                    onChange={(e) => setNewCourse({ ...newCourse, totalSeats: parseInt(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-forest-900 border border-emerald-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Annual Tuition Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={newCourse.tuitionFee}
                    onChange={(e) => setNewCourse({ ...newCourse, tuitionFee: parseFloat(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-forest-900 border border-emerald-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Hostel Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={newCourse.hostelFee}
                    onChange={(e) => setNewCourse({ ...newCourse, hostelFee: parseFloat(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-forest-900 border border-emerald-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Eligibility Criteria *
                </label>
                <input
                  type="text"
                  required
                  value={newCourse.eligibility}
                  onChange={(e) => setNewCourse({ ...newCourse, eligibility: e.target.value })}
                  placeholder="B.Tech in CSE / IT with valid GATE score"
                  className="w-full px-3.5 py-2 rounded-xl bg-forest-900 border border-emerald-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  placeholder="Curriculum overview..."
                  className="w-full px-3.5 py-2 rounded-xl bg-forest-900 border border-emerald-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCourseModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg"
                >
                  Publish Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversityDashboard;
