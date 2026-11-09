"use client";

import React, { useState } from "react";
import { AlertOctagon, AlertTriangle, ArrowRight, X, CheckSquare } from "lucide-react";

interface AlertBannerProps {
  onOpenActionPlan: () => void;
}

export default function AlertBanner({ onOpenActionPlan }: AlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-rose-950 via-red-900 to-amber-950 text-white p-3.5 sm:p-4 rounded-xl border border-red-700/50 shadow-md mb-6 relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-800/80 rounded-lg text-amber-300 ring-1 ring-red-400/40 shrink-0">
            <AlertOctagon className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider bg-rose-800 text-rose-100 px-2 py-0.5 rounded">
                Active Threshold Breaches (2 Triggers)
              </span>
              <span className="text-[11px] text-amber-200 font-semibold">Immediate Chair Action Required</span>
            </div>
            <p className="text-xs text-rose-100 mt-1 leading-relaxed">
              <strong>Academic Red Flag:</strong> 2 Class Sections (IT 201 & IT 301) exceeded the <strong>20% Midterm Failure Threshold</strong> (23.4% and 21.8%).
              <span className="hidden lg:inline text-rose-200 ml-1">
                | <strong>Capacity Alert:</strong> Projected enrollment indicates a <strong>-3 Faculty Instructor Deficit</strong> for 38 upcoming class sections.
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenActionPlan}
            className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <span>Review Intervention Checklist</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 rounded-lg text-rose-300 hover:text-white hover:bg-white/10 transition"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

