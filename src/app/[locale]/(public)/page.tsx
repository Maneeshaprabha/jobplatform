'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  Briefcase,
  Monitor,
  Globe,
  X,
  LayoutGrid,
  List,
  Calendar,
  FileText,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../../components/Navbar';

const PROVINCES = [
  'All Island',
  'Western',
  'Central',
  'Southern',
  'North Western',
  'Sabaragamuwa',
  'Uva',
  'North Central',
  'Eastern',
  'Northern',
];

const FOREIGN_REGIONS = [
  'All Foreign',
  'Middle East (UAE / Qatar / Saudi)',
  'Japan / South Korea',
  'Europe & UK',
  'Australia / Canada',
  'Singapore / Maldives',
  'Global Remote',
];

const SECTORS = [
  { id: 'all', label: 'All Jobs' },
  { id: 'government', label: 'Government (රාජ්‍ය)' },
  { id: 'private', label: 'Private (පෞද්ගලික)' },
  { id: 'it', label: 'IT & Tech' },
  { id: 'foreign', label: 'Foreign Jobs (විදේශ රැකියා)' },
  { id: 'internship', label: 'Internships' },
];

export default function Homepage() {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // View Mode State: 'list' or 'grid'
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Interactive Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
 const [jobScope, setJobScope] = useState<
  'all' | 'local' | 'foreign'
>('all');
  const [selectedProvince, setSelectedProvince] = useState('All Island');
  const [selectedForeignRegion, setSelectedForeignRegion] =
    useState('All Foreign');

  const t = useTranslations('Homepage');
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Theme Classes with #1A1A1A Dark Surface & #29AAE3 Accent
  const bgClass = isDarkMode ? 'bg-[#121212]' : 'bg-[#F8FAFC]';
  const textMain = isDarkMode ? 'text-zinc-100' : 'text-zinc-900';
  const textMuted = isDarkMode ? 'text-zinc-400' : 'text-zinc-500';
  const cardBg = isDarkMode
    ? 'bg-[#1A1A1A] border-zinc-800'
    : 'bg-white border-zinc-200/80';

  const modernCardHover = isDarkMode
    ? 'hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/50'
    : 'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-zinc-200/70';

  const accentText = 'text-[#29AAE3]';
  const accentBtn = 'bg-[#29AAE3] hover:bg-[#1E8EC2] text-white';

  // Mock Job Data (Sri Lankan + Foreign Context)
  const mockJobs = [
    {
      id: 1,
      title: 'Senior UI/UX Designer',
      company: 'PickMe (Digital Mobility Solutions)',
      sector: 'it',
      isForeign: false,
      province: 'Western',
      region: '',
      type: 'Full-Time',
      workplace: 'Hybrid',
      status: 'Urgently hiring',
      location: 'Colombo, Sri Lanka',
      closingDate: 'Nov 30, 2026',
      posted: 'Posted 5 mins ago',
      hasPdfForm: false,
      bullets: [
        'Design intuitive interfaces for our local ride-hailing and food delivery applications.',
        'Collaborate with cross-functional engineering teams based in our Colombo head office.',
      ],
      logo: 'P',
      logoBg: isDarkMode ? 'bg-white text-[#1A1A1A]' : 'bg-[#1A1A1A] text-white',
    },
    {
      id: 2,
      title: 'Vocational Instructor Vacancies 2026',
      company: 'Department of Social Services',
      sector: 'government',
      isForeign: false,
      province: 'All Island',
      region: '',
      type: 'Full-Time',
      workplace: 'On-Site',
      status: '15 Vacancies',
      location: 'All Island, Sri Lanka',
      closingDate: 'Dec 15, 2026',
      posted: 'Posted 1 hour ago',
      hasPdfForm: true,
      bullets: [
        'Recruitment to the posts of Vocational Instructor at Vocational Training Centers.',
        'Official application form PDF available for direct download.',
      ],
      logo: 'DS',
      logoBg: 'bg-[#29AAE3] text-white',
    },
    {
      id: 3,
      title: 'Hotel & Hospitality Supervisors (SLBFE Approved)',
      company: 'Emirates Grand Hospitality Group',
      sector: 'foreign',
      isForeign: true,
      province: '',
      region: 'Middle East (UAE / Qatar / Saudi)',
      type: 'Contract (2 Years)',
      workplace: 'On-Site',
      status: 'Foreign • Visa Provided',
      location: 'Dubai, UAE',
      closingDate: 'Dec 22, 2026',
      posted: 'Posted 2 hours ago',
      hasPdfForm: true,
      bullets: [
        'Free accommodation, medical insurance, and return air ticket provided by the employer.',
        'SLBFE registered recruitment agency — official application checklist PDF available.',
      ],
      logo: 'EG',
      logoBg: 'bg-amber-600 text-white',
    },
    {
      id: 4,
      title: 'Full Stack Developer (Next.js/Node)',
      company: 'Sysco LABS Sri Lanka',
      sector: 'it',
      isForeign: false,
      province: 'All Island',
      region: '',
      type: 'Full-Time',
      workplace: 'Remote',
      status: 'LKR 300,000 - 500,000',
      location: 'Colombo, Sri Lanka',
      closingDate: 'Dec 20, 2026',
      posted: 'Posted 3 hours ago',
      hasPdfForm: false,
      bullets: [
        'Build enterprise-grade software solutions for the global foodservice industry.',
        'Enjoy flexible working hours with a strong remote-first engineering culture.',
      ],
      logo: 'S',
      logoBg: 'bg-blue-600 text-white',
    },
    {
      id: 5,
      title: 'Caregiver & Nursing Staff (SSW Visa Program)',
      company: 'Sakura Healthcare Japan',
      sector: 'foreign',
      isForeign: true,
      province: '',
      region: 'Japan / South Korea',
      type: 'Full-Time',
      workplace: 'On-Site',
      status: 'Foreign • High Salary',
      location: 'Osaka, Japan',
      closingDate: 'Dec 28, 2026',
      posted: 'Posted 5 hours ago',
      hasPdfForm: false,
      bullets: [
        'Specified Skilled Worker (SSW) pathway with Japanese language training support.',
        'Monthly salary starting from JPY 210,000 + overtime and housing allowance.',
      ],
      logo: 'SH',
      logoBg: 'bg-rose-600 text-white',
    },
    {
      id: 6,
      title: 'Digital Marketing Executive',
      company: 'Daraz Sri Lanka',
      sector: 'private',
      isForeign: false,
      province: 'Central',
      region: '',
      type: 'Full-Time',
      workplace: 'On-Site',
      status: 'LKR 100,000 - 150,000',
      location: 'Kandy, Sri Lanka',
      closingDate: 'Dec 05, 2026',
      posted: 'Posted 1 day ago',
      hasPdfForm: false,
      bullets: [
        'Execute regional e-commerce marketing campaigns across the Central Province.',
        'Analyze consumer trends and optimize digital advertising spend for maximum ROI.',
      ],
      logo: 'D',
      logoBg: 'bg-orange-500 text-white',
    },
    {
      id: 7,
      title: 'Software Engineering Intern',
      company: 'WSO2 Lanka (Pvt) Ltd',
      sector: 'internship',
      isForeign: false,
      province: 'Southern',
      region: '',
      type: 'Internship',
      workplace: 'Hybrid',
      status: 'Paid Internship',
      location: 'Galle, Sri Lanka',
      closingDate: 'Dec 18, 2026',
      posted: 'Posted 2 days ago',
      hasPdfForm: false,
      bullets: [
        'Work alongside senior engineers on open-source cloud and API platforms.',
        '6-month structured internship program for Sri Lankan undergraduates.',
      ],
      logo: 'W',
      logoBg: 'bg-zinc-700 text-white',
    },
  ];

  // Sync sector click with scope
  const handleSectorSelect = (sectorId: string) => {
    setSelectedSector(sectorId);
    if (sectorId === 'foreign') {
      setJobScope('foreign');
    } else if (sectorId === 'government') {
      setJobScope('local');
    }
  };

  // Real-time Filtering Logic
  const filteredJobs = useMemo(() => {
    return mockJobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLocation =
        locationQuery.trim() === '' ||
        job.location.toLowerCase().includes(locationQuery.toLowerCase()) ||
        job.province.toLowerCase().includes(locationQuery.toLowerCase()) ||
        job.region.toLowerCase().includes(locationQuery.toLowerCase());

      const matchesSector =
        selectedSector === 'all' || job.sector === selectedSector;

      const matchesScope =
        jobScope === 'all' ||
        (jobScope === 'foreign' && job.isForeign) ||
        (jobScope === 'local' && !job.isForeign);

      const matchesLocalProvince =
        jobScope !== 'local' ||
        selectedProvince === 'All Island' ||
        job.province === selectedProvince ||
        job.province === 'All Island';

      const matchesForeignRegion =
        jobScope !== 'foreign' ||
        selectedForeignRegion === 'All Foreign' ||
        job.region === selectedForeignRegion;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesSector &&
        matchesScope &&
        matchesLocalProvince &&
        matchesForeignRegion
      );
    });
  }, [
    searchQuery,
    locationQuery,
    selectedSector,
    jobScope,
    selectedProvince,
    selectedForeignRegion,
  ]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setLocationQuery('');
    setSelectedSector('all');
    setJobScope('all');
    setSelectedProvince('All Island');
    setSelectedForeignRegion('All Foreign');
  };

  // Inline Metadata Strip
  const renderMetaRow = (job: (typeof mockJobs)[0]) => (
    <div
      className={`flex flex-wrap items-center gap-x-4 sm:gap-x-5 gap-y-1.5 text-sm sm:text-base ${
        isDarkMode ? 'text-zinc-300' : 'text-zinc-600'
      }`}
    >
      <span className="inline-flex items-center gap-1.5">
        <Briefcase
          className={`w-4 h-4 flex-shrink-0 ${
            isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
          }`}
        />
        <span>{job.type}</span>
      </span>

      <span className="inline-flex items-center gap-1.5">
        <Monitor
          className={`w-4 h-4 flex-shrink-0 ${
            isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
          }`}
        />
        <span>{job.workplace}</span>
      </span>

      <span className="inline-flex items-center gap-1.5">
        {job.isForeign ? (
          <Globe className="w-4 h-4 flex-shrink-0 text-[#29AAE3]" />
        ) : (
          <MapPin className="w-4 h-4 flex-shrink-0 text-[#29AAE3]" />
        )}
        <span>{job.location}</span>
      </span>
    </div>
  );

  // Minimalist Status Badge Renderer
  const renderStatusBadge = (
    status: string,
    isUrgent?: boolean,
    isAccentBadge?: boolean
  ) => {
    if (isUrgent) {
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold border ${
            isDarkMode
              ? 'bg-[#1A1A1A] border-zinc-700 text-zinc-200'
              : 'bg-zinc-50 border-zinc-200 text-zinc-800'
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
          </span>
          {status}
        </span>
      );
    }

    if (isAccentBadge) {
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold border ${
            isDarkMode
              ? 'bg-[#1A1A1A] border-zinc-700 text-[#29AAE3]'
              : 'bg-zinc-50 border-zinc-200 text-[#29AAE3]'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-[#29AAE3]" />
          {status}
        </span>
      );
    }

    return (
      <span
        className={`text-xs sm:text-sm font-semibold tracking-tight ${
          isDarkMode ? 'text-zinc-300' : 'text-zinc-700'
        }`}
      >
        {status}
      </span>
    );
  };

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: 'easeOut' as const },
    },
  };

  if (!mounted) return null;

  return (
    <div
      className={`min-h-screen ${bgClass} font-sans ${textMain} transition-colors duration-300 overflow-x-clip`}
    >
      {/* Reusable Floating Pill Navigation Bar */}
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      {/* Main Content Area */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-5 sm:py-9">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-10 items-start">
          {/* Left Sidebar Filters */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className={`lg:col-span-1 space-y-5 sm:space-y-6 ${cardBg} p-4 sm:p-6 rounded-2xl border shadow-xs lg:sticky lg:top-28 transition-colors duration-300`}
          >
            <div className="flex justify-between items-center">
              <h3 className={`font-bold text-base sm:text-lg ${textMain}`}>
                Filter
              </h3>
              <button
                onClick={clearAllFilters}
                className="text-rose-500 text-xs sm:text-sm font-semibold hover:underline cursor-pointer"
              >
                Clear all
              </button>
            </div>

            {/* Destination Scope Switcher (All / Sri Lanka / Foreign) */}
            <div>
              <h4
                className={`font-semibold text-sm sm:text-base mb-2.5 ${textMain}`}
              >
                Job Destination
              </h4>
              <div
                className={`grid grid-cols-3 p-1 rounded-xl border ${
                  isDarkMode
                    ? 'bg-[#121212] border-zinc-800'
                    : 'bg-zinc-100/80 border-zinc-200/80'
                }`}
              >
                {[
                  { id: 'all', label: 'All' },
                  { id: 'local', label: 'Sri Lanka' },
                  { id: 'foreign', label: 'Foreign' },
                ].map((tab) => {
                  const active = jobScope === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() =>
                        setJobScope(tab.id as 'all' | 'local' | 'foreign')
                      }
                      className={`py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                        active
                          ? 'bg-[#29AAE3] text-white shadow-xs'
                          : `${textMuted} hover:${textMain}`
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <hr
              className={isDarkMode ? 'border-zinc-800' : 'border-zinc-200/80'}
            />

            {/* Job Sector Filter */}
            <div>
              <h4
                className={`font-semibold text-sm sm:text-base mb-2.5 sm:mb-3 ${textMain}`}
              >
                Job Category
              </h4>
              <div className="flex lg:flex-col gap-2 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
                {SECTORS.map((sector) => {
                  const isActive = selectedSector === sector.id;
                  return (
                    <button
                      key={sector.id}
                      onClick={() => handleSectorSelect(sector.id)}
                      className={`whitespace-nowrap lg:whitespace-normal w-auto lg:w-full text-left px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between gap-2 flex-shrink-0 ${
                        isActive
                          ? isDarkMode
                            ? 'bg-white text-[#1A1A1A] shadow-xs'
                            : 'bg-[#1A1A1A] text-white shadow-xs'
                          : isDarkMode
                          ? 'bg-[#1A1A1A] text-zinc-300 border border-zinc-800 hover:bg-[#242424]'
                          : 'bg-zinc-50/80 text-zinc-700 border border-zinc-200/80 hover:bg-zinc-100'
                      }`}
                    >
                      <span>{sector.label}</span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-[#29AAE3] flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <hr
              className={isDarkMode ? 'border-zinc-800' : 'border-zinc-200/80'}
            />

            {/* Conditional Location Selector: Sri Lanka Provinces OR Foreign Regions */}
            {jobScope === 'foreign' ? (
              <div>
                <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
                  <Globe className={`w-4 h-4 ${accentText}`} />
                  <h4
                    className={`font-semibold text-sm sm:text-base ${textMain}`}
                  >
                    Foreign Country / Region
                  </h4>
                </div>
                <div className="flex lg:flex-wrap gap-2 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
                  {FOREIGN_REGIONS.map((region) => {
                    const isSelected = selectedForeignRegion === region;
                    return (
                      <button
                        key={region}
                        onClick={() => setSelectedForeignRegion(region)}
                        className={`whitespace-nowrap px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer flex-shrink-0 ${
                          isSelected
                            ? 'bg-[#29AAE3] text-white font-semibold shadow-xs'
                            : isDarkMode
                            ? 'bg-[#1A1A1A] text-zinc-300 border border-zinc-800 hover:bg-[#242424]'
                            : 'bg-zinc-50/80 text-zinc-700 border border-zinc-200/80 hover:bg-zinc-100'
                        }`}
                      >
                        {region}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
                  <MapPin className={`w-4 h-4 ${accentText}`} />
                  <h4
                    className={`font-semibold text-sm sm:text-base ${textMain}`}
                  >
                    Select Province (පළාත)
                  </h4>
                </div>
                <div className="flex lg:flex-wrap gap-2 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
                  {PROVINCES.map((province) => {
                    const isSelected = selectedProvince === province;
                    return (
                      <button
                        key={province}
                        onClick={() => {
                          setJobScope('local');
                          setSelectedProvince(province);
                        }}
                        className={`whitespace-nowrap px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer flex-shrink-0 ${
                          isSelected && jobScope === 'local'
                            ? 'bg-[#29AAE3] text-white font-semibold shadow-xs'
                            : isDarkMode
                            ? 'bg-[#1A1A1A] text-zinc-300 border border-zinc-800 hover:bg-[#242424]'
                            : 'bg-zinc-50/80 text-zinc-700 border border-zinc-200/80 hover:bg-zinc-100'
                        }`}
                      >
                        {province}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.aside>

          {/* Right Content Area */}
          <div className="lg:col-span-3 min-w-0">
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`flex flex-col md:flex-row w-full ${cardBg} border rounded-2xl p-2 mb-5 sm:mb-6 shadow-xs transition-colors duration-300`}
            >
              <div
                className={`flex-1 flex items-center px-3 sm:px-4 py-2.5 sm:py-3 border-b md:border-b-0 md:border-r ${
                  isDarkMode ? 'border-zinc-800' : 'border-zinc-200/80'
                }`}
              >
                <Search
                  className={`w-5 h-5 mr-2.5 sm:mr-3 flex-shrink-0 ${textMuted}`}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Job title, keywords, or company"
                  className={`w-full text-sm sm:text-base outline-none bg-transparent ${textMain} placeholder-zinc-400`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-zinc-400 hover:text-zinc-600 cursor-pointer ml-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex-1 flex items-center px-3 sm:px-4 py-2.5 sm:py-3">
                <Globe
                  className={`w-5 h-5 mr-2.5 sm:mr-3 flex-shrink-0 ${accentText}`}
                />
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="City, Province, or Country (e.g. Dubai, Japan)"
                  className={`w-full text-sm sm:text-base outline-none bg-transparent ${textMain} placeholder-zinc-400`}
                />
              </div>

              <button
                className={`${accentBtn} w-full md:w-auto px-6 sm:px-8 py-3 rounded-xl font-medium text-sm sm:text-base md:m-1 transition-all shadow-xs cursor-pointer flex-shrink-0`}
              >
                Find jobs
              </button>
            </motion.div>

            {/* Results Count + Card/List View Switcher */}
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className={`font-medium text-sm sm:text-base ${textMuted}`}>
                <span className={`font-bold ${accentText}`}>
                  {filteredJobs.length}
                </span>{' '}
                {jobScope === 'foreign'
                  ? 'Foreign jobs found'
                  : jobScope === 'local'
                  ? 'Jobs found in Sri Lanka'
                  : 'Jobs found (Sri Lanka & Foreign)'}
              </div>

              {/* View Mode Switcher */}
              <div
                className={`inline-flex items-center p-1 rounded-xl border flex-shrink-0 ${cardBg}`}
              >
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    viewMode === 'list'
                      ? isDarkMode
                        ? 'bg-white text-[#1A1A1A] shadow-xs'
                        : 'bg-[#1A1A1A] text-white shadow-xs'
                      : `${textMuted} hover:${textMain}`
                  }`}
                >
                  <List className="w-4 h-4" />
                  List
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    viewMode === 'grid'
                      ? isDarkMode
                        ? 'bg-white text-[#1A1A1A] shadow-xs'
                        : 'bg-[#1A1A1A] text-white shadow-xs'
                      : `${textMuted} hover:${textMain}`
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  Cards
                </button>
              </div>
            </div>

            {/* Job Listings */}
            {filteredJobs.length === 0 ? (
              <div
                className={`${cardBg} border rounded-2xl p-8 sm:p-12 text-center shadow-xs`}
              >
                <Briefcase className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
                <h3 className={`text-lg sm:text-xl font-bold mb-2 ${textMain}`}>
                  No jobs found
                </h3>
                <p className={`text-sm sm:text-base mb-5 ${textMuted}`}>
                  Try resetting your filters to see all local and foreign
                  vacancies.
                </p>
                <button
                  onClick={clearAllFilters}
                  className={`${accentBtn} px-6 py-2.5 rounded-xl font-semibold text-sm sm:text-base cursor-pointer`}
                >
                  Reset Filters
                </button>
              </div>
            ) : viewMode === 'list' ? (
              /* LIST VIEW */
              <motion.div
                key={`list-${selectedSector}-${jobScope}-${selectedProvince}-${selectedForeignRegion}`}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className={`${cardBg} rounded-2xl border shadow-xs overflow-hidden divide-y ${
                  isDarkMode ? 'divide-zinc-800' : 'divide-zinc-200/80'
                }`}
              >
                <AnimatePresence>
                  {filteredJobs.map((job) => (
                    <motion.div
                      key={job.id}
                      variants={itemVariants}
                      onClick={() => router.push(`/jobs/${job.id}`)}
                      className={`group p-4 sm:p-7 transition-colors duration-200 cursor-pointer ${
                        isDarkMode
                          ? 'hover:bg-white/[0.03]'
                          : 'hover:bg-zinc-50/90'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-5">
                        {/* Left: Logo + Title + Company + Status + Metadata + Bullets */}
                        <div className="flex items-start gap-3.5 sm:gap-5 min-w-0 flex-1">
                          <div
                            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex-shrink-0 ${job.logoBg} flex items-center justify-center font-bold text-base sm:text-lg shadow-xs mt-0.5`}
                          >
                            {job.logo}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                              <h3
                                className={`text-lg sm:text-xl font-bold leading-snug transition-colors duration-200 ${textMain} group-hover:text-[#29AAE3]`}
                              >
                                {job.title}
                              </h3>
                              {renderStatusBadge(
                                job.status,
                                job.status.toLowerCase().includes('urgent'),
                                job.sector === 'government' || job.isForeign
                              )}
                            </div>

                            <p
                              className={`text-xs font-semibold uppercase tracking-wider mt-1 ${textMuted}`}
                            >
                              {job.company}
                            </p>

                            {/* Inline Metadata Row */}
                            <div className="mt-2.5 sm:mt-3">
                              {renderMetaRow(job)}
                            </div>

                            {/* Job Description Bullets */}
                            <ul
                              className={`mt-3 space-y-1.5 text-sm sm:text-base list-disc pl-4 ${
                                isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
                              }`}
                            >
                              {job.bullets.map((bullet, idx) => (
                                <li key={idx}>{bullet}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Right: Type / Workplace + Posted Time + Circle Arrow Button */}
                        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-100 dark:border-zinc-800/70">
                          <div className="text-left md:text-right">
                            <p
                              className={`text-xs sm:text-sm font-medium ${textMain}`}
                            >
                              {job.type} • {job.workplace}
                            </p>
                            <p className={`text-xs mt-0.5 ${textMuted}`}>
                              {job.posted}
                            </p>
                          </div>

                          <div
                            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors duration-200 flex-shrink-0 ${
                              isDarkMode
                                ? 'border border-zinc-700 text-zinc-300 group-hover:bg-white group-hover:text-[#1A1A1A] group-hover:border-white'
                                : 'border border-zinc-200 text-zinc-700 group-hover:bg-[#1A1A1A] group-hover:text-white group-hover:border-[#1A1A1A]'
                            }`}
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              /* CARD (GRID) VIEW */
              <motion.div
                key={`grid-${selectedSector}-${jobScope}-${selectedProvince}-${selectedForeignRegion}`}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
              >
                <AnimatePresence>
                  {filteredJobs.map((job) => (
                    <motion.div
                      key={job.id}
                      variants={itemVariants}
                      onClick={() => router.push(`/jobs/${job.id}`)}
                      className={`group ${cardBg} rounded-2xl border shadow-xs transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer ${modernCardHover}`}
                    >
                      {/* Card Top Header */}
                      <div
                        className={`px-4 sm:px-6 py-3.5 sm:py-4 border-b ${
                          isDarkMode
                            ? 'border-zinc-800 bg-[#1A1A1A]'
                            : 'border-zinc-100 bg-zinc-50/70'
                        } flex items-center justify-between gap-2.5`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex-shrink-0 ${job.logoBg} flex items-center justify-center font-bold text-base sm:text-lg shadow-xs`}
                          >
                            {job.logo}
                          </div>
                          <div className="min-w-0">
                            <p
                              className={`font-semibold text-sm sm:text-base truncate ${textMain}`}
                            >
                              {job.company}
                            </p>
                            <p className={`text-xs ${textMuted}`}>
                              {job.posted}
                            </p>
                          </div>
                        </div>

                        <div className="flex-shrink-0">
                          {renderStatusBadge(
                            job.status,
                            job.status.toLowerCase().includes('urgent'),
                            job.sector === 'government' || job.isForeign
                          )}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 sm:p-6 flex-1">
                        <h3
                          className={`text-lg sm:text-xl font-bold leading-snug mb-3 transition-colors duration-200 ${textMain} group-hover:text-[#29AAE3]`}
                        >
                          {job.title}
                        </h3>

                        {/* Inline Metadata Row */}
                        <div className="mb-3.5">{renderMetaRow(job)}</div>

                        <div
                          className={`flex items-center gap-2 text-xs sm:text-sm ${textMuted}`}
                        >
                          <Calendar className="w-4 h-4 text-rose-500 flex-shrink-0" />
                          <span>
                            Closing:{' '}
                            <strong className={textMain}>
                              {job.closingDate}
                            </strong>
                          </span>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div
                        className={`px-4 sm:px-6 py-3.5 sm:py-4 border-t ${
                          isDarkMode ? 'border-zinc-800' : 'border-zinc-100'
                        } flex items-center justify-between gap-3`}
                      >
                        {job.hasPdfForm ? (
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold ${accentText}`}
                          >
                            <FileText className="w-4 h-4" />
                            PDF Form
                          </span>
                        ) : (
                          <span
                            className={`text-xs sm:text-sm font-medium ${textMuted}`}
                          >
                            Online Apply
                          </span>
                        )}

                        <span
                          className={`inline-flex items-center gap-1 text-xs sm:text-sm font-bold ${accentText} group-hover:underline`}
                        >
                          View Details
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}