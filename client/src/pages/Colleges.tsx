import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Building2,
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
  GraduationCap,
} from 'lucide-react';
import api from '../services/api';
import { Institution } from '../types';
import { useAuth } from '../context/AuthContext';

export const Colleges: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [colleges, setColleges] = useState<Institution[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || 'All');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'All');
  const [selectedAffiliation, setSelectedAffiliation] = useState(searchParams.get('university') || 'All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');

  const indianStates = ['All', 'Kerala', 'Karnataka', 'Tamil Nadu', 'Maharashtra', 'Delhi'];

  // Categories requested in Section 7
  const institutionCategories = [
    'All',
    'Government',
    'Government Aided',
    'Private Self-Financing',
    'Autonomous',
    'University Department',
    'NIT',
    'IIT',
    'State University',
  ];

  const affiliations = [
    'All',
    'APJ Abdul Kalam Technological University (KTU)',
    'University of Calicut',
    'Mahatma Gandhi University',
    'University of Kerala',
    'CUSAT',
    'Kannur University',
  ];

  const keralaDistricts = [
    'All',
    'Thiruvananthapuram',
    'Kollam',
    'Kottayam',
    'Ernakulam',
    'Thrissur',
    'Malappuram',
    'Kozhikode',
    'Kannur',
  ];

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const params: any = { limit: 100 };
      if (selectedState !== 'All') params.state = selectedState;
      if (selectedType !== 'All') params.type = selectedType;
      if (selectedAffiliation !== 'All') params.affiliation = selectedAffiliation;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/institutions', { params });
      if (res.data.success) {
        let data: Institution[] = res.data.data;
        if (selectedDistrict !== 'All') {
          data = data.filter(
            (c) =>
              c.city?.toLowerCase().includes(selectedDistrict.toLowerCase()) ||
              c.location?.toLowerCase().includes(selectedDistrict.toLowerCase()) ||
              c.address?.toLowerCase().includes(selectedDistrict.toLowerCase())
          );
        }
        setColleges(data);
      }
    } catch (err) {
      console.error('Fetch colleges error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSaved = async () => {
    if (!user) return;
    try {
      const res = await api.get('/institutions/user/saved');
      if (res.data.success) {
        const ids = new Set<string>(res.data.data.map((c: any) => c.id as string));
        setSavedIds(ids);
      }
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    fetchColleges();
  }, [selectedState, selectedType, selectedAffiliation, selectedDistrict]);

  useEffect(() => {
    fetchSaved();
  }, [user]);

  const toggleSave = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please log in as a student to save colleges to your bookmarks.');
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
      console.error('Save error:', err);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedState('All');
    setSelectedType('All');
    setSelectedAffiliation('All');
    setSelectedDistrict('All');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#021814] text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-semibold mb-3">
              <Compass className="w-4 h-4" />
              <span>NEXORA Verified College Directory</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white">
              Explore Verified Colleges & Institutions
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Official categories (Government, Aided, Autonomous, Private Self-Financing), university affiliations, NIRF ranks, and verified fee matrices across Kerala and India.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="rounded-3xl glass-panel bg-[#03241e]/90 border border-emerald-800/60 p-6 shadow-xl space-y-5">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchColleges()}
                placeholder="Search by college name, town, or specialization (e.g. CET, TKM, GEC, Farook)..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-forest-900/90 border border-emerald-800/60 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={fetchColleges}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-glow-emerald transition-all"
            >
              Search Registry
            </button>
          </div>

          {/* Affiliation / University Filter */}
          <div className="space-y-2 pt-2 border-t border-emerald-950">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Filter by Affiliated University:
            </span>
            <div className="flex flex-wrap gap-2">
              {affiliations.map((aff) => (
                <button
                  key={aff}
                  onClick={() => setSelectedAffiliation(aff)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedAffiliation === aff
                      ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald font-bold'
                      : 'bg-forest-900/80 text-slate-300 hover:text-white hover:bg-forest-800 border border-emerald-800/40'
                  }`}
                >
                  {aff}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="space-y-2 pt-2 border-t border-emerald-950">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Filter by Institution Category:
            </span>
            <div className="flex flex-wrap gap-2">
              {institutionCategories.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedType === type
                      ? 'bg-teal-500 text-slate-950 shadow-glow-emerald font-bold'
                      : 'bg-forest-900/80 text-slate-300 hover:text-white hover:bg-forest-800 border border-emerald-800/40'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* District Filter Chips */}
          <div className="space-y-2 pt-2 border-t border-emerald-950">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Filter by Kerala District:
              </span>
              {(selectedAffiliation !== 'All' || selectedType !== 'All' || selectedDistrict !== 'All' || search) && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-emerald-400 hover:underline font-medium"
                >
                  Reset All Filters
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {keralaDistricts.map((dist) => (
                <button
                  key={dist}
                  onClick={() => setSelectedDistrict(dist)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedDistrict === dist
                      ? 'bg-gold-500 text-slate-950 shadow-glow-gold font-bold'
                      : 'bg-forest-900/80 text-slate-300 hover:text-white hover:bg-forest-800 border border-emerald-800/40'
                  }`}
                >
                  {dist}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Directory Listing */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400 text-sm">Querying verified institutional registry...</p>
          </div>
        ) : colleges.length === 0 ? (
          <div className="py-16 text-center glass-panel rounded-3xl p-8 max-w-lg mx-auto bg-forest-900/60 border border-emerald-900/40">
            <Building2 className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No Colleges Match Current Filters</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Try choosing "All" on university affiliation or category to broaden results.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-forest-800 text-emerald-300 text-xs font-semibold hover:bg-forest-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((college) => {
              const isSaved = savedIds.has(college.id);
              return (
                <div
                  key={college.id}
                  className="rounded-3xl glass-panel bg-forest-900/80 p-6 flex flex-col justify-between border border-emerald-900/60 relative group hover:border-emerald-500/50 transition-all shadow-xl"
                >
                  <div>
                    {/* Header with Type & Bookmark */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                        {college.institutionType}
                      </span>

                      <div className="flex items-center space-x-2">
                        {college.nirfRank && (
                          <span className="text-[10px] font-bold text-gold-300 bg-amber-950/60 border border-amber-800/50 px-2 py-0.5 rounded-lg">
                            NIRF #{college.nirfRank}
                          </span>
                        )}
                        <button
                          onClick={(e) => toggleSave(college.id, e)}
                          className="p-1.5 rounded-lg bg-forest-900 hover:bg-forest-800 text-slate-400 hover:text-white transition-colors"
                          title={isSaved ? 'Remove from Saved' : 'Save College'}
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* College Title & Location */}
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                      {college.name}
                    </h3>

                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{college.city}, {college.state}</span>
                    </p>

                    {/* Affiliated University */}
                    {college.affiliation && (
                      <div className="mt-2 text-[11px] text-slate-300 flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
                        <span className="truncate">{college.affiliation}</span>
                      </div>
                    )}

                    {/* Verified Gazette Badge */}
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-300 bg-emerald-950/50 border border-emerald-800/40 px-2.5 py-1 rounded-xl">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="truncate">{college.officialSource || 'UGC & State DTE Verified'}</span>
                    </div>

                    {/* Facilities Preview */}
                    <div className="mt-4 pt-3 border-t border-emerald-950 text-xs text-slate-300 space-y-1">
                      <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                        Key Facilities:
                      </p>
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {college.facilities || 'Information not yet verified.'}
                      </p>
                    </div>

                    {/* Available Courses preview */}
                    {college.courses && college.courses.length > 0 && (
                      <div className="mt-3 text-xs text-slate-300">
                        <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                          Featured Course Fee:
                        </span>
                        <div className="p-2.5 rounded-xl bg-forest-950/80 border border-emerald-900/40 flex items-center justify-between">
                          <span className="truncate pr-2">{college.courses[0].title}</span>
                          <span className="font-bold text-emerald-400 flex-shrink-0">
                            {college.courses[0].fees?.[0]
                              ? `₹${college.courses[0].fees[0].tuitionFee.toLocaleString()}/yr`
                              : 'Information not yet verified.'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-5 mt-4 border-t border-emerald-950 space-y-2">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/colleges/${college.slug || college.id}`}
                        className="flex-1 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors border border-emerald-500/20 shadow-sm"
                      >
                        <span>Details & Fee Matrix</span>
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                      </Link>

                      {college.officialWebsite && (
                        <a
                          href={college.officialWebsite}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2.5 rounded-xl bg-forest-850 hover:bg-forest-800 border border-emerald-800/60 text-slate-400 hover:text-white transition-colors"
                          title="Open Official College Website"
                        >
                          <ExternalLink className="w-4 h-4 text-emerald-400" />
                        </a>
                      )}
                    </div>

                    <Link
                      to={`/admission?institutionId=${college.id}`}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-forest-700 hover:from-emerald-400 hover:to-forest-600 text-[#021814] font-bold text-xs flex items-center justify-center gap-1.5 shadow-glow-emerald transition-all"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Apply for Admission
                    </Link>
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

export default Colleges;
