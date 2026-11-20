'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  Globe,
  Building2,
  Users,
  CheckCircle2,
  Briefcase,
  ArrowUpRight,
  X,
} from 'lucide-react';
import Navbar from '../../../../components/Navbar';

interface CompanyItem {
  slug: string;
  name: string;
  industry: string;
  category: 'it' | 'government' | 'private' | 'foreign';
  isForeign: boolean;
  location: string;
  size: string;
  openJobsCount: number;
  verified: boolean;
  logoUrl?: string;
  logo: string;
  logoBg: string;
}

const INDUSTRIES = [
  { id: 'all', label: 'All Industries' },
  { id: 'it', label: 'IT & Software' },
  { id: 'private', label: 'Private & E-Commerce' },
  { id: 'government', label: 'Government' },
  { id: 'foreign', label: 'Foreign Employers' },
];

const MOCK_COMPANIES: CompanyItem[] = [
  {
    slug: 'pickme',
    name: 'PickMe (Digital Mobility Solutions)',
    industry: 'Technology & Mobility',
    category: 'it',
    isForeign: false,
    location: 'Colombo, Sri Lanka',
    size: '500+ Employees',
    openJobsCount: 3,
    verified: true,
    logoUrl: '/logos/pickme.png',
    logo: 'P',
    logoBg: 'bg-[#1A1A1A] text-white',
  },
  {
    slug: 'sysco-labs',
    name: 'Sysco LABS Sri Lanka',
    industry: 'Enterprise Software & Cloud',
    category: 'it',
    isForeign: false,
    location: 'Colombo, Sri Lanka',
    size: '800+ Employees',
    openJobsCount: 2,
    verified: true,
    logoUrl: '/logos/sysco-labs.png',
    logo: 'S',
    logoBg: 'bg-blue-600 text-white',
  },
  {
    slug: 'department-of-social-services',
    name: 'Department of Social Services',
    industry: 'Government Sector',
    category: 'government',
    isForeign: false,
    location: 'All Island, Sri Lanka',
    size: 'Public Sector',
    openJobsCount: 15,
    verified: true,
    logoUrl: '/logos/dss.png',
    logo: 'DS',
    logoBg: 'bg-[#29AAE3] text-white',
  },
  {
    slug: 'emirates-grand-hospitality',
    name: 'Emirates Grand Hospitality Group',
    industry: 'Hospitality & Tourism',
    category: 'foreign',
    isForeign: true,
    location: 'Dubai, UAE',
    size: '1,000+ Employees',
    openJobsCount: 4,
    verified: true,
    logoUrl: '/logos/emirates-grand.png',
    logo: 'EG',
    logoBg: 'bg-amber-600 text-white',
  },
  {
    slug: 'sakura-healthcare-japan',
    name: 'Sakura Healthcare Japan',
    industry: 'Healthcare & Eldercare (SSW)',
    category: 'foreign',
    isForeign: true,
    location: 'Osaka, Japan',
    size: '300+ Employees',
    openJobsCount: 6,
    verified: true,
    logoUrl: '/logos/sakura-healthcare.png',
    logo: 'SH',
    logoBg: 'bg-rose-600 text-white',
  },
  {
    slug: 'daraz-sri-lanka',
    name: 'Daraz Sri Lanka',
    industry: 'E-Commerce & Retail',
    category: 'private',
    isForeign: false,
    location: 'Colombo & Kandy, Sri Lanka',
    size: '500+ Employees',
    openJobsCount: 2,
    verified: true,
    logoUrl: '/logos/daraz.png',
    logo: 'D',
    logoBg: 'bg-orange-500 text-white',
  },
  {
    slug: 'wso2-lanka',
    name: 'WSO2 Lanka (Pvt) Ltd',
    industry: 'Open Source Software & APIs',
    category: 'it',
    isForeign: false,
    location: 'Colombo & Galle, Sri Lanka',
    size: '800+ Employees',
    openJobsCount: 5,
    verified: true,
    logoUrl: '/logos/wso2.png',
    logo: 'W',
    logoBg: 'bg-zinc-700 text-white',
  },
];

function CompanyLogo({
  logoUrl,
  fallbackText,
  fallbackBg,
  companyName,
  isDarkMode,
}: {
  logoUrl?: string;
  fallbackText: string;
  fallbackBg: string;
  companyName: string;
  isDarkMode: boolean;
}) {
  const [imgError, setImgError] = useState(false);

  if (logoUrl && !imgError) {
    return (
      <div
        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex-shrink-0 overflow-hidden bg-white border flex items-center justify-center p-1 shadow-xs ${
          isDarkMode ? 'border-zinc-700/80' : 'border-zinc-200/80'
        }`}
      >
        <img
          src={logoUrl}
          alt={`${companyName} logo`}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  return (
    <div
      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex-shrink-0 ${fallbackBg} flex items-center justify-center font-bold text-sm sm:text-base shadow-xs`}
    >
      {fallbackText}
    </div>
  );
}

export default function CompaniesPage() {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [scope, setScope] = useState<'all' | 'local' | 'foreign'>('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const bgClass = isDarkMode ? 'bg-[#121212]' : 'bg-white';
  const textMain = isDarkMode ? 'text-zinc-100' : 'text-zinc-900';
  const textMuted = isDarkMode ? 'text-zinc-400' : 'text-zinc-500';
  const borderSubtle = isDarkMode ? 'border-zinc-800' : 'border-zinc-200/80';

  const filteredCompanies = useMemo(() => {
    return MOCK_COMPANIES.filter((company) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        company.name.toLowerCase().includes(q) ||
        company.industry.toLowerCase().includes(q) ||
        company.location.toLowerCase().includes(q);

      const matchesScope =
        scope === 'all' ||
        (scope === 'foreign' && company.isForeign) ||
        (scope === 'local' && !company.isForeign);

      const matchesIndustry =
        selectedIndustry === 'all' || company.category === selectedIndustry;

      const matchesVerified = !verifiedOnly || company.verified;

      return (
        matchesSearch && matchesScope && matchesIndustry && matchesVerified
      );
    });
  }, [searchQuery, scope, selectedIndustry, verifiedOnly]);

  const clearFilters = () => {
    setSearchQuery('');
    setScope('all');
    setSelectedIndustry('all');
    setVerifiedOnly(false);
  };

  if (!mounted) return null;

  return (
    <div
      className={`min-h-screen ${bgClass} font-sans ${textMain} transition-colors duration-300 overflow-x-clip`}
    >
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <main className="max-w-[1040px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Clean Editorial Page Header */}
        <div className="mb-7">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Companies
          </h1>
          <p className={`text-sm sm:text-[15px] mt-1.5 ${textMuted}`}>
            Browse hiring companies and available vacancies.
          </p>
        </div>

        {/* Flat Search & Filter Section (No heavy outer box) */}
        <div className="mb-7 space-y-3.5">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div
              className={`flex-1 flex items-center px-3.5 py-2.5 sm:py-3 rounded-xl border transition-colors ${
                isDarkMode
                  ? 'bg-[#1A1A1A] border-zinc-800 focus-within:border-[#29AAE3]'
                  : 'bg-white border-zinc-200 focus-within:border-[#29AAE3]'
              }`}
            >
              <Search className="w-4 h-4 mr-2.5 flex-shrink-0 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search company name, industry, or location..."
                className={`w-full text-sm outline-none bg-transparent ${textMain} placeholder-zinc-400`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-zinc-400 hover:text-zinc-600 cursor-pointer ml-1"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Scope Tabs (All / Sri Lanka / Foreign) */}
            <div
              className={`grid grid-cols-3 p-1 rounded-xl border flex-shrink-0 ${
                isDarkMode
                  ? 'bg-[#1A1A1A] border-zinc-800'
                  : 'bg-zinc-50 border-zinc-200/80'
              }`}
            >
              {[
                { id: 'all', label: 'All' },
                { id: 'local', label: 'Sri Lanka' },
                { id: 'foreign', label: 'Foreign' },
              ].map((tab) => {
                const active = scope === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() =>
                      setScope(tab.id as 'all' | 'local' | 'foreign')
                    }
                    className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
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

          {/* Industry Pills + Verified Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
              {INDUSTRIES.map((ind) => {
                const active = selectedIndustry === ind.id;
                return (
                  <button
                    key={ind.id}
                    onClick={() => setSelectedIndustry(ind.id)}
                    className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs sm:text-[13px] font-medium transition-all cursor-pointer flex-shrink-0 ${
                      active
                        ? isDarkMode
                          ? 'bg-white text-[#1A1A1A] font-semibold'
                          : 'bg-[#1A1A1A] text-white font-semibold'
                        : isDarkMode
                        ? 'bg-[#1A1A1A] text-zinc-300 border border-zinc-800 hover:bg-zinc-800'
                        : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    {ind.label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setVerifiedOnly((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                verifiedOnly
                  ? 'bg-[#29AAE3]/10 border-[#29AAE3]/50 text-[#29AAE3]'
                  : isDarkMode
                  ? 'bg-[#1A1A1A] border-zinc-800 text-zinc-300'
                  : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified Only
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className={`text-xs sm:text-sm font-medium mb-3 ${textMuted}`}>
          Showing{' '}
          <span className="font-semibold text-[#29AAE3]">
            {filteredCompanies.length}
          </span>{' '}
          companies
        </div>

        {/* Clean Minimal Company List (Matching /companies/[slug] editorial rows) */}
        {filteredCompanies.length === 0 ? (
          <div className={`py-14 text-center border-t ${borderSubtle}`}>
            <Building2 className="w-10 h-10 text-zinc-400 mx-auto mb-2.5" />
            <h3 className="text-base font-semibold mb-1">No companies found</h3>
            <p className={`text-sm mb-4 ${textMuted}`}>
              Try adjusting your search or resetting the filters.
            </p>
            <button
              onClick={clearFilters}
              className="px-5 py-2 rounded-lg bg-[#29AAE3] hover:bg-[#1E8EC2] text-white text-sm font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            className={`divide-y border-t border-b ${
              isDarkMode
                ? 'divide-zinc-800/90 border-zinc-800/90'
                : 'divide-zinc-200/80 border-zinc-200/80'
            }`}
          >
            {filteredCompanies.map((company) => (
              <div
                key={company.slug}
                onClick={() => router.push(`/companies/${company.slug}`)}
                className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 py-4 sm:py-5 px-2 -mx-2 rounded-xl transition-colors cursor-pointer ${
                  isDarkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-zinc-50/70'
                }`}
              >
                {/* Left: Logo + Company Name + Location & Employee Size */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <CompanyLogo
                    logoUrl={company.logoUrl}
                    fallbackText={company.logo}
                    fallbackBg={company.logoBg}
                    companyName={company.name}
                    isDarkMode={isDarkMode}
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-semibold text-sm sm:text-base truncate transition-colors ${textMain} group-hover:text-[#29AAE3]`}
                      >
                        {company.name}
                      </span>
                      {company.verified && (
                        <CheckCircle2 className="w-4 h-4 text-[#29AAE3] flex-shrink-0" />
                      )}
                    </div>

                    <div
                      className={`flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs sm:text-[13px] ${textMuted}`}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        {company.isForeign ? (
                          <Globe className="w-3.5 h-3.5 text-zinc-400" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                        )}
                        {company.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-zinc-400" />
                        {company.size}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Available Vacancies Pill + View Button */}
                <div className="flex items-center justify-between sm:justify-end gap-3.5 flex-shrink-0 pl-[54px] sm:pl-0">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                      isDarkMode
                        ? 'bg-zinc-900 text-zinc-200 border border-zinc-800'
                        : 'bg-[#F1F4F8] text-[#475569]'
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-[#7EC8EE]" />
                    {company.openJobsCount}{' '}
                    {company.openJobsCount === 1 ? 'Vacancy' : 'Vacancies'}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg border text-xs sm:text-sm font-medium transition-all ${
                      isDarkMode
                        ? 'border-zinc-700 text-zinc-200 group-hover:bg-[#29AAE3] group-hover:border-[#29AAE3] group-hover:text-white'
                        : 'border-zinc-200 text-zinc-700 bg-white group-hover:bg-[#29AAE3] group-hover:border-[#29AAE3] group-hover:text-white'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    View
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}