/**
 * Mock data for Notification Settings
 * Used for development and as fallback when API is unavailable
 */

import { EVENTS } from './constants';

export const mockNotificationSettings = EVENTS.map((eventName, index) => ({
  id: index + 1,
  event_key: eventName.toLowerCase().replace(/\s+/g, '_'),
  event_name: eventName,
  enable_email: index % 2 === 0,
  enable_sms: index % 3 === 0,
  enable_app: index % 4 === 0,
  enable_whatsapp: index % 5 === 0,
  recipients: [
    'student',
    ...(index % 2 === 0 ? ['guardian'] : []),
    ...(index % 3 === 0 ? ['staff'] : []),
  ],
  sms_template_id: index % 2 === 0 ? `TMPLT_SMS_${index.toString().padStart(3, '0')}` : '',
  whatsapp_template_id: index % 3 === 0 ? `TMPLT_WA_${index.toString().padStart(3, '0')}` : '',
  sample_message: getSampleMessage(eventName),
  updated_at: new Date().toISOString(),
}));

function getSampleMessage(eventName) {
  const messages = {
    'online admission fees submission':
      'Dear {{student_name}}, your admission fee of {{amount}} has been submitted. Your admission number is {{admission_no}}.',
    'behaviour incident assigned':
      'Hello {{student_name}}, a behavior incident has been reported by {{staff_name}} on {{date}}. Please contact your guardian.',
    'cbse exam result':
      'Dear {{student_name}}, your {{subject}} exam result is {{mark}}. For admission number {{admission_no}}, {{date}}.',
    'student admission':
      'Congratulations {{student_name}}! You have been admitted to {{class}} {{section}}. Admission No: {{admission_no}}',
    'forgot password':
      'Hello {{student_name}}, reset your password using this link: {{meeting_link}}. Valid for 24 hours.',
    'student absent attendance':
      '{{student_name}} was marked absent on {{date}} for {{subject}}. Please contact the school if this is incorrect.',
    'student present attendance':
      '{{student_name}} was marked present on {{date}} for {{subject}}.',
    'homework':
      'Dear {{student_name}}, homework for {{subject}} has been assigned. Please complete by {{due_date}}.',
    'homework evaluation':
      'Dear {{student_name}}, your {{subject}} homework has been evaluated and marked as {{status}}.',
    'fees reminder':
      'Reminder: Fee of {{amount}} is due on {{due_date}} for {{student_name}} (Admission: {{admission_no}}).',
  };

  return messages[eventName.toLowerCase()] || `Notification for {{student_name}} regarding {{subject}}. Sent on {{date}}.`;
}

export const mockTemplateIds = {
  sms: [
    'TMPLT_SMS_001',
    'TMPLT_SMS_002',
    'TMPLT_SMS_003',
    'TMPLT_SMS_004',
    'TMPLT_SMS_005',
  ],
  whatsapp: [
    'TMPLT_WA_001',
    'TMPLT_WA_002',
    'TMPLT_WA_003',
    'TMPLT_WA_004',
    'TMPLT_WA_005',
  ],
  email: [
    'TMPLT_EMAIL_001',
    'TMPLT_EMAIL_002',
    'TMPLT_EMAIL_003',
    'TMPLT_EMAIL_004',
    'TMPLT_EMAIL_005',
  ],
};
