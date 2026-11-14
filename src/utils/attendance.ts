import {
  AttendanceCalculationResult,
  AttendanceStatus,
  Subject,
  OverallSummary
} from '../types/attendance';

export function calculateAttendance(
  attended: number,
  total: number,
  targetPercentage: number = 75
): AttendanceCalculationResult {
  if (
    isNaN(attended) ||
    isNaN(total) ||
    isNaN(targetPercentage) ||
    attended < 0 ||
    total < 0 ||
    targetPercentage <= 0 ||
    targetPercentage >= 100
  ) {
    return {
      percentage: 0,
      status: 'INVALID',
      message: 'Invalid numbers provided',
      nextClassImpact: { ifAttend: 0, ifBunk: 0 },
    };
  }

  if (attended > total) {
    return {
      percentage: 0,
      status: 'INVALID',
      message: 'Attended cannot exceed Total',
      nextClassImpact: { ifAttend: 0, ifBunk: 0 },
    };
  }

  if (total === 0) {
    return {
      percentage: 100,
      status: 'NO_CLASSES',
      message: 'No classes held yet',
      nextClassImpact: {
        ifAttend: 100,
        ifBunk: 0,
      },
    };
  }

  const rawPercentage = (attended / total) * 100;
  const percentage = Math.round(rawPercentage * 10) / 10;

  const nextAttendPct = Math.round(((attended + 1) / (total + 1)) * 1000) / 10;
  const nextBunkPct = Math.round((attended / (total + 1)) * 1000) / 10;

  const R = targetPercentage;

  if (rawPercentage >= R) {
    const numerator = 100 * attended - R * total;
    const safeBunks = Math.floor(numerator / R);

    if (safeBunks > 0) {
      return {
        percentage,
        status: 'SAFE',
        message: `You can safely bunk ${safeBunks} class${safeBunks > 1 ? 'es' : ''}`,
        nextClassImpact: {
          ifAttend: nextAttendPct,
          ifBunk: nextBunkPct,
        },
      };
    } else {
      return {
        percentage,
        status: 'BORDERLINE',
        message: 'On the edge! Cannot bunk next class',
        nextClassImpact: {
          ifAttend: nextAttendPct,
          ifBunk: nextBunkPct,
        },
      };
    }
  } else {
    const numerator = R * total - 100 * attended;
    const denominator = 100 - R;
    const mustAttend = Math.ceil(numerator / denominator);

    return {
      percentage,
      status: 'CRITICAL',
      message: `Must attend next ${mustAttend} class${mustAttend > 1 ? 'es' : ''}`,
      nextClassImpact: {
        ifAttend: nextAttendPct,
        ifBunk: nextBunkPct,
      },
    };
  }
}

export function calculateOverallSummary(subjects: Subject[]): OverallSummary {
  if (!subjects || subjects.length === 0) {
    return {
      totalAttended: 0,
      totalHeld: 0,
      overallPercentage: 100,
      overallStatus: 'NO_CLASSES',
      subjectsCount: 0,
      criticalSubjectsCount: 0,
    };
  }

  let totalAttended = 0;
  let totalHeld = 0;
  let criticalSubjectsCount = 0;

  for (const sub of subjects) {
    totalAttended += sub.attended;
    totalHeld += sub.total;
    const result = calculateAttendance(sub.attended, sub.total, sub.targetPercentage);
    if (result.status === 'CRITICAL') {
      criticalSubjectsCount++;
    }
  }

  if (totalHeld === 0) {
    return {
      totalAttended: 0,
      totalHeld: 0,
      overallPercentage: 100,
      overallStatus: 'NO_CLASSES',
      subjectsCount: subjects.length,
      criticalSubjectsCount: 0,
    };
  }

  const rawPct = (totalAttended / totalHeld) * 100;
  const overallPercentage = Math.round(rawPct * 10) / 10;
  
  let overallStatus: AttendanceStatus = 'SAFE';
  if (rawPct < 75) {
    overallStatus = 'CRITICAL';
  } else if (rawPct === 75 || Math.floor((100 * totalAttended - 75 * totalHeld) / 75) === 0) {
    overallStatus = 'BORDERLINE';
  }

  return {
    totalAttended,
    totalHeld,
    overallPercentage,
    overallStatus,
    subjectsCount: subjects.length,
    criticalSubjectsCount,
  };
}
