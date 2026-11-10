"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, ReferenceLine,
} from "recharts";
import {
  GraduationCap, AlertTriangle, Calendar,
  Sparkles, ChevronRight, Layers, ShieldCheck,
  BookOpen, Briefcase, Printer, Bell, Search,
  Users, CheckCircle2,
  Info, RotateCcw, Filter, UserCheck, MessageSquareQuote,
  Lock, Check, Hand,
} from "lucide-react";

// ─── TYPES & DATA STORE ──────────────────────────────────────────────────────

interface TermData {
  totalEnrolled: number;
  availableFaculty: number;
  sectionsNeeded: number;
  facultyShortage: number; // Negative = shortage
  isCurrentOrFuture: boolean;
  kpis: {
    passingRate:   { value: string; delta: string; positive: boolean; num: number };
    atRiskRate:    { value: string; delta: string; positive: boolean; num: number };
    retentionRate: { value: string; delta: string; positive: boolean; num: number };
    seteScore:     { value: string; delta: string; positive: boolean; num: number };
    attendanceRate:{ value: string; delta: string; positive: boolean; num: number };
  };
  yearLevels: Array<{ name: string; count: number; percent: string; color: string }>;
  seteDimensions: Array<{ name: string; score: number; code: string }>;
  flaggedSections: Array<{ name: string; course: string; courseType: "Major" | "GenEd"; failing: number; total: number; rate: number }>;
  bottleneckCourses: Array<{ code: string; name: string; courseType: "Major" | "GenEd"; failRate: number; students: number }>;
}

const TERM_DATA_STORE: Record<string, TermData> = {
  // AY 2026-2027 (Active current year)
  "AY 2026–2027_Semester 1": {
    totalEnrolled: 1420,
    availableFaculty: 35,
    sectionsNeeded: 38,
    facultyShortage: -3,
    isCurrentOrFuture: true,
    kpis: {
      passingRate:   { value: "91.4%", delta: "+1.8%", positive: true,  num: 91.4 },
      atRiskRate:    { value: "8.3%",  delta: "-2.1%", positive: true,  num: 8.3 },
      retentionRate: { value: "92.5%", delta: "+1.5%", positive: true,  num: 92.5 },
      seteScore:     { value: "86.2%", delta: "+1.4%", positive: true,  num: 86.2 },
      attendanceRate:{ value: "96.8%", delta: "+1.3%", positive: true,  num: 96.8 },
    },
    yearLevels: [
      { name: "1st Year", count: 430, percent: "30%", color: "#8a1538" },
      { name: "2nd Year", count: 385, percent: "27%", color: "#b87333" },
      { name: "3rd Year", count: 335, percent: "24%", color: "#0f766e" },
      { name: "4th Year", count: 270, percent: "19%", color: "#64748b" },
    ],
    seteDimensions: [
      { code: "SC", name: "Syllabus Coverage",    score: 92.1 },
      { code: "AC", name: "Student Consultation", score: 89.4 },
      { code: "IC", name: "Instructional Clarity",score: 88.5 },
      { code: "AG", name: "Assessment Fairness",  score: 84.2 },
      { code: "PT", name: "Classroom Pacing",     score: 81.6 },
    ],
    flaggedSections: [
      { name: "BSIT 2-1 Section", course: "IT 201 Data Structures", courseType: "Major", failing: 18, total: 40, rate: 45.0 },
      { name: "BSIT 2-3 Section", course: "IT 201 Data Structures", courseType: "Major", failing: 14, total: 38, rate: 36.8 },
      { name: "BSIT 3-2 Section", course: "IT 301 Advanced Databases", courseType: "Major", failing: 12, total: 36, rate: 33.3 },
      { name: "BSIT 1-2 Section", course: "MATH 201 Discrete Math", courseType: "GenEd", failing: 8, total: 42, rate: 19.0 },
    ],
    bottleneckCourses: [
      { code: "IT 201",   name: "Data Structures & Algorithms", courseType: "Major", failRate: 23.4, students: 184 },
      { code: "IT 301",   name: "Advanced Database Systems", courseType: "Major", failRate: 21.8, students: 162 },
      { code: "MATH 201", name: "Discrete Mathematics", courseType: "GenEd", failRate: 19.1, students: 190 },
    ],
  },
  "AY 2026–2027_Semester 2": {
    totalEnrolled: 1490,
    availableFaculty: 35,
    sectionsNeeded: 40,
    facultyShortage: -5,
    isCurrentOrFuture: true,
    kpis: {
      passingRate:   { value: "92.0%", delta: "+0.6%", positive: true,  num: 92.0 },
      atRiskRate:    { value: "13.5%", delta: "-0.7%", positive: true,  num: 13.5 },
      retentionRate: { value: "93.1%", delta: "+0.6%", positive: true,  num: 93.1 },
      seteScore:     { value: "89.2%", delta: "+0.6%", positive: true,  num: 89.2 },
      attendanceRate:{ value: "97.1%", delta: "+0.3%", positive: true,  num: 97.1 },
    },
    yearLevels: [
      { name: "1st Year", count: 450, percent: "30%", color: "#8a1538" },
      { name: "2nd Year", count: 405, percent: "27%", color: "#b87333" },
      { name: "3rd Year", count: 350, percent: "24%", color: "#0f766e" },
      { name: "4th Year", count: 285, percent: "19%", color: "#64748b" },
    ],
    seteDimensions: [
      { code: "SC", name: "Syllabus Coverage",    score: 92.5 },
      { code: "AC", name: "Student Consultation", score: 89.8 },
      { code: "IC", name: "Instructional Clarity",score: 89.0 },
      { code: "AG", name: "Assessment Fairness",  score: 85.0 },
      { code: "PT", name: "Classroom Pacing",     score: 82.4 },
    ],
    flaggedSections: [
      { name: "BSIT 2-2 Section", course: "IT 202 Web Systems", courseType: "Major", failing: 13, total: 39, rate: 33.3 },
      { name: "BSIT 3-1 Section", course: "IT 304 Systems Integration", courseType: "Major", failing: 11, total: 35, rate: 31.4 },
    ],
    bottleneckCourses: [
      { code: "IT 202", name: "Web Systems & Tech", courseType: "Major", failRate: 20.5, students: 175 },
      { code: "IT 304", name: "Systems Integration & Arch", courseType: "Major", failRate: 19.8, students: 155 },
    ],
  },

  // AY 2025-2026 (Completed historical year)
  "AY 2025–2026_Semester 1": {
    totalEnrolled: 1310,
    availableFaculty: 35,
    sectionsNeeded: 35,
    facultyShortage: 0,
    isCurrentOrFuture: false,
    kpis: {
      passingRate:   { value: "91.0%", delta: "+0.4%", positive: true,  num: 91.0 },
      atRiskRate:    { value: "15.0%", delta: "-0.8%", positive: false, num: 15.0 },
      retentionRate: { value: "92.1%", delta: "+0.6%", positive: true,  num: 92.1 },
      seteScore:     { value: "85.7%", delta: "+0.4%", positive: true,  num: 85.7 },
      attendanceRate:{ value: "96.5%", delta: "+0.5%", positive: true,  num: 96.5 },
    },
    yearLevels: [
      { name: "1st Year", count: 395, percent: "30%", color: "#8a1538" },
      { name: "2nd Year", count: 355, percent: "27%", color: "#b87333" },
      { name: "3rd Year", count: 310, percent: "24%", color: "#0f766e" },
      { name: "4th Year", count: 250, percent: "19%", color: "#64748b" },
    ],
    seteDimensions: [
      { code: "SC", name: "Syllabus Coverage",    score: 91.0 },
      { code: "AC", name: "Student Consultation", score: 88.2 },
      { code: "IC", name: "Instructional Clarity",score: 87.4 },
      { code: "AG", name: "Assessment Fairness",  score: 83.1 },
      { code: "PT", name: "Classroom Pacing",     score: 80.5 },
    ],
    flaggedSections: [
      { name: "BSIT 2-1 Section", course: "IT 201 Data Structures", courseType: "Major", failing: 15, total: 38, rate: 39.5 },
      { name: "BSIT 3-1 Section", course: "IT 301 Adv. Databases", courseType: "Major", failing: 10, total: 34, rate: 29.4 },
    ],
    bottleneckCourses: [
      { code: "IT 201",   name: "Data Structures & Algorithms", courseType: "Major", failRate: 22.1, students: 170 },
      { code: "IT 301",   name: "Advanced Database Systems", courseType: "Major", failRate: 20.4, students: 150 },
    ],
  },
  "AY 2025–2026_Semester 2": {
    totalEnrolled: 1340,
    availableFaculty: 35,
    sectionsNeeded: 36,
    facultyShortage: -1,
    isCurrentOrFuture: false,
    kpis: {
      passingRate:   { value: "91.4%", delta: "+0.4%", positive: true,  num: 91.4 },
      atRiskRate:    { value: "14.4%", delta: "-0.6%", positive: true,  num: 14.4 },
      retentionRate: { value: "92.5%", delta: "+0.4%", positive: true,  num: 92.5 },
      seteScore:     { value: "86.2%", delta: "+0.5%", positive: true,  num: 86.2 },
      attendanceRate:{ value: "96.8%", delta: "+0.3%", positive: true,  num: 96.8 },
    },
    yearLevels: [
      { name: "1st Year", count: 405, percent: "30%", color: "#8a1538" },
      { name: "2nd Year", count: 365, percent: "27%", color: "#b87333" },
      { name: "3rd Year", count: 315, percent: "24%", color: "#0f766e" },
      { name: "4th Year", count: 255, percent: "19%", color: "#64748b" },
    ],
    seteDimensions: [
      { code: "SC", name: "Syllabus Coverage",    score: 91.8 },
      { code: "AC", name: "Student Consultation", score: 88.9 },
      { code: "IC", name: "Instructional Clarity",score: 88.0 },
      { code: "AG", name: "Assessment Fairness",  score: 83.8 },
      { code: "PT", name: "Classroom Pacing",     score: 81.2 },
    ],
    flaggedSections: [
      { name: "BSIT 2-3 Section", course: "IT 201 Data Structures", courseType: "Major", failing: 14, total: 37, rate: 37.8 },
    ],
    bottleneckCourses: [
      { code: "IT 201",   name: "Data Structures & Algorithms", courseType: "Major", failRate: 21.5, students: 165 },
    ],
  },

  // AY 2024-2025 (Completed historical year)
  "AY 2024–2025_Semester 1": {
    totalEnrolled: 1180,
    availableFaculty: 34,
    sectionsNeeded: 32,
    facultyShortage: 0,
    isCurrentOrFuture: false,
    kpis: {
      passingRate:   { value: "89.9%", delta: "+0.7%", positive: false, num: 89.9 },
      atRiskRate:    { value: "16.5%", delta: "-0.9%", positive: false, num: 16.5 },
      retentionRate: { value: "90.8%", delta: "+0.7%", positive: true,  num: 90.8 },
      seteScore:     { value: "82.4%", delta: "+0.4%", positive: false, num: 82.4 },
      attendanceRate:{ value: "95.5%", delta: "+0.6%", positive: true,  num: 95.5 },
    },
    yearLevels: [
      { name: "1st Year", count: 360, percent: "30%", color: "#8a1538" },
      { name: "2nd Year", count: 320, percent: "27%", color: "#b87333" },
      { name: "3rd Year", count: 280, percent: "24%", color: "#0f766e" },
      { name: "4th Year", count: 220, percent: "19%", color: "#64748b" },
    ],
    seteDimensions: [
      { code: "SC", name: "Syllabus Coverage",    score: 89.5 },
      { code: "AC", name: "Student Consultation", score: 86.8 },
      { code: "IC", name: "Instructional Clarity",score: 86.2 },
      { code: "AG", name: "Assessment Fairness",  score: 82.0 },
      { code: "PT", name: "Classroom Pacing",     score: 79.5 },
    ],
    flaggedSections: [
      { name: "BSIT 2-1 Section", course: "IT 201 Data Structures", courseType: "Major", failing: 16, total: 35, rate: 45.7 },
      { name: "BSIT 1-2 Section", course: "MATH 201 Discrete Math", courseType: "GenEd", failing: 10, total: 38, rate: 26.3 },
    ],
    bottleneckCourses: [
      { code: "IT 201",   name: "Data Structures & Algorithms", courseType: "Major", failRate: 24.5, students: 160 },
      { code: "MATH 201", name: "Discrete Mathematics", courseType: "GenEd", failRate: 22.0, students: 175 },
    ],
  },
  "AY 2024–2025_Semester 2": {
    totalEnrolled: 1250,
    availableFaculty: 34,
    sectionsNeeded: 34,
    facultyShortage: 0,
    isCurrentOrFuture: false,
    kpis: {
      passingRate:   { value: "90.6%", delta: "+0.7%", positive: true,  num: 90.6 },
      atRiskRate:    { value: "15.4%", delta: "-1.1%", positive: false, num: 15.4 },
      retentionRate: { value: "91.5%", delta: "+0.7%", positive: true,  num: 91.5 },
      seteScore:     { value: "85.3%", delta: "+2.9%", positive: true,  num: 85.3 },
      attendanceRate:{ value: "96.0%", delta: "+0.5%", positive: true,  num: 96.0 },
    },
    yearLevels: [
      { name: "1st Year", count: 380, percent: "30%", color: "#8a1538" },
      { name: "2nd Year", count: 340, percent: "27%", color: "#b87333" },
      { name: "3rd Year", count: 295, percent: "24%", color: "#0f766e" },
      { name: "4th Year", count: 235, percent: "19%", color: "#64748b" },
    ],
    seteDimensions: [
      { code: "SC", name: "Syllabus Coverage",    score: 90.2 },
      { code: "AC", name: "Student Consultation", score: 87.5 },
      { code: "IC", name: "Instructional Clarity",score: 87.0 },
      { code: "AG", name: "Assessment Fairness",  score: 82.8 },
      { code: "PT", name: "Classroom Pacing",     score: 80.1 },
    ],
    flaggedSections: [
      { name: "BSIT 2-2 Section", course: "IT 201 Data Structures", courseType: "Major", failing: 12, total: 36, rate: 33.3 },
    ],
    bottleneckCourses: [
      { code: "IT 201",   name: "Data Structures & Algorithms", courseType: "Major", failRate: 21.0, students: 155 },
    ],
  },

  // AY 2023-2024 (Completed historical year)
  "AY 2023–2024_Semester 1": {
    totalEnrolled: 1040,
    availableFaculty: 32,
    sectionsNeeded: 28,
    facultyShortage: 0,
    isCurrentOrFuture: false,
    kpis: {
      passingRate:   { value: "88.4%", delta: "Baseline", positive: false, num: 88.4 },
      atRiskRate:    { value: "18.2%", delta: "Baseline", positive: false, num: 18.2 },
      retentionRate: { value: "89.6%", delta: "Baseline", positive: false, num: 89.6 },
      seteScore:     { value: "80.0%", delta: "Baseline", positive: false, num: 80.0 },
      attendanceRate:{ value: "94.2%", delta: "Baseline", positive: false, num: 94.2 },
    },
    yearLevels: [
      { name: "1st Year", count: 315, percent: "30%", color: "#8a1538" },
      { name: "2nd Year", count: 280, percent: "27%", color: "#b87333" },
      { name: "3rd Year", count: 250, percent: "24%", color: "#0f766e" },
      { name: "4th Year", count: 195, percent: "19%", color: "#64748b" },
    ],
    seteDimensions: [
      { code: "SC", name: "Syllabus Coverage",    score: 88.0 },
      { code: "AC", name: "Student Consultation", score: 85.0 },
      { code: "IC", name: "Instructional Clarity",score: 84.5 },
      { code: "AG", name: "Assessment Fairness",  score: 80.5 },
      { code: "PT", name: "Classroom Pacing",     score: 77.8 },
    ],
    flaggedSections: [
      { name: "BSIT 2-1 Section", course: "IT 201 Data Structures", courseType: "Major", failing: 17, total: 34, rate: 50.0 },
    ],
    bottleneckCourses: [
      { code: "IT 201",   name: "Data Structures & Algorithms", courseType: "Major", failRate: 26.2, students: 145 },
    ],
  },
  "AY 2023–2024_Semester 2": {
    totalEnrolled: 1110,
    availableFaculty: 32,
    sectionsNeeded: 30,
    facultyShortage: 0,
    isCurrentOrFuture: false,
    kpis: {
      passingRate:   { value: "89.2%", delta: "+0.8%", positive: false, num: 89.2 },
      atRiskRate:    { value: "17.4%", delta: "-0.8%", positive: false, num: 17.4 },
      retentionRate: { value: "90.1%", delta: "+0.5%", positive: true,  num: 90.1 },
      seteScore:     { value: "81.8%", delta: "+1.8%", positive: false, num: 81.8 },
      attendanceRate:{ value: "94.9%", delta: "+0.7%", positive: false, num: 94.9 },
    },
    yearLevels: [
      { name: "1st Year", count: 335, percent: "30%", color: "#8a1538" },
      { name: "2nd Year", count: 300, percent: "27%", color: "#b87333" },
      { name: "3rd Year", count: 265, percent: "24%", color: "#0f766e" },
      { name: "4th Year", count: 210, percent: "19%", color: "#64748b" },
    ],
    seteDimensions: [
      { code: "SC", name: "Syllabus Coverage",    score: 88.8 },
      { code: "AC", name: "Student Consultation", score: 85.9 },
      { code: "IC", name: "Instructional Clarity",score: 85.2 },
      { code: "AG", name: "Assessment Fairness",  score: 81.3 },
      { code: "PT", name: "Classroom Pacing",     score: 78.6 },
    ],
    flaggedSections: [
      { name: "BSIT 2-2 Section", course: "IT 201 Data Structures", courseType: "Major", failing: 13, total: 35, rate: 37.1 },
    ],
    bottleneckCourses: [
      { code: "IT 201",   name: "Data Structures & Algorithms", courseType: "Major", failRate: 23.0, students: 150 },
    ],
  },
};

// Historical Actual vs Forecast Series
const ENROLLMENT_TIME_SERIES = [
  { term: "AY 2023–2024 Semester 1", short: "23-24 S1", actual: 1040, forecast: null },
  { term: "AY 2023–2024 Semester 2", short: "23-24 S2", actual: 1110, forecast: null },
  { term: "AY 2024–2025 Semester 1", short: "24-25 S1", actual: 1180, forecast: null },
  { term: "AY 2024–2025 Semester 2", short: "24-25 S2", actual: 1250, forecast: null },
  { term: "AY 2025–2026 Semester 1", short: "25-26 S1", actual: 1310, forecast: null },
  { term: "AY 2025–2026 Semester 2", short: "25-26 S2", actual: 1340, forecast: 1340 },
  { term: "AY 2026–2027 Semester 1", short: "26-27 S1", actual: 1420, forecast: 1420 }, // Active term
  { term: "AY 2026–2027 Semester 2", short: "26-27 S2", actual: null, forecast: 1490 }, // Model projection
];

const KPI_DEFINITIONS = [
  {
    id: 1,
    key: "passingRate",
    name: "Student Passing Rate",
    target: "≥ 90%",
    targetNum: 90,
    higherIsBetter: true,
    category: "academic",
    sourceTag: "Student Portal Database",
    objective: "Maintain high academic success and prevent student course dropouts across the BSIT curriculum.",
    formula: "(Students with Passing Grades ÷ Total Enrolled Students) × 100",
    action: "Conduct syllabus reviews on high-failure courses, mandate 2-hour weekly consultation hours, and deploy peer study groups.",
  },
  {
    id: 2,
    key: "atRiskRate",
    name: "At-Risk Student Rate",
    target: "≤ 10%",
    targetNum: 10,
    higherIsBetter: false,
    category: "academic",
    sourceTag: "Student Portal Database",
    objective: "Detect struggling students early at midterms to prevent course failures and disqualification.",
    formula: "(Students Failing or in Academic Danger at Midterms ÷ Total Enrolled) × 100",
    action: "Trigger automated academic early warnings, require mandatory instructor-student advising, and coordinate with guidance.",
  },
  {
    id: 3,
    key: "retentionRate",
    name: "Student Retention Rate",
    target: "≥ 90% (Floor: 85%)",
    targetNum: 90,
    alertFloor: 85,
    higherIsBetter: true,
    category: "academic",
    sourceTag: "Student Portal Database",
    objective: "Minimize semester-to-semester attrition and ensure cohort persistence into the next academic year.",
    formula: "(Students Re-enrolling in Next Term ÷ Total Enrolled at Term Start) × 100",
    action: "Conduct structured exit interviews for withdrawing students, investigate financial/academic bottlenecks, and coordinate with university guidance.",
  },
  {
    id: 4,
    key: "seteScore",
    name: "Faculty Teaching (SETE)",
    target: "≥ 85%",
    targetNum: 85,
    higherIsBetter: true,
    category: "faculty",
    sourceTag: "SETE System (Proposed Integration)",
    objective: "Ensure instructors provide high-quality, clear, and fair classroom instruction meeting student learning needs.",
    formula: "(Faculty Members with Satisfactory Rating [≥85%] ÷ Total Evaluated Faculty) × 100",
    action: "Provide faculty development support, peer teaching observations, and review classroom exam item pacing.",
  },
  {
    id: 5,
    key: "attendanceRate",
    name: "Faculty Attendance Rate",
    target: "≥ 95%",
    targetNum: 95,
    higherIsBetter: true,
    category: "faculty",
    sourceTag: "Department Logs & Biometrics (Proposed Integration)",
    objective: "Safeguard prescribed student-faculty contact hours so syllabi are completely covered before finals.",
    formula: "(Class Hours Conducted ÷ Scheduled Class Hours) × 100",
    action: "Require formal make-up class certifications, monitor room attendance logs, and rebalance excessive teaching unit loads.",
  },
];

// Anonymized Department Teaching Clusters (per RA 10173 privacy rules)
const ANONYMIZED_FACULTY_ROSTER = [
  {
    id: "CLUS-01",
    title: "Instructional Cluster 1 (Data Structures & Core IT)",
    instructorAlias: "Faculty Instructor A",
    courseType: "Major" as const,
    sections: 4,
    units: 18,
    status: "Full Load",
    overallScore: 84.7,
    seteDimensions: [
      { code: "SC", name: "Syllabus Coverage", score: 90.5 },
      { code: "AC", name: "Student Consultation", score: 86.2 },
      { code: "IC", name: "Instructional Clarity", score: 87.0 },
      { code: "AG", name: "Assessment Fairness", score: 81.5 },
      { code: "PT", name: "Classroom Pacing", score: 78.4 },
    ],
  },
  {
    id: "CLUS-02",
    title: "Instructional Cluster 2 (Database Systems & Analytics)",
    instructorAlias: "Faculty Instructor B",
    courseType: "Major" as const,
    sections: 4,
    units: 18,
    status: "Full Load",
    overallScore: 86.7,
    seteDimensions: [
      { code: "SC", name: "Syllabus Coverage", score: 91.8 },
      { code: "AC", name: "Student Consultation", score: 88.0 },
      { code: "IC", name: "Instructional Clarity", score: 87.5 },
      { code: "AG", name: "Assessment Fairness", score: 85.2 },
      { code: "PT", name: "Classroom Pacing", score: 81.0 },
    ],
  },
  {
    id: "CLUS-03",
    title: "Instructional Cluster 3 (Discrete Mathematics & Logic)",
    instructorAlias: "Faculty Instructor C",
    courseType: "GenEd" as const,
    sections: 5,
    units: 21,
    status: "Overloaded",
    overallScore: 84.3,
    seteDimensions: [
      { code: "SC", name: "Syllabus Coverage", score: 89.2 },
      { code: "AC", name: "Student Consultation", score: 87.1 },
      { code: "IC", name: "Instructional Clarity", score: 85.0 },
      { code: "AG", name: "Assessment Fairness", score: 81.0 },
      { code: "PT", name: "Classroom Pacing", score: 79.2 },
    ],
  },
  {
    id: "CLUS-04",
    title: "Instructional Cluster 4 (Object-Oriented Programming)",
    instructorAlias: "Faculty Instructor D",
    courseType: "Major" as const,
    sections: 4,
    units: 18,
    status: "Full Load",
    overallScore: 89.8,
    seteDimensions: [
      { code: "SC", name: "Syllabus Coverage", score: 94.0 },
      { code: "AC", name: "Student Consultation", score: 91.2 },
      { code: "IC", name: "Instructional Clarity", score: 90.5 },
      { code: "AG", name: "Assessment Fairness", score: 88.0 },
      { code: "PT", name: "Classroom Pacing", score: 85.5 },
    ],
  },
  {
    id: "CLUS-05",
    title: "Instructional Cluster 5 (Senior Electives & Capstones)",
    instructorAlias: "Faculty Instructor E (Vacant/Requisition)",
    courseType: "Major" as const,
    sections: 3,
    units: 9,
    status: "Unassigned",
    overallScore: 89.2,
    seteDimensions: [
      { code: "SC", name: "Syllabus Coverage", score: 93.5 },
      { code: "AC", name: "Student Consultation", score: 90.0 },
      { code: "IC", name: "Instructional Clarity", score: 89.8 },
      { code: "AG", name: "Assessment Fairness", score: 87.0 },
      { code: "PT", name: "Classroom Pacing", score: 85.8 },
    ],
  },
];

// Anonymized Student Qualitative Comments with NLP Sentiment Classification
const ANONYMIZED_STUDENT_FEEDBACK = [
  {
    category: "Classroom Pacing (PT)",
    theme: "2nd-Year Programming & Laboratory Courses",
    comment: "Lecture slides are clear, but laboratory assignments on Graph Algorithms felt crammed into the final two weeks before midterms.",
    sentiment: "negative",
    sentimentLabel: "Negative / Concern",
    nlpScore: -0.68,
  },
  {
    category: "Assessment Fairness (AG)",
    theme: "3rd-Year Database Architecture Courses",
    comment: "Exam questions contained query optimization scenarios that were not discussed during hands-on lab hours.",
    sentiment: "negative",
    sentimentLabel: "Negative / Concern",
    nlpScore: -0.74,
  },
  {
    category: "Student Consultation (AC)",
    theme: "1st-Year Mathematical Foundations",
    comment: "Instructor makes time to explain proofs during consultation hours, but consultation schedule conflicts with major lab sessions.",
    sentiment: "neutral",
    sentimentLabel: "Neutral / Observation",
    nlpScore: 0.05,
  },
  {
    category: "Instructional Clarity (IC)",
    theme: "Software Engineering & Web Systems",
    comment: "Very detailed coding demonstrations and helpful explanations of pointers and linked lists with clear grading rubrics.",
    sentiment: "positive",
    sentimentLabel: "Positive",
    nlpScore: 0.88,
  },
];

// ─── TOOLTIPS & STATUS BADGES ────────────────────────────────────────────────

function CustomChartTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const p = payload[0];
    const fullTerm = p.payload.term ?? label;
    const value = p.value;
    const isKpi = p.payload.target !== undefined;
    return (
      <div className="bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-200 text-xs font-sans">
        <p className="font-bold text-slate-800 text-[11px]">{fullTerm}</p>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-base font-black text-[#8a1538] tracking-tight">{value}</span>
          <span className="text-[11px] font-semibold text-slate-500">{isKpi ? "%" : "Students"}</span>
        </div>
        {isKpi && (
          <div className="mt-1 pt-1 border-t border-slate-100 flex items-center justify-between gap-3 text-[10px]">
            <span className="text-slate-400">Institutional Benchmark:</span>
            <span className="font-bold text-slate-700">{p.payload.target}%</span>
          </div>
        )}
      </div>
    );
  }
  return null;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "Full Load":  "bg-emerald-50 text-emerald-800 border-emerald-200",
    "Overloaded": "bg-amber-50   text-amber-800   border-amber-200",
    "Unassigned": "bg-red-50     text-red-800     border-red-200",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${styles[status] ?? "bg-slate-100 text-slate-700 border-slate-200"}`}>
      {status}
    </span>
  );
}

// ─── MAIN DASHBOARD COMPONENT ────────────────────────────────────────────────

export default function Dashboard() {
  const [chartView,        setChartView]        = useState<"forecast" | "actual">("forecast");
  const [activeKpiId,      setActiveKpiId]      = useState<number | null>(null);
  const [modalKpi,         setModalKpi]         = useState<typeof KPI_DEFINITIONS[0] | null>(null);
  const [showIntervention, setShowIntervention] = useState(false);
  const [showFeedbackModal,setShowFeedbackModal]= useState(false);
  const [sentimentFilter,  setSentimentFilter]  = useState<"all" | "positive" | "negative" | "neutral">("all");
  const [selectedFacultyId,setSelectedFacultyId]= useState<string | null>(null);
  const [searchQuery,      setSearchQuery]      = useState("");

  // Linked Global Filters
  const [selectedYear,     setSelectedYear]     = useState("AY 2026–2027");
  const [selectedSemester, setSelectedSemester] = useState("Semester 1");
  const [selectedYearLevel,setSelectedYearLevel]= useState("All Year Levels");
  const [selectedCourseType,setSelectedCourseType]=useState("All Courses");

  // Dynamic greeting (client-side in useEffect to ensure safe static pre-rendering)
  const [greeting, setGreeting] = useState("Program Chair Decision Support");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning, Program Chair");
    else if (hour < 17) setGreeting("Good afternoon, Program Chair");
    else setGreeting("Good evening, Program Chair");
  }, []);

  // Base term data
  const filterKey = `${selectedYear}_${selectedSemester}`;
  const baseTermData = TERM_DATA_STORE[filterKey] ?? TERM_DATA_STORE["AY 2026–2027_Semester 1"];

  // ── UNIVERSAL CROSS-FILTERING RECALCULATION ──
  const termData = useMemo(() => {
    let enrolled = baseTermData.totalEnrolled;
    let faculty = baseTermData.availableFaculty;
    let sections = baseTermData.sectionsNeeded;
    let shortage = baseTermData.facultyShortage;

    let passingNum = baseTermData.kpis.passingRate.num;
    let atRiskNum = baseTermData.kpis.atRiskRate.num;
    let retentionNum = baseTermData.kpis.retentionRate.num;
    let seteNum = baseTermData.kpis.seteScore.num;
    let attendanceNum = baseTermData.kpis.attendanceRate.num;

    let deltaPass = baseTermData.kpis.passingRate.delta;
    let deltaRisk = baseTermData.kpis.atRiskRate.delta;

    // Filter by Year Level (Dynamic offsets relative to selected term, yielding user-verified cohort distributions)
    if (selectedYearLevel === "1st Year") {
      enrolled = baseTermData.yearLevels.find(y => y.name === "1st Year")?.count ?? 430;
      faculty = 9;
      sections = 11;
      shortage = Math.min(0, faculty - sections); // -2
      passingNum = Number(Math.min(100, Math.max(0, baseTermData.kpis.passingRate.num + 2.8)).toFixed(1));
      atRiskNum = Number(Math.min(100, Math.max(0, baseTermData.kpis.atRiskRate.num - 0.8)).toFixed(1));
      seteNum = Number(Math.min(100, Math.max(0, baseTermData.kpis.seteScore.num + 2.3)).toFixed(1));
      retentionNum = Number(Math.min(100, Math.max(0, baseTermData.kpis.retentionRate.num + 1.5)).toFixed(1));
      attendanceNum = Number(Math.min(100, Math.max(0, baseTermData.kpis.attendanceRate.num + 1.3)).toFixed(1));
      deltaPass = "+1.4%";
      deltaRisk = "-1.4%";
    } else if (selectedYearLevel === "2nd Year") {
      enrolled = baseTermData.yearLevels.find(y => y.name === "2nd Year")?.count ?? 385;
      faculty = 9;
      sections = 10;
      shortage = Math.min(0, faculty - sections); // -1 (IT 201 section load)
      passingNum = Number(Math.min(100, Math.max(0, baseTermData.kpis.passingRate.num - 3.2)).toFixed(1));
      atRiskNum = Number(Math.min(100, Math.max(0, baseTermData.kpis.atRiskRate.num + 3.2)).toFixed(1));
      seteNum = Number(Math.min(100, Math.max(0, baseTermData.kpis.seteScore.num - 1.7)).toFixed(1));
      retentionNum = Number(Math.min(100, Math.max(0, baseTermData.kpis.retentionRate.num - 1.5)).toFixed(1));
      attendanceNum = Number(Math.min(100, Math.max(0, baseTermData.kpis.attendanceRate.num - 0.4)).toFixed(1));
      deltaPass = "-1.8%";
      deltaRisk = "+1.8%";
    } else if (selectedYearLevel === "3rd Year") {
      enrolled = baseTermData.yearLevels.find(y => y.name === "3rd Year")?.count ?? 335;
      faculty = 9;
      sections = 9;
      shortage = Math.min(0, faculty - sections); // 0
      passingNum = Number(Math.min(100, Math.max(0, baseTermData.kpis.passingRate.num - 1.4)).toFixed(1));
      atRiskNum = Number(Math.min(100, Math.max(0, baseTermData.kpis.atRiskRate.num - 0.3)).toFixed(1));
      seteNum = Number(Math.min(100, Math.max(0, baseTermData.kpis.seteScore.num - 0.2)).toFixed(1));
      retentionNum = Number(Math.min(100, Math.max(0, baseTermData.kpis.retentionRate.num - 0.5)).toFixed(1));
      attendanceNum = Number(Math.min(100, Math.max(0, baseTermData.kpis.attendanceRate.num + 0.2)).toFixed(1));
      deltaPass = "-0.6%";
      deltaRisk = "+0.6%";
    } else if (selectedYearLevel === "4th Year") {
      enrolled = baseTermData.yearLevels.find(y => y.name === "4th Year")?.count ?? 270;
      faculty = 8;
      sections = 8;
      shortage = Math.min(0, faculty - sections); // 0
      passingNum = Number(Math.min(100, Math.max(0, baseTermData.kpis.passingRate.num + 4.6)).toFixed(1));
      atRiskNum = Number(Math.min(100, Math.max(0, baseTermData.kpis.atRiskRate.num - 4.7)).toFixed(1));
      seteNum = Number(Math.min(100, Math.max(0, baseTermData.kpis.seteScore.num + 3.8)).toFixed(1));
      retentionNum = Number(Math.min(100, Math.max(0, baseTermData.kpis.retentionRate.num + 2.5)).toFixed(1));
      attendanceNum = Number(Math.min(100, Math.max(0, baseTermData.kpis.attendanceRate.num + 1.0)).toFixed(1));
      deltaPass = "+2.1%";
      deltaRisk = "-2.1%";
    }

    // Filter by Course Type
    if (selectedCourseType === "Major / Professional IT") {
      sections = Math.round(sections * 0.72);
      faculty = Math.min(faculty, 26);
      passingNum = Math.max(70, Number((passingNum - 1.2).toFixed(1)));
      atRiskNum = Math.min(25, Number((atRiskNum + 1.5).toFixed(1)));
      seteNum = Number((seteNum - 1.1).toFixed(1));
    } else if (selectedCourseType === "General Education") {
      sections = Math.round(sections * 0.28);
      faculty = Math.min(faculty, 9);
      shortage = 0;
      passingNum = Math.min(99, Number((passingNum + 2.4).toFixed(1)));
      atRiskNum = Math.max(2, Number((atRiskNum - 3.2).toFixed(1)));
      seteNum = Number((seteNum + 2.5).toFixed(1));
      attendanceNum = Number((attendanceNum + 0.6).toFixed(1));
    }

    return {
      ...baseTermData,
      totalEnrolled: enrolled,
      availableFaculty: faculty,
      sectionsNeeded: sections,
      facultyShortage: shortage,
      kpis: {
        passingRate: {
          value: `${passingNum.toFixed(1)}%`,
          delta: deltaPass,
          positive: passingNum >= 90,
          num: passingNum,
        },
        atRiskRate: {
          value: `${atRiskNum.toFixed(1)}%`,
          delta: deltaRisk,
          positive: atRiskNum <= 10,
          num: atRiskNum,
        },
        retentionRate: {
          value: `${retentionNum.toFixed(1)}%`,
          delta: baseTermData.kpis.retentionRate.delta,
          positive: retentionNum >= 90,
          num: retentionNum,
        },
        seteScore: {
          value: `${seteNum.toFixed(1)}%`,
          delta: baseTermData.kpis.seteScore.delta,
          positive: seteNum >= 85,
          num: seteNum,
        },
        attendanceRate: {
          value: `${attendanceNum.toFixed(1)}%`,
          delta: baseTermData.kpis.attendanceRate.delta,
          positive: attendanceNum >= 95,
          num: attendanceNum,
        },
      },
    };
  }, [baseTermData, selectedYearLevel, selectedCourseType]);

  // Donut chart distribution
  const filteredYearLevels = useMemo(() => {
    if (selectedYearLevel === "All Year Levels") return baseTermData.yearLevels;
    return baseTermData.yearLevels.filter(y => y.name.toLowerCase().includes(selectedYearLevel.toLowerCase()));
  }, [baseTermData.yearLevels, selectedYearLevel]);

  // Secondary filters on Bottlenecks & Flagged Sections
  const filteredBottlenecks = useMemo(() => {
    let list = baseTermData.bottleneckCourses;
    if (selectedCourseType === "Major / Professional IT") {
      list = list.filter(c => c.courseType === "Major");
    } else if (selectedCourseType === "General Education") {
      list = list.filter(c => c.courseType === "GenEd");
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q));
    }
    return list;
  }, [baseTermData.bottleneckCourses, selectedCourseType, searchQuery]);

  const filteredSections = useMemo(() => {
    let list = baseTermData.flaggedSections;
    if (selectedCourseType === "Major / Professional IT") {
      list = list.filter(s => s.courseType === "Major");
    } else if (selectedCourseType === "General Education") {
      list = list.filter(s => s.courseType === "GenEd");
    }
    if (selectedYearLevel !== "All Year Levels") {
      const lvl = selectedYearLevel.charAt(0);
      list = list.filter(s => s.name.startsWith(`BSIT ${lvl}-`));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.course.toLowerCase().includes(q));
    }
    return list;
  }, [baseTermData.flaggedSections, selectedCourseType, selectedYearLevel, searchQuery]);

  const filteredFaculty = useMemo(() => {
    let list = ANONYMIZED_FACULTY_ROSTER;
    if (selectedCourseType === "Major / Professional IT") {
      list = list.filter(f => f.courseType === "Major");
    } else if (selectedCourseType === "General Education") {
      list = list.filter(f => f.courseType === "GenEd");
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(f => f.title.toLowerCase().includes(q));
    }
    return list;
  }, [selectedCourseType, searchQuery]);

  // Selected faculty cluster for individual SETE inspection
  const selectedFaculty = useMemo(() => {
    if (!selectedFacultyId) return null;
    return ANONYMIZED_FACULTY_ROSTER.find(f => f.id === selectedFacultyId) ?? null;
  }, [selectedFacultyId]);

  const displayedSeteDimensions = useMemo(() => {
    if (selectedFaculty) return selectedFaculty.seteDimensions;
    return baseTermData.seteDimensions;
  }, [selectedFaculty, baseTermData.seteDimensions]);

  // Dynamic computation of threshold breaches
  const breachedSections = useMemo(() => {
    return filteredSections.filter(s => s.rate >= 20.0);
  }, [filteredSections]);

  const breachCount = breachedSections.length;
  const retentionUnderFloor = termData.kpis.retentionRate.num < 85.0;

  // Active KPI data for chart
  const activeKpiConfig = useMemo(() => {
    if (!activeKpiId) return null;
    const def = KPI_DEFINITIONS.find(k => k.id === activeKpiId);
    if (!def) return null;

    const trendData = Object.entries(TERM_DATA_STORE).map(([key, data]) => {
      const [y, s] = key.split("_");
      const short = `${y.replace("AY ", "").substring(2, 7)} ${s === "Semester 1" ? "S1" : "S2"}`;
      const metric = data.kpis[def.key as keyof typeof data.kpis];
      return {
        term: `${y} ${s}`,
        short,
        value: metric.num,
        target: def.targetNum,
      };
    });

    const currentVal = termData.kpis[def.key as keyof typeof termData.kpis];
    const isTargetMet = def.higherIsBetter
      ? currentVal.num >= def.targetNum
      : currentVal.num <= def.targetNum;

    return {
      def,
      title: `${def.name} Multi-Term Trend (%)`,
      subtitle: `${def.objective} · Scope: ${selectedYearLevel} · ${selectedCourseType} · Target: ${def.target}`,
      data: trendData,
      currentValue: currentVal.value,
      currentDelta: currentVal.delta,
      isTargetMet,
      target: def.targetNum,
      domain: def.key === "atRiskRate" ? [0, 25] : [75, 100],
    };
  }, [activeKpiId, termData, selectedYearLevel, selectedCourseType]);

  // Filtered student feedback for NLP drawer
  const filteredFeedback = useMemo(() => {
    if (sentimentFilter === "all") return ANONYMIZED_STUDENT_FEEDBACK;
    return ANONYMIZED_STUDENT_FEEDBACK.filter(f => f.sentiment === sentimentFilter);
  }, [sentimentFilter]);

  return (
    <div className="min-h-screen font-sans text-slate-800 flex">

      {/* ══════════════════ SIDEBAR ══════════════════ */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col sticky top-0 h-screen bg-white/80 backdrop-blur-sm border-r border-slate-200/60 p-4 print:hidden">
        {/* Brand */}
        <div className="flex items-center gap-2.5 pb-4 mb-3 border-b border-slate-200/60">
          <div className="w-8 h-8 rounded-xl bg-[#8a1538] flex items-center justify-center shadow-sm shadow-red-900/20">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight text-slate-900 leading-tight">SpartanPulse</h1>
            <p className="text-[10px] text-slate-400 font-medium">BatStateU · CICS ARASOF</p>
          </div>
        </div>

        {/* Working Search Bar */}
        <div className="relative mb-3">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search courses or faculty…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1.5 rounded-xl bg-slate-100/80 border border-slate-200/60 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#8a1538]"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs">×</button>
          )}
        </div>

        {/* Navigation Menu */}
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">Decision Views</p>
        <nav className="space-y-1 flex-1">
          <button
            onClick={() => setActiveKpiId(null)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left transition ${
              activeKpiId === null ? "bg-[#8a1538] text-white shadow-xs" : "text-slate-600 hover:bg-slate-100/80"
            }`}
          >
            <span className="flex items-center gap-2.5"><Layers className="w-4 h-4" />Executive Dashboard</span>
          </button>

          <button
            onClick={() => setShowIntervention(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100/80 transition text-xs font-semibold text-left"
          >
            <span className="flex items-center gap-2.5"><AlertTriangle className="w-4 h-4 text-rose-500" />Action Protocols</span>
            <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-bold">3</span>
          </button>

          <button
            onClick={() => setShowFeedbackModal(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100/80 transition text-xs font-semibold text-left"
          >
            <span className="flex items-center gap-2.5"><MessageSquareQuote className="w-4 h-4 text-purple-600" />SETE Sentiment Tagging</span>
            <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-bold">4</span>
          </button>

          <button
            onClick={() => setModalKpi(KPI_DEFINITIONS[0])}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100/80 transition text-xs font-semibold text-left"
          >
            <BookOpen className="w-4 h-4 text-slate-400" />KPI Formulas &amp; Targets
          </button>
        </nav>

        {/* Role, Audit & Privacy Compliance */}
        <div className="mt-auto pt-3 border-t border-slate-200/60 space-y-2">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="w-7 h-7 rounded-full bg-[#8a1538]/10 border border-[#8a1538]/20 flex items-center justify-center font-bold text-[#8a1538] text-xs shrink-0">
              PC
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">Program Chair</p>
              <p className="text-[10px] text-slate-400 truncate">BS Information Technology</p>
            </div>
          </div>
          <div className="text-[9px] text-slate-500 bg-slate-100/60 p-2 rounded-lg leading-tight space-y-1">
            <div className="flex items-center gap-1 font-semibold text-emerald-700">
              <ShieldCheck className="w-3 h-3 shrink-0" />
              <span>Designed per RA 10173</span>
            </div>
            <p className="text-[8.5px] text-slate-400">
              Identity stripped · Audit ID: <span className="font-mono text-slate-600">AUDIT-PC-IT-26</span>
            </p>
            <p className="text-[8px] font-semibold text-slate-500 pt-1 border-t border-slate-200/60">
              Academic Prototype · Simulated Portal &amp; SETE Data · BAT 405 Research Project
            </p>
          </div>
        </div>
      </aside>

      {/* ══════════════════ MAIN CONTENT AREA ══════════════════ */}
      <main className="flex-1 min-w-0 flex flex-col">

        {/* ── STICKY GLOBAL FILTER BAR (Linked & Role-Locked) ── */}
        <header className="sticky top-0 z-20 px-3.5 sm:px-5 py-2 bg-white/90 backdrop-blur-md border-b border-slate-200/60 print:border-b-2 print:border-[#8a1538] space-y-1.5">
          {/* Top Row: Department Info & Dynamic Greeting */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-[#8a1538]/10 text-[#8a1538] flex items-center justify-center shrink-0">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight truncate">
                    {greeting}
                  </h2>
                  <Hand className="w-3.5 h-3.5 text-amber-600 shrink-0 inline-block" />
                </div>
                <p className="text-[10px] text-slate-500 truncate">
                  SpartanPulse Decision Support · {selectedSemester} {selectedYear}
                </p>
              </div>
            </div>

            {/* Department Lock Chips (Role-Based Isolation) */}
            <div className="flex items-center gap-1.5 text-xs flex-wrap">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200" title="Locked to Program Chair Department">
                <Lock className="w-2.5 h-2.5 text-slate-400" />
                <span>CICS · ARASOF-Nasugbu</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#8a1538]/10 text-[#8a1538] text-[10px] font-bold border border-[#8a1538]/20" title="Program Chair Scope">
                <Briefcase className="w-2.5 h-2.5" />
                <span>BS Information Technology</span>
              </div>
              <button
                onClick={() => window.print()}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition print:hidden"
              >
                <Printer className="w-3 h-3" />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          {/* Linked Filter Controls Row */}
          <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-100 text-xs">
            {/* Academic Year Dropdown */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-slate-200 font-medium text-slate-700 shadow-xs">
              <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer text-xs"
              >
                <option value="AY 2026–2027">AY 2026–2027 (Active Term)</option>
                <option value="AY 2025–2026">AY 2025–2026 (Historical)</option>
                <option value="AY 2024–2025">AY 2024–2025 (Historical)</option>
                <option value="AY 2023–2024">AY 2023–2024 (Historical)</option>
              </select>
            </div>

            {/* Semester Dropdown (Dynamically labeled based on isCurrentOrFuture) */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-slate-200 font-medium text-slate-700 shadow-xs">
              <Filter className="w-3 h-3 text-slate-400 shrink-0" />
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer text-xs"
              >
                <option value="Semester 1">
                  {baseTermData.isCurrentOrFuture ? "Semester 1 (Active / Midterms)" : "Semester 1 (Concluded)"}
                </option>
                <option value="Semester 2">
                  {baseTermData.isCurrentOrFuture ? "Semester 2 (Upcoming / Projected)" : "Semester 2 (Concluded)"}
                </option>
              </select>
            </div>

            {/* Secondary: Level Filter (formerly Year:) */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-slate-200 font-medium text-slate-700 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Level:</span>
              <select
                value={selectedYearLevel}
                onChange={(e) => setSelectedYearLevel(e.target.value)}
                className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer text-xs"
              >
                <option value="All Year Levels">All Year Levels</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            {/* Secondary: Course Type Filter */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-slate-200 font-medium text-slate-700 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Type:</span>
              <select
                value={selectedCourseType}
                onChange={(e) => setSelectedCourseType(e.target.value)}
                className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer text-xs"
              >
                <option value="All Courses">All Courses</option>
                <option value="Major / Professional IT">Major / Professional IT</option>
                <option value="General Education">General Education</option>
              </select>
            </div>
          </div>
        </header>

        {/* ── DASHBOARD BODY (Break-inside-avoid for clean printing) ── */}
        <div className="flex-1 p-3 sm:p-4 space-y-2.5">

          {/* ── TOP OPERATIONAL STRIP (Cross-Filtered) ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 break-inside-avoid">
            {/* Total Enrolled */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 p-3 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-[#8a1538] flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                  {termData.totalEnrolled.toLocaleString()}
                </div>
                <div className="text-[11px] font-semibold text-slate-700 mt-0.5 truncate">
                  {selectedYearLevel === "All Year Levels" ? "Total Enrolled Students" : `${termData.totalEnrolled.toLocaleString()} of ${baseTermData.totalEnrolled.toLocaleString()} Enrolled`}
                </div>
                <div className="text-[9px] text-slate-400 truncate">[Student Portal Data]</div>
              </div>
            </div>

            {/* Available Faculty */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 p-3 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                  {termData.availableFaculty}
                </div>
                <div className="text-[11px] font-semibold text-slate-700 mt-0.5 truncate">Regular Teaching Staff</div>
                <div className="text-[9px] text-slate-400 truncate">{termData.availableFaculty * 3} units teaching capacity</div>
              </div>
            </div>

            {/* Sections Needed */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 p-3 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                  {termData.sectionsNeeded}
                </div>
                <div className="text-[11px] font-semibold text-slate-700 mt-0.5 truncate">Class Section Blocks Needed</div>
                <div className="text-[9px] text-slate-400 truncate">
                  {termData.sectionsNeeded} blocks · {termData.sectionsNeeded * 3} units required ({termData.availableFaculty * 3} regular capacity)
                </div>
              </div>
            </div>

            {/* Staffing Deficit / Balance */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 p-3 shadow-xs flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                termData.facultyShortage < 0 ? "bg-rose-50 text-[#8a1538]" : "bg-emerald-50 text-emerald-700"
              }`}>
                {termData.facultyShortage < 0 ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <div className={`text-xl sm:text-2xl font-black tracking-tight leading-none ${
                  termData.facultyShortage < 0 ? "text-[#8a1538]" : "text-emerald-700"
                }`}>
                  {termData.facultyShortage < 0 ? `${termData.facultyShortage} Gap` : "Balanced"}
                </div>
                <div className="text-[11px] font-semibold text-slate-700 mt-0.5 truncate">
                  {termData.facultyShortage < 0 ? "Staff Deficit" : "Teaching Capacity"}
                </div>
                <div className="text-[9px] text-slate-400 truncate">
                  {termData.facultyShortage < 0 ? `Shortage of ${Math.abs(termData.facultyShortage)} Faculty (${termData.sectionsNeeded - termData.availableFaculty} Blocks Unstaffed)` : "All Sections Covered"}
                </div>
              </div>
            </div>
          </div>

          {/* ── KPI SECTION (Category Banners & 5 Cards) ── */}
          <section className="space-y-1.5 break-inside-avoid">
            {/* Hint for interaction */}
            <div className="flex items-center justify-between px-1 text-[10px] text-slate-500">
              <span className="font-semibold text-slate-700">Five Core Decision-Support Indicators</span>
              <span className="italic text-[#8a1538] font-medium print:hidden">Tip: Click any KPI card to plot its trend on the chart</span>
            </div>

            {/* Banners */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-2.5">
              <div className="lg:col-span-3">
                <div className="bg-[#8a1538] text-white text-[11px] font-bold uppercase tracking-wider py-1 px-4 rounded-xl text-center shadow-xs">
                  STUDENT ACADEMIC PERFORMANCE (Portal Data)
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="bg-[#1e293b] text-white text-[11px] font-bold uppercase tracking-wider py-1 px-4 rounded-xl text-center shadow-xs">
                  TEACHING QUALITY &amp; SETE (Proposed Integration)
                </div>
              </div>
            </div>

            {/* 5 KPI Cards Grid (Responsive 2x2 on mobile, 5-col on desktop) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
              {KPI_DEFINITIONS.map((def) => {
                const isSelected = activeKpiId === def.id;
                const metricVal = termData.kpis[def.key as keyof typeof termData.kpis];
                const isTargetMet = def.higherIsBetter
                  ? metricVal.num >= def.targetNum
                  : metricVal.num <= def.targetNum;

                return (
                  <div
                    key={def.id}
                    onClick={() => setActiveKpiId(isSelected ? null : def.id)}
                    className={`relative bg-white/95 p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group break-inside-avoid ${
                      isSelected
                        ? "border-[#8a1538]/70 shadow-sm bg-rose-50/15"
                        : "border-slate-200/80 shadow-xs hover:border-[#8a1538]/40 hover:shadow-xs"
                    }`}
                  >
                    {/* Top Row: KPI # & Delta */}
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        KPI {def.id}
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                        isTargetMet ? "text-emerald-700 bg-emerald-50" : "text-red-700 bg-red-50"
                      }`}>
                        {metricVal.delta}
                      </span>
                    </div>

                    {/* Value & Name */}
                    <div>
                      <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                        {metricVal.value}
                      </div>
                      <div className="text-[11px] sm:text-xs font-semibold text-slate-700 mt-1 line-clamp-1">
                        {def.name}
                      </div>
                    </div>

                    {/* Target & Formula Lower Popover */}
                    <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Target: <strong className="text-slate-700">{def.target}</strong></span>

                      <div className="relative group/formula print:hidden">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalKpi(def);
                          }}
                          className="flex items-center gap-0.5 text-slate-500 hover:text-[#8a1538] font-semibold transition"
                          title="Click to view formula and management protocol"
                        >
                          <Info className="w-3 h-3 text-slate-400 group-hover/formula:text-[#8a1538]" />
                          <span>Formula</span>
                        </button>

                        {/* Glassmorphic Popover positioned BELOW the button */}
                        <div className="absolute right-0 top-full mt-2 hidden group-hover/formula:block z-40 w-64 p-3.5 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 ring-1 ring-black/5 text-left pointer-events-none">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-[#8a1538]">Computational Formula</p>
                          <p className="font-mono text-[10px] text-slate-900 bg-slate-50/90 p-2 rounded-xl border border-slate-200/80 my-1 font-semibold leading-relaxed">
                            {def.formula}
                          </p>
                          <p className="text-[10px] text-slate-600 leading-snug">
                            <strong>Objective:</strong> {def.objective}
                          </p>
                          <p className="text-[10px] text-emerald-700 font-semibold mt-1">
                            Target Standard: {def.target}
                          </p>
                          <p className="text-[9px] text-slate-400 mt-1 border-t border-slate-100 pt-1">
                            Source: {def.sourceTag}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── DUAL WARNING ALERT BANNER (Computed Dynamically from Data) ── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 text-white shadow-sm border border-slate-800 break-inside-avoid">
            <div className="flex items-start sm:items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="text-xs text-slate-200 leading-snug space-y-0.5">
                <p>
                  <strong className="text-white">Active Threshold Alerts: </strong>
                  <span className="text-slate-300">
                    {breachCount > 0 ? (
                      <>
                        <strong className="text-red-400 font-semibold">{breachCount} sections</strong> breached the 20% Midterm Failure Threshold ({breachedSections.map(s => `${s.name} @ ${s.rate.toFixed(1)}%`).join(", ")}).
                      </>
                    ) : (
                      <span className="text-emerald-400">All evaluated sections remain safely within the 20% failure threshold. </span>
                    )}
                    {termData.facultyShortage < 0 ? (
                      <> {baseTermData.isCurrentOrFuture ? "Upcoming term indicates" : "Staffing records indicated"} a <strong className="text-amber-300 font-semibold">{Math.abs(termData.facultyShortage)}-instructor deficit</strong> ({termData.sectionsNeeded} sections required vs. {termData.availableFaculty} covered).</>
                    ) : (
                      <> Teaching staff capacity is fully balanced for required sections ({termData.sectionsNeeded} sections covered by {termData.availableFaculty} faculty).</>
                    )}
                  </span>
                </p>
                <p className="text-[10px] text-slate-400">
                  Retention Status: <span className={retentionUnderFloor ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
                    {termData.kpis.retentionRate.value}
                  </span> ({retentionUnderFloor ? "Critical Alert: Below 85.0% floor" : "Healthy: Above 85.0% alert floor"})
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowIntervention(true)}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#8a1538] hover:bg-[#a01a42] text-white rounded-lg text-xs font-semibold transition print:hidden"
            >
              <span>See Action Checklist (3)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* ── MAIN INTERACTIVE CHART SECTION ── */}
          <section className="bg-white/95 rounded-2xl border border-slate-200/80 shadow-xs p-3.5 sm:p-4 break-inside-avoid">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    {activeKpiConfig ? activeKpiConfig.title : "Student Enrollment & Section Demand Trajectory"}
                  </h3>
                  {activeKpiConfig && (
                    <span className="text-[10px] font-bold bg-[#8a1538]/10 text-[#8a1538] px-2 py-0.5 rounded-full border border-[#8a1538]/20">
                      KPI {activeKpiConfig.def.id} Selected
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  {activeKpiConfig ? activeKpiConfig.subtitle : `Predictive polynomial trend curve with historical actuals · ${selectedYear}`}
                </p>
              </div>

              {/* View Switchers */}
              <div className="flex items-center gap-2 print:hidden">
                {activeKpiConfig ? (
                  <button
                    onClick={() => setActiveKpiId(null)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                    title="Return to enrollment curve"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to Demand Curve</span>
                  </button>
                ) : (
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
                    <button
                      onClick={() => setChartView("forecast")}
                      className={`px-3 py-1 rounded-lg transition text-[11px] ${
                        chartView === "forecast" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      Actuals + Forecast
                    </button>
                    <button
                      onClick={() => setChartView("actual")}
                      className={`px-3 py-1 rounded-lg transition text-[11px] ${
                        chartView === "actual" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      Past Actuals Only
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Responsive Chart & Side Metric Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 pt-3">
              <div className="lg:col-span-3 h-[225px] min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={190}>
                  {activeKpiConfig ? (
                    <LineChart data={activeKpiConfig.data} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="short" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={10}
                        tickLine={false}
                        domain={activeKpiConfig.domain}
                        tickFormatter={(v) => `${v}%`}
                      />
                      <Tooltip content={<CustomChartTooltip />} />
                      <ReferenceLine
                        y={activeKpiConfig.target}
                        stroke="#059669"
                        strokeDasharray="4 4"
                        label={{
                          value: `Target: ${activeKpiConfig.target}%`,
                          position: "insideTopRight",
                          fill: "#059669",
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        name={activeKpiConfig.title}
                        stroke="#8a1538"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "#8a1538", stroke: "#fff", strokeWidth: 1.5 }}
                        activeDot={{ r: 6, fill: "#8a1538", stroke: "#fff", strokeWidth: 2 }}
                      />
                    </LineChart>
                  ) : (
                    <AreaChart data={ENROLLMENT_TIME_SERIES} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                      <defs>
                        <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8a1538" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#8a1538" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="short" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[900, 1600]} />
                      <Tooltip content={<CustomChartTooltip />} />
                      {/* Actuals series */}
                      <Area
                        type="monotone"
                        dataKey="actual"
                        name="Actual Enrollment"
                        stroke="#8a1538"
                        strokeWidth={2.5}
                        fill="url(#actualGrad)"
                        connectNulls
                      />
                      {/* Dashed line for upcoming projection */}
                      {chartView === "forecast" && (
                        <Line
                          type="monotone"
                          dataKey="forecast"
                          name="Model Projection"
                          stroke="#8a1538"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={{ r: 4, fill: "#8a1538" }}
                          connectNulls
                        />
                      )}
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>

              {/* Side Panel: Contextual Demand / Status */}
              <div className="border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-4 flex flex-col justify-between space-y-2">
                {activeKpiConfig ? (
                  <div className="space-y-2.5">
                    <div className="p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-xs text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{selectedSemester} Status</p>
                      <div className="text-3xl font-black text-slate-900 tracking-tight mt-0.5">{activeKpiConfig.currentValue}</div>
                      <p className={`text-[10px] font-bold mt-1 py-0.5 px-2 rounded-full inline-block border ${
                        activeKpiConfig.isTargetMet
                          ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                          : "text-red-700 bg-red-50 border-red-200"
                      }`}>
                        {activeKpiConfig.isTargetMet ? "Target Met (Satisfactory)" : "Action Required (Needs Improvement)"}
                      </p>
                    </div>

                    <div className="text-[11px] space-y-1">
                      <div className="flex justify-between py-0.5 border-b border-slate-100">
                        <span className="text-slate-500">Benchmark Target:</span>
                        <strong className="text-slate-900">{activeKpiConfig.target}%</strong>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-slate-100">
                        <span className="text-slate-500">Selected Term Delta:</span>
                        <strong className="text-slate-800">{activeKpiConfig.currentDelta}</strong>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-slate-100">
                        <span className="text-slate-500">Data Source:</span>
                        <span className="text-[10px] text-slate-600 truncate">{activeKpiConfig.def.sourceTag}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-sm text-center">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#8a1538] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        {baseTermData.isCurrentOrFuture ? "Projected Student Demand" : "Historical Enrolled Demand"}
                      </span>
                      <div className="text-3xl font-black text-slate-900 tracking-tight mt-0.5">
                        {termData.totalEnrolled.toLocaleString()}
                        <span className="text-xs font-semibold text-slate-500 ml-1">Students</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                        {selectedSemester} {selectedYear} · {termData.sectionsNeeded} Sections Needed
                      </p>

                      <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex flex-col items-center justify-center gap-0.5 text-[10px] text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          <span>Model Error (MAPE): <strong className="text-slate-900 font-bold">1.11%</strong></span>
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200 text-[9px]">High Precision</span>
                        </div>
                        <p className="text-[9px] text-slate-400">
                          Part IV Polynomial Model Evaluation · RMSE: 14.92
                        </p>
                      </div>
                    </div>

                    <div className="space-y-0.5 text-xs">
                      <div className="flex justify-between py-0.5 border-b border-slate-100 text-[11px]">
                        <span className="text-slate-500">Instructors Available:</span>
                        <strong className="text-slate-900">{termData.availableFaculty} Regular Staff</strong>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-slate-100 text-[11px]">
                        <span className="text-slate-500">Sections Required:</span>
                        <strong className="text-slate-900">{termData.sectionsNeeded} Sections</strong>
                      </div>
                      <div className={`flex justify-between py-1 px-2 rounded-lg text-[11px] font-bold border ${
                        termData.facultyShortage < 0
                          ? "bg-rose-50 text-[#8a1538] border-rose-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}>
                        <span>Staffing Balance:</span>
                        <span>{termData.facultyShortage < 0 ? `${termData.facultyShortage} Shortage (Adjuncts Needed)` : "Fully Staffed (0 Gap)"}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* ── ROW: Student Year-Level Distribution + SETE Dimensions ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 break-inside-avoid">
            {/* Year-Level Distribution with Centered Count inside Donut */}
            <div className="bg-white/95 rounded-2xl border border-slate-200/80 shadow-xs p-3.5 flex flex-col">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Student Year-Level Distribution</h3>
                  <p className="text-[10px] text-slate-500">Enrollment count across 1st to 4th year · [Student Portal]</p>
                </div>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                  {termData.totalEnrolled.toLocaleString()} Enrolled
                </span>
              </div>

              {/* Donut Chart with Centered Number & Tap-to-Filter */}
              <div className="relative h-[155px] min-w-0 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={140}>
                  <PieChart>
                    <Pie
                      data={baseTermData.yearLevels}
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="count"
                      cursor="pointer"
                      onClick={(entry: any) => {
                        if (entry && entry.name) {
                          setSelectedYearLevel(selectedYearLevel === entry.name ? "All Year Levels" : entry.name);
                        }
                      }}
                    >
                      {baseTermData.yearLevels.map((e, i) => (
                        <Cell
                          key={i}
                          fill={e.color}
                          stroke={selectedYearLevel === e.name ? "#0f172a" : "#ffffff"}
                          strokeWidth={selectedYearLevel === e.name ? 2.5 : 1}
                          className="cursor-pointer hover:opacity-80 transition"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }: any) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="bg-white/95 px-3 py-1.5 rounded-xl shadow-lg border border-slate-200 text-xs">
                              <p className="font-bold text-slate-800">{item.name}</p>
                              <p className="text-slate-600 font-medium">{item.count} students ({item.percent})</p>
                              <p className="text-[9px] text-[#8a1538] font-bold mt-0.5">Click slice to filter</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Total number displayed inside the center of the donut hole */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-none">
                    {filteredYearLevels.reduce((acc, curr) => acc + curr.count, 0).toLocaleString()}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                    {selectedYearLevel === "All Year Levels" ? "Students" : selectedYearLevel}
                  </span>
                </div>
              </div>

              {/* Clickable Legend Pills (Acts as mobile-friendly filter buttons) */}
              <div className="grid grid-cols-2 gap-1.5 mt-auto pt-2 border-t border-slate-100 text-[11px]">
                {baseTermData.yearLevels.map((c) => {
                  const isSelected = selectedYearLevel === c.name;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedYearLevel(isSelected ? "All Year Levels" : c.name)}
                      className={`flex items-center justify-between p-1 rounded-lg border text-left transition cursor-pointer ${
                        isSelected
                          ? "bg-rose-50 border-[#8a1538]/60 ring-1 ring-[#8a1538]/40 shadow-xs"
                          : "bg-slate-50 border-slate-100 hover:bg-slate-100/80"
                      }`}
                      title={`Click to filter dashboard to ${c.name}`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                        <span className={`font-medium ${isSelected ? "text-[#8a1538] font-bold" : "text-slate-600"}`}>
                          {c.name}
                        </span>
                      </div>
                      <strong className="text-slate-900">{c.count}</strong>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SETE Evaluation Dimensions (Interactive: Cross-filters to individual teacher upon clicking faculty table) */}
            <div className="bg-white/95 rounded-2xl border border-slate-200/80 shadow-xs p-3.5 flex flex-col">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Teaching Quality (SETE) Dimensions</h3>
                    {selectedFaculty && (
                      <span className="text-[9px] font-bold bg-[#8a1538]/10 text-[#8a1538] px-1.5 py-0.2 rounded-full border border-[#8a1538]/20">
                        {selectedFaculty.instructorAlias}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500">
                    {selectedFaculty ? `Individual rating for ${selectedFaculty.title}` : "Student evaluation average by pedagogical criterion"} · Target ≥85%
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {selectedFaculty ? (
                    <button
                      onClick={() => setSelectedFacultyId(null)}
                      className="text-[10px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-full transition print:hidden"
                    >
                      Reset to Dept Avg
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowFeedbackModal(true)}
                      className="text-[10px] font-bold text-purple-800 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full hover:bg-purple-100 transition print:hidden"
                    >
                      Student Comment Themes &amp; Sentiment Tagging (Proposed) →
                    </button>
                  )}
                </div>
              </div>

              {/* Dynamic SETE Dimensions List (Displays individual scores when teacher row clicked) */}
              <div className="space-y-2 flex-1">
                {displayedSeteDimensions.map((c) => (
                  <div key={c.name}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="font-medium text-slate-700">{c.name} ({c.code})</span>
                      <span className={`font-bold ${c.score < 85 ? "text-amber-700" : "text-emerald-700"}`}>{c.score}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${c.score < 85 ? "bg-amber-500" : "bg-[#8a1538]"}`}
                        style={{ width: `${c.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-2.5 pt-1.5 border-t border-slate-100 text-[9.5px] text-slate-500 leading-snug">
                {selectedFaculty ? (
                  <span>
                    <strong>Instructor Evaluation:</strong> Overall SETE Score: <strong>{selectedFaculty.overallScore.toFixed(1)}%</strong> ({selectedFaculty.instructorAlias}). Click any other cluster below to inspect.
                  </span>
                ) : (
                  <span>
                    <strong>SETE Evidence Note:</strong> Response Rate: <strong>84.6%</strong> ({Math.round(termData.totalEnrolled * 0.846).toLocaleString()} / {termData.totalEnrolled.toLocaleString()} students). Click any faculty row below to inspect individual ratings.
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* ── BOTTOM ROW: Anonymized Workload + Section Breaches + Bottlenecks ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 break-inside-avoid">
            {/* Anonymized Faculty Workload Table (Click row to inspect individual SETE) */}
            <div className="lg:col-span-2 bg-white/95 rounded-2xl border border-slate-200/80 shadow-xs p-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Faculty Teaching Load &amp; Cluster Allocation</h3>
                  <p className="text-[10px] text-slate-500">Click a faculty row to inspect individual SETE scores · Standard: 18 units</p>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">{selectedYear}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400">
                      <th className="pb-1.5 pr-2">Instructional Cluster / Faculty</th>
                      <th className="pb-1.5 text-center pr-2">Type</th>
                      <th className="pb-1.5 text-center pr-2">Sec</th>
                      <th className="pb-1.5 text-center pr-2">Units</th>
                      <th className="pb-1.5 text-right">Load Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredFaculty.map((f, i) => {
                      const isRowSelected = selectedFacultyId === f.id;
                      return (
                        <tr
                          key={i}
                          onClick={() => setSelectedFacultyId(isRowSelected ? null : f.id)}
                          className={`transition cursor-pointer ${
                            isRowSelected
                              ? "bg-rose-50/80 border-l-2 border-l-[#8a1538]"
                              : "hover:bg-slate-50/70"
                          }`}
                          title="Click to view individual SETE evaluation ratings in chart above"
                        >
                          <td className="py-2 pr-2 font-semibold text-slate-900 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span>{f.title}</span>
                              {isRowSelected && (
                                <span className="text-[8.5px] font-bold text-[#8a1538] bg-rose-100 px-1.5 py-0.2 rounded-full border border-rose-200">
                                  SETE Active ({f.overallScore}%)
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-2 pr-2 text-center text-slate-500">{f.courseType}</td>
                          <td className="py-2 pr-2 text-center font-bold">{f.sections}</td>
                          <td className="py-2 pr-2 text-center font-bold">{f.units}</td>
                          <td className="py-2 text-right"><StatusBadge status={f.status} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Section Failure Rates (%) & Bottleneck Courses */}
            <div className="space-y-3">
              {/* Flagged Sections with clear breach labels */}
              <div className="bg-white/95 rounded-2xl border border-slate-200/80 shadow-xs p-3.5">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 mb-2">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Flagged Class Sections</h3>
                    <p className="text-[10px] text-slate-500">Threshold: Section Midterm Failure &gt; 20%</p>
                  </div>
                  <span className="text-[9px] bg-red-50 text-red-800 font-bold border border-red-200 px-1.5 py-0.2 rounded-full">
                    {breachCount} Breached
                  </span>
                </div>
                <div className="space-y-1.5">
                  {filteredSections.map((sec, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                      <div>
                        <p className="font-semibold text-slate-900">{sec.name}</p>
                        <p className="text-[10px] text-slate-400">{sec.course} · {sec.failing}/{sec.total} at-risk</p>
                      </div>
                      <div className="text-right">
                        <span className={`font-black text-sm ${sec.rate >= 20 ? "text-red-700" : "text-amber-700"}`}>
                          {sec.rate.toFixed(1)}%
                        </span>
                        <p className="text-[9px]">
                          <span className={`px-1 rounded-sm font-semibold ${sec.rate >= 20 ? "bg-red-100 text-red-800" : "bg-slate-200 text-slate-700"}`}>
                            {sec.rate >= 20 ? "Critical" : "Watch"}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottleneck Courses */}
              <div className="bg-white/95 rounded-2xl border border-slate-200/80 shadow-xs p-3.5">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 mb-2">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">High-Failure Prerequisite Courses</h3>
                    <p className="text-[10px] text-slate-500">Midterm failure rates across sections</p>
                  </div>
                  <span className="text-[9px] bg-red-50 text-red-800 font-bold border border-red-200 px-1.5 py-0.2 rounded-full">Curriculum Bottleneck</span>
                </div>
                <div className="space-y-1.5">
                  {filteredBottlenecks.map((s) => (
                    <div key={s.code} className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                      <div className="flex justify-between text-xs font-bold mb-0.5">
                        <span className="text-slate-800">{s.code} — {s.name}</span>
                        <span className={s.failRate >= 20 ? "text-red-700" : "text-slate-600"}>{s.failRate}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full ${s.failRate >= 20 ? "bg-[#8a1538]" : "bg-emerald-500"}`} style={{ width: `${(s.failRate / 30) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ══ KPI DETAIL / FORMULA MODAL ══ */}
      {modalKpi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm print:hidden">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-start pb-2 border-b border-slate-100">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">KPI {modalKpi.id} Specification</span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">{modalKpi.name}</h3>
              </div>
              <button onClick={() => setModalKpi(null)} className="text-slate-400 hover:text-slate-700 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Objective</p>
                <p className="text-slate-800 leading-relaxed">{modalKpi.objective}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800">
                <p className="text-[9px] font-sans font-bold text-slate-400 uppercase mb-0.5">Computational Formula</p>
                {modalKpi.formula}
              </div>
              <div className="flex justify-between items-center px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500">Institutional Target Standard:</span>
                <strong className="text-slate-900 text-sm">{modalKpi.target}</strong>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                <p className="text-[9px] font-bold uppercase text-emerald-700 mb-0.5">Management Action Protocol</p>
                {modalKpi.action}
              </div>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                <strong>Data Source:</strong> {modalKpi.sourceTag}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setActiveKpiId(modalKpi.id);
                  setModalKpi(null);
                }}
                className="flex-1 py-2 bg-[#8a1538] hover:bg-[#70102d] text-white rounded-xl text-xs font-semibold transition"
              >
                Plot Multi-Semester Trend
              </button>
              <button
                onClick={() => setModalKpi(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ INTERVENTION CHECKLIST MODAL (3 Protocols) ══ */}
      {showIntervention && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm print:hidden">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Program Chair Action Checklist (3 Protocols)</h3>
                <p className="text-[10px] text-slate-500">Prescriptive interventions based on institutional thresholds</p>
              </div>
              <button onClick={() => setShowIntervention(false)} className="text-slate-400 hover:text-slate-700 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              {[
                {
                  title: breachCount > 0
                    ? `Protocol 1: Midterm Failure Audit — ${breachedSections.map(s => `${s.course} (${s.name} @ ${s.rate.toFixed(1)}%)`).join(", ")}`
                    : "Protocol 1: Midterm Failure Audit — No Threshold Breaches",
                  badge: `${breachCount} Sections Breached > 20%`,
                  color: breachCount > 0 ? "red" : "slate",
                  body: breachCount > 0
                    ? `Course-level failure rates are driven by specific sections: ${breachedSections.map(s => `${s.course} (${s.name}: ${s.failing}/${s.total} failing, ${s.rate.toFixed(1)}%)`).join("; ")}. Chair action: Audit exam-to-syllabus alignment, require 2-hour weekly consultation hours, and activate student peer tutoring before finals.`
                    : "All evaluated class sections are maintaining midterm failure rates within the institutional standard (≤ 20%). Continue monitoring through midterm grade encoding.",
                },
                {
                  title: `Protocol 2: Faculty Staffing Requisition (${termData.facultyShortage < 0 ? `${termData.facultyShortage} Gap` : "Balanced"})`,
                  badge: termData.facultyShortage < 0 ? "Capacity Deficit" : "Fully Staffed",
                  color: termData.facultyShortage < 0 ? "amber" : "slate",
                  body: `Academic enrollment indicates ${termData.sectionsNeeded} required course sections. Available departmental regular faculty cover ${termData.availableFaculty} sections. ${
                    termData.facultyShortage < 0
                      ? `Endorse a formal hiring requisition to the Dean for ${Math.abs(termData.facultyShortage)} part-time instructors (adjuncts) 2 weeks prior to enrollment encoding.`
                      : `Teaching load is fully covered with existing departmental faculty.`
                  }`,
                },
                {
                  title: "Protocol 3: Faculty Development Support — Pacing (81.6%) & Grading (84.2%)",
                  badge: "Pedagogical Mentorship",
                  color: "slate",
                  body: "SETE scores for Classroom Pacing (81.6%) and Assessment Fairness (84.2%) fell below the 85.0% target. Provide faculty development support, conduct peer classroom observation, and rebalance lab workload schedules.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={`p-3.5 rounded-xl border ${
                    item.color === "red"
                      ? "bg-red-50   border-red-200   text-red-900"
                      : item.color === "amber"
                      ? "bg-amber-50 border-amber-200 text-amber-900"
                      : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <strong className="block text-xs">{item.title}</strong>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white border border-current shrink-0">
                      {item.badge}
                    </span>
                  </div>
                  <p className="leading-relaxed text-[11px]">{item.body}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowIntervention(false)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition"
            >
              Close Action Plan
            </button>
          </div>
        </div>
      )}

      {/* ══ ANONYMIZED STUDENT COMMENTS WITH NLP SENTIMENT CLASSIFICATION ══ */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm print:hidden">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Student Comment Themes &amp; Sentiment Tagging (Proposed)</h3>
                <p className="text-[10px] text-slate-500">
                  Student &amp; faculty identity stripped per RA 10173 · Automatic sentiment tagging
                </p>
              </div>
              <button onClick={() => setShowFeedbackModal(false)} className="text-slate-400 hover:text-slate-700 text-xl leading-none">×</button>
            </div>

            {/* NLP Sentiment Filter Pills */}
            <div className="flex items-center gap-1.5 text-[11px] bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setSentimentFilter("all")}
                className={`px-2.5 py-1 rounded-lg transition font-medium ${sentimentFilter === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
              >
                All Comments (4)
              </button>
              <button
                onClick={() => setSentimentFilter("positive")}
                className={`px-2.5 py-1 rounded-lg transition font-medium ${sentimentFilter === "positive" ? "bg-white text-emerald-800 shadow-xs" : "text-emerald-700 hover:bg-emerald-50"}`}
              >
                Positive (1)
              </button>
              <button
                onClick={() => setSentimentFilter("negative")}
                className={`px-2.5 py-1 rounded-lg transition font-medium ${sentimentFilter === "negative" ? "bg-white text-red-800 shadow-xs" : "text-red-700 hover:bg-red-50"}`}
              >
                Action Required (2)
              </button>
              <button
                onClick={() => setSentimentFilter("neutral")}
                className={`px-2.5 py-1 rounded-lg transition font-medium ${sentimentFilter === "neutral" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
              >
                Observation (1)
              </button>
            </div>

            {/* Comments List with Sentiment Colors */}
            <div className="space-y-2.5 text-xs">
              {filteredFeedback.map((fb, idx) => {
                const isPos = fb.sentiment === "positive";
                const isNeg = fb.sentiment === "negative";

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs space-y-1 transition ${
                      isNeg
                        ? "bg-rose-50/70 border-rose-200 text-slate-800"
                        : isPos
                        ? "bg-emerald-50/70 border-emerald-200 text-slate-800"
                        : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-[#8a1538]">{fb.category}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold border ${
                          isNeg
                            ? "bg-red-100 text-red-800 border-red-200"
                            : isPos
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : "bg-slate-200 text-slate-700 border-slate-300"
                        }`}
                      >
                        {fb.sentimentLabel} ({fb.nlpScore > 0 ? `+${fb.nlpScore}` : fb.nlpScore})
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">{fb.theme}</p>
                    <p className="italic text-[11px] leading-relaxed pt-0.5">
                      &ldquo;{fb.comment}&rdquo;
                    </p>
                  </div>
                );
              })}
            </div>

            <p className="text-[10px] text-slate-500 bg-amber-50 p-2.5 rounded-xl border border-amber-200 leading-snug">
              <strong>Chair Protocol:</strong> Qualitative NLP feedback must be addressed as thematic curriculum improvements during department meetings, never as individual punitive measures.
            </p>

            <button
              onClick={() => setShowFeedbackModal(false)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition"
            >
              Close Feedback Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
