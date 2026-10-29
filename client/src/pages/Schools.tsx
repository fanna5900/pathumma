import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  School,
  Search,
  MapPin,
  ShieldCheck,
  Star,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Compass,
  ArrowRight,
  Filter,
  CheckCircle,
  BookOpen,
  GraduationCap,
} from 'lucide-react';
import api from '../services/api';
import { Institution } from '../types';
import { useAuth } from '../context/AuthContext';

export const Schools: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [schools, setSchools] = useState<Institution[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || 'All');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedBoard, setSelectedBoard] = useState(searchParams.get('board') || 'All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');

  const indianStates = ['All', 'Kerala', 'Tamil Nadu', 'Karnataka', 'West Bengal', 'Delhi'];

  const schoolCategories = [
    'All',
    'Government School',
    'Government Aided',
    'Private School',
  ];

  const educationBoards = [
    'All',
    'Kerala State Board (DHSE / SSLC)',
    'Central Board of Secondary Education (CBSE)',
    'Council for the Indian School Certificate Examinations (CISCE / ICSE)',
    'IHRD Technical Higher Secondary',
  ];

  const keralaDistricts = [
    'All',
    'Thiruvananthapuram',
    'Kollam',
    'Pathanamthitta',
    'Alappuzha',
    'Kottayam',
    'Idukki',
    'Ernakulam',
    'Thrissur',
    'Palakkad',
    'Malappuram',
    'Kozhikode',
    'Wayanad',
    'Kannur',
    'Kasaragod',
  ];

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const params: any = { category: 'SCHOOL', limit: 100 };
      if (selectedState !== 'All') params.state = selectedState;
      if (selectedCategory !== 'All') params.type = selectedCategory;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/institutions', { params });
      if (res.data.success) {
        let data: Institution[] = res.data.data;

        // Filter by board
        if (selectedBoard !== 'All') {
          const boardKey = selectedBoard.toLowerCase();
          data = data.filter((s) => {
            const aff = (s.affiliation || '').toLowerCase();
            if (boardKey.includes('kerala') || boardKey.includes('dhse')) return aff.includes('kerala') || aff.includes('dhse');
            if (boardKey.includes('cbse')) return aff.includes('cbse') || aff.includes('central board');
            if (boardKey.includes('icse') || boardKey.includes('cisce')) return aff.includes('icse') || aff.includes('cisce');
            if (boardKey.includes('ihrd')) return aff.includes('ihrd');
            return true;
          });
        }

        // Filter by district
        if (selectedDistrict !== 'All') {
          data = data.filter(
            (c) =>
              c.city?.toLowerCase().includes(selectedDistrict.toLowerCase()) ||
              c.location?.toLowerCase().includes(selectedDistrict.toLowerCase()) ||
              c.address?.toLowerCase().includes(selectedDistrict.toLowerCase())
          );
        }

        setSchools(data);
      }
    } catch (err) {
      console.error('Fetch schools error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSaved = async () => {
    if (!user) return;
    try {
      const res = await api.get('/institutions/user/saved');
      if (res.data.success) {
        const ids = new Set<string>(res.data.data.map((item: any) => item.institutionId as string));
        setSavedIds(ids);
      }
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    fetchSchools();
  }, [selectedState, selectedCategory, selectedBoard, selectedDistrict]);

  useEffect(() => {
    fetchSaved();
  }, [user]);

  const toggleSave = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert('Please log in to save schools to your profile.');
      return;
    }

    try {
      const res = await api.post(`/institutions/${id}/save`);
      if (res.data.success) {
        const next = new Set(savedIds);
        if (res.data.saved) next.add(id);
        else next.delete(id);
        setSavedIds(next);
      }
    } catch (err) {
      console.error('Save school error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#021814] text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-semibold mb-3">
              <School className="w-4 h-4" />
              <span>Verified School Directory</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white">
              Schools Directory & Portals
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
              Discover Government, Government-Aided, and Private schools across Kerala and India with verified admission standards, education boards, and senior secondary streams.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admission"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-glow-emerald transition-all flex items-center gap-2"
            >
              <span>Apply for School Admission</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Filter Controls Panel */}
        <div className="rounded-3xl glass-panel bg-[#03241e]/90 border border-emerald-800/60 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Filter className="w-4 h-4" />
              <span>Filter Verified Schools</span>
            </div>
            <button
              onClick={() => {
                setSelectedState('All');
                setSelectedCategory('All');
                setSelectedBoard('All');
                setSelectedDistrict('All');
                setSearch('');
              }}
              className="text-xs text-slate-400 hover:text-emerald-400 transition-colors"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Search Input */}
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                Search School
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchSchools()}
                  placeholder="e.g. Model Boys, Cotton Hill, KV..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-forest-900 border border-emerald-800/60 text-white focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                School Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-forest-900 border border-emerald-800/60 text-white focus:outline-none focus:border-emerald-500 text-xs"
              >
                {schoolCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Board Filter */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                Education Board
              </label>
              <select
                value={selectedBoard}
                onChange={(e) => setSelectedBoard(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-forest-900 border border-emerald-800/60 text-white focus:outline-none focus:border-emerald-500 text-xs"
              >
                {educationBoards.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* District Filter */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                Kerala District
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-forest-900 border border-emerald-800/60 text-white focus:outline-none focus:border-emerald-500 text-xs"
              >
                {keralaDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            Showing <strong className="text-white">{schools.length}</strong> verified schools
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" /> Official Gazette & Education Board Verified
          </span>
        </div>

        {/* Schools Cards Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400 text-sm">Loading verified school records...</p>
          </div>
        ) : schools.length === 0 ? (
          <div className="py-20 text-center glass-panel rounded-3xl p-8 max-w-lg mx-auto">
            <School className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No Schools Found</h3>
            <p className="text-xs text-slate-400 mt-1">
              No verified schools match your current filter selection. Try adjusting your district or board filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((school) => {
              const isSaved = savedIds.has(school.id);

              return (
                <div
                  key={school.id}
                  className="rounded-3xl glass-panel p-6 border border-emerald-900/60 flex flex-col justify-between hover:border-emerald-500/40 transition-all group relative overflow-hidden"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                          {school.institutionType}
                        </span>
                        <span className="ml-2 text-[10px] text-slate-400">
                          Est. {school.establishedYear || 'N/A'}
                        </span>
                      </div>
                      <button
                        onClick={(e) => toggleSave(school.id, e)}
                        className="text-slate-400 hover:text-emerald-400 transition-colors"
                        title={isSaved ? 'Saved School' : 'Save School'}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                        <Link to={`/colleges/${school.id}`}>{school.name}</Link>
                      </h3>
                      <p className="flex items-center gap-1.5 text-xs text-slate-300 mt-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="truncate">{school.location}</span>
                      </p>
                    </div>

                    {/* Affiliation / Board */}
                    {school.affiliation && (
                      <div className="p-3 rounded-xl bg-forest-950/70 border border-emerald-900/40 text-xs">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Board / Affiliation</p>
                        <p className="text-emerald-300 font-semibold truncate mt-0.5">{school.affiliation}</p>
                      </div>
                    )}

                    {/* Available Classes & Streams */}
                    <div className="space-y-1.5 pt-2 border-t border-emerald-950 text-xs">
                      <p className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Available Classes & Streams:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {school.courses && school.courses.length > 0 ? (
                          school.courses.slice(0, 3).map((c) => (
                            <span
                              key={c.id}
                              className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800"
                            >
                              {c.code || c.title}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-slate-400">Class 10, Plus One & Plus Two</span>
                        )}
                        {school.courses && school.courses.length > 3 && (
                          <span className="text-[10px] text-slate-400 pt-0.5">
                            +{school.courses.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Verified Facilities Preview */}
                    {school.facilities && (
                      <p className="text-[11px] text-slate-400 line-clamp-2">
                        <strong className="text-slate-300">Facilities:</strong> {school.facilities}
                      </p>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-4 mt-4 border-t border-emerald-950 flex items-center justify-between gap-3">
                    <Link
                      to={`/colleges/${school.id}`}
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      <span>View School Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {school.officialWebsite && (
                      <a
                        href={school.officialWebsite}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                        title="Official School Website"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Schools;
