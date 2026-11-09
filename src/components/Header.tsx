"use client";

import React from "react";
import {
  Menu,
  Calendar,
  Filter,
  Download,
  Bell,
  RefreshCw,
  Clock,
} from "lucide-react";

interface HeaderProps {
  onToggleSidebar: () => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  selectedTerm: string;
  setSelectedTerm: (term: string) => void;
  selectedYearLevel: string;
  setSelectedYearLevel: (level: string) => void;
  onOpenAlerts: () => void;
  alertCount: number;
  onPrintReport: () => void;
}

export default function Header({
  onToggleSidebar,
  selectedYear,
  setSelectedYear,
  selectedTerm,
  setSelectedTerm,
  selectedYearLevel,
  setSelectedYearLevel,
  onOpenAlerts,
  alertCount,
  onPrintReport,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200/80 px-4 lg:px-8 py-3 transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left Side: Mobile Menu Button + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Academic & Teaching Performance Dashboard
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                Program Chair View
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
              <span>Integrated Portal + SETE Decision Support System</span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3 h-3" /> Synced: Nov 09, 2026, 09:49 PM
              </span>
            </p>
          </div>
        </div>

        {/* Right Side: Linked Dropdowns & Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Linked Filter: Academic Year */}
          <div className="flex items-center gap-1.5 bg-slate-100/90 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent font-medium text-slate-700 outline-none cursor-pointer pr-1"
            >
              <option value="AY 2026-2027">AY 2026-2027 (Active/Forecast)</option>
              <option value="AY 2025-2026">AY 2025-2026</option>
              <option value="AY 2024-2025">AY 2024-2025</option>
            </select>
          </div>

          {/* Linked Filter: Term */}
          <div className="flex items-center gap-1.5 bg-slate-100/90 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="bg-transparent font-medium text-slate-700 outline-none cursor-pointer pr-1"
            >
              <option value="1st Semester">1st Semester</option>
              <option value="2nd Semester">2nd Semester</option>
              <option value="Midyear Term">Midyear Term</option>
            </select>
          </div>

          {/* Filter: Year Level */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-100/90 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
            <select
              value={selectedYearLevel}
              onChange={(e) => setSelectedYearLevel(e.target.value)}
              className="bg-transparent font-medium text-slate-700 outline-none cursor-pointer pr-1"
            >
              <option value="All Levels">All Year Levels</option>
              <option value="1st Year">1st Year Cohort</option>
              <option value="2nd Year">2nd Year Cohort</option>
              <option value="3rd Year">3rd Year Cohort</option>
              <option value="4th Year">4th Year Cohort</option>
            </select>
          </div>

          {/* Alert Notification Button */}
          <button
            onClick={onOpenAlerts}
            className="relative p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
            title="Active Warning Triggers"
          >
            <Bell className="w-4 h-4" />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white ring-2 ring-white">
                {alertCount}
              </span>
            )}
          </button>

          {/* Export / Print PDF Button (for Long Bond Paper colored requirement) */}
          <button
            onClick={onPrintReport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition"
            title="Print or Save colored snapshot for submission"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print / Export</span>
          </button>
        </div>
      </div>
    </header>
  );
}
