"use client";

import React, { useState } from "react";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, ReferenceLine,
} from "recharts";
import {
  GraduationCap, AlertTriangle, Calendar,
  Sparkles, ChevronRight, Layers, ShieldCheck,
  BookOpen, Briefcase, Printer, Bell, Search,
  TrendingUp, Users, CheckCircle2,
  Info, RotateCcw, Filter, UserCheck,
} from "lucide-react";

// ─── DATA BY TERM (CROSS-FILTERING DATABASE) ──────────────────────────────────

interface TermData {
  totalEnrolled: number;
  availableFaculty: number;
  sectionsNeeded: number;
  facultyShortage: number; // negative number means shortage
  kpis: {
    passingRate: { value: string; delta: string; positive: boolean };
    atRiskRate: { value: string; delta: string; positive: boolean };
    retentionRate: { value: string; delta: string; positive: boolean };
    seteScore: { value: string; delta: string; positive: boolean };
    attendanceRate: { value: string; delta: string; positive: boolean };
  };
  yearLevels: Array<{ name: string; count: number; percent: string; color: string }>;
}

const TERM_DATA_STORE: Record<string, TermData> = {
  // AY 2026-2027
  "AY 2026–2027_Semester 1": {
    totalEnrolled: 1420,
    availableFaculty: 35,
    sectionsNeeded: 38,
    facultyShortage: -3,
    kpis: {
      passingRate:   { value: "92.0%", delta: "+0.6%", positive: true },
      atRiskRate:    { value: "7.9%",  delta: "-0.4%", positive: true },
      retentionRate: { value: "93.0%", delta: "+0.5%", positive: true },
      seteScore:     { value: "87.1%", delta: "+0.9%", positive: true },
      attendanceRate:{ value: "97.2%", delta: "+0.4%", positive: true },
    },
    yearLevels: [
      { name: "1st Year", count: 430, percent: "30%", color: "#8a1538" },
      { name: "2nd Year", count: 385, percent: "27%", color: "#b87333" },
      { name: "3rd Year", count: 335, percent: "24%", color: "#0f766e" },
      { name: "4th Year", count: 270, percent: "19%", color: "#64748b" },
    ],
  },
  "AY 2026–2027_Semester 2": {
    totalEnrolled: 1490,
    availableFaculty: 35,
    sectionsNeeded: 40,
    facultyShortage: -5,
    kpis: {
      passingRate:   { value: "92.5%", delta: "+0.5%", positive: true },
      atRiskRate:    { value: "7.5%",  delta: "-0.4%", positive: true },
      retentionRate: { value: "93.4%", delta: "+0.4%", positive: true },
      seteScore:     { value: "87.6%", delta: "+0.5%", positive: true },
      attendanceRate:{ value: "97.5%", delta: "+0.3%", positive: true },
    },
    yearLevels: [
      { name: "1st Year", count: 450, percent: "30%", color: "#8a1538" },
      { name: "2nd Year", count: 405, percent: "27%", color: "#b87333" },
      { name: "3rd Year", count: 350, percent: "24%", color: "#0f766e" },
      { name: "4th Year", count: 285, percent: "19%", color: "#64748b" },
    ],
  },
  "AY 2026–2027_Full Academic Year": {
    totalEnrolled: 1455,
    availableFaculty: 35,
    sectionsNeeded: 39,
    facultyShortage: -4,
    kpis: {
      passingRate:   { value: "92.2%", delta: "+0.6%", positive: true },
      atRiskRate:    { value: "7.7%",  delta: "-0.4%", positive: true },
      retentionRate: { value: "93.2%", delta: "+0.5%", positive: true },
      seteScore:     { value: "87.3%", delta: "+0.7%", positive: true },
      attendanceRate:{ value: "97.3%", delta: "+0.4%", positive: true },
    },
    yearLevels: [
      { name: "1st Year", count: 440, percent: "30%", color: "#8a1538" },
      { name: "2nd Year", count: 395, percent: "27%", color: "#b87333" },
      { name: "3rd Year", count: 342, percent: "24%", color: "#0f766e" },
      { name: "4th Year", count: 278, percent: "19%", color: "#64748b" },
    ],
  },

  // AY 2025-2026
  "AY 2025–2026_Semester 1": {
    totalEnrolled: 1310,
    availableFaculty: 35,
    sectionsNeeded: 35,
    facultyShortage: 0,
    kpis: {
      passingRate:   { value: "91.0%", delta: "+0.4%", positive: true },
      atRiskRate:    { value: "9.1%",  delta: "-0.8%", positive: true },
      retentionRate: { value: "92.1%", delta: "+0.6%", positive: true },
      seteScore:     { value: "85.9%", delta: "+0.6%", positive: true },
      attendanceRate:{ value: "96.5%", delta: "+0.5%", positive: true },
    },
    yearLevels: [
      { name: "1st Year", count: 395, percent: "30%", color: "#8a1538" },
      { name: "2nd Year", count: 355, percent: "27%", color: "#b87333" },
      { name: "3rd Year", count: 310, percent: "24%", color: "#0f766e" },
      { name: "4th Year", count: 250, percent: "19%", color: "#64748b" },
    ],
  },
  "AY 2025–2026_Semester 2": {
    totalEnrolled: 1340,
    availableFaculty: 35,
    sectionsNeeded: 36,
    facultyShortage: -1,
    kpis: {
      passingRate:   { value: "91.4%", delta: "+1.8%", positive: true },
      atRiskRate:    { value: "8.3%",  delta: "-2.1%", positive: true },
      retentionRate: { value: "92.5%", delta: "+1.5%", positive: true },
      seteScore:     { value: "86.2%", delta: "+1.4%", positive: true },
      attendanceRate:{ value: "96.8%", delta: "+1.3%", positive: true },
    },
    yearLevels: [
      { name: "1st Year", count: 405, percent: "30%", color: "#8a1538" },
      { name: "2nd Year", count: 365, percent: "27%", color: "#b87333" },
      { name: "3rd Year", count: 315, percent: "24%", color: "#0f766e" },
      { name: "4th Year", count: 255, percent: "19%", color: "#64748b" },
    ],
  },
  "AY 2025–2026_Full Academic Year": {
    totalEnrolled: 1325,
    availableFaculty: 35,
    sectionsNeeded: 35,
    facultyShortage: 0,
    kpis: {
      passingRate:   { value: "91.2%", delta: "+1.1%", positive: true },
      atRiskRate:    { value: "8.7%",  delta: "-1.5%", positive: true },
      retentionRate: { value: "92.3%", delta: "+1.1%", positive: true },
      seteScore:     { value: "86.1%", delta: "+1.0%", positive: true },
      attendanceRate:{ value: "96.6%", delta: "+0.9%", positive: true },
    },
    yearLevels: [
      { name: "1st Year", count: 400, percent: "30%", color: "#8a1538" },
      { name: "2nd Year", count: 360, percent: "27%", color: "#b87333" },
      { name: "3rd Year", count: 312, percent: "24%", color: "#0f766e" },
      { name: "4th Year", count: 253, percent: "19%", color: "#64748b" },
    ],
  },

  // AY 2024-2025
  "AY 2024–2025_Semester 1": {
    totalEnrolled: 1180,
    availableFaculty: 34,
    sectionsNeeded: 32,
    facultyShortage: 0,
    kpis: {
      passingRate:   { value: "89.9%", delta: "+0.7%", positive: true },
      atRiskRate:    { value: "10.8%", delta: "-0.6%", positive: true },
      retentionRate: { value: "90.8%", delta: "+0.7%", positive: true },
      seteScore:     { value: "84.8%", delta: "+0.8%", positive: true },
      attendanceRate:{ value: "95.5%", delta: "+0.6%", positive: true },
    },
    yearLevels: [
      { name: "1st Year", count: 360, percent: "30%", color: "#8a1538" },
      { name: "2nd Year", count: 320, percent: "27%", color: "#b87333" },
      { name: "3rd Year", count: 280, percent: "24%", color: "#0f766e" },
      { name: "4th Year", count: 220, percent: "19%", color: "#64748b" },
    ],
  },
  "AY 2024–2025_Semester 2": {
    totalEnrolled: 1250,
    availableFaculty: 34,
    sectionsNeeded: 34,
    facultyShortage: 0,
    kpis: {
      passingRate:   { value: "90.6%", delta: "+0.7%", positive: true },
      atRiskRate:    { value: "9.9%",  delta: "-0.9%", positive: true },
      retentionRate: { value: "91.5%", delta: "+0.7%", positive: true },
      seteScore:     { value: "85.3%", delta: "+0.5%", positive: true },
      attendanceRate:{ value: "96.0%", delta: "+0.5%", positive: true },
    },
    yearLevels: [
      { name: "1st Year", count: 380, percent: "30%", color: "#8a1538" },
      { name: "2nd Year", count: 340, percent: "27%", color: "#b87333" },
      { name: "3rd Year", count: 295, percent: "24%", color: "#0f766e" },
      { name: "4th Year", count: 235, percent: "19%", color: "#64748b" },
    ],
  },
  "AY 2024–2025_Full Academic Year": {
    totalEnrolled: 1215,
    availableFaculty: 34,
    sectionsNeeded: 33,
    facultyShortage: 0,
    kpis: {
      passingRate:   { value: "90.2%", delta: "+0.7%", positive: true },
      atRiskRate:    { value: "10.3%", delta: "-0.8%", positive: true },
      retentionRate: { value: "91.2%", delta: "+0.7%", positive: true },
      seteScore:     { value: "85.0%", delta: "+0.6%", positive: true },
      attendanceRate:{ value: "95.8%", delta: "+0.6%", positive: true },
    },
    yearLevels: [
      { name: "1st Year", count: 370, percent: "30%", color: "#8a1538" },
      { name: "2nd Year", count: 330, percent: "27%", color: "#b87333" },
      { name: "3rd Year", count: 288, percent: "24%", color: "#0f766e" },
      { name: "4th Year", count: 227, percent: "19%", color: "#64748b" },
    ],
  },

  // AY 2023-2024
  "AY 2023–2024_Semester 1": {
    totalEnrolled: 1040,
    availableFaculty: 32,
    sectionsNeeded: 28,
    facultyShortage: 0,
    kpis: {
      passingRate:   { value: "88.4%", delta: "Baseline", positive: true },
      atRiskRate:    { value: "12.6%", delta: "Baseline", positive: false },
      retentionRate: { value: "89.6%", delta: "Baseline", positive: true },
      seteScore:     { value: "83.1%", delta: "Baseline", positive: true },
      attendanceRate:{ value: "94.2%", delta: "Baseline", positive: true },
    },
    yearLevels: [
      { name: "1st Year", count: 315, percent: "30%", color: "#8a1538" },
      { name: "2nd Year", count: 280, percent: "27%", color: "#b87333" },
      { name: "3rd Year", count: 250, percent: "24%", color: "#0f766e" },
      { name: "4th Year", count: 195, percent: "19%", color: "#64748b" },
    ],
  },
  "AY 2023–2024_Semester 2": {
    totalEnrolled: 1110,
    availableFaculty: 32,
    sectionsNeeded: 30,
    facultyShortage: 0,
    kpis: {
      passingRate:   { value: "89.2%", delta: "+0.8%", positive: true },
      atRiskRate:    { value: "11.4%", delta: "-1.2%", positive: true },
      retentionRate: { value: "90.1%", delta: "+0.5%", positive: true },
      seteScore:     { value: "84.0%", delta: "+0.9%", positive: true },
      attendanceRate:{ value: "94.9%", delta: "+0.7%", positive: true },
    },
    yearLevels: [
      { name: "1st Year", count: 335, percent: "30%", color: "#8a1538" },
      { name: "2nd Year", count: 300, percent: "27%", color: "#b87333" },
      { name: "3rd Year", count: 265, percent: "24%", color: "#0f766e" },
      { name: "4th Year", count: 210, percent: "19%", color: "#64748b" },
    ],
  },
  "AY 2023–2024_Full Academic Year": {
    totalEnrolled: 1075,
    availableFaculty: 32,
    sectionsNeeded: 29,
    facultyShortage: 0,
    kpis: {
      passingRate:   { value: "88.8%", delta: "+0.4%", positive: true },
      atRiskRate:    { value: "12.0%", delta: "-0.6%", positive: true },
      retentionRate: { value: "89.8%", delta: "+0.3%", positive: true },
      seteScore:     { value: "83.6%", delta: "+0.5%", positive: true },
      attendanceRate:{ value: "94.5%", delta: "+0.4%", positive: true },
    },
    yearLevels: [
      { name: "1st Year", count: 325, percent: "30%", color: "#8a1538" },
      { name: "2nd Year", count: 290, percent: "27%", color: "#b87333" },
      { name: "3rd Year", count: 258, percent: "24%", color: "#0f766e" },
      { name: "4th Year", count: 202, percent: "19%", color: "#64748b" },
    ],
  },
};

const ENROLLMENT_FORECAST = [
  { term: "AY 2023–2024 Semester 1", short: "23-24 S1", actual: 1040, forecast: null },
  { term: "AY 2023–2024 Semester 2", short: "23-24 S2", actual: 1110, forecast: null },
  { term: "AY 2024–2025 Semester 1", short: "24-25 S1", actual: 1180, forecast: null },
  { term: "AY 2024–2025 Semester 2", short: "24-25 S2", actual: 1250, forecast: null },
  { term: "AY 2025–2026 Semester 1", short: "25-26 S1", actual: 1310, forecast: null },
  { term: "AY 2025–2026 Semester 2", short: "25-26 S2", actual: 1340, forecast: 1340 },
  { term: "AY 2026–2027 Semester 1", short: "26-27 S1 (Forecast)", actual: null, forecast: 1420 },
  { term: "AY 2026–2027 Semester 2", short: "26-27 S2 (Forecast)", actual: null, forecast: 1490 },
];

const KPI_METRICS_DATA: Record<number, {
  title: string;
  subtitle: string;
  unit: string;
  target: number;
  domain: [number, number];
  color: string;
  data: Array<{ term: string; short: string; value: number; target: number }>;
  summaryValue: string;
  summaryLabel: string;
  statusNote: string;
}> = {
  1: {
    title: "Student Passing Rate Trend (%)",
    subtitle: "Historical student passing rate across all BSIT courses · Target: ≥ 90%",
    unit: "%",
    target: 90,
    domain: [85, 96],
    color: "#8a1538",
    data: [
      { term: "AY 2023–2024 Semester 1", short: "23-24 S1", value: 88.4, target: 90 },
      { term: "AY 2023–2024 Semester 2", short: "23-24 S2", value: 89.2, target: 90 },
      { term: "AY 2024–2025 Semester 1", short: "24-25 S1", value: 89.9, target: 90 },
      { term: "AY 2024–2025 Semester 2", short: "24-25 S2", value: 90.6, target: 90 },
      { term: "AY 2025–2026 Semester 1", short: "25-26 S1", value: 91.0, target: 90 },
      { term: "AY 2025–2026 Semester 2", short: "25-26 S2", value: 91.4, target: 90 },
      { term: "AY 2026–2027 Semester 1", short: "26-27 S1 (Projected)", value: 92.0, target: 90 },
      { term: "AY 2026–2027 Semester 2", short: "26-27 S2 (Projected)", value: 92.5, target: 90 },
    ],
    summaryValue: "92.0%",
    summaryLabel: "BSIT Passing Rate",
    statusNote: "Target Met: +2.0% above standard",
  },
  2: {
    title: "At-Risk Student Rate Trend (%)",
    subtitle: "Percentage of students with midterm failures or drop warnings · Target: ≤ 10%",
    unit: "%",
    target: 10,
    domain: [5, 15],
    color: "#dc2626",
    data: [
      { term: "AY 2023–2024 Semester 1", short: "23-24 S1", value: 12.6, target: 10 },
      { term: "AY 2023–2024 Semester 2", short: "23-24 S2", value: 11.4, target: 10 },
      { term: "AY 2024–2025 Semester 1", short: "24-25 S1", value: 10.8, target: 10 },
      { term: "AY 2024–2025 Semester 2", short: "24-25 S2", value: 9.9, target: 10 },
      { term: "AY 2025–2026 Semester 1", short: "25-26 S1", value: 9.1, target: 10 },
      { term: "AY 2025–2026 Semester 2", short: "25-26 S2", value: 8.3, target: 10 },
      { term: "AY 2026–2027 Semester 1", short: "26-27 S1 (Projected)", value: 7.9, target: 10 },
      { term: "AY 2026–2027 Semester 2", short: "26-27 S2 (Projected)", value: 7.5, target: 10 },
    ],
    summaryValue: "7.9%",
    summaryLabel: "At-Risk Rate",
    statusNote: "Controlled: Safely under 10% ceiling",
  },
  3: {
    title: "Student Retention Rate Trend (%)",
    subtitle: "Semester-to-semester cohort persistence across 1st to 4th year · Target: ≥ 90%",
    unit: "%",
    target: 90,
    domain: [85, 96],
    color: "#0f766e",
    data: [
      { term: "AY 2023–2024 Semester 1", short: "23-24 S1", value: 89.6, target: 90 },
      { term: "AY 2023–2024 Semester 2", short: "23-24 S2", value: 90.1, target: 90 },
      { term: "AY 2024–2025 Semester 1", short: "24-25 S1", value: 90.8, target: 90 },
      { term: "AY 2024–2025 Semester 2", short: "24-25 S2", value: 91.5, target: 90 },
      { term: "AY 2025–2026 Semester 1", short: "25-26 S1", value: 92.1, target: 90 },
      { term: "AY 2025–2026 Semester 2", short: "25-26 S2", value: 92.5, target: 90 },
      { term: "AY 2026–2027 Semester 1", short: "26-27 S1 (Projected)", value: 93.0, target: 90 },
      { term: "AY 2026–2027 Semester 2", short: "26-27 S2 (Projected)", value: 93.4, target: 90 },
    ],
    summaryValue: "93.0%",
    summaryLabel: "Student Retention Rate",
    statusNote: "Strong persistence: +3.0% above target",
  },
  4: {
    title: "Faculty Teaching Performance (SETE) Trend (%)",
    subtitle: "Student Evaluation of Teachers aggregate satisfactory score · Target: ≥ 85%",
    unit: "%",
    target: 85,
    domain: [80, 92],
    color: "#3b82f6",
    data: [
      { term: "AY 2023–2024 Semester 1", short: "23-24 S1", value: 83.1, target: 85 },
      { term: "AY 2023–2024 Semester 2", short: "23-24 S2", value: 84.0, target: 85 },
      { term: "AY 2024–2025 Semester 1", short: "24-25 S1", value: 84.8, target: 85 },
      { term: "AY 2024–2025 Semester 2", short: "24-25 S2", value: 85.3, target: 85 },
      { term: "AY 2025–2026 Semester 1", short: "25-26 S1", value: 85.9, target: 85 },
      { term: "AY 2025–2026 Semester 2", short: "25-26 S2", value: 86.2, target: 85 },
      { term: "AY 2026–2027 Semester 1", short: "26-27 S1 (Projected)", value: 87.1, target: 85 },
      { term: "AY 2026–2027 Semester 2", short: "26-27 S2 (Projected)", value: 87.6, target: 85 },
    ],
    summaryValue: "87.1%",
    summaryLabel: "Faculty SETE Average",
    statusNote: "Target Met: +2.1% above standard",
  },
  5: {
    title: "Faculty Attendance Rate Trend (%)",
    subtitle: "Conducted class sessions vs scheduled timetable · Target: ≥ 95%",
    unit: "%",
    target: 95,
    domain: [90, 100],
    color: "#b87333",
    data: [
      { term: "AY 2023–2024 Semester 1", short: "23-24 S1", value: 94.2, target: 95 },
      { term: "AY 2023–2024 Semester 2", short: "23-24 S2", value: 94.9, target: 95 },
      { term: "AY 2024–2025 Semester 1", short: "24-25 S1", value: 95.5, target: 95 },
      { term: "AY 2024–2025 Semester 2", short: "24-25 S2", value: 96.0, target: 95 },
      { term: "AY 2025–2026 Semester 1", short: "25-26 S1", value: 96.5, target: 95 },
      { term: "AY 2025–2026 Semester 2", short: "25-26 S2", value: 96.8, target: 95 },
      { term: "AY 2026–2027 Semester 1", short: "26-27 S1 (Projected)", value: 97.2, target: 95 },
      { term: "AY 2026–2027 Semester 2", short: "26-27 S2 (Projected)", value: 97.5, target: 95 },
    ],
    summaryValue: "97.2%",
    summaryLabel: "Faculty Attendance",
    statusNote: "Benchmark Exceeded: +2.2% above target",
  },
};

const KPI_DEFINITIONS = [
  {
    id: 1, key: "passingRate", name: "Student Passing Rate", target: "≥ 90%",
    category: "academic",
    objective: "Maintain high academic success and prevent student failures across the program.",
    formula: "(Students with Passing Grades ÷ Total Enrolled) × 100",
    action: "Conduct syllabus reviews on high-failure subjects, require faculty consultation hours, and organize remedial reviews.",
  },
  {
    id: 2, key: "atRiskRate", name: "At-Risk Student Rate", target: "≤ 10%",
    category: "academic",
    objective: "Detect struggling students early to prevent mid-term drops and course failures.",
    formula: "(Students Failing at Midterms ÷ Total Enrolled) × 100",
    action: "Send early academic warnings and schedule mandatory advising sessions with course instructors.",
  },
  {
    id: 3, key: "retentionRate", name: "Student Retention Rate", target: "≥ 90%",
    category: "academic",
    objective: "Minimize dropouts and ensure students persist into the next term or year level.",
    formula: "(Students Remaining or Re-enrolling ÷ Enrolled at Term Start) × 100",
    action: "Conduct exit interviews with withdrawing students and coordinate financial or academic support with guidance.",
  },
  {
    id: 4, key: "seteScore", name: "Faculty Teaching (SETE)", target: "≥ 85%",
    category: "faculty",
    objective: "Ensure faculty deliver high-quality instruction that meets student learning needs.",
    formula: "(Faculty with Satisfactory SETE ÷ Total Evaluated Faculty) × 100",
    action: "Pair low-scoring faculty with master faculty mentors and review classroom pacing and exam items.",
  },
  {
    id: 5, key: "attendanceRate", name: "Faculty Attendance Rate", target: "≥ 95%",
    category: "faculty",
    objective: "Monitor how consistently instructors conduct their scheduled classes.",
    formula: "(Classes Conducted ÷ Scheduled Classes) × 100",
    action: "Require make-up classes for missed sessions and review teaching load distribution for overbooked instructors.",
  },
];

const FACULTY_WORKLOAD = [
  { name: "Prof. R. De Guzman",        subject: "Data Structures",   sections: 4, units: 18, status: "Full Load"  },
  { name: "Asst. Prof. M. Santos",     subject: "Adv. Databases",    sections: 4, units: 18, status: "Full Load"  },
  { name: "Engr. J. Alcantara",        subject: "Discrete Math",     sections: 5, units: 21, status: "Overloaded" },
  { name: "Ms. C. Hernandez",          subject: "OOP Java (IT 102)", sections: 4, units: 18, status: "Full Load"  },
  { name: "Vacant (Recruitment Open)", subject: "BAT 401 & Electives",sections:3, units: 9,  status: "Unassigned" },
];

const BOTTLENECK_SUBJECTS = [
  { code: "IT 201",   name: "Data Structures & Algorithms", failRate: 23.4, students: 184 },
  { code: "IT 301",   name: "Advanced Database Systems",    failRate: 21.8, students: 162 },
  { code: "MATH 201", name: "Discrete Mathematics",         failRate: 19.1, students: 190 },
];

const SETE_CRITERIA = [
  { name: "Syllabus Coverage",    score: 92.1 },
  { name: "Student Consultation", score: 89.4 },
  { name: "Instructional Clarity",score: 88.5 },
  { name: "Assessment Fairness",  score: 84.2 },
  { name: "Classroom Pacing",     score: 81.6 },
];

const AT_RISK_STUDENTS = [
  { name: "BSIT 2-1 Section", atRisk: 18, total: 40, subject: "IT 201" },
  { name: "BSIT 2-3 Section", atRisk: 14, total: 38, subject: "IT 201" },
  { name: "BSIT 3-2 Section", atRisk: 12, total: 36, subject: "IT 301" },
];

// ─── HIGH-CONTRAST READABLE TOOLTIP ──────────────────────────────────────────

function CustomChartTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const p = payload[0];
    const fullTerm = p.payload.term ?? label;
    const value = p.value;
    const isKpi = p.payload.target !== undefined;
    return (
      <div className="bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-200 text-xs">
        <p className="font-bold text-slate-800 text-[11px]">{fullTerm}</p>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-base font-black text-[#8a1538] tracking-tight">{value}</span>
          <span className="text-[11px] font-semibold text-slate-500">{isKpi ? "%" : "Students"}</span>
        </div>
        {isKpi && (
          <div className="mt-1 pt-1 border-t border-slate-100 flex items-center justify-between gap-3 text-[10px]">
            <span className="text-slate-400">Target Benchmark:</span>
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

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function Dashboard() {
  const [chartView,        setChartView]        = useState<"forecast" | "actual">("forecast");
  const [activeKpiId,      setActiveKpiId]      = useState<number | null>(null);
  const [modalKpi,         setModalKpi]         = useState<typeof KPI_DEFINITIONS[0] | null>(null);
  const [showIntervention, setShowIntervention] = useState(false);
  const [selectedYear,     setSelectedYear]     = useState("AY 2026–2027");
  const [selectedSemester, setSelectedSemester] = useState("Semester 1");

  // Lookup cross-filtered data
  const filterKey = `${selectedYear}_${selectedSemester}`;
  const currentTermData = TERM_DATA_STORE[filterKey] ?? TERM_DATA_STORE["AY 2026–2027_Semester 1"];

  const activeKpiConfig = activeKpiId ? KPI_METRICS_DATA[activeKpiId] : null;

  const defaultChartData = ENROLLMENT_FORECAST.map((d) => ({
    term:     d.term,
    short:    d.short,
    students: chartView === "actual" ? d.actual : (d.forecast ?? d.actual),
  }));

  return (
    <div className="min-h-screen font-sans text-slate-800 flex">

      {/* ══════════════════ SIDEBAR ══════════════════ */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col sticky top-0 h-screen bg-white/80 backdrop-blur-sm border-r border-slate-200/60 p-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-200/60">
          <div className="w-8 h-8 rounded-xl bg-[#8a1538] flex items-center justify-center shadow-sm shadow-red-900/20">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight text-slate-900 leading-tight">SpartanPulse</h1>
            <p className="text-[10px] text-slate-400 font-medium">BatStateU · CICS ARASOF</p>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/80 border border-slate-200/60 mb-4 text-xs text-slate-400">
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span>Search dashboard…</span>
        </div>

        {/* Nav */}
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">Main Menu</p>
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
            <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-bold">2</span>
          </button>

          <button
            onClick={() => setModalKpi(KPI_DEFINITIONS[0])}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100/80 transition text-xs font-semibold text-left"
          >
            <BookOpen className="w-4 h-4 text-slate-400" />KPI Formulas &amp; Targets
          </button>
        </nav>

        {/* User card at bottom */}
        <div className="mt-auto pt-3 border-t border-slate-200/60">
          <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-100/60 transition">
            <div className="w-8 h-8 rounded-full bg-[#8a1538]/10 border border-[#8a1538]/20 flex items-center justify-center font-bold text-[#8a1538] text-xs">
              PC
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">Program Chair</p>
              <p className="text-[10px] text-slate-400 truncate">BS Information Technology</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-400 px-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />RA 10173 Compliant
          </div>
        </div>
      </aside>

      {/* ══════════════════ MAIN AREA ══════════════════ */}
      <main className="flex-1 min-w-0 flex flex-col">

        {/* ── TOP NAV BAR (Responsive, no wrapping bug, icon instead of emoji) ── */}
        <header className="sticky top-0 z-20 flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-2.5 bg-white/75 backdrop-blur-md border-b border-slate-200/50 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#8a1538]/10 text-[#8a1538] flex items-center justify-center shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight truncate">
                Good evening, Program Chair
              </h2>
              <p className="text-[10px] text-slate-500 truncate">
                Academic &amp; Faculty Decision Support · {selectedSemester} {selectedYear}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Year filter with full label */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 shadow-xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer text-xs"
              >
                <option value="AY 2026–2027">AY 2026–2027 (Active/Forecast)</option>
                <option value="AY 2025–2026">AY 2025–2026</option>
                <option value="AY 2024–2025">AY 2024–2025</option>
                <option value="AY 2023–2024">AY 2023–2024</option>
              </select>
            </div>

            {/* Semester filter with full label */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 shadow-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer text-xs"
              >
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Full Academic Year">Full Academic Year</option>
              </select>
            </div>

            {/* Alert bell */}
            <button
              onClick={() => setShowIntervention(true)}
              className="relative p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition shadow-xs"
              title="2 Action Protocols"
            >
              <Bell className="w-4 h-4 text-slate-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-black rounded-full flex items-center justify-center">2</span>
            </button>

            {/* Export */}
            <button
              onClick={() => window.print()}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              <Printer className="w-3.5 h-3.5" />Export
            </button>
          </div>
        </header>

        {/* ── DASHBOARD BODY ── */}
        <div className="flex-1 p-3.5 sm:p-5 lg:p-6 space-y-3.5">

          {/* ── TOP OPERATIONAL STRIP (Brought back, compact & cross-filtered) ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
            {/* Total Enrolled */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 p-3 sm:p-3.5 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-[#8a1538] flex items-center justify-center shrink-0">
                <Users className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                  {currentTermData.totalEnrolled.toLocaleString()}
                </div>
                <div className="text-[11px] font-semibold text-slate-700 mt-0.5 truncate">Total Enrolled</div>
                <div className="text-[9px] text-slate-400 truncate">{selectedSemester} {selectedYear}</div>
              </div>
            </div>

            {/* Total Faculty */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 p-3 sm:p-3.5 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <Briefcase className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                  {currentTermData.availableFaculty}
                </div>
                <div className="text-[11px] font-semibold text-slate-700 mt-0.5 truncate">Available Faculty</div>
                <div className="text-[9px] text-slate-400 truncate">Regular Teaching Staff</div>
              </div>
            </div>

            {/* Total Sections */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 p-3 sm:p-3.5 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Layers className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                  {currentTermData.sectionsNeeded}
                </div>
                <div className="text-[11px] font-semibold text-slate-700 mt-0.5 truncate">Class Sections Needed</div>
                <div className="text-[9px] text-slate-400 truncate">Classroom Allocation</div>
              </div>
            </div>

            {/* Staffing Status */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 p-3 sm:p-3.5 shadow-xs flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                currentTermData.facultyShortage < 0 ? "bg-rose-50 text-[#8a1538]" : "bg-emerald-50 text-emerald-700"
              }`}>
                {currentTermData.facultyShortage < 0 ? <AlertTriangle className="w-4.5 h-4.5" /> : <CheckCircle2 className="w-4.5 h-4.5" />}
              </div>
              <div className="min-w-0">
                <div className={`text-xl sm:text-2xl font-black tracking-tight leading-none ${
                  currentTermData.facultyShortage < 0 ? "text-[#8a1538]" : "text-emerald-700"
                }`}>
                  {currentTermData.facultyShortage < 0 ? `${currentTermData.facultyShortage}` : "Balanced"}
                </div>
                <div className="text-[11px] font-semibold text-slate-700 mt-0.5 truncate">
                  {currentTermData.facultyShortage < 0 ? "Staff Shortage" : "Staffing Status"}
                </div>
                <div className="text-[9px] text-slate-400 truncate">
                  {currentTermData.facultyShortage < 0 ? "Part-time Hiring Required" : "All Sections Covered"}
                </div>
              </div>
            </div>
          </div>

          {/* ── KPI SECTION WITH DISTINCT HEADERS ── */}
          <section className="space-y-1.5">
            {/* 2 Category Headers */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-2.5 sm:gap-3">
              <div className="lg:col-span-3">
                <div className="bg-[#8a1538] text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-xl text-center shadow-xs">
                  STUDENT ACADEMIC PERFORMANCE
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="bg-[#1e293b] text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-xl text-center shadow-xs">
                  TEACHING QUALITY &amp; SETE
                </div>
              </div>
            </div>

            {/* Responsive KPI Grid: 2 columns on mobile, 5 on desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
              {KPI_DEFINITIONS.map((def) => {
                const isSelected = activeKpiId === def.id;
                const metricVal = currentTermData.kpis[def.key as keyof typeof currentTermData.kpis];

                return (
                  <div
                    key={def.id}
                    onClick={() => setActiveKpiId(isSelected ? null : def.id)}
                    className={`relative bg-white/95 p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                      isSelected
                        ? "border-[#8a1538]/70 shadow-sm bg-rose-50/15"
                        : "border-slate-200/80 shadow-xs hover:border-[#8a1538]/40 hover:shadow-xs"
                    }`}
                  >
                    {/* Top Row: KPI # and Delta */}
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        KPI {def.id}
                      </span>
                      <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        def.category === "faculty"
                          ? "text-amber-700 bg-amber-50"
                          : metricVal.positive
                          ? "text-emerald-700 bg-emerald-50"
                          : "text-red-700 bg-red-50"
                      }`}>
                        {metricVal.delta}
                      </span>
                    </div>

                    {/* Metric Value & Name */}
                    <div>
                      <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                        {metricVal.value}
                      </div>
                      <div className="text-[11px] sm:text-xs font-semibold text-slate-700 mt-1 line-clamp-1">
                        {def.name}
                      </div>
                    </div>

                    {/* Bottom Row: Target & Lower Popover */}
                    <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Target: <strong className="text-slate-700">{def.target}</strong></span>

                      {/* Formula hover trigger */}
                      <div className="relative group/formula">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalKpi(def);
                          }}
                          className="flex items-center gap-0.5 text-slate-500 hover:text-[#8a1538] font-semibold transition py-0.5"
                          title="Click or hover to view formula"
                        >
                          <Info className="w-3 h-3 text-slate-400 group-hover/formula:text-[#8a1538]" />
                          <span>Formula</span>
                        </button>

                        {/* Glassmorphic Popover positioned BELOW the button so it never covers the KPI */}
                        <div className="absolute right-0 top-full mt-2 hidden group-hover/formula:block z-40 w-64 p-3.5 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 ring-1 ring-black/5 text-left pointer-events-none">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-[#8a1538]">Formula Protocol</p>
                          <p className="font-mono text-[10px] text-slate-900 bg-slate-50/90 p-2 rounded-xl border border-slate-200/80 my-1.5 font-semibold leading-relaxed">
                            {def.formula}
                          </p>
                          <p className="text-[10px] text-slate-600 leading-snug">
                            <strong>Objective:</strong> {def.objective}
                          </p>
                          <p className="text-[10px] text-emerald-700 font-semibold mt-1.5">
                            ✓ Target Standard: {def.target}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── ALERT BANNER (Chic dark slate & red styling, NO yellow!) ── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:px-4 sm:py-2.5 rounded-xl bg-slate-900 text-white shadow-sm border border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <p className="text-xs text-slate-200 leading-snug">
                <span className="font-bold text-white">Management Attention Required — </span>
                <span className="text-slate-300">
                  <strong className="text-red-400 font-semibold">IT 201 (23.4%)</strong> and <strong className="text-red-400 font-semibold">IT 301 (21.8%)</strong> exceeded the 20% midterm failure threshold. Next semester also indicates a <strong className="text-amber-300 font-semibold">shortage of 3 instructors</strong> for 38 sections.
                </span>
              </p>
            </div>
            <button
              onClick={() => setShowIntervention(true)}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#8a1538] hover:bg-[#a01a42] text-white rounded-lg text-xs font-semibold transition"
            >
              <span>See Action Checklist</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* ── MAIN INTERACTIVE CHART SECTION ── */}
          <section className="bg-white/95 rounded-2xl border border-slate-200/80 shadow-xs p-3.5 sm:p-5">
            {/* Header row with Dynamic Title & Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    {activeKpiConfig ? activeKpiConfig.title : "Student Enrollment & Section Demand Curve"}
                  </h3>
                  {activeKpiConfig && (
                    <span className="text-[10px] font-bold bg-[#8a1538]/10 text-[#8a1538] px-2 py-0.5 rounded-full border border-[#8a1538]/20">
                      KPI {activeKpiId} Selected
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  {activeKpiConfig ? activeKpiConfig.subtitle : `Historical student trajectory with predictive forecast for ${selectedYear}`}
                </p>
              </div>

              {/* View switchers (Visible on all screens) */}
              <div className="flex items-center gap-2">
                {activeKpiConfig ? (
                  <button
                    onClick={() => setActiveKpiId(null)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                    title="Return to enrollment curve"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to Forecast</span>
                  </button>
                ) : (
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
                    <button
                      onClick={() => setChartView("forecast")}
                      className={`px-3 py-1 rounded-lg transition text-[11px] ${
                        chartView === "forecast" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      Next Term Forecast
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

            {/* Responsive Chart & Hero Side Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 pt-3.5">
              <div className="lg:col-span-3 h-[230px] min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
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
                        stroke={activeKpiConfig.color}
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: activeKpiConfig.color, stroke: "#fff", strokeWidth: 1.5 }}
                        activeDot={{ r: 6, fill: activeKpiConfig.color, stroke: "#fff", strokeWidth: 2 }}
                      />
                    </LineChart>
                  ) : (
                    <AreaChart data={defaultChartData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                      <defs>
                        <linearGradient id="enrollmentGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8a1538" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#8a1538" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="short" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[900, 1600]} />
                      <Tooltip content={<CustomChartTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="students"
                        name="Enrollment"
                        stroke="#8a1538"
                        strokeWidth={2.5}
                        fill="url(#enrollmentGrad)"
                        connectNulls
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>

              {/* Side Panel: Hero Highlight for Predicted Demand */}
              <div className="border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-5 flex flex-col justify-between space-y-2.5">
                {activeKpiConfig ? (
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-xs text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{activeKpiConfig.summaryLabel}</p>
                      <div className="text-3xl font-black text-slate-900 tracking-tight mt-1">{activeKpiConfig.summaryValue}</div>
                      <p className="text-[10px] text-emerald-700 font-bold mt-1.5 bg-emerald-50 py-0.5 px-2 rounded-full inline-block border border-emerald-200">
                        {activeKpiConfig.statusNote}
                      </p>
                    </div>

                    <div className="text-[11px] space-y-1.5">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Target Standard:</span>
                        <strong className="text-slate-900">{activeKpiConfig.target}%</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Institutional Review:</span>
                        <strong className="text-emerald-700">Satisfactory</strong>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200 leading-snug">
                      💡 Click the card again or press <strong>&ldquo;Reset to Forecast&rdquo;</strong> to view the enrollment curve.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Hero Highlight for Projected Demand */}
                    <div className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-sm text-center">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#8a1538] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        Predicted Student Demand
                      </span>
                      <div className="text-3xl font-black text-slate-900 tracking-tight mt-1">
                        1,420
                        <span className="text-xs font-semibold text-slate-500 ml-1">Students</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5">AY 2026–2027 · 38 Sections Needed</p>

                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] text-slate-600">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Model Error (MAPE): <strong>1.11%</strong></span>
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 rounded-full border border-emerald-200">High Precision</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      {[
                        ["Available Instructors", "35 Regular Faculty"],
                        ["Class Sections Needed", "38 Sections"],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between py-0.5 border-b border-slate-100 text-[11px]">
                          <span className="text-slate-500">{k}:</span>
                          <strong className="text-slate-900">{v}</strong>
                        </div>
                      ))}
                      <div className="flex justify-between py-1 px-2 bg-rose-50 rounded-lg text-[11px] font-bold text-[#8a1538] border border-rose-200">
                        <span>Staff Shortage:</span>
                        <span>−3 Instructors Needed</span>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200 leading-snug">
                      💡 <strong>Program Chair Action:</strong> Request 3 part-time instructors from Dean 2 weeks prior to enrollment.
                    </p>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* ── ROW: Year-Level Enrollment + SETE Evaluation ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Year-Level Distribution (formerly cohort) */}
            <div className="bg-white/95 rounded-2xl border border-slate-200/80 shadow-xs p-4 flex flex-col">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Student Year-Level Distribution</h3>
                  <p className="text-[11px] text-slate-500">Enrollment breakdown across 1st to 4th year levels</p>
                </div>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                  {currentTermData.totalEnrolled.toLocaleString()} Total
                </span>
              </div>
              <div className="h-[155px] min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={140}>
                  <PieChart>
                    <Pie data={currentTermData.yearLevels} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="count">
                      {currentTermData.yearLevels.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }: any) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="bg-white/95 px-3 py-1.5 rounded-xl shadow-lg border border-slate-200 text-xs">
                              <p className="font-bold text-slate-800">{item.name}</p>
                              <p className="text-slate-600 font-medium">{item.count} students ({item.percent})</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-1.5 mt-auto pt-2.5 border-t border-slate-100 text-[11px]">
                {currentTermData.yearLevels.map((c) => (
                  <div key={c.name} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="text-slate-600 font-medium">{c.name}</span>
                    </div>
                    <strong className="text-slate-900">{c.count}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* SETE Breakdown */}
            <div className="bg-white/95 rounded-2xl border border-slate-200/80 shadow-xs p-4 flex flex-col">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Teaching Evaluation (SETE) Scores</h3>
                  <p className="text-[11px] text-slate-500">Student evaluation rating per teaching criterion (Target ≥85%)</p>
                </div>
                <span className="text-[10px] font-bold text-purple-800 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                  {currentTermData.kpis.seteScore.value} Avg
                </span>
              </div>
              <div className="space-y-2.5 flex-1">
                {SETE_CRITERIA.map((c) => (
                  <div key={c.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">{c.name}</span>
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
              <p className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500 leading-snug">
                💡 <em>Classroom Pacing (81.6%)</em> and <em>Assessment Fairness (84.2%)</em> fell below the 85% target — pair affected instructors with senior mentors.
              </p>
            </div>
          </div>

          {/* ── BOTTOM ROW: Faculty Table + Bottleneck Courses + Flagged Sections ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Faculty Teaching Load Table */}
            <div className="lg:col-span-2 bg-white/95 rounded-2xl border border-slate-200/80 shadow-xs p-4">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Faculty Teaching Load &amp; Section Allocation</h3>
                  <p className="text-[11px] text-slate-500">Assigned sections per instructor · Standard max 18–21 units</p>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">{selectedYear}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400">
                      <th className="pb-2 pr-3">Instructor</th>
                      <th className="pb-2 pr-3">Course</th>
                      <th className="pb-2 text-center pr-3">Sec</th>
                      <th className="pb-2 text-center pr-3">Units</th>
                      <th className="pb-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {FACULTY_WORKLOAD.map((f, i) => (
                      <tr key={i} className="hover:bg-slate-50/60 transition">
                        <td className="py-2.5 pr-3 font-semibold text-slate-900 whitespace-nowrap">{f.name}</td>
                        <td className="py-2.5 pr-3 text-slate-500 whitespace-nowrap">{f.subject}</td>
                        <td className="py-2.5 pr-3 text-center font-bold">{f.sections}</td>
                        <td className="py-2.5 pr-3 text-center font-bold">{f.units}</td>
                        <td className="py-2.5 text-right"><StatusBadge status={f.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right column: High-Failure Courses & Flagged Sections */}
            <div className="space-y-4">
              {/* High Failure Courses */}
              <div className="bg-white/95 rounded-2xl border border-slate-200/80 shadow-xs p-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">High-Failure Courses</h3>
                    <p className="text-[10px] text-slate-500">Midterm failure rates exceeding 20%</p>
                  </div>
                  <span className="text-[10px] bg-red-50 text-red-800 font-bold border border-red-200 px-2 py-0.5 rounded-full">2 Critical</span>
                </div>
                <div className="space-y-2">
                  {BOTTLENECK_SUBJECTS.map((s) => (
                    <div key={s.code} className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-slate-800">{s.code}</span>
                        <span className={s.failRate >= 20 ? "text-red-700" : "text-slate-600"}>{s.failRate}%</span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate mb-1">{s.name}</p>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full ${s.failRate >= 20 ? "bg-[#8a1538]" : "bg-emerald-500"}`} style={{ width: `${(s.failRate / 30) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Flagged Sections */}
              <div className="bg-white/95 rounded-2xl border border-slate-200/80 shadow-xs p-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Flagged Class Sections</h3>
                  <span className="text-[10px] text-slate-400 font-medium">Midterm Warnings</span>
                </div>
                <div className="space-y-2">
                  {AT_RISK_STUDENTS.map((sec, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                      <div>
                        <p className="font-semibold text-slate-900">{sec.name}</p>
                        <p className="text-[10px] text-slate-400">{sec.subject} · {sec.total} students</p>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-red-700 text-sm">{sec.atRisk}</span>
                        <p className="text-[9px] text-slate-400">at-risk</p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
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
                <p className="text-[9px] font-sans font-bold text-slate-400 uppercase mb-0.5">Formula</p>
                {modalKpi.formula}
              </div>
              <div className="flex justify-between items-center px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500">Target Standard:</span>
                <strong className="text-slate-900 text-sm">{modalKpi.target}</strong>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                <p className="text-[9px] font-bold uppercase text-emerald-700 mb-0.5">Management Action Protocol</p>
                {modalKpi.action}
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
                View on Line Chart
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

      {/* ══ INTERVENTION CHECKLIST MODAL ══ */}
      {showIntervention && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Program Chair Action Checklist</h3>
              <button onClick={() => setShowIntervention(false)} className="text-slate-400 hover:text-slate-700 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              {[
                {
                  title: "1. Midterm Failure Audit — IT 201 & IT 301",
                  color: "red",
                  body: "23.4% and 21.8% midterm failure rates breach the 20% warning threshold. Meet with instructors to audit exam items against syllabus topics and deploy peer-study sessions before finals.",
                },
                {
                  title: "2. Faculty Hiring Requisition (−3 Deficit)",
                  color: "amber",
                  body: "Forecast projects 1,420 students requiring 38 sections next semester. With only 35 faculty, endorse a request to the Dean for 3 part-time instructors 2 weeks before enrollment.",
                },
                {
                  title: "3. Classroom Pacing Mentorship",
                  color: "slate",
                  body: "SETE score for Classroom Pacing (81.6%) fell below the 85% target. Pair affected instructors with senior faculty to ensure lab activities are evenly distributed — not crammed at end of term.",
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
                  <strong className="block mb-1">{item.title}</strong>
                  <p className="leading-relaxed">{item.body}</p>
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
    </div>
  );
}
