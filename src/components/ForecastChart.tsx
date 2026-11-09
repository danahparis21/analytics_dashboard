"use client";

import React, { useState } from "react";
import { FORECAST_DATA } from "@/data/mockData";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Line,
  ComposedChart,
} from "recharts";
import { TrendingUp, Sparkles, BrainCircuit, Users, AlertCircle, Info } from "lucide-react";

interface ForecastChartProps {
  onOpenModelDetails: () => void;
}

export default function ForecastChart({ onOpenModelDetails }: ForecastChartProps) {
  const [activeTab, setActiveTab] = useState<"capacity" | "academic" | "sete">("capacity");

  // Chart view configurations
  const getTabContent = () => {
    switch (activeTab) {
      case "capacity":
        return {
          title: "Student Enrollment & Faculty Section Demand",
          subtitle: "Historical baseline (AY 23-26) with 2-Term Predictive Forecast (AY 26-27)",
          areaKey1: "actualEnrollment",
          areaKey2: "forecastEnrollment",
          name1: "Actual Enrolled Students",
          name2: "Forecasted Demand (ARIMA)",
          color1: "#0f766e", // Teal/Pine
          color2: "#b91c1c", // Spartan Red
          unit: "Students",
        };
      case "academic":
        return {
          title: "Cohort Passing Rate vs At-Risk Trajectory",
          subtitle: "Tracking academic stability and projected midterm drop risk",
          areaKey1: "passRate",
          areaKey2: "atRiskRate",
          name1: "Passing Rate (%)",
          name2: "At-Risk Rate (%)",
          color1: "#059669",
          color2: "#d97706",
          unit: "%",
        };
      case "sete":
        return {
          title: "Faculty Teaching Effectiveness (SETE) Trend",
          subtitle: "Term-by-term satisfactory rating percentage",
          areaKey1: "seteAverage",
          areaKey2: "seteAverage",
          name1: "SETE Satisfactory %",
          name2: "Target Benchmark (85%)",
          color1: "#7c3aed",
          color2: "#dc2626",
          unit: "%",
        };
    }
  };

  const currentTab = getTabContent();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 lg:p-6 mb-6">
      {/* Header and Tab Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              {currentTab.title}
            </h2>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
              <Sparkles className="w-3 h-3" /> Predictive Model Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{currentTab.subtitle}</p>
        </div>

        {/* Forecast View Switcher Tabs (Matching professor's screenshot tabs) */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/70 text-xs">
          <button
            onClick={() => setActiveTab("capacity")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === "capacity"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Enrollment & Capacity
          </button>
          <button
            onClick={() => setActiveTab("academic")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === "academic"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Pass vs At-Risk
          </button>
          <button
            onClick={() => setActiveTab("sete")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === "sete"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            SETE Trend
          </button>
        </div>
      </div>

      {/* Main Chart + Right Side Forecast Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-5">
        {/* Left 3 Columns: Smooth Area/Line Chart */}
        <div className="lg:col-span-3 h-[300px] sm:h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={FORECAST_DATA}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorTeal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f766e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0f766e" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#b91c1c" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#b91c1c" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="period"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={activeTab === "capacity" ? [900, 1600] : [0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "0.75rem",
                  color: "#fff",
                  fontSize: "12px",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
                }}
                itemStyle={{ color: "#f8fafc" }}
                formatter={(val: any, name: any) => [
                  `${val} ${currentTab.unit}`,
                  name,
                ]}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
                iconType="circle"
              />

              {activeTab === "capacity" && (
                <>
                  <Area
                    type="monotone"
                    dataKey="actualEnrollment"
                    name="Actual Enrollment"
                    stroke="#0f766e"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorTeal)"
                  />
                  <Area
                    type="monotone"
                    dataKey="forecastEnrollment"
                    name="Projected Forecast (AY 26-27)"
                    stroke="#b91c1c"
                    strokeWidth={2.5}
                    strokeDasharray="5 5"
                    fillOpacity={1}
                    fill="url(#colorRed)"
                  />
                </>
              )}

              {activeTab === "academic" && (
                <>
                  <Area
                    type="monotone"
                    dataKey="passRate"
                    name="Student Passing Rate (%)"
                    stroke="#059669"
                    strokeWidth={2.5}
                    fill="#10b981"
                    fillOpacity={0.15}
                  />
                  <Line
                    type="monotone"
                    dataKey="atRiskRate"
                    name="At-Risk Rate (%)"
                    stroke="#ea580c"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </>
              )}

              {activeTab === "sete" && (
                <>
                  <Area
                    type="monotone"
                    dataKey="seteAverage"
                    name="SETE Satisfactory %"
                    stroke="#7c3aed"
                    strokeWidth={2.5}
                    fill="#8b5cf6"
                    fillOpacity={0.15}
                  />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Right 1 Column: Forecast Performance Side Panel (Matching Prof's Side Metrics) */}
        <div className="bg-slate-50/90 rounded-xl border border-slate-200/90 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Model Evaluation
              </span>
              <button
                onClick={onOpenModelDetails}
                className="text-[11px] font-semibold text-red-800 hover:text-red-950 flex items-center gap-0.5"
                title="View Analytics Model Specs"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Specs</span>
              </button>
            </div>

            {/* MAPE Metric Card */}
            <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Model Accuracy (MAPE)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">2.42%</div>
              <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                High precision (Under 5% standard)
              </p>
            </div>

            {/* Forecast Projection Points */}
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/70">
                <span className="text-slate-500">Next-Term Demand:</span>
                <strong className="text-slate-900">1,420 Students</strong>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/70">
                <span className="text-slate-500">Required Sections:</span>
                <strong className="text-slate-900">38 Sections</strong>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/70">
                <span className="text-slate-500">Available Faculty:</span>
                <span className="text-slate-700 font-medium">35 Faculty</span>
              </div>
              <div className="flex justify-between items-center py-1.5 px-2 rounded bg-rose-50 border border-rose-200 text-rose-900 font-bold">
                <span>Faculty Capacity Deficit:</span>
                <span className="text-rose-700">-3 Instructors</span>
              </div>
            </div>
          </div>

          {/* Chair Action Recommendation */}
          <div className="mt-4 pt-3 border-t border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Chair Decision Support
            </span>
            <p className="text-[11px] text-slate-700 mt-1 leading-snug">
              Request endorsement for <strong>3 adjunct faculty</strong> immediately to prevent unstaffed sections before the enrollment rush.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
