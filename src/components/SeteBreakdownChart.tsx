"use client";

import React from "react";
import { SETE_CRITERIA_DATA } from "@/data/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { Award, AlertCircle, HelpCircle } from "lucide-react";

export default function SeteBreakdownChart() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 lg:p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                SETE Dimensions & Teaching Performance
              </h2>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                Evaluation Radar
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Average score per evaluation criterion across all BSIT faculty
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-2.5 h-0.5 bg-red-600 inline-block" />
            <span className="text-[11px] font-medium">Target: ≥85.0%</span>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="h-[240px] w-full min-w-0 mt-4">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
            <BarChart
              data={SETE_CRITERIA_DATA}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis
                type="number"
                domain={[70, 100]}
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="code"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "0.75rem",
                  color: "#fff",
                  fontSize: "12px",
                }}
                formatter={(val: any, name: any, item: any) => [
                  `${val}% (${item.payload.criterion})`,
                  "Score",
                ]}
              />
              <ReferenceLine x={85.0} stroke="#dc2626" strokeDasharray="3 3" />
              <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={18}>
                {SETE_CRITERIA_DATA.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.score >= 85.0 ? "#7c3aed" : "#f59e0b"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend & Details */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 pt-3 border-t border-slate-100">
          {SETE_CRITERIA_DATA.map((item) => (
            <div key={item.code} className="flex items-center justify-between p-1.5 rounded bg-slate-50">
              <span className="truncate pr-1">
                <strong>{item.code}:</strong> {item.criterion}
              </span>
              <span
                className={`font-bold shrink-0 ${
                  item.score >= 85.0 ? "text-purple-700" : "text-amber-600"
                }`}
              >
                {item.score}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-900 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p>
          <strong>Chair Insight:</strong> <em>Classroom Pacing (81.6%)</em> and <em>Assessment Fairness (84.2%)</em> fall below target. Recommended action: Pair affected instructors with senior mentors before finals.
        </p>
      </div>
    </div>
  );
}

