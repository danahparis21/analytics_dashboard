"use client";

import React, { useState } from "react";
import { X, CheckCircle2, AlertTriangle, Users, BookOpen, Clock } from "lucide-react";

interface InterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InterventionModal({ isOpen, onClose }: InterventionModalProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);

  if (!isOpen) return null;

  const toggleStep = (id: number) => {
    setCompletedSteps((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const protocols = [
    {
      id: 1,
      title: "Midterm Syllabus & Exam Alignment Audit",
      target: "IT 201 (Data Structures) & IT 301 (Adv. Databases)",
      description: "Summon course instructors to verify test items against syllabus outcomes and table of specifications.",
      dept: "Academic Standards Committee",
      due: "Within 48 hours",
      severity: "High",
    },
    {
      id: 2,
      title: "Activate Mandatory Remedial & Peer Tutoring Sessions",
      target: "BSIT Sections 2-1, 2-3, 3-2 (92 flagged students)",
      description: "Direct academic peer tutors and schedule 2-hour weekly guided laboratory problem-solving sessions.",
      dept: "Student Success Center",
      due: "Starting Week 10",
      severity: "High",
    },
    {
      id: 3,
      title: "Initiate Faculty Adjunct Requisition (Dean Endorsement)",
      target: "Projected 38 Sections for AY 2026-2027 Term 1",
      description: "Submit request to Dean & HR for 3 adjunct instructors to prevent unstaffed sections up to midterm.",
      dept: "Dean's Office & HR",
      due: "2 Weeks before Enrollment",
      severity: "Urgent",
    },
    {
      id: 4,
      title: "SETE Formative Mid-Semester Feedback Review",
      target: "Instructors with Assessment Fairness < 85%",
      description: "Pair instructor with senior department mentor to refine exam pacing and clarify rubrics.",
      dept: "Faculty Development Committee",
      due: "End of Month",
      severity: "Medium",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-900 via-rose-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-800 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Program Chair Management Interventions</h2>
              <p className="text-xs text-rose-200">Department of Information Technology • Action Protocol Checklist</p>
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
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <p className="text-xs text-slate-600 leading-relaxed">
            Per University Academic Quality Guidelines, whenever section failure exceeds 20% or faculty shortage is projected, the Program Chair must execute the following evidence-based actions:
          </p>

          <div className="space-y-3">
            {protocols.map((protocol) => {
              const isDone = completedSteps.includes(protocol.id);
              return (
                <div
                  key={protocol.id}
                  onClick={() => toggleStep(protocol.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isDone
                      ? "bg-emerald-50/60 border-emerald-300/80"
                      : "bg-slate-50 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition ${
                        isDone
                          ? "bg-emerald-600 text-white"
                          : "border-2 border-slate-300 bg-white"
                      }`}
                    >
                      {isDone && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4
                          className={`text-xs font-bold ${
                            isDone ? "text-emerald-900 line-through" : "text-slate-900"
                          }`}
                        >
                          {protocol.title}
                        </h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            protocol.severity === "Urgent"
                              ? "bg-rose-100 text-rose-800 border border-rose-200"
                              : protocol.severity === "High"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {protocol.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{protocol.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-500">
                        <span><strong>Target:</strong> {protocol.target}</span>
                        <span>•</span>
                        <span><strong>Timeline:</strong> {protocol.due}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {completedSteps.length} of {protocols.length} interventions documented
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition"
          >
            Save & Close Protocols
          </button>
        </div>
      </div>
    </div>
  );
}
