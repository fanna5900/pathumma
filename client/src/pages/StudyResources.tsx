import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  FileText,
  Search,
  Filter,
  Download,
  Bookmark,
  BookmarkCheck,
  Building2,
  Calendar,
  Eye,
  CheckCircle,
  Plus,
  X,
  FileCheck,
  School,
  GraduationCap,
} from 'lucide-react';
import api from '../services/api';
import { LearningMaterial, Institution } from '../types';
import { useAuth } from '../context/AuthContext';

export const StudyResources: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resources, setResources] = useState<LearningMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // Domain Mode: All vs College/University vs School
  const [educationDomain, setEducationDomain] = useState<'ALL' | 'COLLEGE' | 'SCHOOL'>('ALL');

  // School Specific Filters
  const [selectedSchoolBoard, setSelectedSchoolBoard] = useState('All');
  const [selectedSchoolClass, setSelectedSchoolClass] = useState('All');
  const [selectedSchoolStream, setSelectedSchoolStream] = useState('All');

  // College Cascading Hierarchy Filters
  const [selectedUniversity, setSelectedUniversity] = useState('All');
  const [selectedCollege, setSelectedCollege] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [previewItem, setPreviewItem] = useState<LearningMaterial | null>(null);

  // Institution & Course options for cascading dropdowns
  const [institutions, setInstitutions] = useState<{ id: string; name: string; affiliation?: string }[]>([]);
  const [courses, setCourses] = useState<{ id: string; title: string; institutionId: string; code: string }[]>([]);

  // Upload modal for faculty
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    resourceType: 'NOTES',
    fileType: 'pdf',
    sourceInfo: 'Department Verified Faculty Upload',
  });

  const universities = [
    'All',
    'APJ Abdul Kalam Technological University (KTU)',
    'University of Calicut',
    'Mahatma Gandhi University',
    'University of Kerala',
    'Cochin University of Science and Technology (CUSAT)',
    'Kannur University',
  ];

  const categories = [
    { id: 'All', label: 'All Resources' },
    { id: 'NOTES', label: 'Study Notes' },
    { id: 'PREVIOUS_QUESTION_PAPER', label: 'Question Papers' },
    { id: 'SYLLABUS', label: 'Syllabus & Course Plans' },
    { id: 'QUESTION_BANK', label: 'Question Banks' },
    { id: 'REVISION_NOTES', label: 'Revision Notes' },
    { id: 'LAB_MANUAL', label: 'Lab Manuals' },
    { id: 'VIDEO_LESSON', label: 'Video Lessons' },
    { id: 'REFERENCE', label: 'Reference Materials' },
  ];

  const schoolBoards = [
    'All',
    'Kerala State Board (DHSE / SSLC)',
    'Central Board of Secondary Education (CBSE)',
    'Council for the Indian School Certificate Examinations (ICSE / ISC)',
    'IHRD Technical Higher Secondary',
  ];

  const schoolClasses = [
    'All',
    'Class 10 (Secondary / SSLC)',
    'Plus One (Class 11 Higher Secondary)',
    'Plus Two (Class 12 Higher Secondary)',
  ];

  const schoolStreams = [
    'All',
    'Science (PCMB / PCMC)',
    'Commerce (Accountancy & Business)',
    'Humanities / Arts',
    'Technical Physical Science',
  ];

  // Load institutions and courses once
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [instRes, courseRes] = await Promise.all([
          api.get('/institutions?limit=100'),
          api.get('/courses?limit=100'),
        ]);
        if (instRes.data?.data) {
          setInstitutions(instRes.data.data);
        }
        if (courseRes.data?.data) {
          setCourses(courseRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load institution/course metadata:', err);
      }
    };
    fetchMetadata();
  }, []);

  // Filter colleges based on chosen university
  const filteredColleges = institutions.filter((inst) => {
    if (selectedUniversity === 'All') return true;
    const aff = (inst.affiliation || '').toLowerCase();
    const uni = selectedUniversity.toLowerCase();
    if (uni.includes('ktu') || uni.includes('technological')) return aff.includes('ktu') || aff.includes('technological');
    if (uni.includes('calicut')) return aff.includes('calicut');
    if (uni.includes('mahatma gandhi') || uni.includes('mg')) return aff.includes('mahatma') || aff.includes('mg');
    if (uni.includes('kerala') && !uni.includes('technological')) return aff.includes('kerala') && !aff.includes('technological');
    if (uni.includes('cusat') || uni.includes('cochin')) return aff.includes('cochin') || aff.includes('cusat');
    if (uni.includes('kannur')) return aff.includes('kannur');
    return true;
  });

  // Filter courses based on chosen college
  const filteredCourses = courses.filter((c) => {
    if (selectedCollege === 'All') {
      if (selectedUniversity === 'All') return true;
      const validCollegeIds = new Set(filteredColleges.map((col) => col.id));
      return validCollegeIds.has(c.institutionId);
    }
    return c.institutionId === selectedCollege;
  });

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (educationDomain === 'COLLEGE') {
        if (selectedUniversity !== 'All') params.university = selectedUniversity;
        if (selectedCollege !== 'All') params.institutionId = selectedCollege;
        if (selectedCourse !== 'All') params.courseId = selectedCourse;
      }
      if (selectedCategory !== 'All') params.category = selectedCategory;

      let effectiveSearch = search.trim();
      if (educationDomain === 'SCHOOL') {
        const schoolKeywords: string[] = [];
        if (selectedSchoolClass !== 'All') {
          if (selectedSchoolClass.includes('10')) schoolKeywords.push('Class 10');
          if (selectedSchoolClass.includes('Plus One')) schoolKeywords.push('Plus One');
          if (selectedSchoolClass.includes('Plus Two')) schoolKeywords.push('Plus Two');
        }
        if (selectedSchoolStream !== 'All') {
          if (selectedSchoolStream.includes('Science')) schoolKeywords.push('Science');
          if (selectedSchoolStream.includes('Commerce')) schoolKeywords.push('Commerce');
          if (selectedSchoolStream.includes('Humanities')) schoolKeywords.push('Humanities');
        }
        if (schoolKeywords.length > 0) {
          effectiveSearch = `${effectiveSearch} ${schoolKeywords.join(' ')}`.trim();
        }
      }

      if (effectiveSearch) params.search = effectiveSearch;

      const res = await api.get('/resources', { params });
      if (res.data.success) {
        let list: LearningMaterial[] = res.data.data;

        // In school mode, filter out college semester specific materials if needed
        if (educationDomain === 'SCHOOL') {
          list = list.filter((r) => {
            const text = (r.title + ' ' + r.description).toLowerCase();
            return (
              text.includes('class 10') ||
              text.includes('sslc') ||
              text.includes('plus one') ||
              text.includes('plus two') ||
              text.includes('school') ||
              text.includes('cbse') ||
              text.includes('icse') ||
              text.includes('dhse')
            );
          });
        }

        setResources(list);
      }
    } catch (err) {
      console.error('Fetch resources error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    if (!user) return;
    try {
      const res = await api.get('/resources/user/bookmarks');
      if (res.data.success) {
        const ids = new Set<string>(res.data.data.map((r: any) => r.id as string));
        setBookmarkedIds(ids);
      }
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    fetchResources();
  }, [
    educationDomain,
    selectedSchoolBoard,
    selectedSchoolClass,
    selectedSchoolStream,
    selectedUniversity,
    selectedCollege,
    selectedCourse,
    selectedCategory,
  ]);

  useEffect(() => {
    fetchBookmarks();
  }, [user]);

  const toggleBookmark = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      alert('Please log in or sign up to bookmark resources.');
      navigate('/login?redirect=/study-resources');
      return;
    }

    try {
      const res = await api.post(`/resources/${id}/bookmark`);
      if (res.data.success) {
        const next = new Set(bookmarkedIds);
        if (res.data.bookmarked) next.add(id);
        else next.delete(id);
        setBookmarkedIds(next);
      }
    } catch (err) {
      console.error('Bookmark error:', err);
    }
  };

  // Protected Access Handler for Download
  const handleDownload = async (item: LearningMaterial) => {
    if (!user) {
      alert('Please log in or sign up to access and download study resources.');
      navigate('/login?redirect=/study-resources');
      return;
    }

    try {
      // Trigger download using the backend download endpoint
      const downloadUrl = `/api/resources/${item.id}/download`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `${item.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Increment local count
      setResources((prev) =>
        prev.map((r) => (r.id === item.id ? { ...r, downloadCount: r.downloadCount + 1 } : r))
      );
    } catch (err) {
      console.error('Download error:', err);
      window.open(`/api/resources/${item.id}/download`, '_blank');
    }
  };

  // Protected Access Handler for Preview
  const handlePreview = (item: LearningMaterial) => {
    if (!user) {
      alert('Please log in or sign up to preview study resources.');
      navigate('/login?redirect=/study-resources');
      return;
    }
    setPreviewItem(item);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/resources/upload', uploadForm);
      if (res.data.success) {
        alert('Learning resource uploaded successfully!');
        setUploadModalOpen(false);
        fetchResources();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to upload resource.');
    }
  };

  return (
    <div className="min-h-screen bg-[#021814] text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-semibold mb-3">
              <BookOpen className="w-4 h-4" />
              <span>Hierarchical Academic Repository</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white">
              Study Resources & Notes Library
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
              Access verified lecture notes, university syllabi, end-semester question papers, and school question banks structured by education level, board, and subject.
            </p>
          </div>

          {(user?.role === 'FACULTY' || user?.role === 'UNIVERSITY' || user?.role === 'ADMIN') && (
            <button
              onClick={() => setUploadModalOpen(true)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-glow-emerald flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Material</span>
            </button>
          )}
        </div>

        {/* Education Domain Selector Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-[#03241e] border border-emerald-900/60 max-w-2xl">
          <button
            onClick={() => setEducationDomain('ALL')}
            className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
              educationDomain === 'ALL'
                ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            All Academic Resources
          </button>
          <button
            onClick={() => setEducationDomain('COLLEGE')}
            className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              educationDomain === 'COLLEGE'
                ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Colleges & Universities</span>
          </button>
          <button
            onClick={() => setEducationDomain('SCHOOL')}
            className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              educationDomain === 'SCHOOL'
                ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <School className="w-4 h-4" />
            <span>Schools (10th, +1, +2)</span>
          </button>
        </div>

        {/* Hierarchical Cascading Filter Bar */}
        <div className="rounded-3xl glass-panel bg-[#03241e]/90 border border-emerald-800/60 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Filter className="w-4 h-4" />
              <span>
                {educationDomain === 'SCHOOL'
                  ? 'School Academic Repository Filter'
                  : 'Hierarchical Repository Filter'}
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedUniversity('All');
                setSelectedCollege('All');
                setSelectedCourse('All');
                setSelectedSemester('All');
                setSelectedSchoolBoard('All');
                setSelectedSchoolClass('All');
                setSelectedSchoolStream('All');
                setSelectedCategory('All');
                setSearch('');
              }}
              className="text-xs text-slate-400 hover:text-emerald-400 transition-colors"
            >
              Reset Filters
            </button>
          </div>

          {/* SCHOOL FILTERS (No Semester dropdown shown for schools) */}
          {educationDomain === 'SCHOOL' ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs animate-fadeIn">
              <div>
                <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                  1. Education Board
                </label>
                <select
                  value={selectedSchoolBoard}
                  onChange={(e) => setSelectedSchoolBoard(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-forest-900 border border-emerald-800/60 text-white focus:outline-none focus:border-emerald-500 text-xs"
                >
                  {schoolBoards.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                  2. School Class / Level
                </label>
                <select
                  value={selectedSchoolClass}
                  onChange={(e) => setSelectedSchoolClass(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-forest-900 border border-emerald-800/60 text-white focus:outline-none focus:border-emerald-500 text-xs"
                >
                  {schoolClasses.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                  3. Stream / Focus
                </label>
                <select
                  value={selectedSchoolStream}
                  onChange={(e) => setSelectedSchoolStream(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-forest-900 border border-emerald-800/60 text-white focus:outline-none focus:border-emerald-500 text-xs"
                >
                  {schoolStreams.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            /* COLLEGE / ALL CASCADING FILTERS */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs animate-fadeIn">
              <div>
                <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                  1. University Affiliation
                </label>
                <select
                  value={selectedUniversity}
                  onChange={(e) => {
                    setSelectedUniversity(e.target.value);
                    setSelectedCollege('All');
                    setSelectedCourse('All');
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-forest-900 border border-emerald-800/60 text-white focus:outline-none focus:border-emerald-500 text-xs"
                >
                  {universities.map((u) => (
                    <option key={u} value={u}>
                      {u === 'All' ? 'All Kerala Universities' : u}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                  2. College / Institution
                </label>
                <select
                  value={selectedCollege}
                  onChange={(e) => {
                    setSelectedCollege(e.target.value);
                    setSelectedCourse('All');
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-forest-900 border border-emerald-800/60 text-white focus:outline-none focus:border-emerald-500 text-xs"
                >
                  <option value="All">All Affiliated Colleges</option>
                  {filteredColleges.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                  3. Degree Course / Program
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-forest-900 border border-emerald-800/60 text-white focus:outline-none focus:border-emerald-500 text-xs"
                >
                  <option value="All">All Courses / Branches</option>
                  {filteredCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                  4. Academic Semester
                </label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-forest-900 border border-emerald-800/60 text-white focus:outline-none focus:border-emerald-500 text-xs"
                >
                  <option value="All">All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={`S${s}`}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Search bar & Category Pills */}
          <div className="flex flex-col md:flex-row gap-4 pt-3 border-t border-emerald-950">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchResources()}
                placeholder={
                  educationDomain === 'SCHOOL'
                    ? 'Search school notes (e.g. Class 10 Math, Plus Two Chemistry, Physics formulas)...'
                    : 'Search by topic, subject code, or keyword (e.g. Data Structures, OS, Algorithms)...'
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-forest-900 border border-emerald-800/60 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              onClick={fetchResources}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-glow-emerald"
            >
              Filter Resources
            </button>
          </div>

          {/* Resource Types Chips */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-emerald-950">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-glow-emerald'
                    : 'bg-forest-900 text-slate-300 hover:text-white border border-emerald-800/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400 text-sm">Loading academic resources...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="py-16 text-center glass-panel rounded-3xl p-8 max-w-lg mx-auto">
            <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No study resources are available yet.</h3>
            <p className="text-xs text-slate-400 mt-1">
              Try choosing another university, school, course, or semester to explore available study materials.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resItem) => {
              const isBookmarked = bookmarkedIds.has(resItem.id);

              return (
                <div
                  key={resItem.id}
                  className="rounded-3xl glass-panel p-6 border border-emerald-900/60 flex flex-col justify-between hover:border-emerald-500/40 transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                        {resItem.resourceType}
                      </span>
                      <button
                        onClick={(e) => toggleBookmark(resItem.id, e)}
                        className="text-slate-400 hover:text-emerald-400 transition-colors"
                        title={isBookmarked ? 'Bookmarked' : 'Bookmark'}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                      {resItem.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {resItem.description}
                    </p>

                    <div className="space-y-1 text-[11px] text-slate-300 pt-2 border-t border-emerald-950">
                      {resItem.institution && (
                        <p className="flex items-center gap-1.5 text-slate-300">
                          <Building2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span className="truncate">{resItem.institution.name}</span>
                        </p>
                      )}
                      {resItem.subject && (
                        <p className="text-emerald-400 font-semibold truncate">
                          Subject: {resItem.subject.title} ({resItem.subject.code})
                        </p>
                      )}
                      <p className="text-slate-400">
                        {resItem.fileType.toUpperCase()} • {resItem.fileSize || '2.4 MB'} • {resItem.downloadCount} Downloads
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-emerald-950 flex items-center gap-2">
                    <button
                      onClick={() => handlePreview(resItem)}
                      className="flex-1 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 border border-emerald-800/60 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Preview</span>
                    </button>

                    <button
                      onClick={() => handleDownload(resItem)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PDF Document Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
          <div className="rounded-3xl glass-panel bg-[#02221b] border border-emerald-500/40 p-5 sm:p-6 max-w-3xl w-full shadow-2xl space-y-4 max-h-[92vh] flex flex-col">
            <div className="flex items-start justify-between gap-4 border-b border-emerald-900/60 pb-3 flex-shrink-0">
              <div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {previewItem.resourceType}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1 line-clamp-1">{previewItem.title}</h3>
                <p className="text-xs text-slate-400">{previewItem.sourceInfo}</p>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-emerald-950"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Embedded Live PDF Document Viewer */}
            <div className="rounded-2xl overflow-hidden border border-emerald-800/60 bg-[#011410] flex-1 min-h-[300px] max-h-[460px]">
              <iframe
                src={`/api/resources/${previewItem.id}/preview`}
                className="w-full h-full border-none"
                title={previewItem.title}
              />
            </div>

            <div className="p-3.5 rounded-xl bg-forest-950/80 border border-emerald-900/60 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
              <div className="space-y-0.5">
                <p><span className="text-slate-400 font-semibold">Verification Seal:</span> Approved by State Academic Board</p>
                <p><span className="text-slate-400 font-semibold">Format & Size:</span> {previewItem.fileType.toUpperCase()} ({previewItem.fileSize || 'Standard'}) • {previewItem.downloadCount} Downloads</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewItem(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDownload(previewItem);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-glow-emerald flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal for Faculty */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="rounded-3xl glass-panel bg-[#02221b] border border-emerald-500/40 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <span>Upload Study Resource</span>
              </h3>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Material Title
                </label>
                <input
                  type="text"
                  required
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  placeholder="e.g. S4 Operating Systems Module 1 Notes"
                  className="w-full px-4 py-2.5 rounded-xl bg-forest-900 border border-emerald-800/60 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Resource Category
                </label>
                <select
                  value={uploadForm.resourceType}
                  onChange={(e) => setUploadForm({ ...uploadForm, resourceType: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-forest-900 border border-emerald-800/60 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="NOTES">Lecture Notes</option>
                  <option value="PREVIOUS_QUESTION_PAPER">Question Paper</option>
                  <option value="SYLLABUS">Syllabus</option>
                  <option value="QUESTION_BANK">Question Bank</option>
                  <option value="REVISION_NOTES">Revision Notes</option>
                  <option value="LAB_MANUAL">Lab Manual</option>
                  <option value="REFERENCE">Reference Material</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Detailed Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  placeholder="Briefly describe the key topics covered in this document..."
                  className="w-full px-4 py-2.5 rounded-xl bg-forest-900 border border-emerald-800/60 text-sm text-white focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-glow-emerald"
                >
                  Publish Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyResources;
