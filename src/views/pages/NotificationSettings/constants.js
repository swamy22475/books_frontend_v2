/**
 * Constants for Notification Settings module
 */

export const AVAILABLE_PLACEHOLDERS = [
  'student_name',
  'admission_no',
  'class',
  'section',
  'date',
  'amount',
  'subject',
  'staff_name',
  'meeting_link',
  'time',
  'fee_category',
  'due_date',
  'status',
  'mark',
  'result',
];

export const EVENTS = [
  'Online Admission Fees Submission',
  'Behaviour Incident Assigned',
  'CBSE Exam Result',
  'CBSE Exam Marksheet PDF',
  'Online Course Guest User Sign Up',
  'Online Course Purchase for Guest User',
  'Email PDF Exam Marksheet',
  'Student Apply Leave',
  'Online Admission Fees Processing',
  'Fee Processing',
  'Staff Login Credential',
  'Student Login Credential',
  'Online Course Purchase',
  'Online Course Publish',
  'Student Admission',
  'Forgot Password',
  'Exam Result',
  'Fee Submission',
  'Student Absent Attendance',
  'Homework',
  'Fees Reminder',
  'Zoom Live Meetings Start',
  'Online Examination Publish Exam',
  'Online Examination Publish Result',
  'Zoom Live Classes',
  'Zoom Live Meetings',
  'Gmeet Live Meetings',
  'Gmeet Live Classes',
  'Gmeet Live Meeting Start',
  'Gmeet Live Classes Start',
  'Student Present Attendance',
  'Homework Evaluation',
  'Staff Present Attendance',
  'Staff Absent Attendance',
];

export const RECIPIENTS = ['student', 'guardian', 'staff'];

export const CHANNELS = {
  email: {
    key: 'enable_email',
    label: 'Email',
    icon: '📧',
  },
  sms: {
    key: 'enable_sms',
    label: 'SMS',
    icon: '💬',
  },
  app: {
    key: 'enable_app',
    label: 'Mobile App',
    icon: '📱',
  },
  whatsapp: {
    key: 'enable_whatsapp',
    label: 'WhatsApp',
    icon: '💚',
  },
};

export const VALIDATION_RULES = {
  smsTemplateId: {
    required: (value, row) => row.enable_sms && !value,
    message: 'SMS Template ID is required when SMS is enabled',
  },
  whatsappTemplateId: {
    required: (value, row) => row.enable_whatsapp && !value,
    message: 'WhatsApp Template ID is required when WhatsApp is enabled',
  },
};
