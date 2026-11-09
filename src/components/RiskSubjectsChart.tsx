"use client";

import React from "react";
import { RISK_COURSES_DATA, RiskCourse } from "@/data/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import { AlertTriangle, MousePointerClick } from "lucide-react";

interface RiskSubjectsChartProps {
  onSelectCourse: (course: RiskCourse) => void;
}

export default function RiskSubjectsChart({ onSelectCourse }: RiskSubjectsChartProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 lg:p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                High-Risk Bottleneck Courses & Failure Rates
              </h2>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                Early Alert
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Midterm failure % vs projected post-intervention final failure %
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
            <span className="w-2.5 h-0.5 bg-rose-600 inline-block" />
            <span className="text-[11px]">Warning: ≥20%</span>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="h-[240px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={RISK_COURSES_DATA}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              onClick={(state: any) => {
                if (state && state.activePayload && state.activePayload.length > 0) {
                  const clickedCode = state.activePayload[0].payload.code;
                  const found = RISK_COURSES_DATA.find((c) => c.code === clickedCode);
                  if (found) onSelectCourse(found);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="code"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={[0, 30]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "0.75rem",
                  color: "#fff",
                  fontSize: "12px",
                }}
                formatter={(val: any, name: any) => [`${val}%`, name]}
              />
              <Legend
                wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                iconType="circle"
              />
              <ReferenceLine y={20} stroke="#e11d48" strokeDasharray="3 3" label={{ value: "20% Threshold", fill: "#e11d48", fontSize: 10, position: "top" }} />
              <Bar
                dataKey="midtermFailureRate"
                name="Midterm Failure Rate"
                fill="#e11d48"
                radius={[4, 4, 0, 0]}
                barSize={16}
                cursor="pointer"
              />
              <Bar
                dataKey="projectedFailureRate"
                name="Projected Final Rate"
                fill="#0284c7"
                radius={[4, 4, 0, 0]}
                barSize={16}
                cursor="pointer"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Click prompt note */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-100">
          <span className="flex items-center gap-1 text-slate-600 font-medium">
            <MousePointerClick className="w-3.5 h-3.5 text-red-600" />
            Click any course bar for section drill-down
          </span>
          <span className="text-rose-700 font-semibold">2 Courses Breaching 20%</span>
        </div>
      </div>

      <div className="mt-3 p-2.5 rounded-lg bg-rose-50/70 border border-rose-200/60 text-[11px] text-rose-950 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
        <p>
          <strong>Action:</strong> <em>IT 201 (23.4%)</em> and <em>IT 301 (21.8%)</em> require emergency syllabus audits and peer tutoring to pull grades back up before final encoding.
        </p>
      </div>
    </div>
  );
}
