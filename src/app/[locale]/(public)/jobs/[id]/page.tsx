'use client';

import { Suspense, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Globe,
  Briefcase,
  Monitor,
  Calendar,
  FileText,
  Download,
  Send,
  CheckCircle2,
  Building2,
  X,
  Maximize2,
  Image as ImageIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../../../../components/Navbar';

const createFallbackFlyerDataUrl = (
  title: string,
  company: string,
  subtitle: string
) => {
  const safeTitle = title.replace(/[<>&"]/g, '');
  const safeCompany = company.replace(/[<>&"]/g, '');
  const safeSub = subtitle.replace(/[<>&"]/g, '');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
      <rect width="800" height="1000" fill="#1A1A1A"/>
      <rect x="36" y="36" width="728" height="928" rx="24" fill="#121212" stroke="#29AAE3" stroke-width="3"/>
      <rect x="76" y="88" width="210" height="38" rx="19" fill="#29AAE3"/>
      <text x="181" y="113" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="16" font-weight="bold">OFFICIAL FLYER</text>
      <text x="76" y="210" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="20" font-weight="bold">${safeCompany}</text>
      <text x="76" y="275" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="38" font-weight="bold">${safeTitle}</text>
      <line x1="76" y1="320" x2="724" y2="320" stroke="#27272A" stroke-width="2"/>
      <text x="76" y="385" fill="#29AAE3" font-family="Arial, sans-serif" font-size="22" font-weight="bold">VACANCY HIGHLIGHTS</text>
      <text x="76" y="435" fill="#E5E7EB" font-family="Arial, sans-serif" font-size="22">• ${safeSub}</text>
      <text x="76" y="485" fill="#E5E7EB" font-family="Arial, sans-serif" font-size="22">• Check full qualifications &amp; closing date below</text>
      <text x="76" y="535" fill="#E5E7EB" font-family="Arial, sans-serif" font-size="22">• Apply online or download official notice</text>
      <rect x="76" y="760" width="648" height="130" rx="16" fill="#1A1A1A" stroke="#27272A" stroke-width="2"/>
      <text x="108" y="815" fill="#29AAE3" font-family="Arial, sans-serif" font-size="20" font-weight="bold">JOB PLATFORM SRI LANKA</text>
      <text x="108" y="852" fill="#D1D5DB" font-family="Arial, sans-serif" font-size="18">Replace /public/flyers/ image with your real advertisement poster.</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const MOCK_JOBS_DATA = [
  {
    id: '1',
    title: 'Senior UI/UX Designer',
    company: 'PickMe (Digital Mobility Solutions)',
    sector: 'it',
    isForeign: false,
    location: 'Colombo, Sri Lanka',
    type: 'Full-Time',
    workplace: 'Hybrid',
    status: 'Urgently hiring',
    closingDate: 'Nov 30, 2026',
    posted: 'Posted 5 mins ago',
    hasPdfForm: false,
    pdfLabel: '',
    flyerUrl: '/flyers/pickme-uiux.jpg',
    flyerFallback: createFallbackFlyerDataUrl(
      'Senior UI/UX Designer',
      'PickMe (Digital Mobility Solutions)',
      'Colombo Head Office • Hybrid Role'
    ),
    flyerCaption: 'PickMe Careers – Official Vacancy Notice 2026',
    summary:
      'Design intuitive interfaces for our local ride-hailing and food delivery applications. Collaborate with cross-functional engineering teams based in our Colombo head office.',
    responsibilities: [
      'Create wireframes, prototypes, and high-fidelity UI components in Figma for iOS, Android, and Web.',
      'Conduct user research and usability testing with riders, drivers, and merchant partners in Sri Lanka.',
      'Maintain consistency across design systems in partnership with frontend engineers.',
    ],
    requirements: [
      '3+ years of product/UI/UX design experience with mobile or consumer web apps.',
      'Strong portfolio demonstrating end-to-end design thinking and visual craft.',
      'Good communication skills and ability to work in a fast-paced hybrid team.',
    ],
    logo: 'P',
    logoBg: 'bg-[#1A1A1A] text-white',
  },
  {
    id: '2',
    title: 'Vocational Instructor Vacancies 2026',
    company: 'Department of Social Services',
    sector: 'government',
    isForeign: false,
    location: 'All Island, Sri Lanka',
    type: 'Full-Time',
    workplace: 'On-Site',
    status: '15 Vacancies',
    closingDate: 'Dec 15, 2026',
    posted: 'Posted 1 hour ago',
    hasPdfForm: true,
    pdfLabel: 'Official Application Form (PDF)',
    flyerUrl: '/flyers/social-services-2026.jpg',
    flyerFallback: createFallbackFlyerDataUrl(
      'Vocational Instructor 2026',
      'Department of Social Services',
      '15 Island-Wide Vacancies • PDF Form Available'
    ),
    flyerCaption:
      'Government Gazette / Newspaper Vacancy Notice – Department of Social Services',
    summary:
      'Recruitment to the posts of Vocational Instructor at Vocational Training Centers. Official application form PDF available for direct download.',
    responsibilities: [
      'Conduct practical and theoretical vocational training sessions for trainees.',
      'Prepare lesson plans, assessment sheets, and workshop safety guidelines.',
      'Assist regional centers with student progress reports and placement support.',
    ],
    requirements: [
      'Citizen of Sri Lanka with relevant NVQ / technical or vocational qualifications.',
      'Meet age and educational criteria specified in the official gazette/notice.',
      'Ability to instruct in Sinhala and/or Tamil/English as required by the center.',
    ],
    logo: 'DS',
    logoBg: 'bg-[#29AAE3] text-white',
  },
  {
    id: '3',
    title: 'Hotel & Hospitality Supervisors (SLBFE Approved)',
    company: 'Emirates Grand Hospitality Group',
    sector: 'foreign',
    isForeign: true,
    location: 'Dubai, UAE',
    type: 'Contract (2 Years)',
    workplace: 'On-Site',
    status: 'Foreign • Visa Provided',
    closingDate: 'Dec 22, 2026',
    posted: 'Posted 2 hours ago',
    hasPdfForm: true,
    pdfLabel: 'SLBFE Application Checklist (PDF)',
    flyerUrl: '/flyers/dubai-hospitality.jpg',
    flyerFallback: createFallbackFlyerDataUrl(
      'Hospitality Supervisors – Dubai',
      'Emirates Grand Hospitality Group',
      '2-Year Contract • Free Visa & Accommodation'
    ),
    flyerCaption:
      'SLBFE Approved Foreign Employment Advertisement – Dubai, UAE',
    summary:
      'Free accommodation, medical insurance, and return air ticket provided by the employer. SLBFE registered recruitment agency — official application checklist PDF available.',
    responsibilities: [
      'Supervise front-office, food & beverage, or housekeeping operations in Dubai.',
      'Train junior hospitality staff and maintain international service standards.',
      'Coordinate shift schedules and guest satisfaction workflows.',
    ],
    requirements: [
      'At least 2 years of experience in hotel or hospitality operations.',
      'Valid passport and willingness to complete SLBFE registration procedures.',
      'Good English communication skills for international guests.',
    ],
    logo: 'EG',
    logoBg: 'bg-amber-600 text-white',
  },
  {
    id: '4',
    title: 'Full Stack Developer (Next.js/Node)',
    company: 'Sysco LABS Sri Lanka',
    sector: 'it',
    isForeign: false,
    location: 'Colombo, Sri Lanka',
    type: 'Full-Time',
    workplace: 'Remote',
    status: 'LKR 300,000 - 500,000',
    closingDate: 'Dec 20, 2026',
    posted: 'Posted 3 hours ago',
    hasPdfForm: false,
    pdfLabel: '',
    flyerUrl: '',
    flyerFallback: '',
    flyerCaption: '',
    summary:
      'Build enterprise-grade software solutions for the global foodservice industry. Enjoy flexible working hours with a strong remote-first engineering culture.',
    responsibilities: [
      'Develop and maintain scalable web applications using React, Next.js, and Node.js.',
      'Design clean REST/GraphQL APIs and write automated unit/integration tests.',
      'Collaborate with product managers and distributed engineering teams.',
    ],
    requirements: [
      'Strong proficiency in TypeScript, React/Next.js, and Node.js.',
      'Experience with relational databases (PostgreSQL) and cloud deployments.',
      'Solid problem-solving skills and clean code practices.',
    ],
    logo: 'S',
    logoBg: 'bg-blue-600 text-white',
  },
  {
    id: '5',
    title: 'Caregiver & Nursing Staff (SSW Visa Program)',
    company: 'Sakura Healthcare Japan',
    sector: 'foreign',
    isForeign: true,
    location: 'Osaka, Japan',
    type: 'Full-Time',
    workplace: 'On-Site',
    status: 'Foreign • High Salary',
    closingDate: 'Dec 28, 2026',
    posted: 'Posted 5 hours ago',
    hasPdfForm: false,
    pdfLabel: '',
    flyerUrl: '/flyers/japan-caregiver.jpg',
    flyerFallback: createFallbackFlyerDataUrl(
      'Caregiver & Nursing – Japan',
      'Sakura Healthcare Japan',
      'SSW Visa Pathway • Osaka, Japan'
    ),
    flyerCaption: 'Japan SSW Caregiver Recruitment Flyer – Osaka',
    summary:
      'Specified Skilled Worker (SSW) pathway with Japanese language training support. Monthly salary starting from JPY 210,000 + overtime and housing allowance.',
    responsibilities: [
      'Provide daily care and mobility assistance to residents in eldercare facilities.',
      'Record routine health observations and coordinate with care supervisors.',
      'Follow Japanese hygiene, safety, and care documentation standards.',
    ],
    requirements: [
      'Eligibility for Specified Skilled Worker (SSW) Caregiver visa pathway.',
      'Basic Japanese proficiency (JLPT N4 / JFT-Basic) or commitment to complete training.',
      'Compassionate attitude and physical fitness for caregiving duties.',
    ],
    logo: 'SH',
    logoBg: 'bg-rose-600 text-white',
  },
  {
    id: '6',
    title: 'Digital Marketing Executive',
    company: 'Daraz Sri Lanka',
    sector: 'private',
    isForeign: false,
    location: 'Kandy, Sri Lanka',
    type: 'Full-Time',
    workplace: 'On-Site',
    status: 'LKR 100,000 - 150,000',
    closingDate: 'Dec 05, 2026',
    posted: 'Posted 1 day ago',
    hasPdfForm: false,
    pdfLabel: '',
    flyerUrl: '',
    flyerFallback: '',
    flyerCaption: '',
    summary:
      'Execute regional e-commerce marketing campaigns across the Central Province. Analyze consumer trends and optimize digital advertising spend for maximum ROI.',
    responsibilities: [
      'Plan and run localized campaigns across social media and digital channels.',
      'Track campaign conversion metrics and prepare weekly performance reports.',
      'Work with seller acquisition and campaign teams in the Central Province.',
    ],
    requirements: [
      '1–2 years of experience in digital marketing, performance ads, or brand campaigns.',
      'Familiarity with Meta Ads, Google Analytics, and campaign tracking.',
      'Strong analytical and content coordination skills.',
    ],
    logo: 'D',
    logoBg: 'bg-orange-500 text-white',
  },
  {
    id: '7',
    title: 'Software Engineering Intern',
    company: 'WSO2 Lanka (Pvt) Ltd',
    sector: 'internship',
    isForeign: false,
    location: 'Galle, Sri Lanka',
    type: 'Internship',
    workplace: 'Hybrid',
    status: 'Paid Internship',
    closingDate: 'Dec 18, 2026',
    posted: 'Posted 2 days ago',
    hasPdfForm: false,
    pdfLabel: '',
    flyerUrl: '',
    flyerFallback: '',
    flyerCaption: '',
    summary:
      'Work alongside senior engineers on open-source cloud and API platforms. 6-month structured internship program for Sri Lankan undergraduates.',
    responsibilities: [
      'Contribute to features, bug fixes, and documentation under mentor guidance.',
      'Participate in code reviews, sprint planning, and engineering demos.',
      'Learn modern cloud-native tooling and API architecture best practices.',
    ],
    requirements: [
      'Undergraduate pursuing a degree in Computer Science, Software Engineering, or IT.',
      'Good grasp of at least one programming language (Java, TypeScript/JS, or Go).',
      'Available for a 6-month full-time internship.',
    ],
    logo: 'W',
    logoBg: 'bg-zinc-700 text-white',
  },
];

function JobDetailsContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');

  // Flyer Lightbox Zoom Modal state
  const [flyerZoomOpen, setFlyerZoomOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const job = useMemo(() => {
    const found = MOCK_JOBS_DATA.find((item) => item.id === String(params?.id));
    return found || MOCK_JOBS_DATA[0];
  }, [params?.id]);

  const activeFlyerSrc =
    !imgError && job.flyerUrl ? job.flyerUrl : job.flyerFallback;

  const bgClass = isDarkMode ? 'bg-[#121212]' : 'bg-[#F8FAFC]';
  const textMain = isDarkMode ? 'text-zinc-100' : 'text-zinc-900';
  const textMuted = isDarkMode ? 'text-zinc-400' : 'text-zinc-500';
  const cardBg = isDarkMode
    ? 'bg-[#1A1A1A] border-zinc-800'
    : 'bg-white border-zinc-200/80';

  const handleDownloadPdf = () => {
    const content = [
      `JOB PLATFORM - APPLICATION FORM / NOTICE`,
      `----------------------------------------`,
      `Position: ${job.title}`,
      `Organization: ${job.company}`,
      `Location: ${job.location}`,
      `Closing Date: ${job.closingDate}`,
      ``,
      `Summary: ${job.summary}`,
    ].join('\n');

    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${job.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')}-form.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleDownloadFlyer = async () => {
    if (!activeFlyerSrc) return;
    try {
      const response = await fetch(activeFlyerSrc);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const ext = blob.type.includes('svg') ? 'svg' : 'jpg';
      link.download = `${job.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')}-flyer.${ext}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(activeFlyerSrc, '_blank', 'noopener,noreferrer');
    }
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const resetAndCloseModal = () => {
    setApplyModalOpen(false);
    setSubmitted(false);
    setFullName('');
    setEmail('');
    setPhone('');
    setNote('');
  };

  return (
    <div
      className={`min-h-screen ${bgClass} font-sans ${textMain} transition-colors duration-300`}
    >
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-6 pb-28 md:py-9">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className={`inline-flex items-center gap-2 text-sm font-semibold mb-6 transition-colors cursor-pointer ${textMuted} hover:text-[#29AAE3]`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </button>

        {/* Main Job Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${cardBg} border rounded-2xl p-6 sm:p-8 shadow-xs mb-6`}
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start gap-4 sm:gap-5">
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex-shrink-0 ${job.logoBg} flex items-center justify-center font-bold text-xl sm:text-2xl shadow-xs`}
              >
                {job.logo}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                  <span
                    className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-medium leading-none ${
                      isDarkMode
                        ? 'bg-zinc-900/90 text-zinc-200 border border-zinc-800/80'
                        : 'bg-[#F1F4F8] text-[#475569]'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full flex-shrink-0 ${
                        job.status === 'Urgently hiring'
                          ? 'bg-rose-400'
                          : 'bg-[#7EC8EE]'
                      }`}
                    />
                    <span>{job.status}</span>
                  </span>
                  <span className={`text-xs ${textMuted}`}>{job.posted}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {job.title}
                </h1>

                <p
                  className={`text-sm sm:text-base font-medium mt-1 ${textMuted}`}
                >
                  {job.company}
                </p>

                {/* Metadata Strip */}
                <div
                  className={`flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-sm ${
                    isDarkMode ? 'text-zinc-300' : 'text-zinc-600'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-[#29AAE3]" />
                    {job.type}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Monitor className="w-4 h-4 text-[#29AAE3]" />
                    {job.workplace}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    {job.isForeign ? (
                      <Globe className="w-4 h-4 text-[#29AAE3]" />
                    ) : (
                      <MapPin className="w-4 h-4 text-[#29AAE3]" />
                    )}
                    {job.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-rose-500" />
                    Closing:{' '}
                    <strong className={textMain}>{job.closingDate}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Action Buttons (Hidden on Mobile — shown in bottom sticky bar on mobile) */}
            <div className="hidden md:flex flex-col gap-3 flex-shrink-0">
              <button
                onClick={() => setApplyModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#29AAE3] hover:bg-[#1E8EC2] text-white font-semibold text-base transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Apply Online
              </button>

              {job.hasPdfForm && (
                <button
                  onClick={handleDownloadPdf}
                  className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border font-semibold text-sm transition-colors cursor-pointer ${
                    isDarkMode
                      ? 'border-zinc-700 text-zinc-200 hover:bg-white/5'
                      : 'border-zinc-200 text-zinc-800 hover:bg-zinc-50'
                  }`}
                >
                  <Download className="w-4 h-4 text-[#29AAE3]" />
                  {job.pdfLabel || 'Download Form (PDF)'}
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Job Details Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Displayed Flyer Image + Download Action */}
            {activeFlyerSrc && (
              <div
                className={`${cardBg} border rounded-2xl p-5 sm:p-7 shadow-xs`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-[#29AAE3]" />
                    <h2 className="text-lg font-bold">Advertisement Flyer</h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFlyerZoomOpen(true)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                        isDarkMode
                          ? 'border-zinc-700 text-zinc-200 hover:bg-white/5'
                          : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-[#29AAE3]" />
                      Zoom
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadFlyer}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#29AAE3] hover:bg-[#1E8EC2] text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Flyer
                    </button>
                  </div>
                </div>

                {/* Direct Flyer Image Display */}
                <div
                  onClick={() => setFlyerZoomOpen(true)}
                  className={`rounded-xl overflow-hidden border cursor-zoom-in ${
                    isDarkMode
                      ? 'border-zinc-800 bg-[#121212]'
                      : 'border-zinc-200/80 bg-zinc-50'
                  }`}
                >
                  <img
                    src={activeFlyerSrc}
                    alt={job.flyerCaption || `${job.title} flyer`}
                    onError={() => setImgError(true)}
                    className="w-full h-auto max-h-[650px] object-contain mx-auto block"
                  />
                </div>

                {job.flyerCaption && (
                  <p className={`text-xs mt-3 ${textMuted}`}>
                    {job.flyerCaption}
                  </p>
                )}
              </div>
            )}

            <div className={`${cardBg} border rounded-2xl p-6 sm:p-7 shadow-xs`}>
              <h2 className="text-lg font-bold mb-3">Overview</h2>
              <p
                className={`text-sm sm:text-base leading-relaxed ${textMuted}`}
              >
                {job.summary}
              </p>
            </div>

            <div className={`${cardBg} border rounded-2xl p-6 sm:p-7 shadow-xs`}>
              <h2 className="text-lg font-bold mb-3">Key Responsibilities</h2>
              <ul
                className={`space-y-2.5 text-sm sm:text-base list-disc pl-5 ${
                  isDarkMode ? 'text-zinc-300' : 'text-zinc-600'
                }`}
              >
                {job.responsibilities.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className={`${cardBg} border rounded-2xl p-6 sm:p-7 shadow-xs`}>
              <h2 className="text-lg font-bold mb-3">
                Qualifications & Requirements
              </h2>
              <ul
                className={`space-y-2.5 text-sm sm:text-base list-disc pl-5 ${
                  isDarkMode ? 'text-zinc-300' : 'text-zinc-600'
                }`}
              >
                {job.requirements.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Summary Card */}
          <div className="lg:col-span-1 space-y-6">
            <div
              className={`${cardBg} border rounded-2xl p-6 shadow-xs space-y-4 lg:sticky lg:top-28`}
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-[#29AAE3]" />
                <h3 className="font-bold text-base">Employer Summary</h3>
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between gap-2">
                  <span className={textMuted}>Organization</span>
                  <span className="font-semibold text-right">
                    {job.company}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className={textMuted}>Destination</span>
                  <span className="font-semibold text-right">
                    {job.isForeign ? 'Foreign / Overseas' : 'Sri Lanka'}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className={textMuted}>Work Mode</span>
                  <span className="font-semibold text-right">
                    {job.workplace}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className={textMuted}>Deadline</span>
                  <span className="font-semibold text-right text-rose-500">
                    {job.closingDate}
                  </span>
                </div>
              </div>

              {job.hasPdfForm && (
                <div
                  className={`pt-3 border-t ${
                    isDarkMode ? 'border-zinc-800' : 'border-zinc-100'
                  } flex items-center gap-2 text-xs text-[#29AAE3] font-semibold`}
                >
                  <FileText className="w-4 h-4 flex-shrink-0" />
                  <span>Official application document available</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Bottom Action Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 md:hidden border-t backdrop-blur-md px-4 py-3 ${
          isDarkMode
            ? 'bg-[#1A1A1A]/95 border-zinc-800'
            : 'bg-white/95 border-zinc-200'
        }`}
      >
        <div className="flex items-center gap-2.5 max-w-[1100px] mx-auto">
          {job.hasPdfForm && (
            <button
              onClick={handleDownloadPdf}
              className={`inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border font-semibold text-sm flex-shrink-0 cursor-pointer ${
                isDarkMode
                  ? 'border-zinc-700 text-zinc-200 hover:bg-white/5'
                  : 'border-zinc-200 text-zinc-800 hover:bg-zinc-50'
              }`}
              aria-label="Download PDF form"
            >
              <Download className="w-4 h-4 text-[#29AAE3]" />
              PDF
            </button>
          )}

          <button
            onClick={() => setApplyModalOpen(true)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#29AAE3] hover:bg-[#1E8EC2] text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
            Apply Online
          </button>
        </div>
      </div>

      {/* Full-Screen Flyer Zoom Lightbox Modal */}
      <AnimatePresence>
        {flyerZoomOpen && activeFlyerSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFlyerZoomOpen(false)}
            className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center"
            >
              <div className="w-full flex items-center justify-between gap-3 mb-3 text-white">
                <p className="text-sm font-semibold truncate">
                  {job.flyerCaption || job.title}
                </p>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleDownloadFlyer}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#29AAE3] hover:bg-[#1E8EC2] text-white text-xs font-semibold cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Download Flyer
                  </button>

                  <button
                    type="button"
                    onClick={() => setFlyerZoomOpen(false)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                    aria-label="Close flyer preview"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="w-full overflow-auto rounded-2xl bg-[#1A1A1A] border border-zinc-800 p-2">
                <img
                  src={activeFlyerSrc}
                  alt={job.flyerCaption || job.title}
                  className="w-full h-auto max-h-[78vh] object-contain mx-auto rounded-xl"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Online Apply Modal */}
      <AnimatePresence>
        {applyModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className={`${cardBg} border w-full max-w-lg rounded-2xl p-6 shadow-xl relative`}
            >
              <button
                onClick={resetAndCloseModal}
                className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-zinc-600 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {submitted ? (
                <div className="py-6 text-center space-y-4">
                  <CheckCircle2 className="w-14 h-14 text-[#29AAE3] mx-auto" />
                  <h3 className="text-xl font-bold">Application Submitted</h3>
                  <p className={`text-sm ${textMuted}`}>
                    Your application for <strong>{job.title}</strong> at{' '}
                    <strong>{job.company}</strong> has been received.
                  </p>
                  <button
                    onClick={resetAndCloseModal}
                    className="px-6 py-2.5 rounded-xl bg-[#29AAE3] hover:bg-[#1E8EC2] text-white font-semibold text-sm cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">Apply Online</h3>
                    <p className={`text-xs mt-1 ${textMuted}`}>
                      {job.title} • {job.company}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none bg-transparent ${
                        isDarkMode ? 'border-zinc-700' : 'border-zinc-200'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none bg-transparent ${
                          isDarkMode ? 'border-zinc-700' : 'border-zinc-200'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+94 7X XXX XXXX"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none bg-transparent ${
                          isDarkMode ? 'border-zinc-700' : 'border-zinc-200'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1.5">
                      Summary / Experience Note
                    </label>
                    <textarea
                      rows={3}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Briefly share your relevant experience or CV link..."
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none bg-transparent ${
                        isDarkMode ? 'border-zinc-700' : 'border-zinc-200'
                      }`}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={resetAndCloseModal}
                      className={`px-4 py-2.5 rounded-xl border text-sm font-semibold cursor-pointer ${
                        isDarkMode ? 'border-zinc-700' : 'border-zinc-200'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#29AAE3] hover:bg-[#1E8EC2] text-white text-sm font-semibold cursor-pointer"
                    >
                      Submit Application
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function JobDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-sm text-zinc-500">
          Loading job details...
        </div>
      }
    >
      <JobDetailsContent />
    </Suspense>
  );
}