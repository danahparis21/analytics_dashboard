"use client";

import React from "react";
import { KPIItem } from "@/data/mockData";
import { X, Target, FunctionSquare, Zap, BookOpen } from "lucide-react";

interface KpiDetailModalProps {
  kpi: KPIItem | null;
  onClose: () => void;
}

export default function KpiDetailModal({ kpi, onClose }: KpiDetailModalProps) {
  if (!kpi) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-900 via-rose-900 to-slate-900 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/20 text-white">
              KPI {kpi.number} Specification
            </span>
            <h2 className="text-lg font-bold mt-1 text-white">{kpi.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-sm text-slate-700 max-h-[75vh] overflow-y-auto">
          {/* Current Status Badge */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-xs text-slate-500 font-medium">Current Performance</span>
              <div className="text-xl font-bold text-slate-900">{kpi.currentValue}%</div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 font-medium">Established Target</span>
              <div className="text-xl font-bold text-red-800">{kpi.targetDescription}</div>
            </div>
          </div>

          {/* Objective */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-red-700" />
              <span>Objective</span>
            </div>
            <p className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
              {kpi.objective}
            </p>
          </div>

          {/* Formula */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <FunctionSquare className="w-3.5 h-3.5 text-red-700" />
              <span>Computational Formula</span>
            </div>
            <div className="p-3 rounded-lg bg-red-50/60 border border-red-200/60 font-mono text-xs text-red-950 font-semibold">
              {kpi.formula}
            </div>
          </div>

          {/* Target */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <Target className="w-3.5 h-3.5 text-red-700" />
              <span>Target Standard</span>
            </div>
            <p className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-700 font-medium">
              Standard: <strong className="text-slate-900">{kpi.targetDescription}</strong>
            </p>
          </div>

          {/* Management Action */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>Program Chair Management Action</span>
            </div>
            <p className="p-3 rounded-lg bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 leading-relaxed font-medium">
              {kpi.managementAction}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition"
          >
            Close Specification
          </button>
        </div>
      </div>
    </div>
  );
}

