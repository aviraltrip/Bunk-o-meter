export type AttendanceStatus =
  | 'SAFE'
  | 'BORDERLINE'
  | 'CRITICAL'
  | 'NO_CLASSES'
  | 'INVALID';

export interface Subject {
  id: string;
  name: string;
  code?: string;
  attended: number;
  total: number;
  targetPercentage: number;
}

export interface NextClassImpact {
  ifAttend: number;
  ifBunk: number;
}

export interface AttendanceCalculationResult {
  percentage: number;
  status: AttendanceStatus;
  message: string;
  nextClassImpact: NextClassImpact;
}

export interface OverallSummary {
  totalAttended: number;
  totalHeld: number;
  overallPercentage: number;
  overallStatus: AttendanceStatus;
  subjectsCount: number;
  criticalSubjectsCount: number;
}
