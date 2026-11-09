export interface KPIItem {
  id: string;
  number: number;
  name: string;
  category: "Academic Operations" | "Teaching Effectiveness";
  currentValue: number;
  targetValue: number;
  unit: "%";
  previousValue: number;
  trend: "up" | "down" | "stable";
  isTargetMet: boolean;
  objective: string;
  formula: string;
  targetDescription: string;
  managementAction: string;
  iconName: string;
}

export const KPI_DATA: KPIItem[] = [
  {
    id: "kpi-1",
    number: 1,
    name: "Student Passing Rate",
    category: "Academic Operations",
    currentValue: 91.4,
    targetValue: 90.0,
    unit: "%",
    previousValue: 89.6,
    trend: "up",
    isTargetMet: true,
    objective: "Maintain high academic success and prevent student failures across the program.",
    formula: "(Students with Passing Grades ÷ Total Enrolled Students) × 100",
    targetDescription: "≥ 90%",
    managementAction: "Conduct syllabus reviews on high-failure subjects, require faculty consultation hours, and organize remedial reviews.",
    iconName: "GraduationCap",
  },
  {
    id: "kpi-2",
    number: 2,
    name: "At-Risk Student Rate",
    category: "Academic Operations",
    currentValue: 8.3,
    targetValue: 10.0,
    unit: "%",
    previousValue: 10.4,
    trend: "down",
    isTargetMet: true, // Lower is better for at-risk
    objective: "Detect struggling students early to prevent mid-term drops and course failures.",
    formula: "(Students Failing or in Danger at Midterm ÷ Total Enrolled Students) × 100",
    targetDescription: "≤ 10%",
    managementAction: "Send early academic alerts and schedule mandatory student consultations with academic advisers.",
    iconName: "AlertTriangle",
  },
  {
    id: "kpi-3",
    number: 3,
    name: "Student Retention Rate",
    category: "Academic Operations",
    currentValue: 92.5,
    targetValue: 90.0,
    unit: "%",
    previousValue: 91.0,
    trend: "up",
    isTargetMet: true,
    objective: "Minimize dropouts and ensure students persist into the next term or year level.",
    formula: "(Students Remaining Enrolled or Re-enrolling ÷ Total Enrolled Students at Term Start) × 100",
    targetDescription: "≥ 90%",
    managementAction: "Conduct exit interviews for withdrawing students, investigate cohort drops, and refer struggling students to guidance counseling.",
    iconName: "Users",
  },
  {
    id: "kpi-4",
    number: 4,
    name: "Faculty Teaching Performance (SETE)",
    category: "Teaching Effectiveness",
    currentValue: 86.2,
    targetValue: 85.0,
    unit: "%",
    previousValue: 84.8,
    trend: "up",
    isTargetMet: true,
    objective: "Ensure faculty deliver high-quality instruction that meets student learning needs.",
    formula: "(Faculty with Satisfactory SETE Rating ÷ Total Evaluated Faculty) × 100",
    targetDescription: "≥ 85%",
    managementAction: "Pair low-scoring faculty with peer mentors, provide instructional workshops, and review syllabus delivery.",
    iconName: "Award",
  },
  {
    id: "kpi-5",
    number: 5,
    name: "Faculty Attendance Rate",
    category: "Teaching Effectiveness",
    currentValue: 96.8,
    targetValue: 95.0,
    unit: "%",
    previousValue: 95.5,
    trend: "up",
    isTargetMet: true,
    objective: "Monitor how consistently instructors conduct their scheduled classes.",
    formula: "(Classes Conducted ÷ Scheduled Classes) × 100",
    targetDescription: "≥ 95%",
    managementAction: "Require make-up classes, audit room logs, and review teaching loads for frequently absent instructors.",
    iconName: "CheckCircle2",
  },
];

export interface ForecastDataPoint {
  period: string;
  actualEnrollment?: number;
  forecastEnrollment?: number;
  actualSections?: number;
  requiredSections?: number;
  availableFaculty?: number;
  requiredFaculty?: number;
  passRate?: number;
  atRiskRate?: number;
  seteAverage?: number;
  isForecast: boolean;
}

export const FORECAST_DATA: ForecastDataPoint[] = [
  { period: "AY 23-24 1S", actualEnrollment: 1040, actualSections: 26, availableFaculty: 26, requiredFaculty: 26, passRate: 88.5, atRiskRate: 11.5, seteAverage: 83.4, isForecast: false },
  { period: "AY 23-24 2S", actualEnrollment: 1110, actualSections: 28, availableFaculty: 28, requiredFaculty: 28, passRate: 89.2, atRiskRate: 10.8, seteAverage: 84.2, isForecast: false },
  { period: "AY 24-25 1S", actualEnrollment: 1180, actualSections: 30, availableFaculty: 30, requiredFaculty: 30, passRate: 90.1, atRiskRate: 9.9, seteAverage: 85.0, isForecast: false },
  { period: "AY 24-25 2S", actualEnrollment: 1250, actualSections: 32, availableFaculty: 32, requiredFaculty: 32, passRate: 90.8, atRiskRate: 9.2, seteAverage: 85.7, isForecast: false },
  { period: "AY 25-26 1S", actualEnrollment: 1310, actualSections: 34, availableFaculty: 34, requiredFaculty: 34, passRate: 91.4, atRiskRate: 8.6, seteAverage: 86.2, isForecast: false },
  { period: "AY 25-26 2S", actualEnrollment: 1340, forecastEnrollment: 1340, actualSections: 35, requiredSections: 35, availableFaculty: 35, requiredFaculty: 35, passRate: 91.7, atRiskRate: 8.3, seteAverage: 86.8, isForecast: false },
  // Forecast terms
  { period: "AY 26-27 1S (FC)", forecastEnrollment: 1420, requiredSections: 38, availableFaculty: 35, requiredFaculty: 38, passRate: 92.0, atRiskRate: 8.0, seteAverage: 87.2, isForecast: true },
  { period: "AY 26-27 2S (FC)", forecastEnrollment: 1490, requiredSections: 40, availableFaculty: 36, requiredFaculty: 40, passRate: 92.4, atRiskRate: 7.6, seteAverage: 87.8, isForecast: true },
];

export interface SeteCriterion {
  criterion: string;
  code: string;
  score: number;
  target: number;
  benchmark: number;
  status: "Excellent" | "Satisfactory" | "Needs Attention";
  remarks: string;
}

export const SETE_CRITERIA_DATA: SeteCriterion[] = [
  { criterion: "Instructional Clarity & Delivery", code: "IC", score: 88.5, target: 85.0, benchmark: 86.0, status: "Satisfactory", remarks: "Clear lectures and real-world examples" },
  { criterion: "Syllabus Coverage & Learning Alignment", code: "SC", score: 92.1, target: 85.0, benchmark: 87.5, status: "Excellent", remarks: "All scheduled topics thoroughly covered" },
  { criterion: "Assessment & Grading Fairness", code: "AG", score: 84.2, target: 85.0, benchmark: 85.0, status: "Needs Attention", remarks: "Exams reported more difficult than class discussions" },
  { criterion: "Classroom Pacing & Time Management", code: "PT", score: 81.6, target: 85.0, benchmark: 84.0, status: "Needs Attention", remarks: "Certain laboratory sessions felt rushed towards finals" },
  { criterion: "Student Availability & Consultation", code: "AC", score: 89.4, target: 85.0, benchmark: 86.2, status: "Satisfactory", remarks: "Prompt consultation responses during office hours" },
];

export interface RiskCourse {
  code: string;
  title: string;
  yearLevel: string;
  enrolled: number;
  midtermFailureRate: number;
  projectedFailureRate: number;
  sectionsCount: number;
  flaggedSections: string[];
  instructorNote: string;
  recommendedAction: string;
}

export const RISK_COURSES_DATA: RiskCourse[] = [
  {
    code: "IT 201",
    title: "Data Structures & Algorithms",
    yearLevel: "2nd Year",
    enrolled: 184,
    midtermFailureRate: 23.4,
    projectedFailureRate: 17.5,
    sectionsCount: 5,
    flaggedSections: ["BSIT 2-1", "BSIT 2-3"],
    instructorNote: "Pointers and dynamic memory management scored poorly in midterm exams.",
    recommendedAction: "Organize peer-tutoring sessions and syllabus review before finals."
  },
  {
    code: "IT 301",
    title: "Advanced Database Systems",
    yearLevel: "3rd Year",
    enrolled: 162,
    midtermFailureRate: 21.8,
    projectedFailureRate: 15.2,
    sectionsCount: 4,
    flaggedSections: ["BSIT 3-2"],
    instructorNote: "Complex query optimization and indexing questions had high error rates.",
    recommendedAction: "Schedule supplementary laboratory practice sessions on SQL query tuning."
  },
  {
    code: "MATH 201",
    title: "Discrete Mathematics",
    yearLevel: "2nd Year",
    enrolled: 190,
    midtermFailureRate: 19.1,
    projectedFailureRate: 13.8,
    sectionsCount: 5,
    flaggedSections: ["BSIT 2-2"],
    instructorNote: "Graph theory proofs and combinatorial logic remain difficult areas.",
    recommendedAction: "Provide step-by-step problem-solving worksheets."
  },
  {
    code: "BAT 401",
    title: "Business Intelligence & Data Warehousing",
    yearLevel: "4th Year",
    enrolled: 118,
    midtermFailureRate: 16.5,
    projectedFailureRate: 10.9,
    sectionsCount: 3,
    flaggedSections: ["BSIT 4-BA"],
    instructorNote: "ETL pipeline implementation hurdles during mid-semester project.",
    recommendedAction: "Conduct specialized cloud lab walkthrough."
  },
  {
    code: "IT 102",
    title: "Computer Programming II (OOP)",
    yearLevel: "1st Year",
    enrolled: 210,
    midtermFailureRate: 15.2,
    projectedFailureRate: 9.5,
    sectionsCount: 6,
    flaggedSections: ["BSIT 1-4"],
    instructorNote: "Polymorphism and interface design patterns need reinforcement.",
    recommendedAction: "Require weekly coding lab reviews."
  },
];

