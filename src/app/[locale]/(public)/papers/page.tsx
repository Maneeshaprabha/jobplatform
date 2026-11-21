'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  FileText,
  Download,
  Eye,
  Calendar,
  BookOpen,
  Languages,
  X,
  CheckCircle2,
  ArrowRight,
  SlidersHorizontal,
  GraduationCap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../../../components/Navbar';

type PaperCategory =
  | 'all'
  | 'past-papers'
  | 'model-papers'
  | 'al'
  | 'ol'
  | 'grade-term-test'
  | 'university'
  | 'notes'
  | 'gov-iq';

type PaperMedium = 'All' | 'Sinhala' | 'English' | 'Tamil';
type PaperType = 'Past Paper' | 'Marking Scheme' | 'Model Paper' | 'Short Notes';

interface CampusOption {
  id: string;
  label: string;
  key: string;
}

interface SubjectOption {
  id: string;
  trilingualLabel: string;
  searchKey: string;
}

interface SubjectGroup {
  id: string;
  title: string;
  emoji: string;
  relevantCategories: PaperCategory[];
  subjects: SubjectOption[];
}

interface PaperItem {
  id: string;
  title: string;
  subject: string;
  subjectKey: string;
  campus?: string;
  campusKey?: string;
  categories: Exclude<PaperCategory, 'all'>[];
  medium: Exclude<PaperMedium, 'All'>;
  year: string;
  type: PaperType;
  fileSize: string;
  downloads: string;
  verified: boolean;
  pdfUrl?: string;
}

const UNIVERSITY_CAMPUSES: CampusOption[] = [
  { id: 'uom', label: 'University of Moratuwa', key: 'moratuwa' },
  { id: 'uoc', label: 'University of Colombo', key: 'colombo' },
  { id: 'uop', label: 'University of Peradeniya', key: 'peradeniya' },
  { id: 'uok', label: 'University of Kelaniya', key: 'kelaniya' },
  { id: 'usjp', label: 'University of Sri Jayewardenepura', key: 'usjp' },
  { id: 'private-uni', label: 'SLIIT / IIT / NSBM', key: 'private-uni' },
];

const CATEGORIES: { id: PaperCategory; label: string }[] = [
  { id: 'all', label: 'All Papers' },
  { id: 'past-papers', label: 'Past Papers' },
  { id: 'model-papers', label: 'Model Papers' },
  { id: 'al', label: 'G.C.E. A/L (උසස් පෙළ)' },
  { id: 'ol', label: 'G.C.E. O/L (සාමාන්‍ය පෙළ)' },
  { id: 'grade-term-test', label: 'Grade 1–13 & Term Tests' },
  { id: 'university', label: 'University Papers' },
  { id: 'notes', label: 'Short Notes' },
  { id: 'gov-iq', label: 'Government & IQ' },
];

const SUBJECT_GROUPS: SubjectGroup[] = [
  {
    id: 'main-subjects',
    title: 'Main Subjects',
    emoji: '📘',
    relevantCategories: [
      'all',
      'past-papers',
      'model-papers',
      'al',
      'ol',
      'grade-term-test',
      'notes',
    ],
    subjects: [
      {
        id: 'mathematics',
        trilingualLabel: 'Mathematics / ගණිතය / கணிதம்',
        searchKey: 'mathematics',
      },
      {
        id: 'science',
        trilingualLabel: 'Science / විද්‍යාව / அறிவியல்',
        searchKey: 'science',
      },
      {
        id: 'history',
        trilingualLabel: 'History / ඉතිහාසය / வரலாறு',
        searchKey: 'history',
      },
      {
        id: 'english-language',
        trilingualLabel: 'English Language / ඉංග්‍රීසි භාෂාව / ஆங்கில மொழி',
        searchKey: 'english',
      },
    ],
  },
  {
    id: 'religion',
    title: 'Religion',
    emoji: '🙏',
    relevantCategories: [
      'all',
      'past-papers',
      'model-papers',
      'ol',
      'grade-term-test',
    ],
    subjects: [
      {
        id: 'buddhism',
        trilingualLabel: 'Buddhism / බුද්ධ ධර්මය / பௌத்தம்',
        searchKey: 'buddhism',
      },
      {
        id: 'saivanery',
        trilingualLabel: 'Saivanery / ශෛවනේරි / சைவநெறி',
        searchKey: 'saivanery',
      },
      {
        id: 'catholicism',
        trilingualLabel: 'Catholicism / කතෝලික ධර්මය / கத்தோலிக்கம்',
        searchKey: 'catholic',
      },
      {
        id: 'christianity',
        trilingualLabel: 'Christianity / ක්‍රිස්තියානි ධර්මය / கிறிஸ்தவம்',
        searchKey: 'christian',
      },
      {
        id: 'islam',
        trilingualLabel: 'Islam / ඉස්ලාම් / இஸ்லாம்',
        searchKey: 'islam',
      },
    ],
  },
  {
    id: 'language-literature',
    title: 'Language & Literature',
    emoji: '📚',
    relevantCategories: [
      'all',
      'past-papers',
      'model-papers',
      'al',
      'ol',
      'grade-term-test',
    ],
    subjects: [
      {
        id: 'sinhala-lit',
        trilingualLabel:
          'Sinhala Language & Literature / සිංහල භාෂාව හා සාහිත්‍යය',
        searchKey: 'sinhala',
      },
      {
        id: 'tamil-lit',
        trilingualLabel:
          'Tamil Language & Literature / දෙමළ භාෂාව හා සාහිත්‍යය',
        searchKey: 'tamil',
      },
    ],
  },
  {
    id: 'category-ii',
    title: 'Category II',
    emoji: '📝',
    relevantCategories: ['all', 'past-papers', 'ol', 'grade-term-test'],
    subjects: [
      {
        id: 'music-oriental',
        trilingualLabel: 'Music (Oriental) / සංගීතය (පෙරදිග)',
        searchKey: 'music',
      },
      {
        id: 'music-western',
        trilingualLabel: 'Music (Western) / සංගීතය (අපරදිග)',
        searchKey: 'music',
      },
      {
        id: 'music-carnatic',
        trilingualLabel: 'Music (Carnatic) / සංගීතය (කර්ණාටක)',
        searchKey: 'music',
      },
      {
        id: 'art',
        trilingualLabel: 'Art / චිත්‍ර කලාව / கலை',
        searchKey: 'art',
      },
      {
        id: 'dancing',
        trilingualLabel: 'Dancing (Oriental) / නර්තනය (පෙරදිග)',
        searchKey: 'dancing',
      },
    ],
  },
  {
    id: 'category-i',
    title: 'Category I',
    emoji: '✏️',
    relevantCategories: [
      'all',
      'past-papers',
      'model-papers',
      'al',
      'ol',
      'notes',
    ],
    subjects: [
      {
        id: 'business-studies',
        trilingualLabel:
          'Business Studies / ව්‍යාපාර අධ්‍යයනය / வணிக ஆய்வுகள்',
        searchKey: 'business',
      },
      {
        id: 'geography',
        trilingualLabel: 'Geography / භූගෝල විද්‍යාව / புவியியல்',
        searchKey: 'geography',
      },
      {
        id: 'ict',
        trilingualLabel: 'ICT / තොරතුරු තාක්ෂණය / தகவல் தொழில்நுட்பம்',
        searchKey: 'ict',
      },
    ],
  },
  {
    id: 'exams-iq',
    title: 'Government & Competitive Exams',
    emoji: '🏛️',
    relevantCategories: ['all', 'past-papers', 'model-papers', 'gov-iq'],
    subjects: [
      {
        id: 'slas-gov',
        trilingualLabel: 'SLAS & Public Service / රාජ්‍ය සේවා විභාග',
        searchKey: 'slas',
      },
      {
        id: 'iq-banking',
        trilingualLabel: 'IQ & Banking / බුද්ධි පරීක්ෂණ හා බැංකු',
        searchKey: 'iq',
      },
    ],
  },
];

const MEDIUMS: PaperMedium[] = ['All', 'Sinhala', 'English', 'Tamil'];
const YEARS = ['All Years', '2025', '2024', '2023', '2022'];

const MOCK_PAPERS: PaperItem[] = [
  {
    id: 'u1',
    title: 'CS2042 – Object Oriented Software Development Past Paper',
    subject: 'University of Moratuwa • BSc IT',
    subjectKey: 'ict',
    campus: 'University of Moratuwa',
    campusKey: 'moratuwa',
    categories: ['university', 'past-papers'],
    medium: 'English',
    year: '2024',
    type: 'Past Paper',
    fileSize: '2.4 MB',
    downloads: '3.2k',
    verified: true,
  },
  {
    id: 'u2',
    title: 'SCS2204 – Database Management Systems Semester Exam',
    subject: 'University of Colombo • UCSC',
    subjectKey: 'ict',
    campus: 'University of Colombo',
    campusKey: 'colombo',
    categories: ['university', 'past-papers'],
    medium: 'English',
    year: '2024',
    type: 'Past Paper',
    fileSize: '2.1 MB',
    downloads: '2.9k',
    verified: true,
  },
  {
    id: 'u3',
    title: 'GP214 – Thermodynamics & Heat Transfer Past Paper',
    subject: 'University of Peradeniya • Faculty of Science',
    subjectKey: 'science',
    campus: 'University of Peradeniya',
    campusKey: 'peradeniya',
    categories: ['university', 'past-papers'],
    medium: 'English',
    year: '2023',
    type: 'Past Paper',
    fileSize: '1.9 MB',
    downloads: '2.2k',
    verified: true,
  },
  {
    id: 'u4',
    title: 'SENG 21212 – Data Structures & Algorithms Exam Paper',
    subject: 'University of Kelaniya • Software Engineering',
    subjectKey: 'ict',
    campus: 'University of Kelaniya',
    campusKey: 'kelaniya',
    categories: ['university', 'past-papers'],
    medium: 'English',
    year: '2024',
    type: 'Past Paper',
    fileSize: '2.3 MB',
    downloads: '2.7k',
    verified: true,
  },
  {
    id: 'u5',
    title: 'ACC 2010 – Financial Accounting Past Paper',
    subject: 'University of Sri Jayewardenepura • Management',
    subjectKey: 'business',
    campus: 'University of Sri Jayewardenepura',
    campusKey: 'usjp',
    categories: ['university', 'past-papers'],
    medium: 'English',
    year: '2024',
    type: 'Past Paper',
    fileSize: '1.8 MB',
    downloads: '3.4k',
    verified: true,
  },
  {
    id: 'u6',
    title: 'IT2020 – Software Engineering Past Paper & Marking Scheme',
    subject: 'SLIIT / IIT / NSBM • Computing',
    subjectKey: 'ict',
    campus: 'SLIIT / IIT / NSBM',
    campusKey: 'private-uni',
    categories: ['university', 'past-papers', 'notes'],
    medium: 'English',
    year: '2025',
    type: 'Marking Scheme',
    fileSize: '2.6 MB',
    downloads: '4.1k',
    verified: true,
  },
  {
    id: 'p1',
    title: 'G.C.E. O/L Mathematics – Past Paper I & II',
    subject: 'Mathematics • G.C.E. O/L',
    subjectKey: 'mathematics',
    categories: ['past-papers', 'ol'],
    medium: 'Sinhala',
    year: '2024',
    type: 'Past Paper',
    fileSize: '2.1 MB',
    downloads: '5.4k',
    verified: true,
  },
  {
    id: 'p2',
    title: 'G.C.E. A/L Combined Mathematics – Past Paper & Marking Scheme',
    subject: 'Combined Mathematics • G.C.E. A/L',
    subjectKey: 'mathematics',
    categories: ['past-papers', 'al'],
    medium: 'English',
    year: '2024',
    type: 'Marking Scheme',
    fileSize: '3.1 MB',
    downloads: '4.8k',
    verified: true,
  },
  {
    id: 'p3',
    title: 'G.C.E. O/L Science – Model Paper with Answers',
    subject: 'Science • Model Paper',
    subjectKey: 'science',
    categories: ['model-papers', 'ol'],
    medium: 'Sinhala',
    year: '2025',
    type: 'Model Paper',
    fileSize: '2.2 MB',
    downloads: '3.9k',
    verified: true,
  },
  {
    id: 'p4',
    title: 'Grade 10 Term Test Paper (3rd Term) – Sinhala & Literature',
    subject: 'Grade 10 Term Test',
    subjectKey: 'sinhala',
    categories: ['grade-term-test'],
    medium: 'Sinhala',
    year: '2024',
    type: 'Past Paper',
    fileSize: '1.6 MB',
    downloads: '2.8k',
    verified: true,
  },
  {
    id: 'p5',
    title: 'Grade 8 Term Test Paper (2nd Term) – English & Grammar',
    subject: 'Grade 8 Term Test',
    subjectKey: 'english',
    categories: ['grade-term-test', 'model-papers'],
    medium: 'English',
    year: '2024',
    type: 'Model Paper',
    fileSize: '1.4 MB',
    downloads: '2.1k',
    verified: true,
  },
  {
    id: 'p6',
    title: 'G.C.E. A/L ICT – Logic Gates, Networking & Python Short Notes',
    subject: 'ICT • Short Notes',
    subjectKey: 'ict',
    categories: ['notes', 'al'],
    medium: 'Sinhala',
    year: '2024',
    type: 'Short Notes',
    fileSize: '2.0 MB',
    downloads: '4.6k',
    verified: true,
  },
  {
    id: 'p7',
    title: 'Sri Lanka Administrative Service (SLAS) & Banking IQ Model Paper',
    subject: 'Government & IQ Exams',
    subjectKey: 'slas',
    categories: ['gov-iq', 'model-papers'],
    medium: 'Sinhala',
    year: '2025',
    type: 'Model Paper',
    fileSize: '1.9 MB',
    downloads: '5.2k',
    verified: true,
  },
  {
    id: 'p8',
    title: 'G.C.E. O/L Tamil Language & Literature – Past Paper',
    subject: 'Tamil Language • G.C.E. O/L',
    subjectKey: 'tamil',
    categories: ['past-papers', 'ol'],
    medium: 'Tamil',
    year: '2023',
    type: 'Past Paper',
    fileSize: '1.8 MB',
    downloads: '1.9k',
    verified: true,
  },
];

export default function PapersPage() {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<PaperCategory>('all');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null
  );
  const [selectedCampusId, setSelectedCampusId] = useState<string | null>(null);
  const [selectedMedium, setSelectedMedium] = useState<PaperMedium>('All');
  const [selectedYear, setSelectedYear] = useState('All Years');

  // Preview Modal State
  const [previewPaper, setPreviewPaper] = useState<PaperItem | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToResults = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 60);
  };

  const bgClass = isDarkMode ? 'bg-[#121212]' : 'bg-white';
  const textMain = isDarkMode ? 'text-zinc-100' : 'text-zinc-900';
  const textMuted = isDarkMode ? 'text-zinc-400' : 'text-zinc-500';
  const borderSubtle = isDarkMode ? 'border-zinc-800' : 'border-zinc-200/80';

  const activeSubject = useMemo(() => {
    if (!selectedSubjectId) return null;
    for (const group of SUBJECT_GROUPS) {
      const found = group.subjects.find((s) => s.id === selectedSubjectId);
      if (found) return found;
    }
    return null;
  }, [selectedSubjectId]);

  const activeCampus = useMemo(() => {
    if (!selectedCampusId) return null;
    return UNIVERSITY_CAMPUSES.find((c) => c.id === selectedCampusId) || null;
  }, [selectedCampusId]);

  // Show University Campus block for 'all' and 'university'
  const showUniversitySection =
    selectedCategory === 'all' || selectedCategory === 'university';

  // Only show Subject Groups relevant to the active top category
  const visibleSubjectGroups = useMemo(() => {
    if (selectedCategory === 'university') return [];
    return SUBJECT_GROUPS.filter((g) =>
      g.relevantCategories.includes(selectedCategory)
    );
  }, [selectedCategory]);

  const filteredPapers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return MOCK_PAPERS.filter((paper) => {
      const matchesSearch =
        !q ||
        paper.title.toLowerCase().includes(q) ||
        paper.subject.toLowerCase().includes(q) ||
        (paper.campus && paper.campus.toLowerCase().includes(q)) ||
        paper.type.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === 'all' ||
        paper.categories.includes(selectedCategory);

      const matchesSubject =
        !activeSubject ||
        paper.subjectKey === activeSubject.searchKey ||
        paper.title.toLowerCase().includes(activeSubject.searchKey);

      const matchesCampus =
        !activeCampus || paper.campusKey === activeCampus.key;

      const matchesMedium =
        selectedMedium === 'All' || paper.medium === selectedMedium;

      const matchesYear =
        selectedYear === 'All Years' || paper.year === selectedYear;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubject &&
        matchesCampus &&
        matchesMedium &&
        matchesYear
      );
    });
  }, [
    searchQuery,
    selectedCategory,
    activeSubject,
    activeCampus,
    selectedMedium,
    selectedYear,
  ]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSubjectId(null);
    setSelectedCampusId(null);
    setSelectedMedium('All');
    setSelectedYear('All Years');
  };

  const handleCategoryClick = (catId: PaperCategory) => {
    setSelectedCategory(catId);
    setSelectedSubjectId(null);
    setSelectedCampusId(null);
  };

  const handleCampusClick = (campusId: string) => {
    const nextId = selectedCampusId === campusId ? null : campusId;
    setSelectedCampusId(nextId);
    setSelectedSubjectId(null);
    if (nextId) {
      setSelectedCategory('university');
      scrollToResults();
    }
  };

  const handleSubjectClick = (subjId: string) => {
    const nextId = selectedSubjectId === subjId ? null : subjId;
    setSelectedSubjectId(nextId);
    setSelectedCampusId(null);
    if (nextId) {
      scrollToResults();
    }
  };

  const handleDownloadPdf = (paper: PaperItem) => {
    if (paper.pdfUrl) {
      window.open(paper.pdfUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    const content = [
      `JOB PLATFORM SRI LANKA - PAPER / STUDY RESOURCE`,
      `------------------------------------------------`,
      `Title: ${paper.title}`,
      `Subject: ${paper.subject}`,
      paper.campus ? `University: ${paper.campus}` : '',
      `Year: ${paper.year}`,
      `Medium: ${paper.medium}`,
      `Type: ${paper.type}`,
    ]
      .filter(Boolean)
      .join('\n');

    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${paper.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')}-${paper.year}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  if (!mounted) return null;

  return (
    <div
      className={`min-h-screen ${bgClass} font-sans ${textMain} transition-colors duration-300 overflow-x-clip`}
    >
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <main className="max-w-[1040px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Clean Editorial Header */}
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Papers & Study Resources
            </h1>
            <p className={`text-sm sm:text-[15px] mt-1.5 ${textMuted}`}>
              Past papers, model papers, grade term test papers, university
              papers, and short notes.
            </p>
          </div>

          {(selectedCategory !== 'all' ||
            selectedSubjectId ||
            selectedCampusId ||
            selectedMedium !== 'All' ||
            selectedYear !== 'All Years' ||
            searchQuery.trim() !== '') && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs sm:text-sm font-semibold text-rose-500 hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Search, Medium, Wrapped Category Pills & Year Bar */}
        <div className="mb-8 space-y-3.5">
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
                placeholder="Search exam, subject, grade, university, or notes..."
                className={`w-full text-sm outline-none bg-transparent ${textMain} placeholder-zinc-400`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-zinc-400 hover:text-zinc-600 cursor-pointer ml-1"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Medium Switcher */}
            <div
              className={`grid grid-cols-4 p-1 rounded-xl border flex-shrink-0 ${
                isDarkMode
                  ? 'bg-[#1A1A1A] border-zinc-800'
                  : 'bg-zinc-50 border-zinc-200/80'
              }`}
            >
              {MEDIUMS.map((med) => {
                const active = selectedMedium === med;
                return (
                  <button
                    key={med}
                    type="button"
                    onClick={() => setSelectedMedium(med)}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      active
                        ? 'bg-[#29AAE3] text-white shadow-xs'
                        : `${textMuted} hover:${textMain}`
                    }`}
                  >
                    {med}
                  </button>
                );
              })}
            </div>
          </div>

          {/* All Category Pills Wrapped Clearly */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs sm:text-[13px] font-medium transition-all cursor-pointer ${
                    active
                      ? isDarkMode
                        ? 'bg-white text-[#1A1A1A] font-semibold'
                        : 'bg-[#1A1A1A] text-white font-semibold'
                      : isDarkMode
                      ? 'bg-[#1A1A1A] text-zinc-300 border border-zinc-800 hover:bg-zinc-800'
                      : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Year Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400 mr-1" />
            {YEARS.map((yr) => {
              const active = selectedYear === yr;
              return (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setSelectedYear(yr)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#29AAE3]/10 border-[#29AAE3]/50 text-[#29AAE3] font-semibold'
                      : isDarkMode
                      ? 'bg-[#1A1A1A] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  {yr}
                </button>
              );
            })}
          </div>
        </div>

        {/* University Campus-Wise Selector */}
        {showUniversitySection && (
          <section className="mb-10">
            <div
              className={`flex items-center justify-between gap-2 pb-2.5 mb-3.5 border-b ${borderSubtle}`}
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#29AAE3]" />
                <h2 className="text-sm sm:text-base font-bold">
                  University Papers (By Campus)
                </h2>
              </div>

              {activeCampus && (
                <button
                  type="button"
                  onClick={() => setSelectedCampusId(null)}
                  className="text-xs font-semibold text-[#29AAE3] hover:underline cursor-pointer"
                >
                  Clear campus
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {UNIVERSITY_CAMPUSES.map((campus) => {
                const isSelected = selectedCampusId === campus.id;
                return (
                  <button
                    key={campus.id}
                    type="button"
                    onClick={() => handleCampusClick(campus.id)}
                    className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1A1A1A] text-white ring-2 ring-[#29AAE3]'
                        : 'bg-[#29AAE3] hover:bg-[#1E8EC2] text-white'
                    }`}
                  >
                    <ArrowRight className="w-4 h-4 flex-shrink-0" />
                    <span className="leading-snug">{campus.label}</span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Grouped Subject Categories Grid (Filtered by Active Top Category) */}
        {visibleSubjectGroups.length > 0 && (
          <section className="mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
              {visibleSubjectGroups.map((group) => (
                <div key={group.id}>
                  <div
                    className={`flex items-center gap-2 pb-2.5 mb-3.5 border-b ${borderSubtle}`}
                  >
                    <span className="text-base leading-none">
                      {group.emoji}
                    </span>
                    <h2 className="text-sm sm:text-base font-bold">
                      {group.title}
                    </h2>
                  </div>

                  <div className="space-y-2.5">
                    {group.subjects.map((subj) => {
                      const isSelected = selectedSubjectId === subj.id;
                      return (
                        <button
                          key={subj.id}
                          type="button"
                          onClick={() => handleSubjectClick(subj.id)}
                          className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#1A1A1A] text-white ring-2 ring-[#29AAE3]'
                              : 'bg-[#29AAE3] hover:bg-[#1E8EC2] text-white'
                          }`}
                        >
                          <ArrowRight className="w-4 h-4 flex-shrink-0" />
                          <span className="leading-snug">
                            {subj.trilingualLabel}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Results Section (Scroll Target) */}
        <div ref={resultsRef} className="scroll-mt-28">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className={`text-xs sm:text-sm font-medium ${textMuted}`}>
              Showing{' '}
              <span className="font-semibold text-[#29AAE3]">
                {filteredPapers.length}
              </span>{' '}
              {activeCampus
                ? `papers for ${activeCampus.label}`
                : activeSubject
                ? `results for ${activeSubject.trilingualLabel}`
                : 'results'}
            </div>

            {(activeSubject || activeCampus) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedSubjectId(null);
                  setSelectedCampusId(null);
                }}
                className="text-xs font-semibold text-[#29AAE3] hover:underline cursor-pointer"
              >
                Show all
              </button>
            )}
          </div>

          {/* Clean Minimal Papers List */}
          {filteredPapers.length === 0 ? (
            <div className={`py-14 text-center border-t ${borderSubtle}`}>
              <FileText className="w-10 h-10 text-zinc-400 mx-auto mb-2.5" />
              <h3 className="text-base font-semibold mb-1">No papers found</h3>
              <p className={`text-sm mb-4 ${textMuted}`}>
                Try selecting another campus, subject, or resetting your
                filters.
              </p>
              <button
                type="button"
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
              {filteredPapers.map((paper) => (
                <div
                  key={paper.id}
                  className={`group flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 sm:py-5 px-2 -mx-2 rounded-xl transition-colors ${
                    isDarkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-zinc-50/70'
                  }`}
                >
                  {/* Left: PDF Badge + Title + Metadata */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <div
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex-shrink-0 flex items-center justify-center border mt-0.5 ${
                        isDarkMode
                          ? 'bg-[#1A1A1A] border-zinc-800 text-[#29AAE3]'
                          : 'bg-[#29AAE3]/10 border-[#29AAE3]/20 text-[#29AAE3]'
                      }`}
                    >
                      <FileText className="w-5 h-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-1.5">
                        <h3
                          onClick={() => setPreviewPaper(paper)}
                          className={`font-semibold text-sm sm:text-base leading-snug transition-colors cursor-pointer ${textMain} group-hover:text-[#29AAE3]`}
                        >
                          {paper.title}
                        </h3>
                        {paper.verified && (
                          <CheckCircle2 className="w-4 h-4 text-[#29AAE3] flex-shrink-0 mt-0.5" />
                        )}
                      </div>

                      <div
                        className={`flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs sm:text-[13px] ${textMuted}`}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                          {paper.subject}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Languages className="w-3.5 h-3.5 text-zinc-400" />
                          {paper.medium}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                          {paper.year}
                        </span>
                        <span>
                          PDF • {paper.fileSize} • {paper.downloads} downloads
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Type Pill + Preview & Download Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-2.5 flex-shrink-0 pl-[54px] md:pl-0">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                        isDarkMode
                          ? 'bg-zinc-900 text-zinc-200 border border-zinc-800'
                          : 'bg-[#F1F4F8] text-[#475569]'
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          paper.type === 'Marking Scheme' ||
                          paper.type === 'Short Notes'
                            ? 'bg-emerald-400'
                            : 'bg-[#7EC8EE]'
                        }`}
                      />
                      {paper.type}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewPaper(paper)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                          isDarkMode
                            ? 'border-zinc-700 text-zinc-200 hover:bg-white/5'
                            : 'border-zinc-200 text-zinc-700 bg-white hover:bg-zinc-50'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Preview
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadPdf(paper)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#29AAE3] hover:bg-[#1E8EC2] text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        PDF
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Paper Preview Modal */}
      <AnimatePresence>
        {previewPaper && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewPaper(null)}
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-lg rounded-2xl border p-6 shadow-xl relative ${
                isDarkMode
                  ? 'bg-[#1A1A1A] border-zinc-800'
                  : 'bg-white border-zinc-200'
              }`}
            >
              <button
                type="button"
                onClick={() => setPreviewPaper(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-zinc-600 cursor-pointer"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4 pr-8">
                <div className="w-11 h-11 rounded-xl bg-[#29AAE3]/10 text-[#29AAE3] flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#29AAE3]">
                    {previewPaper.type} • {previewPaper.year}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold leading-snug">
                    {previewPaper.title}
                  </h3>
                </div>
              </div>

              <div
                className={`rounded-xl border p-4 mb-5 space-y-2 text-sm ${
                  isDarkMode
                    ? 'bg-[#121212] border-zinc-800'
                    : 'bg-zinc-50 border-zinc-200/80'
                }`}
              >
                <div className="flex justify-between">
                  <span className={textMuted}>Subject / Section</span>
                  <span className="font-semibold">{previewPaper.subject}</span>
                </div>
                {previewPaper.campus && (
                  <div className="flex justify-between">
                    <span className={textMuted}>University</span>
                    <span className="font-semibold">{previewPaper.campus}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className={textMuted}>Medium</span>
                  <span className="font-semibold">{previewPaper.medium}</span>
                </div>
                <div className="flex justify-between">
                  <span className={textMuted}>File Size</span>
                  <span className="font-semibold">
                    PDF ({previewPaper.fileSize})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={textMuted}>Total Downloads</span>
                  <span className="font-semibold">
                    {previewPaper.downloads}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setPreviewPaper(null)}
                  className={`px-4 py-2 rounded-xl border text-sm font-semibold cursor-pointer ${
                    isDarkMode ? 'border-zinc-700' : 'border-zinc-200'
                  }`}
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadPdf(previewPaper)}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#29AAE3] hover:bg-[#1E8EC2] text-white text-sm font-semibold cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}