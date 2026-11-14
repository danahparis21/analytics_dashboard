"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, ReferenceLine,
} from "recharts";
import {
  GraduationCap, AlertTriangle, Calendar, ChevronRight, Layers,
  BookOpen, Printer, Search, Users, Info, Filter, MessageSquareQuote,
  Check, X, Briefcase, Smile, Frown, Meh, Menu, User,
} from "lucide-react";

// ─── PALETTE ─────────────────────────────────────────────────────────────────
// Red    #8A1538  brand + critical
// Black  neutral-900  text, primary buttons
// Gray   neutral-*    everything else
// Yellow #F2B705  watch / emphasis only

const RED = "#8A1538";
const YELLOW = "#F2B705";
const YEAR_COLORS = [RED, "#171717", "#8A8D93", "#CFD0D4"];

// ─── TYPES & DATA STORE ──────────────────────────────────────────────────────

interface TermData {
  totalEnrolled: number;
  availableFaculty: number;
  sectionsNeeded: number;
  facultyShortage: number; // Negative = shortage
  isCurrentOrFuture: boolean;
  kpis: {
    passingRate: { value: string; delta: string; positive: boolean; num: number };
    atRiskRate: { value: string; delta: string; positive: boolean; num: number };
    retentionRate: { value: string; delta: string; positive: boolean; num: number };
    seteScore: { value: string; delta: string; positive: boolean; num: number };
    attendanceRate: { value: string; delta: string; positive: boolean; num: number };
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
      passingRate: { value: "91.9%", delta: "+0.5%", positive: true, num: 91.9 },
      atRiskRate: { value: "13.8%", delta: "-0.6%", positive: false, num: 13.8 },
      retentionRate: { value: "92.9%", delta: "+0.4%", positive: true, num: 92.9 },
      seteScore: { value: "86.8%", delta: "+0.6%", positive: true, num: 86.8 },
      attendanceRate: { value: "97.1%", delta: "+0.3%", positive: true, num: 97.1 },
    },
    yearLevels: [
      { name: "1st Year", count: 430, percent: "30%", color: "#8a1538" },
      { name: "2nd Year", count: 385, percent: "27%", color: "#b87333" },
      { name: "3rd Year", count: 335, percent: "24%", color: "#0f766e" },
      { name: "4th Year", count: 270, percent: "19%", color: "#64748b" },
    ],
    seteDimensions: [
      { code: "SC", name: "Syllabus Coverage", score: 92.1 },
      { code: "AC", name: "Student Consultation", score: 89.4 },
      { code: "IC", name: "Instructional Clarity", score: 88.5 },
      { code: "AG", name: "Assessment Fairness", score: 84.2 },
      { code: "PT", name: "Classroom Pacing", score: 81.6 },
    ],
    flaggedSections: [
      { name: "BSIT 2-1 Section", course: "CS 211 Object-Oriented Programming", courseType: "Major", failing: 18, total: 40, rate: 45.0 },
      { name: "BSIT 2-3 Section", course: "CS 211 Object-Oriented Programming", courseType: "Major", failing: 14, total: 38, rate: 36.8 },
      { name: "BSIT 3-2 Section", course: "IT 314 Web Systems and Technologies", courseType: "Major", failing: 12, total: 36, rate: 33.3 },
      { name: "BSIT 1-2 Section", course: "GEd 102 Mathematics in the Modern World", courseType: "GenEd", failing: 8, total: 42, rate: 19.0 },
    ],
    bottleneckCourses: [
      { code: "CS 211", name: "Object-Oriented Programming", courseType: "Major", failRate: 23.4, students: 184 },
      { code: "IT 314", name: "Web Systems and Technologies", courseType: "Major", failRate: 21.8, students: 162 },
      { code: "GEd 102", name: "Mathematics in the Modern World", courseType: "GenEd", failRate: 19.1, students: 190 },
    ],
  },
  "AY 2026–2027_Semester 2": {
    totalEnrolled: 1490,
    availableFaculty: 35,
    sectionsNeeded: 40,
    facultyShortage: -5,
    isCurrentOrFuture: true,
    kpis: {
      passingRate: { value: "92.0%", delta: "+0.6%", positive: true, num: 92.0 },
      atRiskRate: { value: "13.5%", delta: "-0.3%", positive: false, num: 13.5 },
      retentionRate: { value: "93.1%", delta: "+0.6%", positive: true, num: 93.1 },
      seteScore: { value: "89.2%", delta: "+0.6%", positive: true, num: 89.2 },
      attendanceRate: { value: "97.1%", delta: "+0.3%", positive: true, num: 97.1 },
    },
    yearLevels: [
      { name: "1st Year", count: 450, percent: "30%", color: "#8a1538" },
      { name: "2nd Year", count: 405, percent: "27%", color: "#b87333" },
      { name: "3rd Year", count: 350, percent: "24%", color: "#0f766e" },
      { name: "4th Year", count: 285, percent: "19%", color: "#64748b" },
    ],
    seteDimensions: [
      { code: "SC", name: "Syllabus Coverage", score: 92.5 },
      { code: "AC", name: "Student Consultation", score: 89.8 },
      { code: "IC", name: "Instructional Clarity", score: 89.0 },
      { code: "AG", name: "Assessment Fairness", score: 85.0 },
      { code: "PT", name: "Classroom Pacing", score: 82.4 },
    ],
    flaggedSections: [
      { name: "BSIT 2-2 Section", course: "IT 222 Advanced Database Management System", courseType: "Major", failing: 13, total: 39, rate: 33.3 },
      { name: "BSIT 3-1 Section", course: "IT 322 Advanced Systems Integration and Architecture", courseType: "Major", failing: 11, total: 35, rate: 31.4 },
    ],
    bottleneckCourses: [
      { code: "IT 222", name: "Advanced Database Management System", courseType: "Major", failRate: 20.5, students: 175 },
      { code: "IT 322", name: "Advanced Systems Integration and Architecture", courseType: "Major", failRate: 19.8, students: 155 },
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
      passingRate: { value: "91.0%", delta: "+0.4%", positive: true, num: 91.0 },
      atRiskRate: { value: "15.0%", delta: "-0.8%", positive: false, num: 15.0 },
      retentionRate: { value: "92.1%", delta: "+0.6%", positive: true, num: 92.1 },
      seteScore: { value: "85.7%", delta: "+0.4%", positive: true, num: 85.7 },
      attendanceRate: { value: "96.5%", delta: "+0.5%", positive: true, num: 96.5 },
    },
    yearLevels: [
      { name: "1st Year", count: 395, percent: "30%", color: "#8a1538" },
      { name: "2nd Year", count: 355, percent: "27%", color: "#b87333" },
      { name: "3rd Year", count: 310, percent: "24%", color: "#0f766e" },
      { name: "4th Year", count: 250, percent: "19%", color: "#64748b" },
    ],
    seteDimensions: [
      { code: "SC", name: "Syllabus Coverage", score: 91.0 },
      { code: "AC", name: "Student Consultation", score: 88.2 },
      { code: "IC", name: "Instructional Clarity", score: 87.4 },
      { code: "AG", name: "Assessment Fairness", score: 83.1 },
      { code: "PT", name: "Classroom Pacing", score: 80.5 },
    ],
    flaggedSections: [
      { name: "BSIT 2-1 Section", course: "CS 211 Object-Oriented Programming", courseType: "Major", failing: 15, total: 38, rate: 39.5 },
      { name: "BSIT 3-1 Section", course: "IT 314 Web Systems and Technologies", courseType: "Major", failing: 10, total: 34, rate: 29.4 },
    ],
    bottleneckCourses: [
      { code: "CS 211", name: "Object-Oriented Programming", courseType: "Major", failRate: 22.1, students: 170 },
      { code: "IT 314", name: "Web Systems and Technologies", courseType: "Major", failRate: 20.4, students: 150 },
    ],
  },
  "AY 2025–2026_Semester 2": {
    totalEnrolled: 1340,
    availableFaculty: 35,
    sectionsNeeded: 36,
    facultyShortage: -1,
    isCurrentOrFuture: false,
    kpis: {
      passingRate: { value: "91.4%", delta: "+0.4%", positive: true, num: 91.4 },
      atRiskRate: { value: "14.4%", delta: "-0.6%", positive: true, num: 14.4 },
      retentionRate: { value: "92.5%", delta: "+0.4%", positive: true, num: 92.5 },
      seteScore: { value: "86.2%", delta: "+0.5%", positive: true, num: 86.2 },
      attendanceRate: { value: "96.8%", delta: "+0.3%", positive: true, num: 96.8 },
    },
    yearLevels: [
      { name: "1st Year", count: 405, percent: "30%", color: "#8a1538" },
      { name: "2nd Year", count: 365, percent: "27%", color: "#b87333" },
      { name: "3rd Year", count: 315, percent: "24%", color: "#0f766e" },
      { name: "4th Year", count: 255, percent: "19%", color: "#64748b" },
    ],
    seteDimensions: [
      { code: "SC", name: "Syllabus Coverage", score: 91.8 },
      { code: "AC", name: "Student Consultation", score: 88.9 },
      { code: "IC", name: "Instructional Clarity", score: 88.0 },
      { code: "AG", name: "Assessment Fairness", score: 83.8 },
      { code: "PT", name: "Classroom Pacing", score: 81.2 },
    ],
    flaggedSections: [
      { name: "BSIT 2-3 Section", course: "IT 222 Advanced Database Management System", courseType: "Major", failing: 14, total: 37, rate: 37.8 },
    ],
    bottleneckCourses: [
      { code: "IT 222", name: "Advanced Database Management System", courseType: "Major", failRate: 21.5, students: 165 },
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
      passingRate: { value: "89.9%", delta: "+0.7%", positive: false, num: 89.9 },
      atRiskRate: { value: "16.5%", delta: "-0.9%", positive: false, num: 16.5 },
      retentionRate: { value: "90.8%", delta: "+0.7%", positive: true, num: 90.8 },
      seteScore: { value: "82.4%", delta: "+0.4%", positive: false, num: 82.4 },
      attendanceRate: { value: "95.5%", delta: "+0.6%", positive: true, num: 95.5 },
    },
    yearLevels: [
      { name: "1st Year", count: 360, percent: "30%", color: "#8a1538" },
      { name: "2nd Year", count: 320, percent: "27%", color: "#b87333" },
      { name: "3rd Year", count: 280, percent: "24%", color: "#0f766e" },
      { name: "4th Year", count: 220, percent: "19%", color: "#64748b" },
    ],
    seteDimensions: [
      { code: "SC", name: "Syllabus Coverage", score: 89.5 },
      { code: "AC", name: "Student Consultation", score: 86.8 },
      { code: "IC", name: "Instructional Clarity", score: 86.2 },
      { code: "AG", name: "Assessment Fairness", score: 82.0 },
      { code: "PT", name: "Classroom Pacing", score: 79.5 },
    ],
    flaggedSections: [
      { name: "BSIT 2-1 Section", course: "CS 211 Object-Oriented Programming", courseType: "Major", failing: 16, total: 35, rate: 45.7 },
      { name: "BSIT 1-2 Section", course: "GEd 102 Mathematics in the Modern World", courseType: "GenEd", failing: 10, total: 38, rate: 26.3 },
    ],
    bottleneckCourses: [
      { code: "CS 211", name: "Object-Oriented Programming", courseType: "Major", failRate: 24.5, students: 160 },
      { code: "GEd 102", name: "Mathematics in the Modern World", courseType: "GenEd", failRate: 22.0, students: 175 },
    ],
  },
  "AY 2024–2025_Semester 2": {
    totalEnrolled: 1250,
    availableFaculty: 34,
    sectionsNeeded: 34,
    facultyShortage: 0,
    isCurrentOrFuture: false,
    kpis: {
      passingRate: { value: "90.6%", delta: "+0.7%", positive: true, num: 90.6 },
      atRiskRate: { value: "15.4%", delta: "-1.1%", positive: false, num: 15.4 },
      retentionRate: { value: "91.5%", delta: "+0.7%", positive: true, num: 91.5 },
      seteScore: { value: "85.3%", delta: "+2.9%", positive: true, num: 85.3 },
      attendanceRate: { value: "96.0%", delta: "+0.5%", positive: true, num: 96.0 },
    },
    yearLevels: [
      { name: "1st Year", count: 380, percent: "30%", color: "#8a1538" },
      { name: "2nd Year", count: 340, percent: "27%", color: "#b87333" },
      { name: "3rd Year", count: 295, percent: "24%", color: "#0f766e" },
      { name: "4th Year", count: 235, percent: "19%", color: "#64748b" },
    ],
    seteDimensions: [
      { code: "SC", name: "Syllabus Coverage", score: 90.2 },
      { code: "AC", name: "Student Consultation", score: 87.5 },
      { code: "IC", name: "Instructional Clarity", score: 87.0 },
      { code: "AG", name: "Assessment Fairness", score: 82.8 },
      { code: "PT", name: "Classroom Pacing", score: 80.1 },
    ],
    flaggedSections: [
      { name: "BSIT 2-2 Section", course: "IT 222 Advanced Database Management System", courseType: "Major", failing: 12, total: 36, rate: 33.3 },
    ],
    bottleneckCourses: [
      { code: "IT 222", name: "Advanced Database Management System", courseType: "Major", failRate: 21.0, students: 155 },
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
      passingRate: { value: "88.4%", delta: "Baseline", positive: false, num: 88.4 },
      atRiskRate: { value: "18.2%", delta: "Baseline", positive: false, num: 18.2 },
      retentionRate: { value: "89.6%", delta: "Baseline", positive: false, num: 89.6 },
      seteScore: { value: "80.0%", delta: "Baseline", positive: false, num: 80.0 },
      attendanceRate: { value: "94.2%", delta: "Baseline", positive: false, num: 94.2 },
    },
    yearLevels: [
      { name: "1st Year", count: 315, percent: "30%", color: "#8a1538" },
      { name: "2nd Year", count: 280, percent: "27%", color: "#b87333" },
      { name: "3rd Year", count: 250, percent: "24%", color: "#0f766e" },
      { name: "4th Year", count: 195, percent: "19%", color: "#64748b" },
    ],
    seteDimensions: [
      { code: "SC", name: "Syllabus Coverage", score: 88.0 },
      { code: "AC", name: "Student Consultation", score: 85.0 },
      { code: "IC", name: "Instructional Clarity", score: 84.5 },
      { code: "AG", name: "Assessment Fairness", score: 80.5 },
      { code: "PT", name: "Classroom Pacing", score: 77.8 },
    ],
    flaggedSections: [
      { name: "BSIT 2-1 Section", course: "CS 211 Object-Oriented Programming", courseType: "Major", failing: 17, total: 34, rate: 50.0 },
    ],
    bottleneckCourses: [
      { code: "CS 211", name: "Object-Oriented Programming", courseType: "Major", failRate: 26.2, students: 145 },
    ],
  },
  "AY 2023–2024_Semester 2": {
    totalEnrolled: 1110,
    availableFaculty: 32,
    sectionsNeeded: 30,
    facultyShortage: 0,
    isCurrentOrFuture: false,
    kpis: {
      passingRate: { value: "89.2%", delta: "+0.8%", positive: false, num: 89.2 },
      atRiskRate: { value: "17.4%", delta: "-0.8%", positive: false, num: 17.4 },
      retentionRate: { value: "90.1%", delta: "+0.5%", positive: true, num: 90.1 },
      seteScore: { value: "81.8%", delta: "+1.8%", positive: false, num: 81.8 },
      attendanceRate: { value: "94.9%", delta: "+0.7%", positive: false, num: 94.9 },
    },
    yearLevels: [
      { name: "1st Year", count: 335, percent: "30%", color: "#8a1538" },
      { name: "2nd Year", count: 300, percent: "27%", color: "#b87333" },
      { name: "3rd Year", count: 265, percent: "24%", color: "#0f766e" },
      { name: "4th Year", count: 210, percent: "19%", color: "#64748b" },
    ],
    seteDimensions: [
      { code: "SC", name: "Syllabus Coverage", score: 88.8 },
      { code: "AC", name: "Student Consultation", score: 85.9 },
      { code: "IC", name: "Instructional Clarity", score: 85.2 },
      { code: "AG", name: "Assessment Fairness", score: 81.3 },
      { code: "PT", name: "Classroom Pacing", score: 78.6 },
    ],
    flaggedSections: [
      { name: "BSIT 2-2 Section", course: "IT 222 Advanced Database Management System", courseType: "Major", failing: 13, total: 35, rate: 37.1 },
    ],
    bottleneckCourses: [
      { code: "IT 222", name: "Advanced Database Management System", courseType: "Major", failRate: 23.0, students: 150 },
    ],
  },
};

// Term-over-term changes are computed from the numbers above, so cards and charts never contradict each other.
(() => {
  const lowerIsBetter = new Set<string>(["atRiskRate"]);
  const keys = Object.keys(TERM_DATA_STORE).sort((a, b) => a.localeCompare(b));
  keys.forEach((key, i) => {
    const prev = i > 0 ? TERM_DATA_STORE[keys[i - 1]] : null;
    (Object.keys(TERM_DATA_STORE[key].kpis) as Array<keyof TermData["kpis"]>).forEach((k) => {
      const m = TERM_DATA_STORE[key].kpis[k];
      if (!prev) {
        m.delta = "Baseline";
        return;
      }
      const diff = Number((m.num - prev.kpis[k].num).toFixed(1));
      m.delta = `${diff > 0 ? "+" : ""}${diff.toFixed(1)}%`;
      m.positive = lowerIsBetter.has(k) ? diff <= 0 : diff >= 0;
    });
  });
})();

// Historical Actual vs Forecast Series
const ENROLLMENT_TIME_SERIES = [
  { term: "AY 2023–2024 Semester 1", short: "23-24 S1", actual: 1040, forecast: null, teachers: 30, sections: 28, gap: 0, isForecast: false, label: "Semester 1, AY 2023–2024" },
  { term: "AY 2023–2024 Semester 2", short: "23-24 S2", actual: 1110, forecast: null, teachers: 32, sections: 30, gap: 0, isForecast: false, label: "Semester 2, AY 2023–2024" },
  { term: "AY 2024–2025 Semester 1", short: "24-25 S1", actual: 1180, forecast: null, teachers: 32, sections: 32, gap: 0, isForecast: false, label: "Semester 1, AY 2024–2025" },
  { term: "AY 2024–2025 Semester 2", short: "24-25 S2", actual: 1250, forecast: null, teachers: 34, sections: 34, gap: 0, isForecast: false, label: "Semester 2, AY 2024–2025" },
  { term: "AY 2025–2026 Semester 1", short: "25-26 S1", actual: 1310, forecast: null, teachers: 35, sections: 35, gap: 0, isForecast: false, label: "Semester 1, AY 2025–2026" },
  { term: "AY 2025–2026 Semester 2", short: "25-26 S2", actual: 1340, forecast: 1340, teachers: 35, sections: 36, gap: 1, isForecast: false, label: "Semester 2, AY 2025–2026" },
  { term: "AY 2026–2027 Semester 1", short: "26-27 S1", actual: 1420, forecast: 1420, teachers: 35, sections: 38, gap: 3, isForecast: false, label: "Semester 1, AY 2026–2027" },
  { term: "AY 2026–2027 Semester 2", short: "26-27 S2", actual: null, forecast: 1490, teachers: 35, sections: 40, gap: 5, isForecast: true, label: "Semester 2, AY 2026–2027 (Forecast)" },
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
    sourceTag: "Student Portal",
    objective: "Shows how many students pass their courses.",
    formula: "(Students who passed ÷ Total enrolled) × 100",
    action: "Review the syllabus of courses with many failures, hold weekly consultation hours, and set up peer study groups.",
  },
  {
    id: 2,
    key: "atRiskRate",
    name: "At-Risk Student Rate",
    target: "≤ 10%",
    targetNum: 10,
    higherIsBetter: false,
    category: "academic",
    sourceTag: "Student Portal",
    objective: "Finds students who are failing at midterms so they can get help early.",
    formula: "(Students failing at midterms ÷ Total enrolled) × 100",
    action: "Send early warnings, require advising with instructors, and work with Guidance.",
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
    sourceTag: "Student Portal",
    objective: "Shows how many students come back the next semester.",
    formula: "(Students who re-enroll next term ÷ Enrolled at start of term) × 100",
    action: "Interview students who withdraw, check if grades or money is the cause, and work with Guidance.",
  },
  {
    id: 4,
    key: "seteScore",
    name: "Faculty Teaching (SETE)",
    target: "≥ 85%",
    targetNum: 85,
    higherIsBetter: true,
    category: "faculty",
    sourceTag: "SETE system (proposed)",
    objective: "Shows how students rate their teachers.",
    formula: "(Teachers rated 85% or higher ÷ Teachers evaluated) × 100",
    action: "Offer teaching support, do peer class visits, and review exam pacing.",
  },
  {
    id: 5,
    key: "attendanceRate",
    name: "Faculty Attendance Rate",
    target: "≥ 95%",
    targetNum: 95,
    higherIsBetter: true,
    category: "faculty",
    sourceTag: "Department logs and biometrics (proposed)",
    objective: "Makes sure classes are held as scheduled so lessons are finished before finals.",
    formula: "(Class hours held ÷ Scheduled class hours) × 100",
    action: "Require make-up classes, check room attendance logs, and balance heavy teaching loads.",
  },
];

type KpiDef = (typeof KPI_DEFINITIONS)[number];

const KPI_SHORT_NAMES: Record<number, string> = {
  1: "Passing",
  2: "At-risk",
  3: "Retention",
  4: "Teaching",
  5: "Attendance",
};

const KPI_ICONS: Record<number, typeof GraduationCap> = {
  1: GraduationCap,
  2: AlertTriangle,
  3: Users,
  4: BookOpen,
  5: Calendar,
};

// Anonymized Department Teaching Clusters (per RA 10173 privacy rules)
const ANONYMIZED_FACULTY_ROSTER = [
  {
    id: "CLUS-01",
    title: "Instructional Cluster 1 (Object-Oriented Programming)",
    courseCode: "CS 211",
    instructorAlias: "All sections (pooled)",
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
    title: "Instructional Cluster 2 (Database Management System)",
    courseCode: "IT 211",
    instructorAlias: "All sections (pooled)",
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
    title: "Instructional Cluster 3 (Mathematics in the Modern World)",
    courseCode: "GEd 102",
    instructorAlias: "All sections (pooled)",
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
    title: "Instructional Cluster 4 (Web Systems and Technologies)",
    courseCode: "IT 314",
    instructorAlias: "All sections (pooled)",
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
    title: "Instructional Cluster 5 (Systems Integration and Architecture)",
    courseCode: "IT 312",
    instructorAlias: "All sections (pooled)",
    courseType: "Major" as const,
    sections: 4,
    units: 18,
    status: "Full Load",
    overallScore: 87.5,
    seteDimensions: [
      { code: "SC", name: "Syllabus Coverage", score: 92.5 },
      { code: "AC", name: "Student Consultation", score: 89.0 },
      { code: "IC", name: "Instructional Clarity", score: 88.3 },
      { code: "AG", name: "Assessment Fairness", score: 85.0 },
      { code: "PT", name: "Classroom Pacing", score: 82.7 },
    ],
  },
  {
    id: "CLUS-06",
    title: "Instructional Cluster 6 (Information Assurance and Security)",
    courseCode: "IT 323",
    instructorAlias: "All sections (pooled)",
    courseType: "Major" as const,
    sections: 4,
    units: 18,
    status: "Full Load",
    overallScore: 88.2,
    seteDimensions: [
      { code: "SC", name: "Syllabus Coverage", score: 93.0 },
      { code: "AC", name: "Student Consultation", score: 90.2 },
      { code: "IC", name: "Instructional Clarity", score: 89.1 },
      { code: "AG", name: "Assessment Fairness", score: 86.4 },
      { code: "PT", name: "Classroom Pacing", score: 82.3 },
    ],
  },
  {
    id: "CLUS-07",
    title: "Instructional Cluster 7 (Application Development and Emerging Technologies)",
    courseCode: "IT 331",
    instructorAlias: "All sections (pooled)",
    courseType: "Major" as const,
    sections: 4,
    units: 18,
    status: "Full Load",
    overallScore: 85.9,
    seteDimensions: [
      { code: "SC", name: "Syllabus Coverage", score: 91.0 },
      { code: "AC", name: "Student Consultation", score: 87.5 },
      { code: "IC", name: "Instructional Clarity", score: 86.8 },
      { code: "AG", name: "Assessment Fairness", score: 83.5 },
      { code: "PT", name: "Classroom Pacing", score: 80.7 },
    ],
  },
  {
    id: "CLUS-08",
    title: "Instructional Cluster 8 (Capstone Project)",
    courseCode: "IT 324, IT 411",
    instructorAlias: "All sections (pooled)",
    courseType: "Major" as const,
    sections: 4,
    units: 18,
    status: "Full Load",
    overallScore: 91.4,
    seteDimensions: [
      { code: "SC", name: "Syllabus Coverage", score: 95.0 },
      { code: "AC", name: "Student Consultation", score: 93.0 },
      { code: "IC", name: "Instructional Clarity", score: 92.5 },
      { code: "AG", name: "Assessment Fairness", score: 89.0 },
      { code: "PT", name: "Classroom Pacing", score: 87.5 },
    ],
  },
  {
    id: "CLUS-09",
    title: "Staffing Deficit (Unassigned Section Blocks)",
    courseCode: "CS 211, IT 314, GEd 102",
    instructorAlias: "Needs 3 Part-Time Teachers",
    courseType: "Major" as const,
    sections: 3,
    units: 9,
    status: "Needs 3 Part-Time Teachers",
    overallScore: 85.0,
    seteDimensions: [
      { code: "SC", name: "Syllabus Coverage", score: 88.0 },
      { code: "AC", name: "Student Consultation", score: 84.0 },
      { code: "IC", name: "Instructional Clarity", score: 85.0 },
      { code: "AG", name: "Assessment Fairness", score: 82.0 },
      { code: "PT", name: "Classroom Pacing", score: 81.0 },
    ],
  },
];

// Sample response data per cluster (shown with every cluster SETE score)
const CLUSTER_RESPONSE: Record<string, { rate: number; n: number }> = {
  "CLUS-01": { rate: 82.4, n: 118 },
  "CLUS-02": { rate: 79.1, n: 106 },
  "CLUS-03": { rate: 86.0, n: 148 },
  "CLUS-04": { rate: 88.3, n: 121 },
  "CLUS-05": { rate: 47.5, n: 57 },
  "CLUS-06": { rate: 81.7, n: 103 },
  "CLUS-07": { rate: 84.2, n: 112 },
  "CLUS-08": { rate: 77.6, n: 94 },
  "CLUS-09": { rate: 80.0, n: 90 },
};

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
    theme: "2nd-Year Database Courses",
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
    theme: "Web Systems and Technologies",
    comment: "Very detailed coding demonstrations and helpful explanations of pointers and linked lists with clear grading rubrics.",
    sentiment: "positive",
    sentimentLabel: "Positive",
    nlpScore: 0.88,
  },
];

const KPI_INSIGHTS: Record<number, (v: string) => string> = {
  1: (v) => `${v} of enrolled students passed their courses.`,
  2: (v) => `${v} of students are failing or close to failing at midterm. Lower is better.`,
  3: (v) => `${v} of students come back the next semester.`,
  4: (v) => `${v} of evaluated teachers got a satisfactory student rating (85% or higher).`,
  5: (v) => `${v} of scheduled class hours were actually held.`,
};

const SETE_MEANING: Record<string, string> = {
  SC: "how much of the syllabus was covered on schedule",
  AC: "how available teachers are for consultation",
  IC: "how clearly lessons are explained",
  AG: "how fair exams and grading feel",
  PT: "how well the lesson pace fits students",
};

// Green = got better, red = got worse, gray = no change or baseline.
// For At-risk rate, a drop is an improvement, so it is green.
function deltaTone(delta: string, higherIsBetter = true) {
  const n = parseFloat(delta);
  if (Number.isNaN(n) || n === 0) return "text-neutral-500";
  const good = higherIsBetter ? n > 0 : n < 0;
  return good ? "font-medium text-[#15803D]" : "font-medium text-[#C62828]";
}

// ─── SEARCH: sections the search bar can jump to ────────────────────────────

type SearchTarget = {
  id: string;
  label: string;
  hint: string;
  keywords: string[];
  kind: "scroll" | "plan" | "comments" | "formulas";
};

const SEARCH_TARGETS: SearchTarget[] = [
  { id: "kpi-cards", label: "KPI cards", hint: "Section", keywords: ["passing", "at-risk", "retention", "attendance", "goal", "target", "kpi"], kind: "scroll" },
  { id: "trend-chart", label: "Enrollment trend", hint: "Section", keywords: ["students", "forecast", "chart", "semester", "growth"], kind: "scroll" },
  { id: "year-levels", label: "Students by year level", hint: "Section", keywords: ["donut", "cohort", "1st", "2nd", "3rd", "4th"], kind: "scroll" },
  { id: "high-failure-sections", label: "Sections with high failure", hint: "Section", keywords: ["flagged", "failing", "midterm"], kind: "scroll" },
  { id: "teaching-load", label: "Teaching load", hint: "Section", keywords: ["faculty", "teachers", "units", "clusters", "staffing", "shortage"], kind: "scroll" },
  { id: "sete-scores", label: "SETE scores", hint: "Section", keywords: ["evaluation", "teaching", "effectiveness", "response", "pacing", "clarity", "fairness", "consultation", "syllabus"], kind: "scroll" },
  { id: "high-failure-courses", label: "High-failure courses", hint: "Section", keywords: ["bottleneck", "courses", "fail"], kind: "scroll" },
  { id: "plan", label: "Action plan", hint: "Opens window", keywords: ["alerts", "warnings", "interventions", "steps"], kind: "plan" },
  { id: "comments", label: "Student comments", hint: "Opens window", keywords: ["feedback", "sentiment", "nlp"], kind: "comments" },
  { id: "formulas", label: "KPI formulas", hint: "Opens window", keywords: ["definitions", "computation"], kind: "formulas" },
];

// ─── SMALL SHARED PIECES ─────────────────────────────────────────────────────

// Short "Insight" bubble that shows when you hover its parent (needs class "group/tip relative" on the parent)
function TipBubble({ text, align = "center" }: { text: string; align?: "left" | "center" | "right" }) {
  const pos = align === "left" ? "left-0" : align === "right" ? "right-0" : "left-1/2 -translate-x-1/2";
  return (
    <span
      role="tooltip"
      className={`pointer-events-none absolute top-full z-40 mt-2 hidden w-56 rounded-lg bg-neutral-900 px-3 py-2 text-left text-xs font-normal leading-snug text-white shadow-lg md:group-hover/tip:block md:group-has-[:focus-visible]/tip:block ${pos}`}
    >
      <span className="mb-0.5 block text-[11px] font-medium text-neutral-400">Insight</span>
      {text}
    </span>
  );
}

function Tip({
  text,
  align = "center",
  className = "",
  children,
}: {
  text: string;
  align?: "left" | "center" | "right";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={`group/tip relative ${className}`}>
      {children}
      <TipBubble text={text} align={align} />
    </span>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0];
  const fullTerm: string = p.payload.term ?? label;
  const value = p.value;
  const isKpi = p.payload.target !== undefined;

  let note = "";
  if (isKpi) {
    const met = p.payload.higherIsBetter ? value >= p.payload.target : value <= p.payload.target;
    note = met ? `Meets the ${p.payload.target}% goal.` : `Misses the ${p.payload.target}% goal.`;
  } else if (fullTerm.includes("2026–2027 Semester 2")) {
    note = "Forecast. Needs 40 sections and 5 part-time teachers.";
  } else if (fullTerm.includes("2026–2027 Semester 1")) {
    note = "Current term. 38 sections, 3 teachers short.";
  } else if (fullTerm.includes("2025–2026")) {
    note = "Past term. Staffing was balanced.";
  }

  if (isKpi && fullTerm.includes("2026–2027 Semester 2")) note += " Projected, semester not yet complete.";

  return (
    <div className="max-w-[220px] rounded-lg bg-neutral-900 px-3 py-2 text-xs text-white shadow-lg">
      <p className="text-neutral-400">{fullTerm}</p>
      <p className="mt-0.5 text-base font-semibold tabular-nums">
        {value}
        {isKpi ? "%" : " students"}
      </p>
      {note && <p className="mt-1 text-[11px] leading-snug text-neutral-300">{note}</p>}
    </div>
  );
}

const STATUS_STYLE: Record<string, { label: string; dot: string; text: string }> = {
  "Full Load": { label: "Full load", dot: "bg-neutral-400", text: "text-neutral-600" },
  "Overloaded": { label: "Overloaded", dot: "bg-[#F2B705]", text: "text-neutral-900" },
  "Unassigned": { label: "Unassigned", dot: "bg-[#8A1538]", text: "text-[#8A1538]" },
  "Needs 3 Part-Time Teachers": { label: "Needs 3 teachers", dot: "bg-[#8A1538]", text: "font-semibold text-[#8A1538]" },
};

const STATUS_TIP: Record<string, string> = {
  "Full Load": "This cluster teaches 18 units, the standard load.",
  "Overloaded": "This cluster teaches more than the standard 18 units.",
  "Unassigned": "These sections do not have a teacher yet.",
  "Needs 3 Part-Time Teachers": "3 sections have no teacher yet. Hire 3 part-time teachers.",
};

function StatusLabel({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? { label: status, dot: "bg-neutral-400", text: "text-neutral-600" };
  return (
    <Tip align="right" text={STATUS_TIP[status] ?? s.label}>
      <span className={`inline-flex items-center gap-1.5 whitespace-nowrap text-xs ${s.text}`}>
        <span className={`h-2 w-2 rounded-full ${s.dot}`} />
        {s.label}
      </span>
    </Tip>
  );
}

function ModalShell({
  title,
  subtitle,
  onClose,
  headerExtra,
  children,
  widthClass = "sm:max-w-xl",
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
  widthClass?: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4 print:hidden"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`flex max-h-[92vh] w-full ${widthClass} flex-col overflow-hidden rounded-t-3xl bg-[#F1F2F4] shadow-2xl sm:rounded-3xl`}
      >
        <div className="shrink-0 bg-neutral-900 px-5 pb-4 pt-5 text-white">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold leading-tight">{title}</h3>
              {subtitle && <p className="mt-0.5 text-sm text-neutral-400">{subtitle}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-1.5 -mt-1.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-neutral-300 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {headerExtra}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">{children}</div>
      </div>
    </div>
  );
}


// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────

export default function Dashboard() {
  const [chartView, setChartView] = useState<"forecast" | "actual">("forecast");
  const [activeKpiId, setActiveKpiId] = useState<number | null>(null);
  const [modalKpi, setModalKpi] = useState<typeof KPI_DEFINITIONS[0] | null>(null);
  const [showIntervention, setShowIntervention] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [sentimentFilter, setSentimentFilter] = useState<"all" | "positive" | "negative" | "neutral">("all");
  const [selectedFacultyId, setSelectedFacultyId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  // Linked Global Filters
  const [selectedYear, setSelectedYear] = useState("AY 2026–2027");
  const [selectedSemester, setSelectedSemester] = useState("Semester 1");
  const [selectedYearLevel, setSelectedYearLevel] = useState("All Year Levels");
  const [selectedCourseType, setSelectedCourseType] = useState("All Courses");
  const [selectedTrendTerm, setSelectedTrendTerm] = useState<string | null>(null);

  // Sidebar collapsible state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Splash / Loading Screen (starts in red with logo fading in, then fades out to dashboard)
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);
  // showContent triggers entrance animations after splash disappears
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 1700);
    const removeTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2400);
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 2550);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedYear !== "AY 2026–2027") count++;
    if (selectedSemester !== "Semester 1") count++;
    if (selectedYearLevel !== "All Year Levels") count++;
    if (selectedCourseType !== "All Courses") count++;
    return count;
  }, [selectedYear, selectedSemester, selectedYearLevel, selectedCourseType]);

  const resetAllFilters = () => {
    setSelectedYear("AY 2026–2027");
    setSelectedSemester("Semester 1");
    setSelectedYearLevel("All Year Levels");
    setSelectedCourseType("All Courses");
  };

  // Close any open window with Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModalKpi(null);
        setShowIntervention(false);
        setShowFeedbackModal(false);
        setShowFilterModal(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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

    const filteredNow = selectedYearLevel !== "All Year Levels" || selectedCourseType !== "All Courses";
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
      shortage = Math.min(0, faculty - sections); // -1 (CS 211 section load)
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
          delta: filteredNow ? "—" : deltaPass,
          positive: passingNum >= 90,
          num: passingNum,
        },
        atRiskRate: {
          value: `${atRiskNum.toFixed(1)}%`,
          delta: filteredNow ? "—" : deltaRisk,
          positive: atRiskNum <= 10,
          num: atRiskNum,
        },
        retentionRate: {
          value: `${retentionNum.toFixed(1)}%`,
          delta: filteredNow ? "—" : baseTermData.kpis.retentionRate.delta,
          positive: retentionNum >= 90,
          num: retentionNum,
        },
        seteScore: {
          value: `${seteNum.toFixed(1)}%`,
          delta: filteredNow ? "—" : baseTermData.kpis.seteScore.delta,
          positive: seteNum >= 85,
          num: seteNum,
        },
        attendanceRate: {
          value: `${attendanceNum.toFixed(1)}%`,
          delta: filteredNow ? "—" : baseTermData.kpis.attendanceRate.delta,
          positive: attendanceNum >= 95,
          num: attendanceNum,
        },
      },
    };
  }, [baseTermData, selectedYearLevel, selectedCourseType]);

  // The current school year's Semester 2 has not started, so it cannot be selected
  const semester2Locked = TERM_DATA_STORE[`${selectedYear}_Semester 1`]?.isCurrentOrFuture === true;
  const isFilteredView = selectedYearLevel !== "All Year Levels" || selectedCourseType !== "All Courses";
  // Semester 2 of the current year has not finished yet, so its figures are projections
  const isProjected = baseTermData.isCurrentOrFuture && selectedSemester === "Semester 2";

  // Year-over-year enrollment change, computed from the enrollment series
  const yoyChange = useMemo(() => {
    const m = selectedYear.match(/(\d{4})–(\d{4})/);
    if (!m) return null;
    const prev = ENROLLMENT_TIME_SERIES.find(p => p.term === `AY ${Number(m[1]) - 1}–${Number(m[2]) - 1} ${selectedSemester}`);
    const cur = ENROLLMENT_TIME_SERIES.find(p => p.term === `${selectedYear} ${selectedSemester}`);
    if (!prev || !cur) return null;
    const c = cur.actual ?? cur.forecast;
    const pv = prev.actual ?? prev.forecast;
    if (!c || !pv) return null;
    return ((c - pv) / pv) * 100;
  }, [selectedYear, selectedSemester]);
  const yoyText =
    isFilteredView || yoyChange === null
      ? ""
      : ` That is ${Math.abs(yoyChange).toFixed(1)}% ${yoyChange >= 0 ? "more" : "fewer"} than the same semester last year.`;

  // Donut chart distribution
  const filteredYearLevels = useMemo(() => {
    if (selectedYearLevel === "All Year Levels") return baseTermData.yearLevels;
    return baseTermData.yearLevels.filter(y => y.name.toLowerCase().includes(selectedYearLevel.toLowerCase()));
  }, [baseTermData.yearLevels, selectedYearLevel]);

  // ── Search: jump to a section, and still filter courses ──
  const searchText = searchQuery.trim().toLowerCase();
  const sectionMatches = useMemo(() => {
    if (searchText.length < 2) return [] as SearchTarget[];
    const parts = searchText.split(/\s+/);
    return SEARCH_TARGETS.filter((t) => {
      const words = `${t.label} ${t.keywords.join(" ")}`.toLowerCase().split(/[\s/-]+/);
      return parts.every((part) => words.some((w) => w.startsWith(part)));
    });
  }, [searchText]);
  const hasCourseMatch = useMemo(() => {
    if (!searchText) return false;
    return (
      baseTermData.bottleneckCourses.some((c) => c.code.toLowerCase().includes(searchText) || c.name.toLowerCase().includes(searchText)) ||
      baseTermData.flaggedSections.some((x) => x.name.toLowerCase().includes(searchText) || x.course.toLowerCase().includes(searchText)) ||
      ANONYMIZED_FACULTY_ROSTER.some((f) => f.title.toLowerCase().includes(searchText))
    );
  }, [searchText, baseTermData]);
  // If the text names a section (like "SETE") and no course, leave the lists unfiltered
  const effectiveQuery = sectionMatches.length > 0 && !hasCourseMatch ? "" : searchQuery;

  // Secondary filters on Bottlenecks & Flagged Sections
  const filteredBottlenecks = useMemo(() => {
    let list = baseTermData.bottleneckCourses;
    if (selectedCourseType === "Major / Professional IT") {
      list = list.filter(c => c.courseType === "Major");
    } else if (selectedCourseType === "General Education") {
      list = list.filter(c => c.courseType === "GenEd");
    }
    if (effectiveQuery.trim()) {
      const q = effectiveQuery.toLowerCase();
      list = list.filter(c => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q));
    }
    return list;
  }, [baseTermData.bottleneckCourses, selectedCourseType, effectiveQuery]);

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
    if (effectiveQuery.trim()) {
      const q = effectiveQuery.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.course.toLowerCase().includes(q));
    }
    return list;
  }, [baseTermData.flaggedSections, selectedCourseType, selectedYearLevel, effectiveQuery]);

  const filteredFaculty = useMemo(() => {
    let list = ANONYMIZED_FACULTY_ROSTER;
    if (selectedCourseType === "Major / Professional IT") {
      list = list.filter(f => f.courseType === "Major");
    } else if (selectedCourseType === "General Education") {
      list = list.filter(f => f.courseType === "GenEd");
    }
    if (effectiveQuery.trim()) {
      const q = effectiveQuery.toLowerCase();
      list = list.filter(f => f.title.toLowerCase().includes(q));
    }
    return list;
  }, [selectedCourseType, effectiveQuery]);

  // Selected faculty cluster for individual SETE inspection
  const selectedFaculty = useMemo(() => {
    if (!selectedFacultyId) return null;
    return ANONYMIZED_FACULTY_ROSTER.find(f => f.id === selectedFacultyId) ?? null;
  }, [selectedFacultyId]);

  const selectedResponse = selectedFaculty ? CLUSTER_RESPONSE[selectedFaculty.id] ?? null : null;

  const displayedSeteDimensions = useMemo(() => {
    if (selectedFaculty) return selectedFaculty.seteDimensions;
    return baseTermData.seteDimensions;
  }, [selectedFaculty, baseTermData.seteDimensions]);

  // Sections above the 20% midterm failure line (whole term, used by alerts and action plan)
  const breachedSections = useMemo(() => {
    return baseTermData.flaggedSections.filter(s => s.rate >= 20.0);
  }, [baseTermData.flaggedSections]);

  // Same check, but only for the rows currently shown in the list
  const visibleBreachCount = useMemo(
    () => filteredSections.filter(s => s.rate >= 20.0).length,
    [filteredSections]
  );

  const shortCount = Math.abs(Math.min(0, termData.facultyShortage));

  // Active trend item for enrollment chart preview
  const activeTrendData = useMemo(() => {
    if (selectedTrendTerm) {
      const match = ENROLLMENT_TIME_SERIES.find(p => p.short === selectedTrendTerm);
      if (match) return match;
    }
    // Default to active term 26-27 S1 or active global semester
    const currentShort = selectedSemester === "Semester 2" ? "26-27 S2" : "26-27 S1";
    return ENROLLMENT_TIME_SERIES.find(p => p.short === currentShort) ?? ENROLLMENT_TIME_SERIES[6];
  }, [selectedTrendTerm, selectedSemester]);

  // Active KPI data for chart
  const activeKpiConfig = useMemo(() => {
    if (!activeKpiId) return null;
    const def = KPI_DEFINITIONS.find(k => k.id === activeKpiId);
    if (!def) return null;

    const trendData = Object.entries(TERM_DATA_STORE)
      .filter(([key, data]) => !(data.isCurrentOrFuture && key.endsWith("Semester 2")))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, data]) => {
        const [y, s] = key.split("_");
        const years = y.replace("AY ", "");
        const short = `${years.slice(2, 4)}-${years.slice(-2)} ${s === "Semester 1" ? "S1" : "S2"}`;
        const metric = data.kpis[def.key as keyof typeof data.kpis];
        return {
          term: `${y} ${s}`,
          short,
          value: metric.num,
          target: def.targetNum,
          higherIsBetter: def.higherIsBetter,
        };
      });

    const currentVal = termData.kpis[def.key as keyof typeof termData.kpis];
    const isTargetMet = def.higherIsBetter
      ? currentVal.num >= def.targetNum
      : currentVal.num <= def.targetNum;

    return {
      def,
      title: `${def.name} by semester`,
      subtitle: `Goal ${def.target} (dashed line)${selectedYearLevel !== "All Year Levels" || selectedCourseType !== "All Courses" ? " · Program-wide, filters not applied" : ""}`,
      data: trendData,
      currentValue: currentVal.value,
      currentDelta: currentVal.delta,
      isTargetMet,
      target: def.targetNum,
      domain: def.key === "atRiskRate" ? [0, 25] : [75, 100],
      ticks: def.key === "atRiskRate" ? [0, 5, 10, 15, 20, 25] : [75, 80, 85, 90, 95, 100],
    };
  }, [activeKpiId, termData, selectedYearLevel, selectedCourseType]);

  // Filtered student feedback for NLP drawer
  const filteredFeedback = useMemo(() => {
    if (sentimentFilter === "all") return ANONYMIZED_STUDENT_FEEDBACK;
    return ANONYMIZED_STUDENT_FEEDBACK.filter(f => f.sentiment === sentimentFilter);
  }, [sentimentFilter]);


  // ── Values used only by the layout below ──
  const toggleKpi = (id: number) => setActiveKpiId(activeKpiId === id ? null : id);
  const toggleCheck = (key: string) => setChecked(prev => ({ ...prev, [key]: !prev[key] }));

  const lowDims = baseTermData.seteDimensions.filter(d => d.score < 85);

  const actionSteps = [
    {
      id: 1,
      title: "Fix high-failure sections",
      when: "Weeks 9–10",
      tag: `${breachedSections.length} above 20%`,
      dot: "bg-[#8A1538]",
      note: null as string | null,
      items: [
        { label: "Check exams", text: "Review midterm exams against the syllabus." },
        { label: "Consultation", text: "Ask instructors to hold 2 hours of consultation each week." },
        { label: "Peer tutoring", text: "Set up study groups with student tutors before finals." },
      ],
    },
    {
      id: 2,
      title: shortCount > 0 ? `Request ${shortCount} part-time teachers` : "Check teacher coverage",
      when: "2 weeks before enrollment",
      tag: shortCount > 0 ? `${shortCount} short` : "No gap",
      dot: "bg-[#F2B705]",
      note: `${baseTermData.sectionsNeeded} sections needed, ${baseTermData.availableFaculty} regular teachers available.`,
      items: [
        { label: "Hiring letter", text: "Send the request to the Dean." },
        { label: "Open sections", text: "Assign teachers to CS 211, IT 314 and GEd 102." },
        { label: "Contracts", text: "Sign contracts before enrollment opens." },
      ],
    },
    {
      id: 3,
      title: "Support pacing and grading",
      when: "End of term",
      tag: lowDims.length ? `${lowDims.length} below 85%` : "On goal",
      dot: "bg-neutral-400",
      note: lowDims.length
        ? `${lowDims.map(d => `${d.name} (${d.score}%)`).join(" and ")} below the 85% goal.`
        : "All SETE scores meet the 85% goal.",
      items: [
        { label: "Lab pacing", text: "Spread lab work evenly across weeks 6–8." },
        { label: "Practice sets", text: "Share practice problems before exam week." },
        { label: "Peer mentoring", text: "Pair the teacher with a senior mentor for class visits." },
      ],
    },
  ];
  const totalTasks = actionSteps.reduce((n, s) => n + s.items.length, 0);
  const doneTasks = actionSteps.reduce(
    (n, s) => n + s.items.filter((_, i) => checked[`${s.id}-${i}`]).length,
    0
  );

  const alerts: string[] = [];
  if (breachedSections.length > 0)
    alerts.push(`${breachedSections.length} section${breachedSections.length === 1 ? "" : "s"} above 20% failure`);
  if (shortCount > 0)
    alerts.push(`${shortCount} teacher${shortCount === 1 ? "" : "s"} short for next semester`);
  if (termData.kpis.atRiskRate.num > 10)
    alerts.push(`At-risk rate ${termData.kpis.atRiskRate.value} is above the 10% goal`);

  const sentimentCount = {
    negative: ANONYMIZED_STUDENT_FEEDBACK.filter(f => f.sentiment === "negative").length,
    neutral: ANONYMIZED_STUDENT_FEEDBACK.filter(f => f.sentiment === "neutral").length,
    positive: ANONYMIZED_STUDENT_FEEDBACK.filter(f => f.sentiment === "positive").length,
  };
  const feedbackTotal = ANONYMIZED_STUDENT_FEEDBACK.length;

  const navItems = [
    {
      key: "dash", label: "Dashboard", Icon: Layers, badge: null as string | null,
      onClick: () => { setActiveKpiId(null); window.scrollTo({ top: 0, behavior: "smooth" }); }
    },
    { key: "plan", label: "Action plan", Icon: AlertTriangle, badge: "3", onClick: () => setShowIntervention(true) },
    { key: "comments", label: "Comments", Icon: MessageSquareQuote, badge: String(feedbackTotal), onClick: () => setShowFeedbackModal(true) },
    { key: "formulas", label: "Formulas", Icon: BookOpen, badge: null as string | null, onClick: () => setModalKpi(KPI_DEFINITIONS[0]) },
  ];

  const jumpTo = (t: SearchTarget) => {
    setSearchOpen(false);
    setSearchQuery("");
    if (t.kind === "plan") {
      setShowIntervention(true);
      return;
    }
    if (t.kind === "comments") {
      setShowFeedbackModal(true);
      return;
    }
    if (t.kind === "formulas") {
      setModalKpi(KPI_DEFINITIONS[0]);
      return;
    }
    const el = document.getElementById(t.id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    el.classList.add("ring-2", "ring-[#8A1538]/60");
    window.setTimeout(() => el.classList.remove("ring-2", "ring-[#8A1538]/60"), 1800);
  };

  const searchBox = (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
      <input
        type="text"
        aria-label="Search courses or sections"
        placeholder="Search courses or sections"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setSearchOpen(true);
        }}
        onFocus={() => setSearchOpen(true)}
        onBlur={() => setSearchOpen(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && sectionMatches[0]) jumpTo(sectionMatches[0]);
          if (e.key === "Escape") setSearchOpen(false);
        }}
        className="w-full rounded-xl bg-neutral-100 py-2.5 pl-9 pr-8 text-sm text-neutral-900 placeholder-neutral-500 outline-none focus:ring-2 focus:ring-neutral-900/20"
      />
      {searchQuery && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => setSearchQuery("")}
          className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-200"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
      {searchOpen && searchText.length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-40 mt-1.5 overflow-hidden rounded-xl border border-neutral-200 bg-white p-1 shadow-lg print:hidden">
          {sectionMatches.length > 0 && (
            <p className="px-2.5 pb-1 pt-1.5 text-[11px] font-medium text-neutral-400">Jump to</p>
          )}
          {sectionMatches.map((t) => (
            <button
              key={t.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => jumpTo(t)}
              className="flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-neutral-800 transition hover:bg-neutral-100"
            >
              <span className="truncate">{t.label}</span>
              <span className="shrink-0 text-[11px] text-neutral-400">{t.hint}</span>
            </button>
          ))}
          {hasCourseMatch && (
            <p className="px-2.5 py-1.5 text-xs text-neutral-500">
              Also filtering courses and sections for “{searchQuery.trim()}”.
            </p>
          )}
          {sectionMatches.length === 0 && !hasCourseMatch && (
            <p className="px-2.5 py-2 text-xs text-neutral-500">No matches. Try SETE, action plan, or a course code like CS 211.</p>
          )}
        </div>
      )}
    </div>
  );

  // One KPI card (number first, everything else small)
  const renderKpiCard = (def: KpiDef) => {
    const isSelected = activeKpiId === def.id;
    const metric = termData.kpis[def.key as keyof typeof termData.kpis];
    const met = def.higherIsBetter ? metric.num >= def.targetNum : metric.num <= def.targetNum;
    const Icon = KPI_ICONS[def.id];
    const changeText = Number.isNaN(parseFloat(metric.delta)) ? "" : ` Change from last semester: ${metric.delta}.`;
    // Gap to goal, in percentage points (the main number on each card)
    const gap = Number((metric.num - def.targetNum).toFixed(1));
    const gapAbs = Math.abs(gap).toFixed(1);
    const gapText =
      gap === 0
        ? "On goal"
        : def.higherIsBetter
          ? `${gapAbs} pts ${gap > 0 ? "above" : "below"} goal`
          : `${gapAbs} pts ${gap > 0 ? "over" : "under"} goal`;
    const gapShort = gap === 0 ? "On goal" : `${gap > 0 ? "+" : "-"}${gapAbs} pts`;
    const gapTone = met ? "font-medium text-[#15803D]" : "font-medium text-[#C62828]";
    const tip = `${KPI_INSIGHTS[def.id](metric.value)} ${met ? "Goal met" : "Goal missed"} (${gapText}).${changeText}`;
    return (
      <div
        key={def.id}
        className={`group/tip relative rounded-2xl bg-white transition ${isSelected ? "ring-2 ring-[#8A1538]" : "ring-1 ring-transparent hover:ring-neutral-300"
          }`}
      >
        <button
          type="button"
          onClick={() => toggleKpi(def.id)}
          aria-pressed={isSelected}
          className="flex w-full flex-col items-center rounded-2xl px-2 pb-3.5 pt-8 text-center sm:px-3 sm:pb-4 sm:pt-5"
        >
          <span className="mb-2.5 hidden h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 sm:flex">
            <Icon className="h-4 w-4" />
          </span>
          <span className="text-[26px] font-semibold leading-none tracking-tight tabular-nums text-neutral-900 sm:text-[34px]">
            {metric.value}
          </span>
          <span className="mt-2 text-xs leading-snug text-neutral-700 sm:text-[13px]">{def.name}</span>
          <span className={`mt-1 text-[11px] sm:text-xs ${met ? "text-neutral-500" : "font-medium text-[#8A1538]"}`}>
            Goal {def.target.split(" (")[0]}
          </span>
        </button>
        <span
          className={`pointer-events-none absolute left-2.5 top-2 text-[11px] tabular-nums sm:left-3 sm:top-2.5 sm:text-xs ${gapTone}`}
        >
          {gapShort}
        </span>
        <button
          type="button"
          aria-label={`${def.name}: see formula`}
          onClick={() => setModalKpi(def)}
          className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-800 print:hidden"
        >
          <Info className="h-4 w-4" />
        </button>
        <TipBubble text={tip} />
      </div>
    );
  };

  const kpiGroups = [
    { title: "Student performance", bar: "bg-[#8A1538]", ids: [1, 2, 3], span: "lg:col-span-3", cols: "grid-cols-3" },
    { title: "Teaching quality", bar: "bg-neutral-900", ids: [4, 5], span: "lg:col-span-2", cols: "grid-cols-2" },
  ];

  return (
    <>
      {/* ══════════ FULLSCREEN LOADING SPLASH (Spartan Crimson red + logo fade-in) ══════════ */}
      {isLoading && (
        <div
          className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#8A1538] transition-opacity duration-700 ease-in-out ${isFading ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          aria-hidden="true"
        >
          <div className="flex flex-col items-center text-center px-6">
            <div className="relative mb-5 flex items-center justify-center">
              {/* Subtle ambient glow */}
              <div className="absolute -inset-8 rounded-full bg-white/10 blur-2xl animate-pulse" />
              <img
                src="/spartalytics_white.png"
                alt="Spartalytics"
                className="relative h-24 w-24 sm:h-28 sm:w-28 object-contain drop-shadow-2xl animate-logo-fade-in"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl font-normal tracking-wider text-white drop-shadow-sm animate-logo-fade-in">
              <span className="font-black">SPARTA</span>LYTICS
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm font-medium text-rose-200/90 tracking-wide animate-logo-fade-in">
              BatStateU CICS · Program Chair Decision Support
            </p>
            <div className="mt-7 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-white/90 animate-ping" />
              <span className="text-[11px] font-medium tracking-wider uppercase text-rose-200/80">
                Loading Dashboard...
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-[#E5E6E9] font-sans text-neutral-900 md:flex">

        {/* ══════════ SIDEBAR (desktop, closable) ══════════ */}
        <aside
          aria-label="Sidebar"
          aria-hidden={!sidebarOpen}
          className={`sticky top-0 hidden h-screen shrink-0 overflow-hidden bg-white transition-[width] duration-300 ease-out md:block print:hidden ${sidebarOpen ? "w-60" : "w-0"}`}
        >
          <div className={`flex h-full w-60 flex-col overflow-y-auto p-4 ${sidebarOpen ? "" : "invisible"}`}>
            {/* Logo + close button */}
            <div className="flex items-center justify-between gap-2 px-1 pb-4">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200/90 bg-white p-0.5 shadow-xs">
                  <img src="/spartalytics.png" alt="Spartalytics" className="h-full w-full object-contain" />
                </div>
                <div className="min-w-0">
                  <p className="whitespace-nowrap text-[13px] font-normal leading-tight tracking-wide">
                    <span className="font-black">SPARTA</span>LYTICS
                  </p>
                  <p className="truncate text-xs text-neutral-500">CICS ARASOF</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
                title="Close sidebar"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-neutral-600 transition hover:bg-neutral-100"
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>

            {/* Profile */}
            <div className="flex flex-col items-center border-b border-neutral-100 px-2 pb-5 pt-2 text-center">
              <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#8A1538]/10 ring-4 ring-[#8A1538]/10">
                <User className="h-9 w-9 text-[#8A1538]" />
              </div>
              <p className="mt-3 text-sm font-bold text-[#8A1538]">Program Chair</p>
              <p className="text-[11px] leading-snug text-neutral-500">BS Information Technology</p>
            </div>

            <div className="mt-4">{searchBox}</div>

            <p className="mt-5 border-b border-neutral-100 px-1 pb-2 text-sm font-bold text-neutral-900">BSIT Program</p>

            <nav className="mt-3 flex-1 space-y-1">
              {navItems.map(({ key, label, Icon, badge, onClick }) => {
                const isCurrent = key === "dash";
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={onClick}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${isCurrent ? "bg-[#8A1538] text-white" : "text-neutral-700 hover:bg-neutral-100"
                      }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4" />
                      {label}
                    </span>
                    {badge && (
                      <span className={`rounded-full px-2 py-0.5 text-xs ${isCurrent ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-600"}`}>{badge}</span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* ══════════ MAIN ══════════ */}
        <main className="flex min-w-0 flex-1 flex-col pb-20 md:pb-8">

          {/* Header */}
          <header className="sticky top-0 z-20 bg-[#E5E6E9]/90 px-3 pb-2 pt-3 backdrop-blur sm:px-6 md:pt-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                {!sidebarOpen && (
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Open sidebar"
                    title="Open sidebar"
                    className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-neutral-700 transition hover:bg-neutral-50 md:flex print:hidden"
                  >
                    <Menu className="h-4 w-4" />
                  </button>
                )}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-neutral-200/90 md:hidden p-1 overflow-hidden shadow-xs">
                  <img src="/spartalytics.png" alt="Spartalytics" className="h-full w-full object-contain" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl font-semibold leading-tight sm:text-2xl">Dashboard</h1>
                  <p className="truncate text-xs text-neutral-600 sm:text-sm">
                    <span className="hidden sm:inline">BS Information Technology · </span>
                    {selectedSemester}, {selectedYear}
                    {isProjected && " · Projected"}
                    {selectedYearLevel !== "All Year Levels" && ` · ${selectedYearLevel}`}
                    {selectedCourseType !== "All Courses" &&
                      ` · ${selectedCourseType.includes("Major") ? "Majors" : "Gen Ed"}`}
                    {isFilteredView && " · Sample estimates"}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 print:hidden">
                <button
                  type="button"
                  onClick={() => window.print()}
                  aria-label="Export report"
                  title="Export report"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-neutral-700 transition hover:bg-neutral-50"
                >
                  <Printer className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowFilterModal(true)}
                  className="relative flex h-10 items-center gap-2 rounded-xl bg-neutral-900 px-3.5 text-sm font-medium text-white transition hover:bg-neutral-700"
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#8A1538] px-1 text-[11px] font-semibold text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </header>

          <div className="flex-1 space-y-3 px-3 pt-1 sm:space-y-4 sm:px-6">

            <div className="md:hidden print:hidden">{searchBox}</div>

            {/* ── Welcome + totals (Enhanced Hero Section with Background Watermark & Rich Gradient) ── */}
            <section className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-12">
              <div className="col-span-2 relative flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#8A1538] via-[#73102C] to-[#480718] p-5 sm:p-6 text-white lg:col-span-6 shadow-xs border border-[#8A1538]/30 group">
                {/* Background Logo Watermark */}
                <div className="pointer-events-none absolute -bottom-7 -right-5 select-none opacity-[0.13] transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-[0.18]">
                  <img
                    src="/spartalytics_white.png"
                    alt=""
                    className="h-60 w-60 object-contain"
                  />
                </div>

                {/* Decorative radial glows */}
                <div className="pointer-events-none absolute -top-10 -right-10 h-44 w-44 rounded-full bg-rose-400/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-black/25 blur-2xl" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-200 backdrop-blur-xs border border-white/15">
                      BSIT Decision Support
                    </span>
                    <span className="text-[11px] font-medium text-rose-200/80 hidden sm:inline">
                      CICS · ARASOF
                    </span>
                  </div>

                  <h2 className="mt-2.5 text-xl font-normal sm:text-2xl tracking-tight">
                    Welcome to <span className="font-black">SPARTA</span>LYTICS!
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-rose-100/90 font-normal">
                    Here is how the BSIT program is currently performing.
                  </p>
                  <p className="mt-1 text-[11px] sm:text-xs text-rose-100/70 font-normal">
                    Built for the BSIT Program Chair to plan sections, staffing, and teaching support.
                  </p>

                  <div className="mt-4 space-y-1.5 border-t border-white/15 pt-3.5">
                    {alerts.length > 0 ? (
                      alerts.map((text) => (
                        <button
                          key={text}
                          type="button"
                          onClick={() => setShowIntervention(true)}
                          className="flex w-full items-center gap-2.5 rounded-lg py-1 text-left text-xs sm:text-sm transition hover:text-white/80 cursor-pointer"
                        >
                          <span className="h-2 w-2 shrink-0 rounded-full bg-[#F2B705] ring-2 ring-[#F2B705]/30 animate-pulse" />
                          <span className="font-medium text-white">{text}</span>
                        </button>
                      ))
                    ) : (
                      <p className="text-xs sm:text-sm text-rose-200">No active alerts right now.</p>
                    )}
                  </div>
                </div>

                <div className="relative z-10 mt-5 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowIntervention(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-rose-50 hover:shadow-md cursor-pointer print:hidden"
                  >
                    <span>See action plan</span>
                    <ChevronRight className="h-4 w-4 text-neutral-600" />
                  </button>
                </div>
              </div>

              <div className="group/tip relative flex flex-col items-center justify-center rounded-2xl bg-white p-4 text-center lg:col-span-3">
                <span className="mb-2.5 hidden h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 sm:flex">
                  <Users className="h-5 w-5" />
                </span>
                <p className="text-3xl font-semibold tabular-nums tracking-tight sm:text-4xl">
                  {termData.totalEnrolled.toLocaleString()}
                </p>
                <p className="mt-1.5 text-sm text-neutral-700">Total students</p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {isFilteredView ? (
                    "Selected group"
                  ) : yoyChange === null ? (
                    "First year on record"
                  ) : (
                    <>
                      <span className={`font-medium ${yoyChange >= 0 ? "text-[#15803D]" : "text-[#C62828]"}`}>
                        {yoyChange >= 0 ? "+" : ""}{yoyChange.toFixed(1)}%
                      </span>{" "}
                      from last year{isProjected ? " (forecast)" : ""}
                    </>
                  )}
                </p>
                <TipBubble
                  text={`${termData.totalEnrolled.toLocaleString()} students ${isProjected ? "are expected to enroll" : "are enrolled"} this semester.${yoyText}`}
                />
              </div>

              <div className="group/tip relative flex flex-col items-center justify-center rounded-2xl bg-white p-4 text-center lg:col-span-3">
                <span className="mb-2.5 hidden h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 sm:flex">
                  <Briefcase className="h-5 w-5" />
                </span>
                <p className="text-3xl font-semibold tabular-nums tracking-tight sm:text-4xl">{termData.availableFaculty}</p>
                <p className="mt-1.5 text-sm text-neutral-700">Total teachers</p>
                <p className="mt-0.5 text-xs text-neutral-500">{termData.availableFaculty * 3} units</p>
                <TipBubble
                  text={`${termData.availableFaculty} regular teachers can cover ${termData.availableFaculty} sections (${termData.availableFaculty * 3} units). Extra sections need part-time teachers.`}
                />
              </div>
            </section>

            {/* ── 5 main KPIs ── */}
            <section id="kpi-cards" className="scroll-mt-24 rounded-2xl">
              <div className="grid gap-3 lg:grid-cols-5">
                {kpiGroups.map((group) => (
                  <div key={group.title} className={group.span}>
                    <div className={`${group.bar} rounded-xl px-4 py-2.5 text-center text-sm font-semibold text-white sm:py-3 sm:text-[15px]`}>
                      {group.title}
                    </div>
                    <div className={`mt-2 grid gap-2 sm:gap-2.5 ${group.cols}`}>
                      {KPI_DEFINITIONS.filter((d) => group.ids.includes(d.id)).map(renderKpiCard)}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-2 px-1 text-xs text-neutral-600 print:hidden">Select a card to see its trend.</p>
            </section>

            {/* ── Trend chart ── */}
            <section id="trend-chart" className="scroll-mt-24 rounded-2xl bg-white p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h3 className="text-base font-semibold sm:text-lg">
                    {activeKpiConfig ? activeKpiConfig.title : "Enrollment trend"}
                  </h3>
                  <p className="text-sm text-neutral-500">
                    {activeKpiConfig ? activeKpiConfig.subtitle : "Students per semester, with forecast"}
                  </p>
                </div>

                <div className="print:hidden flex items-center gap-2.5 flex-wrap">
                  {activeKpiConfig ? (
                    <button
                      type="button"
                      onClick={() => setActiveKpiId(null)}
                      className="text-sm font-medium text-neutral-900 underline underline-offset-4 hover:text-neutral-600"
                    >
                      Back to enrollment
                    </button>
                  ) : (
                    <div role="tablist" className="flex gap-4">
                      {([
                        ["forecast", "With forecast"],
                        ["actual", "Actual only"],
                      ] as const).map(([id, label]) => (
                        <button
                          key={id}
                          type="button"
                          role="tab"
                          aria-selected={chartView === id}
                          onClick={() => setChartView(id)}
                          className={`border-b-2 pb-1 text-xs font-medium transition cursor-pointer ${chartView === id
                            ? "border-neutral-900 text-neutral-900"
                            : "border-transparent text-neutral-500 hover:text-neutral-900"
                            }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-4">
                <div className="relative h-[220px] min-w-0 lg:col-span-3 lg:h-auto lg:min-h-[260px]">
                  <div className="absolute inset-0">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={190}>
                      {activeKpiConfig ? (
                        <LineChart data={activeKpiConfig.data} margin={{ top: 10, right: 12, left: -15, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ECECEF" />
                          <XAxis dataKey="short" tick={{ fill: "#737373", fontSize: 11 }} tickLine={false} axisLine={false} />
                          <YAxis
                            tick={{ fill: "#737373", fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                            domain={activeKpiConfig.domain}
                            ticks={activeKpiConfig.ticks}
                            tickFormatter={(v) => `${v}%`}
                          />
                          <Tooltip content={<ChartTooltip />} />
                          <ReferenceLine
                            y={activeKpiConfig.target}
                            stroke="#171717"
                            strokeDasharray="4 4"
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke={RED}
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: RED, stroke: "#fff", strokeWidth: 1.5 }}
                            activeDot={{ r: 6, fill: RED, stroke: "#fff", strokeWidth: 2 }}
                          />
                        </LineChart>
                      ) : (
                        <AreaChart
                          data={ENROLLMENT_TIME_SERIES}
                          margin={{ top: 10, right: 12, left: -15, bottom: 0 }}
                          className="cursor-pointer"
                          onClick={(e: any) => {
                            if (e && e.activePayload && e.activePayload.length) {
                              const pt = e.activePayload[0].payload;
                              setSelectedTrendTerm(pt.short);
                            }
                          }}
                        >
                          <defs>
                            <linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={RED} stopOpacity={0.14} />
                              <stop offset="95%" stopColor={RED} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ECECEF" />
                          <XAxis dataKey="short" tick={{ fill: "#737373", fontSize: 11 }} tickLine={false} axisLine={false} />
                          <YAxis tick={{ fill: "#737373", fontSize: 11 }} tickLine={false} axisLine={false} domain={[900, 1600]} ticks={[900, 1100, 1300, 1500]} />
                          <Tooltip content={<ChartTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="actual"
                            stroke={RED}
                            strokeWidth={2.5}
                            fill="url(#actualFill)"
                            connectNulls
                          />
                          {chartView === "forecast" && (
                            <Line
                              type="monotone"
                              dataKey="forecast"
                              stroke={RED}
                              strokeWidth={2}
                              strokeDasharray="5 5"
                              dot={{ r: 5, fill: RED, cursor: "pointer" }}
                              activeDot={{ r: 7, fill: RED, cursor: "pointer" }}
                              connectNulls
                            />
                          )}
                        </AreaChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Side summary */}
                <div className="space-y-3">
                  {activeKpiConfig ? (
                    <>
                      <div className="rounded-2xl bg-neutral-100 p-4 text-center">
                        <p className="text-xs text-neutral-600">{selectedSemester}</p>
                        <p className="mt-0.5 text-3xl font-semibold tabular-nums tracking-tight">{activeKpiConfig.currentValue}</p>
                        <p className={`mt-1 text-xs font-medium ${activeKpiConfig.isTargetMet ? "text-neutral-900" : "text-[#8A1538]"}`}>
                          {activeKpiConfig.isTargetMet ? "Goal met" : "Goal missed"}
                        </p>
                      </div>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between gap-3 border-b border-neutral-100 pb-2">
                          <dt className="text-neutral-500">Goal</dt>
                          <dd className="font-medium">{activeKpiConfig.def.target}</dd>
                        </div>
                        <div className="flex justify-between gap-3 border-b border-neutral-100 pb-2">
                          <dt className="text-neutral-500">Change</dt>
                          <dd className={`tabular-nums ${deltaTone(activeKpiConfig.currentDelta, activeKpiConfig.def.higherIsBetter)}`}>
                            {activeKpiConfig.currentDelta}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-3">
                          <dt className="text-neutral-500">Source</dt>
                          <dd className="text-right text-xs font-medium leading-snug">{activeKpiConfig.def.sourceTag}</dd>
                        </div>
                      </dl>
                    </>
                  ) : (
                    <>
                      {/* Semester switch (same plain style as the chart tabs) */}
                      <div className="flex gap-4 print:hidden">
                        {([
                          ["26-27 S1", "26-27 S1"],
                          ["26-27 S2", "26-27 S2 forecast"],
                        ] as const).map(([short, label]) => {
                          const on = activeTrendData.short === short;
                          return (
                            <button
                              key={short}
                              type="button"
                              aria-pressed={on}
                              onClick={() => setSelectedTrendTerm(short)}
                              className={`border-b-2 pb-1 text-xs font-medium transition cursor-pointer ${on
                                ? "border-neutral-900 text-neutral-900"
                                : "border-transparent text-neutral-500 hover:text-neutral-900"
                                }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>

                      <div className="rounded-2xl bg-neutral-100 px-4 py-3 text-center">
                        <p className="text-xs text-neutral-600">
                          {activeTrendData.isForecast ? "Expected students" : "Students enrolled"}
                        </p>
                        <p className="mt-0.5 text-3xl font-semibold tabular-nums tracking-tight">
                          {(activeTrendData.forecast ?? activeTrendData.actual ?? 1490).toLocaleString()}
                        </p>
                        <p className="mt-0.5 text-xs text-neutral-500">{activeTrendData.label}</p>
                      </div>

                      <div className="space-y-2 text-sm">
                        <Tip
                          className="block"
                          align="right"
                          text={`${activeTrendData.teachers} regular teachers can handle ${activeTrendData.teachers} sections.`}
                        >
                          <div className="flex justify-between gap-3 border-b border-neutral-100 pb-2">
                            <span className="text-neutral-500">Teachers</span>
                            <span className="font-medium tabular-nums">{activeTrendData.teachers}</span>
                          </div>
                        </Tip>
                        <Tip
                          className="block"
                          align="right"
                          text={`${activeTrendData.sections} sections are needed to seat all ${(activeTrendData.forecast ?? activeTrendData.actual ?? 0).toLocaleString()} students.`}
                        >
                          <div className="flex justify-between gap-3 border-b border-neutral-100 pb-2">
                            <span className="text-neutral-500">Sections needed</span>
                            <span className="font-medium tabular-nums">{activeTrendData.sections}</span>
                          </div>
                        </Tip>
                        <Tip
                          className="block"
                          align="right"
                          text={
                            activeTrendData.gap > 0
                              ? `${activeTrendData.sections} sections are needed but only ${activeTrendData.teachers} teachers are available. Hire ${activeTrendData.gap} part-time teachers.`
                              : "There are enough teachers for every section."
                          }
                        >
                          <div className="flex items-center justify-between gap-3 border-b border-neutral-100 pb-2">
                            <span className="text-neutral-500">Teacher gap</span>
                            {activeTrendData.gap > 0 ? (
                              <span className="rounded-md bg-[#F2B705]/25 px-1.5 py-0.5 text-sm font-semibold">
                                {activeTrendData.gap} short
                              </span>
                            ) : (
                              <span className="font-medium">None</span>
                            )}
                          </div>
                        </Tip>
                        <Tip
                          className="block"
                          align="right"
                          text={
                            activeTrendData.isForecast
                              ? "On average, the forecast is off by 1.11%. Lower is better."
                              : "This is the real, recorded enrollment."
                          }
                        >
                          <div className="flex justify-between gap-3">
                            <span className="text-neutral-500">
                              {activeTrendData.isForecast ? "Forecast error (MAPE)" : "Data"}
                            </span>
                            <span className="font-medium tabular-nums">
                              {activeTrendData.isForecast ? "1.11%" : "Actual record"}
                            </span>
                          </div>
                        </Tip>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </section>

            {/* ── Year levels + flagged sections ── */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
              <section id="year-levels" className="scroll-mt-24 flex flex-col rounded-2xl bg-white p-4 sm:p-5">
                <h3 className="text-base font-semibold">Students by year level</h3>
                <p className="text-sm text-neutral-500">Select a year to filter the dashboard.</p>

                <div className="relative my-2 h-[170px] min-w-0">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={150}>
                    <PieChart>
                      <Pie
                        data={baseTermData.yearLevels}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={74}
                        paddingAngle={3}
                        dataKey="count"
                        cursor="pointer"
                        stroke="none"
                        onClick={(entry: any) => {
                          if (entry && entry.name) {
                            setSelectedYearLevel(selectedYearLevel === entry.name ? "All Year Levels" : entry.name);
                          }
                        }}
                      >
                        {baseTermData.yearLevels.map((e, i) => (
                          <Cell
                            key={e.name}
                            fill={YEAR_COLORS[i % YEAR_COLORS.length]}
                            opacity={selectedYearLevel === "All Year Levels" || selectedYearLevel === e.name ? 1 : 0.35}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }: any) => {
                          if (!active || !payload || !payload.length) return null;
                          const item = payload[0].payload;
                          return (
                            <div className="rounded-lg bg-neutral-900 px-3 py-2 text-xs text-white shadow-lg">
                              <p className="font-semibold">{item.name}</p>
                              <p className="text-neutral-300">{item.count} students ({item.percent})</p>
                            </div>
                          );
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-semibold tabular-nums tracking-tight">
                      {filteredYearLevels.reduce((acc, curr) => acc + curr.count, 0).toLocaleString()}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {selectedYearLevel === "All Year Levels" ? "Students" : selectedYearLevel}
                    </span>
                  </div>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-2 pt-2">
                  {baseTermData.yearLevels.map((c, i) => {
                    const isSelected = selectedYearLevel === c.name;
                    return (
                      <Tip
                        key={c.name}
                        className="block"
                        text={`${c.count} students, ${c.percent} of all enrolled. Select to filter the dashboard.`}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedYearLevel(isSelected ? "All Year Levels" : c.name)}
                          aria-pressed={isSelected}
                          className={`flex min-h-10 w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm ring-1 transition ${isSelected ? "bg-neutral-50 ring-neutral-900" : "ring-neutral-200 hover:bg-neutral-50"
                            }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: YEAR_COLORS[i % YEAR_COLORS.length] }} />
                            {c.name}
                          </span>
                          <span className="font-semibold tabular-nums">{c.count}</span>
                        </button>
                      </Tip>
                    );
                  })}
                </div>
              </section>

              <section id="high-failure-sections" className="scroll-mt-24 flex flex-col rounded-2xl bg-white p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold">Sections with high failure</h3>
                    <p className="text-sm text-neutral-500">Midterm failure above 20%</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-[#8A1538]">{visibleBreachCount} flagged</span>
                </div>

                <ul className="mt-2 flex-1 divide-y divide-neutral-100">
                  {filteredSections.map((sec) => {
                    const critical = sec.rate >= 20;
                    return (
                      <li key={sec.name + sec.course}>
                        <Tip
                          className="block"
                          text={
                            critical
                              ? `${sec.failing} of ${sec.total} students (${sec.rate.toFixed(1)}%) are failing at midterm. This is above the 20% limit, so the section needs action.`
                              : `${sec.failing} of ${sec.total} students (${sec.rate.toFixed(1)}%) are failing at midterm. This is close to the 20% limit, so keep watching.`
                          }
                        >
                          <div className="flex items-center justify-between gap-3 py-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">{sec.name}</p>
                              <p className="truncate text-xs text-neutral-500">
                                {sec.course} · {sec.failing} of {sec.total} failing
                              </p>
                            </div>
                            <div className="shrink-0 text-right">
                              <p className={`text-lg font-semibold tabular-nums leading-tight ${critical ? "text-[#8A1538]" : "text-neutral-900"}`}>
                                {sec.rate.toFixed(1)}%
                              </p>
                              <p className="flex items-center justify-end gap-1.5 text-xs text-neutral-600">
                                {!critical && <span className="h-2 w-2 rounded-full bg-[#F2B705]" />}
                                {critical ? "Critical" : "Watch"}
                              </p>
                            </div>
                          </div>
                        </Tip>
                      </li>
                    );
                  })}
                  {filteredSections.length === 0 && (
                    <li className="py-6 text-center text-sm text-neutral-500">No sections to show.</li>
                  )}
                </ul>
              </section>
            </div>

            {/* ── Teaching load + SETE + hard courses ── */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-3">
              <section id="teaching-load" className="scroll-mt-24 rounded-2xl bg-white p-4 sm:p-5 lg:col-span-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold">Teaching load</h3>
                    <p className="text-sm text-neutral-500">Select a row to see its SETE scores. Standard load: 18 units. Scores are pooled by course, not by instructor.</p>
                  </div>
                  <span className="shrink-0 text-sm text-neutral-500">{selectedYear}</span>
                </div>

                {/* Desktop / tablet table */}
                <div className="mt-3 hidden md:block">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-neutral-100 text-xs text-neutral-500">
                        <th className="pb-2 pr-2 font-medium">Cluster</th>
                        <th className="pb-2 pr-2 text-center font-medium">Type</th>
                        <th className="pb-2 pr-2 text-center font-medium">Sections</th>
                        <th className="pb-2 pr-2 text-center font-medium">Units</th>
                        <th className="pb-2 text-right font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {filteredFaculty.map((f) => {
                        const isRowSelected = selectedFacultyId === f.id;
                        return (
                          <tr
                            key={f.id}
                            onClick={() => setSelectedFacultyId(isRowSelected ? null : f.id)}
                            className={`cursor-pointer transition ${isRowSelected ? "bg-neutral-100" : "hover:bg-neutral-50"}`}
                          >
                            <td className="rounded-l-lg py-2.5 pl-2 pr-2">
                              <span className="font-medium">{f.title.replace("Instructional ", "")}</span>
                              <span className="ml-2 text-xs text-neutral-500">{f.courseCode}</span>
                            </td>
                            <td className="whitespace-nowrap py-2.5 pr-2 text-center text-neutral-600">{f.courseType === "GenEd" ? "Gen Ed" : f.courseType}</td>
                            <td className="py-2.5 pr-2 text-center font-semibold tabular-nums">{f.sections}</td>
                            <td className="py-2.5 pr-2 text-center font-semibold tabular-nums">{f.units}</td>
                            <td className="rounded-r-lg py-2.5 pr-2 text-right"><StatusLabel status={f.status} /></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile list: compact rows */}
                <ul className="mt-2 divide-y divide-neutral-100 md:hidden">
                  {filteredFaculty.map((f) => {
                    const isRowSelected = selectedFacultyId === f.id;
                    return (
                      <li key={f.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedFacultyId(isRowSelected ? null : f.id)}
                          aria-pressed={isRowSelected}
                          className={`flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-left ${isRowSelected ? "bg-neutral-100" : ""
                            }`}
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-[13px] font-medium leading-snug">
                              {f.title.replace("Instructional ", "")}
                            </span>
                            <span className="block truncate text-[11px] leading-snug text-neutral-500">
                              {f.courseCode} · {f.sections} sections · {f.units} units
                            </span>
                          </span>
                          <StatusLabel status={f.status} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
                {filteredFaculty.length === 0 && (
                  <p className="py-6 text-center text-sm text-neutral-500">No clusters to show.</p>
                )}

                <div className="mt-3 grid grid-cols-3 gap-2 border-t border-neutral-100 pt-3 text-center">
                  <div>
                    <p className="text-xs text-neutral-500">Capacity</p>
                    <p className="text-sm font-semibold tabular-nums">{baseTermData.availableFaculty * 3} units</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Needed</p>
                    <p className="text-sm font-semibold tabular-nums">{baseTermData.sectionsNeeded * 3} units</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Gap</p>
                    {baseTermData.facultyShortage < 0 ? (
                      <p className="inline-block rounded-md bg-[#F2B705]/25 px-1.5 text-sm font-semibold tabular-nums">
                        {Math.abs(baseTermData.facultyShortage)} sections
                      </p>
                    ) : (
                      <p className="text-sm font-semibold">None</p>
                    )}
                  </div>
                </div>
              </section>

              <div className="space-y-3 sm:space-y-4">
                {/* SETE scores */}
                <section id="sete-scores" className="scroll-mt-24 rounded-2xl bg-white p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold">SETE scores</h3>
                      <p className="truncate text-sm text-neutral-500">
                        {selectedFaculty
                          ? selectedFaculty.title.replace("Instructional ", "")
                          : "Department average · Goal 85%"}
                      </p>
                    </div>
                    <div className="shrink-0 print:hidden">
                      {selectedFaculty ? (
                        <button
                          type="button"
                          onClick={() => setSelectedFacultyId(null)}
                          className="text-sm font-medium underline underline-offset-4 hover:text-neutral-600"
                        >
                          Reset
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowFeedbackModal(true)}
                          className="text-sm font-medium underline underline-offset-4 hover:text-neutral-600"
                        >
                          Comments ({feedbackTotal})
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 space-y-3.5">
                    {displayedSeteDimensions.map((c) => {
                      const low = c.score < 85;
                      return (
                        <Tip
                          key={c.name}
                          className="block"
                          text={`${c.score}% shows ${SETE_MEANING[c.code]}. The goal is 85% or higher, so this ${low ? "needs work" : "is on track"}.`}
                        >
                          <div>
                            <div className="mb-1.5 flex justify-between text-sm">
                              <span className="text-neutral-700">{c.name}</span>
                              <span className="font-semibold tabular-nums">{c.score}%</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                              <div
                                className={`h-full rounded-full ${low ? "bg-[#F2B705]" : "bg-neutral-900"}`}
                                style={{ width: `${c.score}%` }}
                              />
                            </div>
                          </div>
                        </Tip>
                      );
                    })}
                  </div>

                  <div className="mt-4 space-y-1.5 border-t border-neutral-100 pt-3 text-xs text-neutral-500">
                    {selectedFaculty ? (
                      <>
                        <p>Overall score: {selectedFaculty.overallScore.toFixed(1)}%</p>
                        {selectedResponse && (
                          <p>
                            Response rate: {selectedResponse.rate}% ({selectedResponse.n} responses) · {selectedSemester}, {selectedYear}
                          </p>
                        )}
                        <p>Pooled across {selectedFaculty.sections} sections. Individual instructors are not shown.</p>
                        {selectedResponse && selectedResponse.rate < 50 && (
                          <p className="font-medium text-[#8A1538]">Low response rate. Read this score with caution.</p>
                        )}
                      </>
                    ) : (
                      <p>
                        Response rate: 84.6% ({Math.round(termData.totalEnrolled * 0.846).toLocaleString()} of {termData.totalEnrolled.toLocaleString()} students) · {selectedSemester}, {selectedYear}
                      </p>
                    )}
                    <p>SETE is one input. Read it together with peer observation, class visits and student results, never on its own.</p>
                  </div>
                </section>

                {/* High-failure courses */}
                <section id="high-failure-courses" className="scroll-mt-24 rounded-2xl bg-white p-4 sm:p-5">
                  <h3 className="text-base font-semibold">High-failure courses</h3>
                  <p className="text-sm text-neutral-500">Midterm failure rate</p>
                  <div className="mt-4 space-y-3.5">
                    {filteredBottlenecks.map((s) => {
                      const critical = s.failRate >= 20;
                      return (
                        <Tip
                          key={s.code}
                          className="block"
                          text={`${s.failRate}% of the ${s.students} students in ${s.code} failed at midterm. ${critical ? "That is above the 20% limit." : "That is close to the 20% limit."}`}
                        >
                          <div>
                            <div className="mb-1.5 flex justify-between gap-3 text-sm">
                              <span className="min-w-0 truncate text-neutral-700">
                                <span className="font-medium text-neutral-900">{s.code}</span> · {s.name}
                              </span>
                              <span className={`shrink-0 font-semibold tabular-nums ${critical ? "text-[#8A1538]" : ""}`}>
                                {s.failRate}%
                              </span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                              <div
                                className={`h-full rounded-full ${critical ? "bg-[#8A1538]" : "bg-[#F2B705]"}`}
                                style={{ width: `${(s.failRate / 30) * 100}%` }}
                              />
                            </div>
                          </div>
                        </Tip>
                      );
                    })}
                    {filteredBottlenecks.length === 0 && (
                      <p className="py-4 text-center text-sm text-neutral-500">No courses to show.</p>
                    )}
                  </div>
                </section>
              </div>
            </div>

          </div>
        </main>

        {/* ══════════ MOBILE TAB BAR ══════════ */}
        <nav
          className="fixed inset-x-0 bottom-0 z-30 border-t border-neutral-200 bg-white/95 backdrop-blur md:hidden print:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          aria-label="Main"
        >
          <div className="mx-auto grid max-w-md grid-cols-4">
            {navItems.map(({ key, label, Icon, onClick }) => {
              const isCurrent = key === "dash";
              return (
                <button
                  key={key}
                  type="button"
                  onClick={onClick}
                  className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${isCurrent ? "text-[#8A1538]" : "text-neutral-700"
                    }`}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* ══════════ FORMULA WINDOW ══════════ */}
        {modalKpi && (
          <ModalShell
            title={modalKpi.name}
            subtitle={`Goal ${modalKpi.target}`}
            onClose={() => setModalKpi(null)}
            headerExtra={
              <div className="-mx-5 mt-4 flex gap-1.5 overflow-x-auto px-5 pb-0.5">
                {KPI_DEFINITIONS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setModalKpi(d)}
                    aria-pressed={modalKpi.id === d.id}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${modalKpi.id === d.id ? "bg-white text-neutral-900" : "text-neutral-400 hover:text-white"
                      }`}
                  >
                    {KPI_SHORT_NAMES[d.id]}
                  </button>
                ))}
              </div>
            }
          >
            <div className="space-y-3">
              <div className="space-y-4 rounded-2xl bg-white p-4">
                <div>
                  <p className="text-xs font-medium text-neutral-500">What it shows</p>
                  <p className="mt-1 text-[15px] leading-relaxed">{modalKpi.objective}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-500">Formula</p>
                  <p className="mt-1 rounded-xl bg-neutral-100 px-3 py-2.5 text-sm leading-relaxed">{modalKpi.formula}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-500">What to do</p>
                  <p className="mt-1 border-l-4 border-[#F2B705] pl-3 text-[15px] leading-relaxed">{modalKpi.action}</p>
                </div>
                <p className="border-t border-neutral-100 pt-3 text-xs text-neutral-500">Source: {modalKpi.sourceTag}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveKpiId(modalKpi.id);
                    setModalKpi(null);
                    setTimeout(() => document.getElementById("trend-chart")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
                  }}
                  className="min-h-11 flex-1 rounded-xl bg-neutral-900 px-4 text-sm font-medium text-white transition hover:bg-neutral-700"
                >
                  Show trend
                </button>
                <button
                  type="button"
                  onClick={() => setModalKpi(null)}
                  className="min-h-11 rounded-xl bg-white px-5 text-sm font-medium transition hover:bg-neutral-50"
                >
                  Close
                </button>
              </div>
            </div>
          </ModalShell>
        )}

        {/* ══════════ ACTION PLAN WINDOW ══════════ */}
        {showIntervention && (
          <ModalShell
            title="Action plan"
            subtitle={`${actionSteps.length} steps to fix the current alerts`}
            onClose={() => setShowIntervention(false)}
            headerExtra={
              <div className="mt-4 flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
                  <div
                    className="h-full rounded-full bg-white transition-all"
                    style={{ width: `${(doneTasks / totalTasks) * 100}%` }}
                  />
                </div>
                <span className="text-xs tabular-nums text-neutral-300">
                  {doneTasks} of {totalTasks} done
                </span>
              </div>
            }
          >
            <div className="space-y-3">
              {actionSteps.map((step) => {
                const stepDone = step.items.every((_, i) => checked[`${step.id}-${i}`]);
                return (
                  <div key={step.id} className="rounded-2xl bg-white p-4">
                    <div className="flex items-start gap-3">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${stepDone ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-900"
                          }`}
                      >
                        {stepDone ? <Check className="h-4 w-4" /> : step.id}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-semibold leading-snug">{step.title}</p>
                        <p className="text-xs text-neutral-500">{step.when}</p>
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs text-neutral-700">
                        <span className={`h-2 w-2 rounded-full ${step.dot}`} />
                        {step.tag}
                      </span>
                    </div>

                    {step.id === 1 ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {breachedSections.map((s) => (
                          <span key={s.name + s.course} className="rounded-lg bg-neutral-100 px-2.5 py-1 text-xs">
                            {s.name.replace(" Section", "")}{" "}
                            <span className="font-semibold text-[#8A1538]">{s.rate.toFixed(1)}%</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      step.note && (
                        <p className="mt-3 rounded-xl bg-neutral-100 px-3 py-2 text-[13px] leading-snug text-neutral-700">
                          {step.note}
                        </p>
                      )
                    )}

                    <ul className="mt-1 divide-y divide-neutral-100">
                      {step.items.map((it, i) => {
                        const key = `${step.id}-${i}`;
                        const done = !!checked[key];
                        return (
                          <li key={key}>
                            <button
                              type="button"
                              role="checkbox"
                              aria-checked={done}
                              onClick={() => toggleCheck(key)}
                              className="flex w-full items-start gap-3 py-3 text-left"
                            >
                              <span
                                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition ${done ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300 bg-white"
                                  }`}
                              >
                                {done && <Check className="h-3.5 w-3.5" />}
                              </span>
                              <span className={`text-sm leading-snug ${done ? "text-neutral-500 line-through" : "text-neutral-800"}`}>
                                <span className="font-semibold">{it.label}.</span> {it.text}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={() => setShowIntervention(false)}
                className="min-h-11 w-full rounded-xl bg-neutral-900 text-sm font-medium text-white transition hover:bg-neutral-700"
              >
                Close
              </button>
            </div>
          </ModalShell>
        )}

        {/* ══════════ COMMENTS WINDOW ══════════ */}
        {showFeedbackModal && (
          <ModalShell
            title="Student comments"
            subtitle="Anonymous feedback on courses and teaching"
            onClose={() => setShowFeedbackModal(false)}
          >
            <div className="space-y-3">
              <div className="rounded-2xl bg-white p-4">
                <div className="flex h-2 overflow-hidden rounded-full bg-neutral-100">
                  <div className="bg-[#8A1538]" style={{ width: `${(sentimentCount.negative / feedbackTotal) * 100}%` }} />
                  <div className="bg-neutral-300" style={{ width: `${(sentimentCount.neutral / feedbackTotal) * 100}%` }} />
                  <div className="bg-[#15803D]" style={{ width: `${(sentimentCount.positive / feedbackTotal) * 100}%` }} />
                </div>

                <div role="tablist" className="-mx-1 mt-4 flex gap-x-4 overflow-x-auto px-1">
                  {([
                    ["all", "All", feedbackTotal, null, ""],
                    ["negative", "Concerns", sentimentCount.negative, Frown, "text-[#C62828]"],
                    ["neutral", "Neutral", sentimentCount.neutral, Meh, "text-neutral-500"],
                    ["positive", "Positive", sentimentCount.positive, Smile, "text-[#15803D]"],
                  ] as const).map(([id, label, count, Face, tone]) => (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      aria-selected={sentimentFilter === id}
                      onClick={() => setSentimentFilter(id)}
                      className={`flex shrink-0 items-center gap-1.5 border-b-2 pb-1.5 text-[13px] font-medium transition sm:text-sm ${sentimentFilter === id
                        ? "border-neutral-900 text-neutral-900"
                        : "border-transparent text-neutral-500 hover:text-neutral-900"
                        }`}
                    >
                      {Face && <Face className={`h-4 w-4 ${tone}`} />}
                      {label} <span className="tabular-nums">{count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {filteredFeedback.map((fb) => {
                const face =
                  fb.sentiment === "negative"
                    ? { Icon: Frown, bg: "bg-red-50", fg: "text-[#C62828]" }
                    : fb.sentiment === "positive"
                      ? { Icon: Smile, bg: "bg-green-50", fg: "text-[#15803D]" }
                      : { Icon: Meh, bg: "bg-neutral-100", fg: "text-neutral-500" };
                const label =
                  fb.sentiment === "negative" ? "Concern" : fb.sentiment === "positive" ? "Positive" : "Neutral";
                return (
                  <article key={fb.comment} className="flex gap-3 rounded-2xl bg-white p-4">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${face.bg}`}>
                      <face.Icon className={`h-6 w-6 ${face.fg}`} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="text-sm font-semibold">{fb.category.replace(/ \(.*\)/, "")}</p>
                        <Tip align="right" text="Sentiment score from -1 (very negative) to +1 (very positive).">
                          <span className={`text-xs tabular-nums ${face.fg}`}>
                            {label} · {fb.nlpScore > 0 ? `+${fb.nlpScore}` : fb.nlpScore}
                          </span>
                        </Tip>
                      </div>
                      <p className="text-xs text-neutral-500">{fb.theme}</p>
                      <p className="mt-2.5 text-[15px] leading-relaxed text-neutral-800">&ldquo;{fb.comment}&rdquo;</p>
                    </div>
                  </article>
                );
              })}

              <div className="rounded-2xl border-l-4 border-[#F2B705] bg-white p-4">
                <p className="text-sm font-semibold">Reminder</p>
                <p className="mt-0.5 text-sm leading-snug text-neutral-700">
                  Use comments to improve courses. Do not use them to punish individual teachers.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowFeedbackModal(false)}
                className="min-h-11 w-full rounded-xl bg-neutral-900 text-sm font-medium text-white transition hover:bg-neutral-700"
              >
                Close
              </button>
            </div>
          </ModalShell>
        )}

        {/* ══════════ FILTERS WINDOW ══════════ */}
        {showFilterModal && (
          <ModalShell
            title="Filters"
            subtitle="Year and semester update everything. Year level and course type narrow the KPIs and course lists."
            onClose={() => setShowFilterModal(false)}
            widthClass="sm:max-w-md"
          >
            <div className="space-y-3">
              <div className="space-y-4 rounded-2xl bg-white p-4">
                <div>
                  <label htmlFor="f-year" className="text-xs font-medium text-neutral-500">School year</label>
                  <select
                    id="f-year"
                    value={selectedYear}
                    onChange={(e) => {
                      const year = e.target.value;
                      setSelectedYear(year);
                      // Semester 2 of the current year has not started, so it has no data yet
                      if (TERM_DATA_STORE[`${year}_Semester 1`]?.isCurrentOrFuture) setSelectedSemester("Semester 1");
                    }}
                    className="mt-1.5 w-full rounded-xl bg-neutral-100 px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-neutral-900/20"
                  >
                    <option value="AY 2026–2027">AY 2026–2027 (Current)</option>
                    <option value="AY 2025–2026">AY 2025–2026 (Past)</option>
                    <option value="AY 2024–2025">AY 2024–2025 (Past)</option>
                    <option value="AY 2023–2024">AY 2023–2024 (Past)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="f-sem" className="text-xs font-medium text-neutral-500">Semester</label>
                  <select
                    id="f-sem"
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="mt-1.5 w-full rounded-xl bg-neutral-100 px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-neutral-900/20"
                  >
                    <option value="Semester 1">{semester2Locked ? "Semester 1 (Current)" : "Semester 1 (Done)"}</option>
                    <option value="Semester 2" disabled={semester2Locked}>{semester2Locked ? "Semester 2 (Not started, no data yet)" : "Semester 2 (Done)"}</option>
                  </select>
                </div>

                <div>
                  <p className="text-xs font-medium text-neutral-500">Year level</p>
                  <div className="mt-1.5 grid grid-cols-5 gap-1.5">
                    {([
                      ["All Year Levels", "All"],
                      ["1st Year", "1st"],
                      ["2nd Year", "2nd"],
                      ["3rd Year", "3rd"],
                      ["4th Year", "4th"],
                    ] as const).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setSelectedYearLevel(value)}
                        aria-pressed={selectedYearLevel === value}
                        className={`min-h-10 rounded-xl text-sm font-medium transition ${selectedYearLevel === value
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                          }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-neutral-500">Course type</p>
                  <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                    {([
                      ["All Courses", "All"],
                      ["Major / Professional IT", "Majors"],
                      ["General Education", "Gen Ed"],
                    ] as const).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setSelectedCourseType(value)}
                        aria-pressed={selectedCourseType === value}
                        className={`min-h-10 rounded-xl text-sm font-medium transition ${selectedCourseType === value
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                          }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="min-h-11 rounded-xl bg-white px-5 text-sm font-medium transition hover:bg-neutral-50"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setShowFilterModal(false)}
                  className="min-h-11 flex-1 rounded-xl bg-neutral-900 text-sm font-medium text-white transition hover:bg-neutral-700"
                >
                  Apply
                </button>
              </div>
            </div>
          </ModalShell>
        )}
      </div>
    </>
  );
}