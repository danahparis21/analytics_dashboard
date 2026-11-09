"use client";

import React from "react";
import { KPIItem } from "@/data/mockData";
import {
  GraduationCap,
  AlertTriangle,
  Users,
  Award,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Info,
  ArrowRight,
} from "lucide-react";

interface KpiCardProps {
  kpi: KPIItem;
  onOpenDetails: (kpi: KPIItem) => void;
}

export default function KpiCard({ kpi, onOpenDetails }: KpiCardProps) {
  const getIcon = () => {
    switch (kpi.iconName) {
      case "GraduationCap":
        return GraduationCap;
      case "AlertTriangle":
        return AlertTriangle;
      case "Users":
        return Users;
      case "Award":
        return Award;
      default:
        return CheckCircle2;
    }
  };

  const Icon = getIcon();

  // For at-risk rate, lower is better. For others, higher is better.
  const isHealthy =
    kpi.id === "kpi-2"
      ? kpi.currentValue <= kpi.targetValue
      : kpi.currentValue >= kpi.targetValue;

  const delta = (kpi.currentValue - kpi.previousValue).toFixed(1);
  const isPositiveDelta = Number(delta) >= 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden">
      {/* Top indicator bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${
          isHealthy ? "bg-emerald-500" : "bg-amber-500"
        }`}
      />

      <div>
        {/* Card Header: Icon + KPI # + Info Trigger */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                isHealthy
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                KPI {kpi.number}
              </span>
              <h3 className="text-xs font-bold text-slate-800 leading-snug line-clamp-1">
                {kpi.name}
              </h3>
            </div>
          </div>

          <button
            onClick={() => onOpenDetails(kpi)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition"
            title="View Formula, Target & Management Action"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Big Metric Display */}
        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-2xl font-black tracking-tight text-slate-900">
            {kpi.currentValue}
            <span className="text-sm font-semibold text-slate-500 ml-0.5">%</span>
          </div>

          <div
            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
              isHealthy
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}
          >
            {isPositiveDelta ? (
              <TrendingUp className="w-3 h-3 text-emerald-600" />
            ) : (
              <TrendingDown className="w-3 h-3 text-emerald-600" />
            )}
            <span>
              {isPositiveDelta ? `+${delta}%` : `${delta}%`} vs prev
            </span>
          </div>
        </div>

        {/* Target & Status */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Target: <strong className="text-slate-700">{kpi.targetDescription}</strong>
          </span>
          <span
            className={`font-semibold ${
              isHealthy ? "text-emerald-600" : "text-amber-600"
            }`}
          >
            {isHealthy ? "✓ Target Met" : "⚠️ Needs Action"}
          </span>
        </div>
      </div>

      {/* Quick Action Hint */}
      <button
        onClick={() => onOpenDetails(kpi)}
        className="mt-3 w-full py-1.5 px-2 text-[11px] font-medium text-slate-600 hover:text-red-800 bg-slate-50 hover:bg-red-50/60 rounded-lg border border-slate-200/80 transition flex items-center justify-center gap-1 group-hover:border-red-200"
      >
        <span>Action Protocols</span>
        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}

