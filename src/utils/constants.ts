import { Subject } from '../types/attendance';

export const STORAGE_KEY = 'bunk_o_meter_subjects_v1';

export const DEFAULT_SUBJECTS: Subject[] = [
  {
    id: 'sub-1',
    name: 'Engineering Mathematics',
    code: 'MATH201',
    attended: 22,
    total: 25,
    targetPercentage: 75,
  },
  {
    id: 'sub-2',
    name: 'Data Structures & Algorithms',
    code: 'CS202',
    attended: 15,
    total: 20,
    targetPercentage: 75,
  },
  {
    id: 'sub-3',
    name: 'Operating Systems',
    code: 'CS204',
    attended: 11,
    total: 18,
    targetPercentage: 75,
  },
];

