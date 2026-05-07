/**
 * React Query key factory.
 *
 * Centralizing query keys avoids typos and makes cache invalidation reliable.
 * Every module gets its own key namespace.
 *
 * Usage:
 *   useQuery({ queryKey: queryKeys.students.list(classId), queryFn: ... })
 *   queryClient.invalidateQueries({ queryKey: queryKeys.students.all })
 */
export const queryKeys = {
  // ── Auth ──
  auth: {
    all: ['auth'],
    me: () => [...queryKeys.auth.all, 'me']
  },

  // ── Branch ──
  branches: {
    all: ['branches'],
    list: () => [...queryKeys.branches.all, 'list'],
    detail: (id) => [...queryKeys.branches.all, 'detail', id],
    stats: (id) => [...queryKeys.branches.all, 'stats', id],
    profile: (id) => [...queryKeys.branches.all, 'profile', id]
  },

  // ── Students ──
  students: {
    all: ['students'],
    list: (filters) => [...queryKeys.students.all, 'list', filters],
    detail: (id) => [...queryKeys.students.all, 'detail', id],
    attendance: (classId, date) =>
    [...queryKeys.students.all, 'attendance', classId, date]
  },

  // ── Teachers / Staff ──
  teachers: {
    all: ['teachers'],
    list: (filters) => [...queryKeys.teachers.all, 'list', filters],
    detail: (id) => [...queryKeys.teachers.all, 'detail', id]
  },

  // ── Academics ──
  academics: {
    all: ['academics'],
    classes: () => [...queryKeys.academics.all, 'classes'],
    sections: (classId) => [...queryKeys.academics.all, 'sections', classId],
    subjects: (classId) => [...queryKeys.academics.all, 'subjects', classId],
    timetable: (classId) => [...queryKeys.academics.all, 'timetable', classId]
  },

  // ── Finance / Fees ──
  fees: {
    all: ['fees'],
    structure: (classId) => [...queryKeys.fees.all, 'structure', classId],
    transactions: (filters) =>
    [...queryKeys.fees.all, 'transactions', filters],
    dues: (filters) => [...queryKeys.fees.all, 'dues', filters],
    types: () => [...queryKeys.fees.all, 'types'],
    groups: () => [...queryKeys.fees.all, 'groups']
  },

  // ── Exams ──
  exams: {
    all: ['exams'],
    schedule: (filters) =>
    [...queryKeys.exams.all, 'schedule', filters],
    results: (examId) => [...queryKeys.exams.all, 'results', examId]
  },

  // ── Communication ──
  communication: {
    all: ['communication'],
    notices: () => [...queryKeys.communication.all, 'notices'],
    messages: () => [...queryKeys.communication.all, 'messages']
  },

  // ── HR ──
  hr: {
    all: ['hr'],
    departments: () => [...queryKeys.hr.all, 'departments'],
    designations: () => [...queryKeys.hr.all, 'designations'],
    leave: (filters) => [...queryKeys.hr.all, 'leave', filters],
    payroll: (month) => [...queryKeys.hr.all, 'payroll', month]
  },

  // ── Settings ──
  settings: {
    all: ['settings'],
    general: () => [...queryKeys.settings.all, 'general'],
    roles: () => [...queryKeys.settings.all, 'roles']
  }
};