"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AlertBanner from "@/components/AlertBanner";
import KpiCard from "@/components/KpiCard";
import KpiDetailModal from "@/components/KpiDetailModal";
import InterventionModal from "@/components/InterventionModal";
import ForecastChart from "@/components/ForecastChart";
import SeteBreakdownChart from "@/components/SeteBreakdownChart";
import RiskSubjectsChart from "@/components/RiskSubjectsChart";
import CourseDrilldownModal from "@/components/CourseDrilldownModal";
import ModelSpecsModal from "@/components/ModelSpecsModal";
import { KPI_DATA, KPIItem, RiskCourse } from "@/data/mockData";
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Users,
  Award,
  Layers,
  CheckCircle2,
  Calendar,
  AlertTriangle,
} from "lucide-react";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState("dashboard");

  // Linked Filter states
  const [selectedYear, setSelectedYear] = useState("AY 2026-2027");
  const [selectedTerm, setSelectedTerm] = useState("1st Semester");
  const [selectedYearLevel, setSelectedYearLevel] = useState("All Levels");

  // Modals state
  const [selectedKpi, setSelectedKpi] = useState<KPIItem | null>(null);
  const [isActionPlanOpen, setIsActionPlanOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<RiskCourse | null>(null);
  const [isModelSpecsOpen, setIsModelSpecsOpen] = useState(false);

  // Filter KPI data
  const academicKpis = KPI_DATA.filter(
    (k) => k.category === "Academic Operations"
  );
  const teachingKpis = KPI_DATA.filter(
    (k) => k.category === "Teaching Effectiveness"
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeNavTab}
        setActiveTab={setActiveNavTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all">
        {/* Sticky Top Header */}
        <Header
          onToggleSidebar={() => setSidebarOpen(true)}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedTerm={selectedTerm}
          setSelectedTerm={setSelectedTerm}
          selectedYearLevel={selectedYearLevel}
          setSelectedYearLevel={setSelectedYearLevel}
          onOpenAlerts={() => setIsActionPlanOpen(true)}
          alertCount={2}
          onPrintReport={handlePrint}
        />

        {/* Dashboard Body */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Top Alert Banner */}
          <AlertBanner onOpenActionPlan={() => setIsActionPlanOpen(true)} />

          {/* Section 1: KPI Cards Grouped by Category Header (Inspired by prof's E-ForeSy dashboard) */}
          <section className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* Category Group 1: Academic Operations (3 cols) */}
              <div className="lg:col-span-3 space-y-3">
                {/* Styled Category Header Banner */}
                <div className="bg-gradient-to-r from-red-950 to-red-800 text-white px-4 py-2 rounded-xl shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-red-200" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Academic Operations & Student Success
                    </span>
                  </div>
                  <span className="text-[10px] bg-red-900/80 px-2 py-0.5 rounded text-red-200 border border-red-700 font-medium">
                    3 Core KPIs
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {academicKpis.map((kpi) => (
                    <KpiCard
                      key={kpi.id}
                      kpi={kpi}
                      onOpenDetails={(item) => setSelectedKpi(item)}
                    />
                  ))}
                </div>
              </div>

              {/* Category Group 2: Teaching Effectiveness (2 cols) */}
              <div className="lg:col-span-2 space-y-3">
                {/* Styled Category Header Banner */}
                <div className="bg-gradient-to-r from-amber-900 to-amber-700 text-white px-4 py-2 rounded-xl shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-200" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Faculty Effectiveness & Attendance
                    </span>
                  </div>
                  <span className="text-[10px] bg-amber-950/70 px-2 py-0.5 rounded text-amber-200 border border-amber-600 font-medium">
                    2 Core KPIs
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {teachingKpis.map((kpi) => (
                    <KpiCard
                      key={kpi.id}
                      kpi={kpi}
                      onOpenDetails={(item) => setSelectedKpi(item)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Primary Predictive Analytics Visualization (Centerpiece) */}
          <section>
            <ForecastChart
              onOpenModelDetails={() => setIsModelSpecsOpen(true)}
            />
          </section>

          {/* Section 3: Diagnostic & Early Alert Visualizations (2 Columns) */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visualization 2: SETE Criteria Radar/Bar Breakdown */}
            <SeteBreakdownChart />

            {/* Visualization 3: Bottleneck Courses with Clickable Drill-down */}
            <RiskSubjectsChart
              onSelectCourse={(course) => setSelectedCourse(course)}
            />
          </section>

          {/* Section 4: Academic Decision Support Summary Bar */}
          <section className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">
                  Integrated Decision Support Summary (BAT 405)
                </h4>
                <p className="text-slate-500">
                  Batangas State University ARASOF-Nasugbu • CICS Department of Information Technology
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsModelSpecsOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
              >
                Part IV Model Formulation
              </button>
              <button
                onClick={() => setIsActionPlanOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-red-800 hover:bg-red-900 text-white font-semibold transition"
              >
                Chair Action Protocols
              </button>
            </div>
          </section>
        </main>
      </div>

      {/* Modals & Slide-overs */}
      <KpiDetailModal
        kpi={selectedKpi}
        onClose={() => setSelectedKpi(null)}
      />

      <InterventionModal
        isOpen={isActionPlanOpen}
        onClose={() => setIsActionPlanOpen(false)}
      />

      <CourseDrilldownModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />

      <ModelSpecsModal
        isOpen={isModelSpecsOpen}
        onClose={() => setIsModelSpecsOpen(false)}
      />
    </div>
  );
}
