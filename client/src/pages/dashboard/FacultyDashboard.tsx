import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  LayoutDashboard,
  BookOpen,
  FileCheck,
  FileText,
  Sparkles,
  Calendar,
  Bell,
  LogOut,
  Plus,
  CheckCircle,
  Clock,
  Building2,
  Award,
  ChevronRight,
  Send,
  X,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Assignment, LearningMaterial, Course } from '../../types';

export const FacultyDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ASSIGNMENTS' | 'MATERIALS' | 'COURSES' | 'AI_TEACH'>('OVERVIEW');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  // Assignment Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    courseId: '',
    subjectId: '',
    title: '',
    description: '',
    deadline: '',
    totalMarks: 50,
  });

  // Material Modal
  const [materialModalOpen, setMaterialModalOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    description: '',
    resourceType: 'NOTES',
    fileType: 'pdf',
    sourceInfo: 'Faculty Verified Upload',
  });

  // Grading Modal
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [selectedSubId, setSelectedSubId] = useState('');
  const [marks, setMarks] = useState(45);
  const [feedback, setFeedback] = useState('Well researched implementation.');

  const profile = user?.profile || user?.facultyProfile;

  const loadFacultyData = async () => {
    setLoading(true);
    try {
      const [assignRes, courseRes, matRes] = await Promise.all([
        api.get('/assignments'),
        api.get('/courses'),
        api.get('/resources'),
      ]);

      if (assignRes.data.success) setAssignments(assignRes.data.data);
      if (courseRes.data.success) {
        setCourses(courseRes.data.data);
        if (courseRes.data.data.length > 0) {
          setNewAssignment((prev) => ({
            ...prev,
            courseId: courseRes.data.data[0].id,
            subjectId: courseRes.data.data[0].semesters?.[0]?.subjects?.[0]?.id || courseRes.data.data[0].id,
          }));
        }
      }
      if (matRes.data.success) setMaterials(matRes.data.data);
    } catch (err) {
      console.error('Faculty dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFacultyData();
  }, []);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/assignments', newAssignment);
      if (res.data.success) {
        setAssignModalOpen(false);
        loadFacultyData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create assignment.');
    }
  };

  const handleUploadMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/resources/upload', newMaterial);
      if (res.data.success) {
        setMaterialModalOpen(false);
        loadFacultyData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to upload material.');
    }
  };

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.put(`/assignments/submissions/${selectedSubId}/grade`, {
        marksObtained: marks,
        feedback,
      });
      if (res.data.success) {
        setGradeModalOpen(false);
        loadFacultyData();
      }
    } catch (err: any) {
      alert('Failed to record grade.');
    }
  };

  return (
    <div className="min-h-screen bg-[#021814] text-slate-100 pt-24 pb-16 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#011411] border-r border-emerald-950/80 p-5 hidden md:flex flex-col justify-between flex-shrink-0">
        <div className="space-y-6">
          <div className="p-3.5 rounded-2xl bg-forest-950 border border-emerald-900/60 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600/30 border border-teal-400/30 flex items-center justify-center font-bold text-teal-300 text-sm">
              DR
            </div>
            <div className="truncate">
              <h4 className="text-xs font-bold text-white truncate">{profile?.fullName || user?.username}</h4>
              <span className="text-[10px] text-teal-400 font-semibold px-2 py-0.5 rounded-full bg-teal-950 border border-teal-800">
                FACULTY
              </span>
            </div>
          </div>

          <nav className="space-y-1 text-xs">
            <button
              onClick={() => setActiveTab('OVERVIEW')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'OVERVIEW'
                  ? 'bg-teal-600 text-white shadow-glow-emerald'
                  : 'text-slate-400 hover:text-white hover:bg-forest-900/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-teal-400" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('ASSIGNMENTS')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'ASSIGNMENTS'
                  ? 'bg-teal-600 text-white shadow-glow-emerald'
                  : 'text-slate-400 hover:text-white hover:bg-forest-900/60'
              }`}
            >
              <FileCheck className="w-4 h-4 text-teal-400" />
              <span>Assignments & Submissions</span>
            </button>

            <button
              onClick={() => setActiveTab('MATERIALS')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'MATERIALS'
                  ? 'bg-teal-600 text-white shadow-glow-emerald'
                  : 'text-slate-400 hover:text-white hover:bg-forest-900/60'
              }`}
            >
              <FileText className="w-4 h-4 text-teal-400" />
              <span>Study Materials & Syllabi</span>
            </button>

            <button
              onClick={() => setActiveTab('COURSES')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'COURSES'
                  ? 'bg-teal-600 text-white shadow-glow-emerald'
                  : 'text-slate-400 hover:text-white hover:bg-forest-900/60'
              }`}
            >
              <BookOpen className="w-4 h-4 text-teal-400" />
              <span>Assigned Courses</span>
            </button>

            <button
              onClick={() => setActiveTab('AI_TEACH')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'AI_TEACH'
                  ? 'bg-teal-600 text-white shadow-glow-emerald'
                  : 'text-slate-400 hover:text-white hover:bg-forest-900/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>AI Teaching Assistant</span>
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
        <div className="rounded-3xl glass-panel bg-gradient-to-r from-[#032b24] via-[#043329] to-[#02211a] border border-teal-500/40 p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                Faculty Academic Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
                {profile?.fullName || user?.username}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                {profile?.designation || 'Professor'} • {profile?.departmentName || 'Department of CSE'}
              </p>
              <p className="text-xs text-teal-300/80">{profile?.institutionName || 'NIT Calicut'}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setAssignModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-glow-emerald flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Assignment</span>
              </button>
              <button
                onClick={() => setMaterialModalOpen(true)}
                className="px-4 py-2.5 rounded-xl glass-panel bg-forest-900 hover:bg-forest-800 text-teal-300 font-bold text-xs border border-teal-800 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Material</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl glass-panel border border-emerald-900/50 space-y-1">
                <span className="text-xs text-slate-400 font-medium">Created Assignments</span>
                <p className="text-2xl font-bold text-teal-400 font-display">{assignments.length}</p>
                <span className="text-[10px] text-slate-500">Active across courses</span>
              </div>

              <div className="p-5 rounded-2xl glass-panel border border-emerald-900/50 space-y-1">
                <span className="text-xs text-slate-400 font-medium">Student Submissions</span>
                <p className="text-2xl font-bold text-emerald-400 font-display">
                  {assignments.reduce((acc, a) => acc + (a.submissions?.length || 0), 0)}
                </p>
                <span className="text-[10px] text-slate-500">Evaluated & Recorded</span>
              </div>

              <div className="p-5 rounded-2xl glass-panel border border-emerald-900/50 space-y-1">
                <span className="text-xs text-slate-400 font-medium">Published Study Notes</span>
                <p className="text-2xl font-bold text-gold-400 font-display">{materials.length}</p>
                <span className="text-[10px] text-slate-500">In Resource Repository</span>
              </div>
            </div>

            {/* Assignments List */}
            <div className="rounded-3xl glass-panel p-6 border border-emerald-900/60 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Recent Course Assignments</h3>
                <button
                  onClick={() => setActiveTab('ASSIGNMENTS')}
                  className="text-xs font-semibold text-teal-400 hover:underline"
                >
                  Manage All →
                </button>
              </div>

              <div className="space-y-3">
                {assignments.map((asg) => (
                  <div
                    key={asg.id}
                    className="p-4 rounded-2xl bg-forest-950 border border-emerald-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white">{asg.title}</h4>
                      <p className="text-teal-400">{asg.course?.title} • Total Marks: {asg.totalMarks}</p>
                      <p className="text-slate-400 text-[11px]">Due: {new Date(asg.deadline).toLocaleDateString()}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-semibold">
                        {asg.submissions?.length || 0} Submissions
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Assignments & Submissions with Grading */}
        {activeTab === 'ASSIGNMENTS' && (
          <div className="rounded-3xl glass-panel p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-display text-white">Assignments & Submissions</h2>
                <p className="text-xs text-slate-400">View student solutions, award marks, and provide feedback.</p>
              </div>
              <button
                onClick={() => setAssignModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
              >
                + New Assignment
              </button>
            </div>

            <div className="space-y-6">
              {assignments.map((asg) => (
                <div key={asg.id} className="p-5 rounded-2xl bg-forest-950 border border-emerald-900/50 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-base font-bold text-white">{asg.title}</h4>
                      <p className="text-xs text-teal-400">{asg.course?.title}</p>
                      <p className="text-xs text-slate-300 mt-1">{asg.description}</p>
                    </div>
                    <span className="text-xs text-slate-400">Deadline: {new Date(asg.deadline).toLocaleDateString()}</span>
                  </div>

                  <div className="pt-3 border-t border-emerald-950 space-y-2">
                    <p className="text-xs font-bold text-slate-300">
                      Student Submissions ({asg.submissions?.length || 0}):
                    </p>
                    {asg.submissions?.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No submissions yet.</p>
                    ) : (
                      asg.submissions?.map((sub) => (
                        <div
                          key={sub.id}
                          className="p-3 rounded-xl bg-forest-900/60 border border-emerald-900/40 flex items-center justify-between text-xs"
                        >
                          <div>
                            <p className="font-bold text-white">{sub.student?.studentProfile?.fullName || sub.student?.username}</p>
                            <p className="text-slate-300 text-[11px]">{sub.content}</p>
                            {sub.marksObtained !== null && (
                              <p className="text-emerald-400 font-semibold mt-0.5">
                                Graded: {sub.marksObtained}/50 • Feedback: {sub.feedback}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              setSelectedSubId(sub.id);
                              setGradeModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs"
                          >
                            {sub.status === 'GRADED' ? 'Edit Grade' : 'Grade Submission'}
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Materials */}
        {activeTab === 'MATERIALS' && (
          <div className="rounded-3xl glass-panel p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-display text-white">Study Materials & Notes</h2>
                <p className="text-xs text-slate-400">Manage uploaded syllabus documents, notes, and question papers.</p>
              </div>
              <button
                onClick={() => setMaterialModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
              >
                + Upload Notes / Syllabus
              </button>
            </div>

            <div className="space-y-3">
              {materials.map((mat) => (
                <div key={mat.id} className="p-4 rounded-xl bg-forest-950 border border-emerald-900/50 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {mat.resourceType}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1">{mat.title}</h4>
                    <p className="text-slate-400">{mat.sourceInfo} • {mat.downloadCount} Downloads</p>
                  </div>
                  <span className="text-emerald-400 font-semibold">{mat.approvalStatus}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Assigned Courses */}
        {activeTab === 'COURSES' && (
          <div className="rounded-3xl glass-panel p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold font-display text-white">Assigned Courses & Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((crs) => (
                <div key={crs.id} className="p-5 rounded-2xl bg-forest-950 border border-emerald-900/50 space-y-2 text-xs">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                    {crs.code}
                  </span>
                  <h4 className="text-sm font-bold text-white">{crs.title}</h4>
                  <p className="text-slate-400">{crs.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: AI Teaching Assistant */}
        {activeTab === 'AI_TEACH' && (
          <div className="rounded-3xl glass-panel p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-400" />
                <span>AI Teaching & Curriculum Assistant</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Draft 60-minute lesson plans, generate Bloom's taxonomy practice questions, and design rubrics.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/40 text-xs text-amber-200">
              Faculty Notice: All AI-generated questions and lecture materials must be reviewed and verified by faculty before publishing to students.
            </div>

            <Link
              to="/ai-assistant"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-glow-emerald"
            >
              <span>Launch Full AI Workspace in Faculty Mode</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </main>

      {/* Assignment Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="rounded-3xl glass-panel bg-[#02221b] border border-teal-500/40 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Create New Assignment</h3>
            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  placeholder="Assignment 3: B-Tree Indexing Implementation"
                  className="w-full px-3.5 py-2 rounded-xl bg-forest-900 border border-emerald-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Description & Submission Format *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  placeholder="Outline problem requirements, test benchmarks, and report format..."
                  className="w-full px-3.5 py-2 rounded-xl bg-forest-900 border border-emerald-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Deadline *
                  </label>
                  <input
                    type="date"
                    required
                    value={newAssignment.deadline}
                    onChange={(e) => setNewAssignment({ ...newAssignment, deadline: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-forest-900 border border-emerald-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    value={newAssignment.totalMarks}
                    onChange={(e) => setNewAssignment({ ...newAssignment, totalMarks: parseInt(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-forest-900 border border-emerald-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-glow-emerald"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grade Modal */}
      {gradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="rounded-3xl glass-panel bg-[#02221b] border border-teal-500/40 p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Grade Student Submission</h3>
            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Marks Obtained (out of 50) *
                </label>
                <input
                  type="number"
                  max="50"
                  min="0"
                  required
                  value={marks}
                  onChange={(e) => setMarks(parseInt(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-forest-900 border border-emerald-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Feedback *
                </label>
                <textarea
                  rows={3}
                  required
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-forest-900 border border-emerald-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGradeModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
                >
                  Save Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
