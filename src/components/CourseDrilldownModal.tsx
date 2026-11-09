"use client";

import React from "react";
import { RiskCourse } from "@/data/mockData";
import { X, Users, AlertTriangle, BookOpen, Layers, CheckCircle } from "lucide-react";

interface CourseDrilldownModalProps {
  course: RiskCourse | null;
  onClose: () => void;
}

export default function CourseDrilldownModal({ course, onClose }: CourseDrilldownModalProps) {
  if (!course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-950 via-red-900 to-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/20 text-white">
                {course.yearLevel} Bottleneck Audit
              </span>
              <span className="text-xs text-rose-200 font-mono font-bold">
                {course.code}
              </span>
            </div>
            <h2 className="text-base font-bold mt-1 text-white">{course.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs text-slate-700">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-slate-500 font-medium">Enrolled Students</span>
              <div className="text-lg font-bold text-slate-900 mt-0.5">{course.enrolled}</div>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-center">
              <span className="text-rose-600 font-medium">Midterm Failure</span>
              <div className="text-lg font-bold text-rose-700 mt-0.5">{course.midtermFailureRate}%</div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-emerald-700 font-medium">Target Final</span>
              <div className="text-lg font-bold text-emerald-800 mt-0.5">{course.projectedFailureRate}%</div>
            </div>
          </div>

          {/* Flagged Sections */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              <Layers className="w-3.5 h-3.5 text-red-700" />
              <span>Flagged Class Sections Breaching 20% Threshold</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {course.flaggedSections.map((sec) => (
                <span
                  key={sec}
                  className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 border border-rose-300 font-bold text-xs flex items-center gap-1"
                >
                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                  Section {sec}
                </span>
              ))}
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 text-xs">
                Total Sections in Program: {course.sectionsCount}
              </span>
            </div>
          </div>

          {/* Instructor Academic Observation */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              <BookOpen className="w-3.5 h-3.5 text-slate-700" />
              <span>Diagnostic Feedback & Assessment Roots</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
              {course.instructorNote}
            </div>
          </div>

          {/* Prescriptive Management Action */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Chair Prescriptive Action & Study Plan</span>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-emerald-900 leading-relaxed font-medium">
              {course.recommendedAction}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
