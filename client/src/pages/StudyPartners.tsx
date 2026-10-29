import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Sparkles,
  Send,
  Check,
  X,
  UserCheck,
  Video,
  Clock,
  BookOpen,
  Calendar,
  Plus,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import api from '../services/api';
import { StudyPartnerMatch, StudyProfile, StudyGroup } from '../types';
import { useAuth } from '../context/AuthContext';

export const StudyPartners: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'MATCHES' | 'CONNECTIONS' | 'GROUPS' | 'PROFILE'>('MATCHES');
  const [matches, setMatches] = useState<StudyPartnerMatch[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSubject, setFilterSubject] = useState('All');

  // Study profile form state
  const [profileForm, setProfileForm] = useState<Partial<StudyProfile>>({
    subjects: 'Data Structures, Operating Systems, Machine Learning',
    course: 'B.Tech Computer Science and Engineering',
    semester: 'Semester 4',
    preferredLanguage: 'English',
    studyGoals: 'Master graph algorithms and prepare for GATE / top placement drives',
    availableTimes: 'Weekday Evenings (6:00 PM - 9:00 PM)',
    learningStyle: 'VISUAL',
    groupPreference: 'BOTH',
    isDiscoverable: true,
  });
  const [profileSaved, setProfileSaved] = useState(false);

  // New Group state
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [groupForm, setGroupForm] = useState({
    name: '',
    description: '',
    subject: 'Data Structures and Algorithms',
    course: 'B.Tech CSE',
    meetingLink: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      if (user?.role === 'STUDENT') {
        const [profRes, matchRes, connRes, groupRes] = await Promise.all([
          api.get('/study-partners/profile'),
          api.get('/study-partners/matches'),
          api.get('/study-partners/connections'),
          api.get('/study-partners/groups'),
        ]);

        if (profRes.data.success && profRes.data.data) {
          setProfileForm(profRes.data.data);
        }
        if (matchRes.data.success) {
          setMatches(matchRes.data.data);
        }
        if (connRes.data.success) {
          setConnections(connRes.data.connections || []);
          setIncomingRequests(connRes.data.incomingRequests || []);
        }
        if (groupRes.data.success) {
          setGroups(groupRes.data.data);
        }
      } else {
        const groupRes = await api.get('/study-partners/groups');
        if (groupRes.data.success) {
          setGroups(groupRes.data.data);
        }
      }
    } catch (err) {
      console.error('Study partner data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleSendRequest = async (peer: StudyPartnerMatch) => {
    try {
      const res = await api.post('/study-partners/request', {
        receiverId: peer.studentId,
        message: `Hi ${peer.fullName}! I saw your study profile on EDUNEXA focused on ${peer.subjects} and would love to collaborate on coursework.`,
      });
      if (res.data.success) {
        setMatches((prev) =>
          prev.map((m) => (m.studentId === peer.studentId ? { ...m, isPending: true } : m))
        );
        alert(`Collaboration request sent to ${peer.fullName}!`);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to send partner request.');
    }
  };

  const handleRequestAction = async (requestId: string, action: 'ACCEPT' | 'REJECT') => {
    try {
      const res = await api.put(`/study-partners/request/${requestId}`, { action });
      if (res.data.success) {
        loadData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to process request.');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/study-partners/profile', profileForm);
      if (res.data.success) {
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 2000);
        loadData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update study profile.');
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/study-partners/groups', groupForm);
      if (res.data.success) {
        setGroupModalOpen(false);
        loadData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create group.');
    }
  };

  return (
    <div className="min-h-screen bg-[#021814] text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-semibold mb-3">
              <Users className="w-4 h-4" />
              <span>Collaborative Peer Learning</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white">
              Study Partner Matching & Circles
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
              Connect with fellow students preparing for the same semester subjects, GATE, or coding competitions using algorithm-driven compatibility scoring.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setGroupModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-glow-emerald flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Study Circle</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-emerald-950 pb-2">
          {[
            { id: 'MATCHES', label: `Compatible Matches (${matches.length})` },
            { id: 'CONNECTIONS', label: `My Connections (${connections.length})` },
            { id: 'GROUPS', label: `Study Groups (${groups.length})` },
            { id: 'PROFILE', label: 'My Study Profile' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-glow-emerald'
                  : 'text-slate-400 hover:text-white hover:bg-forest-900/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Compatible Matches */}
        {activeTab === 'MATCHES' && (
          <div className="space-y-6">
            {incomingRequests.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/50 space-y-3">
                <h3 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Incoming Collaboration Requests ({incomingRequests.length})</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {incomingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-3.5 rounded-xl bg-forest-950/80 border border-emerald-900/50 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <p className="font-bold text-white">
                          {req.sender?.studentProfile?.fullName || req.sender?.username}
                        </p>
                        <p className="text-slate-400 text-[11px] mt-0.5 line-clamp-1">{req.message}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => handleRequestAction(req.id, 'ACCEPT')}
                          className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                          title="Accept Request"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRequestAction(req.id, 'REJECT')}
                          className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300"
                          title="Decline"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {loading ? (
              <div className="py-20 text-center">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-400 text-sm">Computing matching algorithms...</p>
              </div>
            ) : matches.length === 0 ? (
              <div className="py-16 text-center glass-panel rounded-3xl p-8 max-w-lg mx-auto space-y-3">
                <Users className="w-12 h-12 text-slate-500 mx-auto" />
                <h3 className="text-lg font-bold text-white">No Matching Peers Yet</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Make sure you have completed your Study Profile under the “My Study Profile” tab to enable intelligent matching.
                </p>
                <button
                  onClick={() => setActiveTab('PROFILE')}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  Configure Study Profile
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.map((peer) => (
                  <div
                    key={peer.id}
                    className="rounded-3xl glass-panel p-6 border border-emerald-900/60 flex flex-col justify-between hover:border-emerald-500/40 transition-all space-y-4"
                  >
                    <div>
                      {/* Match Score Badge */}
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1 shadow-sm">
                          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                          <span>{peer.matchScore}% Compatibility</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold px-2 py-0.5 rounded bg-forest-900">
                          {peer.learningStyle}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white">{peer.fullName}</h3>
                      <p className="text-xs text-emerald-400">{peer.course} • {peer.semester}</p>

                      {peer.institution && (
                        <p className="text-xs text-slate-400 mt-1">{peer.institution}</p>
                      )}

                      {/* Matching reasons highlight */}
                      <div className="mt-3 p-3 rounded-xl bg-forest-950/80 border border-emerald-900/40 space-y-1">
                        <p className="text-[10px] font-semibold text-gold-400 uppercase tracking-wider">
                          Why You Matched:
                        </p>
                        {peer.matchReasons.map((reason, idx) => (
                          <p key={idx} className="text-xs text-slate-300 flex items-center gap-1.5">
                            <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                            <span>{reason}</span>
                          </p>
                        ))}
                      </div>

                      <div className="mt-3 text-xs text-slate-300 space-y-1">
                        <p><span className="text-slate-400 font-semibold">Study Goals:</span> {peer.studyGoals}</p>
                        <p><span className="text-slate-400 font-semibold">Availability:</span> {peer.availableTimes}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-emerald-950">
                      {peer.isConnected ? (
                        <div className="py-2 text-center text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                          <UserCheck className="w-4 h-4" />
                          <span>Connected Study Partner</span>
                        </div>
                      ) : peer.isPending ? (
                        <div className="py-2 text-center text-xs font-semibold text-amber-300">
                          Request Pending Response
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSendRequest(peer)}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-glow-emerald transition-all flex items-center justify-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Study Request</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: My Connections */}
        {activeTab === 'CONNECTIONS' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-display text-white">Accepted Academic Connections</h2>
            {connections.length === 0 ? (
              <p className="text-xs text-slate-400">No active connections yet. Explore compatible peers in the Matches tab.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {connections.map((c) => (
                  <div key={c.connectionId} className="rounded-2xl glass-panel p-5 border border-emerald-800/40 space-y-3">
                    <h4 className="text-base font-bold text-white">
                      {c.partner?.studentProfile?.fullName || c.partner?.username}
                    </h4>
                    <p className="text-xs text-emerald-400">{c.partner?.studyProfile?.course || 'Academic Peer'}</p>
                    <p className="text-xs text-slate-300">
                      <span className="text-slate-400 font-semibold">Focused Subjects: </span>
                      {c.partner?.studyProfile?.subjects || 'Not specified'}
                    </p>
                    <a
                      href="https://meet.jit.si/edunexa-peer-session"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 rounded-xl bg-forest-900 hover:bg-forest-800 border border-emerald-800 text-xs font-semibold text-emerald-300 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Video className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Start Video Study Session</span>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Study Groups */}
        {activeTab === 'GROUPS' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {groups.map((grp) => (
                <div key={grp.id} className="rounded-3xl glass-panel p-6 border border-emerald-800/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {grp.subject}
                    </span>
                    <span className="text-xs text-slate-400">{grp.members?.length || 1} Members</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{grp.name}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{grp.description}</p>
                  <div className="pt-3 border-t border-emerald-950">
                    <a
                      href={grp.meetingLink || 'https://meet.jit.si/edunexa-study-group'}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Live Circle Meeting</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Study Profile Form */}
        {activeTab === 'PROFILE' && (
          <div className="rounded-3xl glass-panel p-6 sm:p-8 max-w-2xl mx-auto space-y-6 border border-emerald-800/50">
            <div>
              <h2 className="text-xl font-bold font-display text-white">Your Study Profile Settings</h2>
              <p className="text-xs text-slate-400 mt-1">
                This information powers our intelligent matching algorithm to recommend compatible study partners.
              </p>
            </div>

            {profileSaved && (
              <div className="p-3.5 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Profile updated successfully! Refreshing matches...</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Subjects Currently Studying (Comma-separated) *
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.subjects || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, subjects: e.target.value })}
                  placeholder="Data Structures, Algorithms, Operating Systems"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-forest-900 border border-emerald-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Course Program *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.course || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, course: e.target.value })}
                    placeholder="B.Tech Computer Science"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-forest-900 border border-emerald-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Semester Level *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.semester || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, semester: e.target.value })}
                    placeholder="Semester 4"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-forest-900 border border-emerald-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Learning Style
                  </label>
                  <select
                    value={profileForm.learningStyle || 'VISUAL'}
                    onChange={(e) => setProfileForm({ ...profileForm, learningStyle: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-forest-900 border border-emerald-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="VISUAL">Visual (Diagrams, Mind Maps, Charts)</option>
                    <option value="AUDITORY">Auditory (Discussions, Explaining Concepts)</option>
                    <option value="READING_WRITING">Reading & Writing (Summaries, Textbooks)</option>
                    <option value="KINESTHETIC">Kinesthetic (Hands-on Code, Lab Problems)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Preferred Language
                  </label>
                  <input
                    type="text"
                    value={profileForm.preferredLanguage || 'English'}
                    onChange={(e) => setProfileForm({ ...profileForm, preferredLanguage: e.target.value })}
                    placeholder="English / Malayalam / Hindi / Tamil"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-forest-900 border border-emerald-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Primary Study Goals *
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.studyGoals || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, studyGoals: e.target.value })}
                  placeholder="Master graph algorithms and prepare for GATE"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-forest-900 border border-emerald-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Available Times
                </label>
                <input
                  type="text"
                  value={profileForm.availableTimes || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, availableTimes: e.target.value })}
                  placeholder="Weekday Evenings (6:00 PM - 9:00 PM), Weekends"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-forest-900 border border-emerald-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="discoverable"
                  checked={profileForm.isDiscoverable !== false}
                  onChange={(e) => setProfileForm({ ...profileForm, isDiscoverable: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-forest-900 border-emerald-800"
                />
                <label htmlFor="discoverable" className="text-xs text-slate-300">
                  Allow compatible students to discover my study profile (phone/email remains private)
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-glow-emerald transition-all"
              >
                Save Study Profile
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Create Study Group Modal */}
      {groupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="rounded-3xl glass-panel bg-[#02221b] border border-emerald-500/40 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
              <h3 className="text-lg font-bold text-white">Create New Study Circle</h3>
              <button onClick={() => setGroupModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Circle Name *
                </label>
                <input
                  type="text"
                  required
                  value={groupForm.name}
                  onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                  placeholder="e.g. Algorithms & LeetCode Hard"
                  className="w-full px-3.5 py-2 rounded-xl bg-forest-900 border border-emerald-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={groupForm.subject}
                  onChange={(e) => setGroupForm({ ...groupForm, subject: e.target.value })}
                  placeholder="Data Structures & Algorithms"
                  className="w-full px-3.5 py-2 rounded-xl bg-forest-900 border border-emerald-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={groupForm.description}
                  onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
                  placeholder="Weekly peer problem-solving session..."
                  className="w-full px-3.5 py-2 rounded-xl bg-forest-900 border border-emerald-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setGroupModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-glow-emerald"
                >
                  Create Circle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPartners;
