'use client';

import { Suspense, useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Search,
  Briefcase,
  Globe,
  MapPin,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../../../../../components/Navbar';

interface CompanyJob {
  id: string;
  title: string;
  department: string;
  type: string;
  workplace: string;
  location: string;
  isRemote?: boolean;
}

interface CompanyProfile {
  slug: string;
  name: string;
  shortName: string;
  website: string;
  verified: boolean;
  logoUrl?: string;
  logo: string;
  logoBg: string;
  about: string;
  jobs: CompanyJob[];
}

const COMPANIES_DATA: Record<string, CompanyProfile> = {
  pickme: {
    slug: 'pickme',
    name: 'PickMe (Digital Mobility Solutions)',
    shortName: 'PickMe',
    website: 'https://pickme.lk',
    verified: true,
    logoUrl: '/logos/pickme.png',
    logo: 'P',
    logoBg: 'bg-[#1A1A1A] text-white',
    about:
      'PickMe is Sri Lanka’s leading technology-driven mobility and logistics platform, powering ride-hailing, food delivery, and fleet solutions island-wide. Our mission is to engineer reliable, scalable digital infrastructure while building high-impact career opportunities for talented professionals across Sri Lanka.',
    jobs: [
      {
        id: '1',
        title: 'Senior UI/UX Designer',
        department: 'Product & Design',
        type: 'Full-time',
        workplace: 'Hybrid',
        location: 'Colombo, Sri Lanka',
      },
      {
        id: '101',
        title: 'Senior Backend Engineer (Go / Node.js)',
        department: 'Engineering',
        type: 'Full-time',
        workplace: 'Hybrid',
        location: 'Colombo, Sri Lanka',
      },
      {
        id: '102',
        title: 'QA Automation Engineer',
        department: 'Engineering',
        type: 'Full-time',
        workplace: 'Remote',
        location: 'Remote (Sri Lanka)',
        isRemote: true,
      },
      {
        id: '104',
        title: 'Fleet Operations Coordinator',
        department: 'Operations',
        type: 'Full-time',
        workplace: 'On-Site',
        location: 'Colombo, Sri Lanka',
      },
    ],
  },
  'sysco-labs': {
    slug: 'sysco-labs',
    name: 'Sysco LABS Sri Lanka',
    shortName: 'Sysco LABS',
    website: 'https://syscolabs.lk',
    verified: true,
    logoUrl: '/logos/sysco-labs.png',
    logo: 'S',
    logoBg: 'bg-blue-600 text-white',
    about:
      'Sysco LABS is the captive innovation center for Sysco Corporation, engineering enterprise software and cloud-native platforms that power the global foodservice supply chain. We focus on engineering excellence, modern architecture, and flexible remote-first collaboration.',
    jobs: [
      {
        id: '4',
        title: 'Full Stack Developer (Next.js / Node)',
        department: 'Engineering',
        type: 'Full-time',
        workplace: 'Remote',
        location: 'Remote (Sri Lanka)',
        isRemote: true,
      },
      {
        id: '103',
        title: 'DevOps & Cloud Engineer (AWS)',
        department: 'Engineering',
        type: 'Full-time',
        workplace: 'Hybrid',
        location: 'Colombo, Sri Lanka',
      },
      {
        id: '105',
        title: 'Data Governance Officer',
        department: 'Data & Security',
        type: 'Full-time',
        workplace: 'Remote',
        location: 'Remote',
        isRemote: true,
      },
    ],
  },
  'department-of-social-services': {
    slug: 'department-of-social-services',
    name: 'Department of Social Services',
    shortName: 'Department of Social Services',
    website: 'https://www.socialservices.gov.lk',
    verified: true,
    logoUrl: '/logos/dss.png',
    logo: 'DS',
    logoBg: 'bg-[#29AAE3] text-white',
    about:
      'The Department of Social Services manages vocational training centers, rehabilitation programs, and island-wide social welfare initiatives across Sri Lanka.',
    jobs: [
      {
        id: '2',
        title: 'Vocational Instructor Vacancies 2026',
        department: 'Training & Education',
        type: 'Full-time',
        workplace: 'On-Site',
        location: 'All Island, Sri Lanka',
      },
    ],
  },
  'emirates-grand-hospitality': {
    slug: 'emirates-grand-hospitality',
    name: 'Emirates Grand Hospitality Group',
    shortName: 'Emirates Grand Hospitality',
    website: 'https://example.com',
    verified: true,
    logoUrl: '/logos/emirates-grand.png',
    logo: 'EG',
    logoBg: 'bg-amber-600 text-white',
    about:
      'SLBFE-approved international hospitality employer offering 2-year employment contracts with visa sponsorship, accommodation, and comprehensive medical coverage in the UAE.',
    jobs: [
      {
        id: '3',
        title: 'Hotel & Hospitality Supervisors (SLBFE Approved)',
        department: 'Hospitality & Operations',
        type: 'Contract (2 Years)',
        workplace: 'On-Site',
        location: 'Dubai, UAE',
      },
    ],
  },
  'sakura-healthcare-japan': {
    slug: 'sakura-healthcare-japan',
    name: 'Sakura Healthcare Japan',
    shortName: 'Sakura Healthcare Japan',
    website: 'https://example.com',
    verified: true,
    logoUrl: '/logos/sakura-healthcare.png',
    logo: 'SH',
    logoBg: 'bg-rose-600 text-white',
    about:
      'Authorized Japanese healthcare employer recruiting Sri Lankan caregivers and nursing staff under the Specified Skilled Worker (SSW) visa pathway with structured language and onboarding support.',
    jobs: [
      {
        id: '5',
        title: 'Caregiver & Nursing Staff (SSW Visa Program)',
        department: 'Healthcare & Eldercare',
        type: 'Full-time',
        workplace: 'On-Site',
        location: 'Osaka, Japan',
      },
    ],
  },
  'daraz-sri-lanka': {
    slug: 'daraz-sri-lanka',
    name: 'Daraz Sri Lanka',
    shortName: 'Daraz Sri Lanka',
    website: 'https://careers.daraz.com',
    verified: true,
    logoUrl: '/logos/daraz.png',
    logo: 'D',
    logoBg: 'bg-orange-500 text-white',
    about:
      'Daraz is South Asia’s leading online shopping and e-commerce marketplace connecting thousands of Sri Lankan sellers, logistics partners, and shoppers every day.',
    jobs: [
      {
        id: '6',
        title: 'Digital Marketing Executive',
        department: 'Marketing & Growth',
        type: 'Full-time',
        workplace: 'On-Site',
        location: 'Kandy, Sri Lanka',
      },
    ],
  },
  'wso2-lanka': {
    slug: 'wso2-lanka',
    name: 'WSO2 Lanka (Pvt) Ltd',
    shortName: 'WSO2',
    website: 'https://wso2.com/careers',
    verified: true,
    logoUrl: '/logos/wso2.png',
    logo: 'W',
    logoBg: 'bg-zinc-700 text-white',
    about:
      'WSO2 is a global leader in API management, integration, and identity & access management software, empowering enterprises worldwide with open-source cloud-native platforms.',
    jobs: [
      {
        id: '7',
        title: 'Software Engineering Intern',
        department: 'Engineering',
        type: 'Internship',
        workplace: 'Hybrid',
        location: 'Galle, Sri Lanka',
      },
    ],
  },
};

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
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex-shrink-0 overflow-hidden bg-white border flex items-center justify-center p-1.5 shadow-xs ${
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
      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex-shrink-0 ${fallbackBg} flex items-center justify-center font-bold text-lg sm:text-xl shadow-xs`}
    >
      {fallbackText}
    </div>
  );
}

function CompanyProfileContent() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const company = useMemo(() => {
    const slug = String(params?.slug || '');
    return COMPANIES_DATA[slug] || COMPANIES_DATA['pickme'];
  }, [params?.slug]);

  // Filter jobs inside company
  const filteredJobs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return company.jobs;
    return company.jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.department.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.type.toLowerCase().includes(q)
    );
  }, [company.jobs, searchQuery]);

  // Group filtered jobs by department
  const groupedJobs = useMemo(() => {
    const groups: Record<string, CompanyJob[]> = {};
    filteredJobs.forEach((job) => {
      if (!groups[job.department]) {
        groups[job.department] = [];
      }
      groups[job.department].push(job);
    });
    return Object.entries(groups);
  }, [filteredJobs]);

  const bgClass = isDarkMode ? 'bg-[#121212]' : 'bg-white';
  const textMain = isDarkMode ? 'text-zinc-100' : 'text-zinc-900';
  const textMuted = isDarkMode ? 'text-zinc-400' : 'text-zinc-600';
  const borderSubtle = isDarkMode ? 'border-zinc-800' : 'border-zinc-200/80';

  if (!mounted) return null;

  return (
    <div
      className={`min-h-screen ${bgClass} font-sans ${textMain} transition-colors duration-300`}
    >
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <main className="max-w-[1040px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className={`inline-flex items-center gap-2 text-xs sm:text-sm font-medium mb-6 transition-colors cursor-pointer ${textMuted} hover:text-[#29AAE3]`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Companies
        </button>

        {/* Clean Top Company Header (Editorial style matching reference) */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="mb-4">
            <CompanyLogo
              logoUrl={company.logoUrl}
              fallbackText={company.logo}
              fallbackBg={company.logoBg}
              companyName={company.name}
              isDarkMode={isDarkMode}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Careers at {company.shortName}
            </h1>
            {company.verified && (
              <CheckCircle2 className="w-5 h-5 text-[#29AAE3] flex-shrink-0" />
            )}
          </div>

          <p
            className={`text-sm sm:text-[15px] leading-relaxed max-w-4xl ${textMuted}`}
          >
            {company.about}
          </p>

          {company.website && (
            <div className="mt-4">
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#29AAE3] hover:underline"
              >
                Visit Website
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </motion.section>

        {/* Full-Width Search for Jobs Input */}
        <div className="mb-8">
          <div
            className={`flex items-center px-3.5 py-2.5 sm:py-3 rounded-xl border transition-colors ${
              isDarkMode
                ? 'bg-[#1A1A1A] border-zinc-800 focus-within:border-[#29AAE3]'
                : 'bg-white border-zinc-200 focus-within:border-[#29AAE3]'
            }`}
          >
            <Search className="w-4 h-4 mr-2.5 text-zinc-400 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for Jobs"
              className={`w-full text-sm outline-none bg-transparent ${textMain} placeholder-zinc-400`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-zinc-400 hover:text-zinc-600 cursor-pointer ml-2"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Grouped Open Positions List */}
        {groupedJobs.length === 0 ? (
          <div
            className={`py-14 text-center border-t ${borderSubtle} ${textMuted}`}
          >
            <p className="text-sm">
              No open roles found matching &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="mt-3 text-xs font-semibold text-[#29AAE3] hover:underline cursor-pointer"
            >
              Show all positions
            </button>
          </div>
        ) : (
          <div className="space-y-9">
            {groupedJobs.map(([department, jobs]) => (
              <section key={department}>
                {/* Department Heading */}
                <h2
                  className={`text-base sm:text-lg font-semibold mb-2 ${
                    isDarkMode ? 'text-zinc-300' : 'text-zinc-600'
                  }`}
                >
                  {department}
                </h2>

                {/* Clean Minimal Rows */}
                <div
                  className={`divide-y border-b ${
                    isDarkMode
                      ? 'divide-zinc-800/90 border-zinc-800/90'
                      : 'divide-zinc-200/80 border-zinc-200/80'
                  }`}
                >
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => router.push(`/jobs/${job.id}`)}
                      className={`group py-4 sm:py-5 flex items-center justify-between gap-4 transition-colors cursor-pointer ${
                        isDarkMode
                          ? 'hover:bg-white/[0.02]'
                          : 'hover:bg-zinc-50/70'
                      } px-2 -mx-2 rounded-xl`}
                    >
                      {/* Left: Title + Metadata */}
                      <div className="min-w-0 flex-1">
                        <h3
                          className={`text-sm sm:text-base font-semibold transition-colors ${textMain} group-hover:text-[#29AAE3]`}
                        >
                          {job.title}
                        </h3>

                        <div
                          className={`flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs sm:text-[13px] ${textMuted}`}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                            <span>{job.type}</span>
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            {job.isRemote ? (
                              <Globe className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                            ) : (
                              <MapPin className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                            )}
                            <span>{job.location}</span>
                          </span>
                        </div>
                      </div>

                      {/* Right: Clean Apply Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/jobs/${job.id}`);
                        }}
                        className={`px-4 py-1.5 sm:py-2 rounded-lg border text-xs sm:text-sm font-medium transition-all flex-shrink-0 cursor-pointer ${
                          isDarkMode
                            ? 'border-zinc-700 text-zinc-200 hover:bg-[#29AAE3] hover:border-[#29AAE3] hover:text-white'
                            : 'border-zinc-200 text-zinc-700 bg-white hover:bg-[#29AAE3] hover:border-[#29AAE3] hover:text-white'
                        }`}
                      >
                        Apply
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function CompanyProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-sm text-zinc-500">
          Loading company careers...
        </div>
      }
    >
      <CompanyProfileContent />
    </Suspense>
  );
}