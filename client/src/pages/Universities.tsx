import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Search,
  Filter,
  MapPin,
  ExternalLink,
  BookOpen,
  Award,
  Building2,
  Calendar,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Info,
} from 'lucide-react';
import api from '../services/api';

interface UniversityItem {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  bannerUrl?: string;
  location: string;
  address: string;
  city: string;
  state: string;
  institutionType: string;
  affiliation?: string;
  officialWebsite: string;
  contactEmail: string;
  contactPhone: string;
  facilities: string;
  scholarships?: string;
  verificationStatus: string;
  officialSource: string;
  rating: number;
  establishedYear?: number;
  nirfRank?: number;
  departments?: any[];
  courses?: any[];
  _count?: {
    courses: number;
    departments: number;
  };
}

export const Universities: React.FC = () => {
  const navigate = useNavigate();
  const [universities, setUniversities] = useState<UniversityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  useEffect(() => {
    const fetchUniversities = async () => {
      setLoading(true);
      try {
        const res = await api.get('/institutions?limit=50');
        if (res.data?.data) {
          // Filter to universities or institutions offering multi-department curricula
          const list = res.data.data.filter(
            (inst: UniversityItem) =>
              inst.institutionType.toLowerCase().includes('university') ||
              inst.name.toLowerCase().includes('university') ||
              inst.institutionType.toLowerCase().includes('nit') ||
              inst.institutionType.toLowerCase().includes('iit')
          );
          setUniversities(list);
        }
      } catch (err) {
        console.error('Failed to load universities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  // Filtered list
  const filteredUniversities = universities.filter((univ) => {
    const matchesSearch =
      univ.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      univ.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      univ.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity = selectedCity === 'All' || univ.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesType =
      selectedType === 'All' ||
      univ.institutionType.toLowerCase().includes(selectedType.toLowerCase());

    return matchesSearch && matchesCity && matchesType;
  });

  const cityOptions = ['All', 'Thiruvananthapuram', 'Kochi', 'Malappuram', 'Kottayam', 'Kannur', 'Kozhikode'];
  const typeOptions = ['All', 'State University', 'NIT', 'IIT', 'Central University'];

  return (
    <div className="min-h-screen bg-[#021814] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto pt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <GraduationCap className="w-4 h-4 text-emerald-400" /> Apex Institutional Directory
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Premier Universities of Kerala & India
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            Verified institutional profiles, official gazette affiliations, academic departments, and centralized admission counseling links for Kerala's leading universities.
          </p>
        </div>

        {/* Notice of Initial Scope */}
        <div className="p-4 rounded-2xl bg-forest-900/60 border border-emerald-500/20 flex items-start gap-3 text-xs sm:text-sm text-slate-300 max-w-4xl mx-auto">
          <Info className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
          <p>
            <strong className="text-white">Directory Scope:</strong> NEXORA's institutional directory initially focuses on the six foundational universities of Kerala: APJ Abdul Kalam Technological University (KTU), University of Calicut, Mahatma Gandhi University, University of Kerala, CUSAT, and Kannur University, alongside premier Institutes of National Importance.
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-forest-900/80 border border-emerald-900/40 rounded-2xl p-4 sm:p-6 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by university name, campus location, or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#021814] border border-emerald-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-3.5 py-3 rounded-xl bg-[#021814] border border-emerald-900/50 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-400"
              >
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city === 'All' ? 'All Locations' : city}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gold-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3.5 py-3 rounded-xl bg-[#021814] border border-emerald-900/50 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-400"
              >
                {typeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t === 'All' ? 'All Categories' : t}
                  </option>
                ))}
              </select>
            </div>

            {(searchQuery || selectedCity !== 'All' || selectedType !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCity('All');
                  setSelectedType('All');
                }}
                className="px-3 py-3 text-xs text-emerald-400 hover:text-emerald-300 font-medium underline"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            Showing <strong className="text-emerald-400">{filteredUniversities.length}</strong> verified institutions
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" /> Official UGC / Government Verified
          </span>
        </div>

        {/* Universities Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-80 rounded-3xl bg-forest-900/50 border border-emerald-900/30 animate-pulse"
              />
            ))}
          </div>
        ) : filteredUniversities.length === 0 ? (
          <div className="text-center py-16 bg-forest-900/40 rounded-3xl border border-emerald-900/30 p-8">
            <Building2 className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No institutions match your filters</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-4">
              Try adjusting your search query or selecting "All Locations" to discover universities.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCity('All');
                setSelectedType('All');
              }}
              className="px-5 py-2.5 rounded-xl bg-forest-800 text-emerald-300 text-xs font-semibold hover:bg-forest-700"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUniversities.map((univ) => (
              <div
                key={univ.id}
                className="group bg-forest-900/80 border border-emerald-900/40 hover:border-emerald-500/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Header Banner */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={univ.bannerUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&fit=crop'}
                    alt={univ.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-[#021814]/80 backdrop-blur-md border border-emerald-500/30 text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                      {univ.institutionType}
                    </span>
                    {univ.nirfRank && (
                      <span className="px-2.5 py-1 rounded-full bg-gold-500/20 backdrop-blur-md border border-gold-500/40 text-[10px] font-bold text-gold-300 flex items-center gap-1">
                        <Award className="w-3 h-3" /> NIRF #{univ.nirfRank}
                      </span>
                    )}
                  </div>

                  {/* Established Year */}
                  {univ.establishedYear && (
                    <div className="absolute bottom-3 left-3 text-[11px] text-slate-300 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Est. {univ.establishedYear}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 mb-2">
                      {univ.name}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="truncate">{univ.address || `${univ.city}, ${univ.state}`}</span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                      {univ.affiliation || 'UGC Recognized Premier Higher Education Institution'}
                    </p>

                    {/* Meta stats */}
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-emerald-900/40 text-xs text-slate-400 mb-4">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">State</span>
                        <span className="text-slate-200 font-medium">{univ.state}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">Rating</span>
                        <span className="text-gold-400 font-bold">★ {univ.rating} / 5.0</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/colleges/${univ.slug || univ.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-white font-medium text-xs border border-emerald-500/20 transition-all shadow-sm"
                      >
                        View Details <ChevronRight className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        to={`/colleges?university=${encodeURIComponent(univ.name)}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest-850 hover:bg-forest-800 text-emerald-300 font-medium text-xs border border-emerald-500/30 transition-all"
                      >
                        <Building2 className="w-3.5 h-3.5" /> Colleges
                      </Link>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admission?institutionId=${univ.id}`}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-forest-700 hover:from-emerald-400 hover:to-forest-600 text-[#021814] font-bold text-xs shadow-glow-emerald transition-all"
                      >
                        Apply for Admission <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      {univ.officialWebsite && (
                        <a
                          href={univ.officialWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Official Website"
                          className="p-2.5 rounded-xl bg-forest-850 hover:bg-forest-800 text-slate-300 hover:text-white border border-emerald-500/20 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-emerald-400" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Universities;
