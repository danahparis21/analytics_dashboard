"use client";

import React from "react";
import { X, BrainCircuit, CheckCircle2, ShieldAlert, Database, Cpu, Layers } from "lucide-react";

interface ModelSpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModelSpecsModal({ isOpen, onClose }: ModelSpecsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-950 via-red-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-800/80 rounded-lg">
              <BrainCircuit className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Part IV: Analytics Model Specification</h2>
              <p className="text-xs text-rose-200">
                Enrollment & Faculty Capacity Forecasting Architecture (BAT 405)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-slate-700">
          {/* Problem & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-red-700" />
                Problem Definition & Decision
              </span>
              <p className="text-slate-600 leading-relaxed">
                Preventing recurring shortages of faculty teaching personnel and unstaffed sections up to midterms by forecasting next-term course enrollment and required faculty sections before term encoding begins.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-red-700" />
                Analytics Type & Technique
              </span>
              <p className="text-slate-600 leading-relaxed">
                <strong>Type:</strong> Predictive & Prescriptive Analytics<br />
                <strong>Technique:</strong> Time Series Forecasting (Holt-Winters Exponential Smoothing & Autoregressive Trend Regression) with section capacity constraint modeling.
              </p>
            </div>
          </div>

          {/* Variables */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-red-700" />
              Input Variables & Expected Outputs
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <strong className="text-slate-900 block mb-1">Key Input Variables (4):</strong>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                  <li>Historical term enrollment counts (8 terms)</li>
                  <li>Prerequisite passing/failure flow rates</li>
                  <li>Freshmen admissions intake quota</li>
                  <li>Standard teaching load capacity (18 units/prof)</li>
                </ul>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <strong className="text-slate-900 block mb-1">Model Outputs:</strong>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                  <li>Predicted Student Enrollment: <strong>1,420 students</strong></li>
                  <li>Sections to Open: <strong>38 sections</strong></li>
                  <li>Faculty Headcount Needed: <strong>38 FTE</strong></li>
                  <li>Faculty Gap Deficit: <strong>-3 Instructors</strong></li>
                </ul>
              </div>
            </div>
          </div>

          {/* 7 Workflow Steps */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
              7 Major Steps in Analytics Modeling Workflow
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-white border border-slate-200">1. Problem Formulation & Objective Setting</div>
              <div className="p-2 rounded bg-white border border-slate-200">2. Portal & SETE Data Extraction</div>
              <div className="p-2 rounded bg-white border border-slate-200">3. Data Cleaning & Feature Engineering</div>
              <div className="p-2 rounded bg-white border border-slate-200">4. Model Selection & Fitting (Python)</div>
              <div className="p-2 rounded bg-white border border-slate-200">5. Model Validation & Accuracy Evaluation</div>
              <div className="p-2 rounded bg-white border border-slate-200">6. Integration into Chair Decision Support</div>
              <div className="p-2 rounded bg-white border border-slate-200 col-span-full">7. Continuous Monitoring, Audit & Feedback Loop</div>
            </div>
          </div>

          {/* Evaluation Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <strong className="text-emerald-950 font-bold block mb-1">Metric 1: MAPE (2.42%)</strong>
              <p className="text-emerald-900 leading-relaxed text-[11px]">
                Measures mean absolute percentage error, ensuring projections remain within a tight ±3% operational tolerance.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
              <strong className="text-blue-950 font-bold block mb-1">Metric 2: RMSE (18.4 Students)</strong>
              <p className="text-blue-900 leading-relaxed text-[11px]">
                Penalizes large outlier forecast errors to prevent unexpected section overcrowding or extreme staff shortages.
              </p>
            </div>
          </div>

          {/* SETE Bias & Ethics */}
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-xs font-bold text-rose-900">Responsible SETE Interpretation & Fairness:</strong>
              <p className="text-[11px] leading-relaxed text-rose-900">
                SETE ratings are prone to student survey burnout, retribution for tough courses, and elective bias. Models must never automate faculty contract termination or tenure decisions based solely on raw SETE numbers. SETE must always be contextualized alongside peer reviews, course rigor, and teaching portfolios.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition"
          >
            Close Specifications
          </button>
        </div>
      </div>
    </div>
  );
}

