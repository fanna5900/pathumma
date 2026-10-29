import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  LayoutDashboard,
  User as UserIcon,
  Compass,
  BookOpen,
  Users,
  Sparkles,
  Calendar,
  FileCheck,
  Bookmark,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Video,
  Award,
  Layers,
  Search,
  ExternalLink,
  Plus,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { AdmissionApplication, LearningMaterial, AcademicEvent, Notification } from '../../types';

export const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'APPLICATIONS' | 'SAVED' | 'ASSIGNMENTS' | 'CALENDAR'>('OVERVIEW');
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [savedColleges, setSavedColleges] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [events, setEvents] = useState<AcademicEvent[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // New application tracker modal
  const [trackerModalOpen, setTrackerModalOpen] = useState(false);
  const [collegesList, setCollegesList] = useState<any[]>([]);
  const [selectedInstId, setSelectedInstId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [trackerStatus, setTrackerStatus] = useState('INTERESTED');

  const profile = user?.profile || user?.studentProfile;

  const loadStudentData = async () => {
    setLoading(true);
    try {
      const [appRes, savedRes, assignRes, eventRes, notifRes, instRes] = await Promise.all([
        api.get('/admissions/my-applications'),
        api.get('/institutions/user/saved'),
        api.get('/assignments'),
        api.get('/calendar/events'),
        api.get('/notifications'),
        api.get('/institutions?limit=20'),
      ]);

      if (appRes.data.success) setApplications(appRes.data.data);
      if (savedRes.data.success) setSavedColleges(savedRes.data.data);
      if (assignRes.data.success) setAssignments(assignRes.data.data);
      if (eventRes.data.success) setEvents(eventRes.data.data);
      if (notifRes.data.success) setNotifications(notifRes.data.data);
      if (instRes.data.success) {
        setCollegesList(instRes.data.data);
        if (instRes.data.data.length > 0) {
          setSelectedInstId(instRes.data.data[0].id);
          if (instRes.data.data[0].courses?.length > 0) {
            setSelectedCourseId(instRes.data.data[0].courses[0].id);
          }
        }
      }
    } catch (err) {
      console.error('Student dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentData();
  }, []);

  const handleUpdateStatus = async (appId: string, newStatus: string) => {
    try {
      const res = await api.put(`/admissions/${appId}/status`, { status: newStatus });
      if (res.data.success) {
        setApplications((prev) =>
          prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
        );
      }
    } catch (err) {
      alert('Failed to update application status.');
    }
  };

  const handleAddTracker = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/admissions/apply', {
        institutionId: selectedInstId,
        courseId: selectedCourseId,
        status: trackerStatus,
        notes: 'Added from student tracker',
        isOfficial: false,
      });
      if (res.data.success) {
        setTrackerModalOpen(false);
        loadStudentData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add tracker item.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'WAITLISTED':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'REJECTED':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  const selectedCollegeCourses =
    collegesList.find((c) => c.id === selectedInstId)?.courses || [];

  return (
    <div className="min-h-screen bg-[#021814] text-slate-100 pt-24 pb-16 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#011411] border-r border-emerald-950/80 p-5 hidden md:flex flex-col justify-between flex-shrink-0">
        <div className="space-y-6">
          {/* User Micro Profile */}
          <div className="p-3.5 rounded-2xl bg-forest-950 border border-emerald-900/60 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-400/30 flex items-center justify-center font-bold text-emerald-300 text-sm">
              {user?.username?.slice(0, 2).toUpperCase()}
            </div>
            <div className="truncate">
              <h4 className="text-xs font-bold text-white truncate">{profile?.fullName || user?.username}</h4>
              <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800">
                STUDENT
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs">
            <button
              onClick={() => setActiveTab('OVERVIEW')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'OVERVIEW'
                  ? 'bg-emerald-600 text-white shadow-glow-emerald'
                  : 'text-slate-400 hover:text-white hover:bg-forest-900/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('APPLICATIONS')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'APPLICATIONS'
                  ? 'bg-emerald-600 text-white shadow-glow-emerald'
                  : 'text-slate-400 hover:text-white hover:bg-forest-900/60'
              }`}
            >
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Admission Tracker</span>
            </button>

            <button
              onClick={() => setActiveTab('SAVED')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'SAVED'
                  ? 'bg-emerald-600 text-white shadow-glow-emerald'
                  : 'text-slate-400 hover:text-white hover:bg-forest-900/60'
              }`}
            >
              <Bookmark className="w-4 h-4 text-emerald-400" />
              <span>Saved Colleges ({savedColleges.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('ASSIGNMENTS')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'ASSIGNMENTS'
                  ? 'bg-emerald-600 text-white shadow-glow-emerald'
                  : 'text-slate-400 hover:text-white hover:bg-forest-900/60'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Assignments ({assignments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('CALENDAR')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'CALENDAR'
                  ? 'bg-emerald-600 text-white shadow-glow-emerald'
                  : 'text-slate-400 hover:text-white hover:bg-forest-900/60'
              }`}
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Study Planner & Events</span>
            </button>

            <div className="pt-4 border-t border-emerald-950 my-2"></div>

            <Link
              to="/admission"
              className="flex items-center space-x-3 px-3.5 py-2 rounded-xl text-emerald-300 hover:text-white hover:bg-forest-900/60 transition-colors font-medium"
            >
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Online Admission Application</span>
            </Link>

            <Link
              to="/universities"
              className="flex items-center space-x-3 px-3.5 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-forest-900/60 transition-colors"
            >
              <GraduationCap className="w-4 h-4 text-teal-400" />
              <span>Universities</span>
            </Link>

            <Link
              to="/colleges"
              className="flex items-center space-x-3 px-3.5 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-forest-900/60 transition-colors"
            >
              <Compass className="w-4 h-4 text-teal-400" />
              <span>Explore Colleges</span>
            </Link>

            <Link
              to="/study-resources"
              className="flex items-center space-x-3 px-3.5 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-forest-900/60 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-teal-400" />
              <span>Study Resources</span>
            </Link>

            <Link
              to="/study-partners"
              className="flex items-center space-x-3 px-3.5 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-forest-900/60 transition-colors"
            >
              <Users className="w-4 h-4 text-teal-400" />
              <span>Find Study Partners</span>
            </Link>

            <Link
              to="/ai-assistant"
              className="flex items-center space-x-3 px-3.5 py-2 rounded-xl text-gold-300 hover:bg-amber-950/40 transition-colors font-semibold"
            >
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>AI Learning Assistant</span>
            </Link>
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

      {/* Main Dashboard Content */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-6xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="rounded-3xl glass-panel bg-gradient-to-r from-[#032921] via-[#043329] to-[#02211a] border border-emerald-500/40 p-6 sm:p-8 relative overflow-hidden shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Student Learning Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                Welcome back, {profile?.fullName || user?.username}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                {profile?.educationLevel || 'Undergraduate'} • Focused on {profile?.preferredCourse || 'Computer Science & Engineering'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/ai-assistant"
                className="px-4 py-2.5 rounded-xl glass-card-gold bg-amber-950/40 border border-gold-500/40 text-gold-300 font-bold text-xs flex items-center gap-2 hover:bg-amber-900/40 transition-all shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-gold-400" />
                <span>Ask AI Mentor</span>
              </Link>
              <button
                onClick={() => setTrackerModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-glow-emerald transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Track College</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-8">
            {/* Academic Snapshot Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl glass-panel border border-emerald-900/50 space-y-1">
                <span className="text-xs text-slate-400 font-medium">Tracked Applications</span>
                <p className="text-2xl font-bold text-emerald-400 font-display">{applications.length}</p>
                <span className="text-[10px] text-slate-500">Across Indian Universities</span>
              </div>

              <div className="p-5 rounded-2xl glass-panel border border-emerald-900/50 space-y-1">
                <span className="text-xs text-slate-400 font-medium">Saved Institutions</span>
                <p className="text-2xl font-bold text-teal-400 font-display">{savedColleges.length}</p>
                <span className="text-[10px] text-slate-500">In Kerala, Karnataka & TN</span>
              </div>

              <div className="p-5 rounded-2xl glass-panel border border-emerald-900/50 space-y-1">
                <span className="text-xs text-slate-400 font-medium">Course Assignments</span>
                <p className="text-2xl font-bold text-mint-400 font-display">{assignments.length}</p>
                <span className="text-[10px] text-slate-500">Faculty Evaluations</span>
              </div>

              <div className="p-5 rounded-2xl glass-panel border border-emerald-900/50 space-y-1">
                <span className="text-xs text-slate-400 font-medium">Upcoming Exams & Events</span>
                <p className="text-2xl font-bold text-gold-400 font-display">{events.length}</p>
                <span className="text-[10px] text-slate-500">On Academic Calendar</span>
              </div>
            </div>

            {/* Admission Tracker Preview Section */}
            <div className="rounded-3xl glass-panel p-6 border border-emerald-900/60 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Active Admission Tracker</h3>
                  <p className="text-xs text-slate-400">
                    Distinguishing self-tracked preparation from official centralized counseling statuses.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('APPLICATIONS')}
                  className="text-xs font-semibold text-emerald-400 hover:underline"
                >
                  View All Stages →
                </button>
              </div>

              {applications.length === 0 ? (
                <div className="p-6 rounded-2xl bg-forest-950/60 text-center text-xs text-slate-400">
                  No admission applications tracked yet. Click "Track College" to begin.
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 3).map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-2xl bg-forest-950/80 border border-emerald-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{app.institution.name}</span>
                          {app.isOfficial && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                              OFFICIAL COUNSELING
                            </span>
                          )}
                        </div>
                        <p className="text-emerald-400">{app.course?.title}</p>
                        <p className="text-slate-400 text-[11px]">App ID: {app.applicationNumber}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(app.status)}`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Notifications */}
            <div className="rounded-3xl glass-panel p-6 border border-emerald-900/60 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-400" />
                <span>Academic Updates & Notifications</span>
              </h3>
              <div className="space-y-2.5">
                {notifications.slice(0, 3).map((notif) => (
                  <div key={notif.id} className="p-3.5 rounded-xl bg-forest-950/70 border border-emerald-900/40 text-xs flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-white">{notif.title}</p>
                      <p className="text-slate-300 mt-0.5">{notif.message}</p>
                    </div>
                    <span className="text-[10px] text-slate-500 flex-shrink-0">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Full Admission Tracker */}
        {activeTab === 'APPLICATIONS' && (
          <div className="rounded-3xl glass-panel p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-display text-white">College Admission Tracker</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage applications through all 8 stages: Interested, Preparing Documents, Ready to Apply, Submitted, Under Review, Accepted, Waitlisted, or Rejected.
                </p>
              </div>
              <button
                onClick={() => setTrackerModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-glow-emerald"
              >
                + Add Tracked Institution
              </button>
            </div>

            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="p-5 rounded-2xl bg-forest-950 border border-emerald-900/50 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-base font-bold text-white">{app.institution?.name}</h4>
                      <p className="text-xs text-emerald-400 font-semibold">{app.course?.title}</p>
                      <p className="text-[11px] text-slate-400">Application Number: {app.applicationNumber}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={app.status}
                        onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-forest-900 border border-emerald-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="INTERESTED">Interested</option>
                        <option value="PREPARING_DOCUMENTS">Preparing Documents</option>
                        <option value="READY_TO_APPLY">Ready to Apply</option>
                        <option value="SUBMITTED">Application Submitted</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="ACCEPTED">Accepted</option>
                        <option value="WAITLISTED">Waitlisted</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                  </div>

                  {app.notes && (
                    <div className="p-3 rounded-xl bg-[#011411] border border-emerald-950 text-xs text-slate-300">
                      <span className="font-semibold text-slate-400">Notes: </span>
                      {app.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Saved Colleges */}
        {activeTab === 'SAVED' && (
          <div className="rounded-3xl glass-panel p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold font-display text-white">Bookmarked Colleges</h2>
            {savedColleges.length === 0 ? (
              <p className="text-xs text-slate-400">You haven't saved any colleges yet. Explore the directory to bookmark colleges.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedColleges.map((col) => (
                  <div key={col.id} className="p-5 rounded-2xl bg-forest-950 border border-emerald-900/50 space-y-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {col.institutionType}
                    </span>
                    <h4 className="text-base font-bold text-white">{col.name}</h4>
                    <p className="text-xs text-slate-400">{col.city}, {col.state}</p>
                    <Link
                      to={`/colleges/${col.slug || col.id}`}
                      className="block text-center py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-emerald-300 text-xs font-semibold"
                    >
                      View Details & Fee Matrix →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Assignments */}
        {activeTab === 'ASSIGNMENTS' && (
          <div className="rounded-3xl glass-panel p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold font-display text-white">Course Assignments & Tasks</h2>
            <div className="space-y-4">
              {assignments.map((asg) => (
                <div key={asg.id} className="p-5 rounded-2xl bg-forest-950 border border-emerald-900/50 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400">{asg.course?.title}</span>
                    <span className="text-slate-400">Due: {new Date(asg.deadline).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-base font-bold text-white">{asg.title}</h4>
                  <p className="text-slate-300 leading-relaxed">{asg.description}</p>
                  {asg.submissions && asg.submissions.length > 0 ? (
                    <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300">
                      <span className="font-bold">Submitted: </span>
                      {asg.submissions[0].status} • Marks: {asg.submissions[0].marksObtained !== null ? `${asg.submissions[0].marksObtained}/50` : 'Pending grading'}
                    </div>
                  ) : (
                    <div className="pt-2 flex justify-end">
                      <span className="text-amber-300 font-semibold">Submission Open</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Calendar */}
        {activeTab === 'CALENDAR' && (
          <div className="rounded-3xl glass-panel p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold font-display text-white">Academic Calendar & Milestones</h2>
            <div className="space-y-3">
              {events.map((ev) => (
                <div key={ev.id} className="p-4 rounded-xl bg-forest-950 border border-emerald-900/50 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                      {ev.eventType}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1">{ev.title}</h4>
                    <p className="text-slate-400">{ev.description}</p>
                  </div>
                  <span className="text-emerald-400 font-bold flex-shrink-0">
                    {new Date(ev.startDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Add Tracker Item Modal */}
      {trackerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="rounded-3xl glass-panel bg-[#02221b] border border-emerald-500/40 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <h3 className="text-lg font-bold text-white">Track an Institution</h3>

            <form onSubmit={handleAddTracker} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Select College *
                </label>
                <select
                  value={selectedInstId}
                  onChange={(e) => setSelectedInstId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-forest-900 border border-emerald-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  {collegesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.state})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Select Program *
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-forest-900 border border-emerald-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  required
                >
                  {selectedCollegeCourses.map((crs: any) => (
                    <option key={crs.id} value={crs.id}>
                      {crs.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Current Status
                </label>
                <select
                  value={trackerStatus}
                  onChange={(e) => setTrackerStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-forest-900 border border-emerald-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="INTERESTED">Interested</option>
                  <option value="PREPARING_DOCUMENTS">Preparing Documents</option>
                  <option value="READY_TO_APPLY">Ready to Apply</option>
                  <option value="SUBMITTED">Application Submitted</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setTrackerModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-glow-emerald"
                >
                  Add to Tracker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
