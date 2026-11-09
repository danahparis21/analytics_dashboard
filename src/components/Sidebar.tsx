"use client";

import React from "react";
import {
  LayoutDashboard,
  TrendingUp,
  AlertTriangle,
  Award,
  Users,
  FileSpreadsheet,
  ShieldCheck,
  GraduationCap,
  Sparkles,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
}: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "forecast", label: "Capacity & Demand Forecast", icon: TrendingUp },
    { id: "risk", label: "At-Risk & Interventions", icon: AlertTriangle },
    { id: "sete", label: "SETE Faculty Evaluations", icon: Award },
    { id: "workload", label: "Faculty Section Loads", icon: Users },
    { id: "reports", label: "Accreditation Reports", icon: FileSpreadsheet },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-100 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-900 flex items-center justify-center shadow-lg shadow-red-900/30 text-white font-bold text-lg ring-2 ring-red-500/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-white text-base">SpartanPulse</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-red-900/60 text-red-300 border border-red-700/50">
                  Decision
                </span>
              </div>
              <p className="text-xs text-slate-400">BatStateU • CICS Analytics</p>
            </div>
          </div>
        </div>

        {/* Program Chair User Profile */}
        <div className="p-4 mx-3 my-4 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-red-700 to-rose-500 flex items-center justify-center font-bold text-white text-sm ring-2 ring-white/20">
                PC
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-slate-900" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-white truncate">Program Chair</h2>
              <p className="text-xs text-red-300 font-medium truncate">BS Information Technology</p>
              <p className="text-[11px] text-slate-400 truncate">CICS • ARASOF-Nasugbu</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Decision Support Views
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-red-700 to-red-800 text-white shadow-md shadow-red-950/40"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-white" : "text-slate-400"
                  }`}
                />
                <span>{item.label}</span>
                {item.id === "forecast" && (
                  <span className="ml-auto text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> AI
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Privacy & Compliance Footer */}
        <div className="p-4 m-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-[11px] text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Role-Based Privacy</span>
          </div>
          <p className="leading-relaxed">
            Data aggregated & de-identified per RA 10173. SETE student identity stripped.
          </p>
          <div className="pt-1 text-[10px] text-slate-400 border-t border-slate-800">
            BAT 405 Analytics • AY 2026-2027
          </div>
        </div>
      </aside>
    </>
  );
}
