# Notification Settings - Seed Data & Examples

## Sample Notification Settings (JSON)

```json
{
  "notification_settings": [
    {
      "id": 1,
      "event_key": "student_admission",
      "event_name": "Student Admission",
      "enable_email": true,
      "enable_sms": true,
      "enable_app": true,
      "enable_whatsapp": false,
      "recipients": ["student", "guardian"],
      "sms_template_id": "TMPLT_SMS_001",
      "whatsapp_template_id": null,
      "sample_message": "Congratulations {{student_name}}! You have been admitted to {{class}} {{section}}. Admission No: {{admission_no}}. Welcome to our school family!",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "updated_by": null
    },
    {
      "id": 2,
      "event_key": "exam_result",
      "event_name": "Exam Result",
      "enable_email": true,
      "enable_sms": false,
      "enable_app": true,
      "enable_whatsapp": true,
      "recipients": ["student", "guardian"],
      "sms_template_id": null,
      "whatsapp_template_id": "TMPLT_WA_002",
      "sample_message": "Dear {{student_name}}, your {{subject}} exam result is {{mark}}/100 dated {{date}}. Admission No: {{admission_no}}",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "updated_by": null
    },
    {
      "id": 3,
      "event_key": "fee_submission",
      "event_name": "Fee Submission",
      "enable_email": true,
      "enable_sms": true,
      "enable_app": false,
      "enable_whatsapp": true,
      "recipients": ["guardian"],
      "sms_template_id": "TMPLT_SMS_003",
      "whatsapp_template_id": "TMPLT_WA_003",
      "sample_message": "Receipt: Fee of {{amount}} for {{student_name}} ({{admission_no}}) received on {{date}}. Thank you!",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "updated_by": null
    },
    {
      "id": 4,
      "event_key": "student_absent_attendance",
      "event_name": "Student Absent Attendance",
      "enable_email": true,
      "enable_sms": true,
      "enable_app": false,
      "enable_whatsapp": false,
      "recipients": ["guardian", "staff"],
      "sms_template_id": "TMPLT_SMS_004",
      "whatsapp_template_id": null,
      "sample_message": "{{student_name}} ({{admission_no}}) was marked absent on {{date}} for {{subject}}. Please contact school for details.",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "updated_by": null
    },
    {
      "id": 5,
      "event_key": "homework_assigned",
      "event_name": "Homework",
      "enable_email": false,
      "enable_sms": false,
      "enable_app": true,
      "enable_whatsapp": true,
      "recipients": ["student", "guardian"],
      "sms_template_id": null,
      "whatsapp_template_id": "TMPLT_WA_005",
      "sample_message": "Homework assignment for {{subject}}: Due on {{due_date}}. Chapter details have been sent. - {{staff_name}}",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "updated_by": null
    }
  ]
}
```

## SQL Insert Statements

```sql
-- Sample INSERT statements for notification_settings table

INSERT INTO notification_settings (
  event_key, event_name, enable_email, enable_sms, enable_app, enable_whatsapp,
  recipients, sms_template_id, whatsapp_template_id, sample_message, 
  created_at, updated_at
) VALUES
(
  'student_admission', 'Student Admission', TRUE, TRUE, TRUE, FALSE,
  '["student", "guardian"]', 'TMPLT_SMS_001', NULL,
  'Congratulations {{student_name}}! You have been admitted to {{class}} {{section}}. Admission No: {{admission_no}}',
  NOW(), NOW()
),
(
  'exam_result', 'Exam Result', TRUE, FALSE, TRUE, TRUE,
  '["student", "guardian"]', NULL, 'TMPLT_WA_002',
  'Dear {{student_name}}, your {{subject}} exam result is {{mark}}/100 dated {{date}}',
  NOW(), NOW()
),
(
  'fee_submission', 'Fee Submission', TRUE, TRUE, FALSE, TRUE,
  '["guardian"]', 'TMPLT_SMS_003', 'TMPLT_WA_003',
  'Receipt: Fee of {{amount}} for {{student_name}} received on {{date}}. Thank you!',
  NOW(), NOW()
),
(
  'fees_reminder', 'Fees Reminder', TRUE, TRUE, TRUE, FALSE,
  '["guardian"]', 'TMPLT_SMS_005', NULL,
  'Reminder: Fee of {{amount}} is due on {{due_date}} for {{student_name}}',
  NOW(), NOW()
),
(
  'student_absent_attendance', 'Student Absent Attendance', TRUE, TRUE, FALSE, FALSE,
  '["guardian", "staff"]', 'TMPLT_SMS_004', NULL,
  '{{student_name}} was marked absent on {{date}} for {{subject}}',
  NOW(), NOW()
),
(
  'student_present_attendance', 'Student Present Attendance', FALSE, FALSE, TRUE, FALSE,
  '["student", "guardian"]', NULL, NULL,
  '{{student_name}} was marked present on {{date}} for {{subject}}',
  NOW(), NOW()
),
(
  'homework', 'Homework', FALSE, FALSE, TRUE, TRUE,
  '["student", "guardian"]', NULL, 'TMPLT_WA_005',
  'Homework assignment for {{subject}}: Due on {{due_date}}. - {{staff_name}}',
  NOW(), NOW()
),
(
  'homework_evaluation', 'Homework Evaluation', TRUE, FALSE, TRUE, FALSE,
  '["student", "guardian"]', NULL, NULL,
  '{{subject}} homework evaluated. Status: {{status}}. Marks: {{mark}}',
  NOW(), NOW()
),
(
  'forgot_password', 'Forgot Password', TRUE, FALSE, FALSE, FALSE,
  '["student", "staff"]', NULL, NULL,
  'Hello {{student_name}}, reset your password using this link: {{meeting_link}}. Valid for 24 hours.',
  NOW(), NOW()
),
(
  'student_login_credential', 'Student Login Credential', TRUE, FALSE, FALSE, TRUE,
  '["student", "guardian"]', NULL, 'TMPLT_WA_001',
  'Login credentials for {{student_name}} ({{admission_no}}): Username: {{admission_no}}, Password: (sent separately)',
  NOW(), NOW()
),
(
  'staff_login_credential', 'Staff Login Credential', TRUE, FALSE, FALSE, FALSE,
  '["staff"]', NULL, NULL,
  'Login credentials for {{staff_name}}: Username and password sent securely',
  NOW(), NOW()
),
(
  'online_admission_fees_processing', 'Online Admission Fees Processing', TRUE, TRUE, TRUE, FALSE,
  '["student", "guardian"]', 'TMPLT_SMS_002', NULL,
  'Processing admission fees of {{amount}} for {{student_name}}. Transaction ID: {{date}}',
  NOW(), NOW()
),
(
  'fee_processing', 'Fee Processing', TRUE, TRUE, FALSE, TRUE,
  '["guardian"]', 'TMPLT_SMS_003', 'TMPLT_WA_003',
  'Processing fee payment of {{amount}}. Amount: {{amount}}, Date: {{date}}',
  NOW(), NOW()
),
(
  'behaviour_incident_assigned', 'Behaviour Incident Assigned', TRUE, FALSE, TRUE, FALSE,
  '["student", "guardian"]', NULL, NULL,
  'Dear {{student_name}}, a behavior incident reported by {{staff_name}} on {{date}}. Please contact guardian.',
  NOW(), NOW()
),
(
  'zoom_live_meetings_start', 'Zoom Live Meetings Start', FALSE, FALSE, TRUE, TRUE,
  '["student", "staff"]', NULL, 'TMPLT_WA_004',
  '{{subject}} live class started. Join using: {{meeting_link}} - {{staff_name}}',
  NOW(), NOW()
),
(
  'zoom_live_classes', 'Zoom Live Classes', FALSE, FALSE, TRUE, TRUE,
  '["student"]', NULL, 'TMPLT_WA_004',
  '{{subject}} class at {{time}} via Zoom. Link: {{meeting_link}}',
  NOW(), NOW()
),
(
  'gmeet_live_meetings', 'Gmeet Live Meetings', FALSE, FALSE, TRUE, TRUE,
  '["student", "staff"]', NULL, 'TMPLT_WA_004',
  '{{subject}} meeting started. Join: {{meeting_link}} - {{staff_name}}',
  NOW(), NOW()
),
(
  'gmeet_live_classes', 'Gmeet Live Classes', FALSE, FALSE, TRUE, TRUE,
  '["student"]', NULL, 'TMPLT_WA_004',
  '{{subject}} class at {{time}} via Google Meet. Link: {{meeting_link}}',
  NOW(), NOW()
),
(
  'gmeet_live_meeting_start', 'Gmeet Live Meeting Start', FALSE, FALSE, TRUE, TRUE,
  '["student", "staff"]', NULL, 'TMPLT_WA_004',
  'Meeting started by {{staff_name}}. Join: {{meeting_link}}',
  NOW(), NOW()
),
(
  'gmeet_live_classes_start', 'Gmeet Live Classes Start', FALSE, FALSE, TRUE, TRUE,
  '["student"]', NULL, 'TMPLT_WA_004',
  '{{subject}} class started. Join: {{meeting_link}}',
  NOW(), NOW()
),
(
  'online_course_purchase', 'Online Course Purchase', TRUE, TRUE, TRUE, FALSE,
  '["student"]', 'TMPLT_SMS_006', NULL,
  'Purchase successful! Course: {{subject}}, Amount: {{amount}}, Date: {{date}}',
  NOW(), NOW()
),
(
  'online_course_publish', 'Online Course Publish', FALSE, FALSE, TRUE, FALSE,
  '["student"]', NULL, NULL,
  'New online course available: {{subject}}. Enroll now!',
  NOW(), NOW()
),
(
  'online_examination_publish_exam', 'Online Examination Publish Exam', TRUE, FALSE, TRUE, FALSE,
  '["student"]', NULL, NULL,
  'Online {{subject}} exam is now available. Exam date: {{date}}, Time: {{time}}',
  NOW(), NOW()
),
(
  'online_examination_publish_result', 'Online Examination Publish Result', TRUE, TRUE, TRUE, TRUE,
  '["student", "guardian"]', 'TMPLT_SMS_007', 'TMPLT_WA_002',
  '{{subject}} exam result published. Score: {{mark}}/100, Date: {{date}}',
  NOW(), NOW()
),
(
  'cbse_exam_result', 'CBSE Exam Result', TRUE, TRUE, TRUE, TRUE,
  '["student", "guardian"]', 'TMPLT_SMS_008', 'TMPLT_WA_006',
  'CBSE {{subject}} result: {{mark}}/100, Grade: {{status}}, Date: {{date}}',
  NOW(), NOW()
),
(
  'cbse_exam_marksheet_pdf', 'CBSE Exam Marksheet PDF', TRUE, FALSE, TRUE, FALSE,
  '["student", "guardian"]', NULL, NULL,
  'CBSE marksheet PDF for {{student_name}} sent to your email',
  NOW(), NOW()
),
(
  'email_pdf_exam_marksheet', 'Email PDF Exam Marksheet', TRUE, FALSE, FALSE, FALSE,
  '["student", "guardian"]', NULL, NULL,
  'Exam marksheet PDF for {{student_name}} attached',
  NOW(), NOW()
),
(
  'student_apply_leave', 'Student Apply Leave', TRUE, FALSE, TRUE, FALSE,
  '["guardian", "staff"]', NULL, NULL,
  'Leave application from {{student_name}} for {{date}}. Status: {{status}}',
  NOW(), NOW()
),
(
  'online_admission_fees_submission', 'Online Admission Fees Submission', TRUE, TRUE, TRUE, FALSE,
  '["student", "guardian"]', 'TMPLT_SMS_001', NULL,
  'Admission fee of {{amount}} submitted for {{student_name}}. Admission No: {{admission_no}}',
  NOW(), NOW()
),
(
  'online_course_guest_user_sign_up', 'Online Course Guest User Sign Up', TRUE, FALSE, TRUE, FALSE,
  '["student"]', NULL, NULL,
  'Welcome {{student_name}}! Your guest account for online courses is ready',
  NOW(), NOW()
),
(
  'online_course_purchase_for_guest_user', 'Online Course Purchase for Guest User', TRUE, TRUE, TRUE, FALSE,
  '["student"]', 'TMPLT_SMS_006', NULL,
  'Course purchase confirmed: {{subject}}, Amount: {{amount}}',
  NOW(), NOW()
),
(
  'staff_present_attendance', 'Staff Present Attendance', FALSE, FALSE, TRUE, FALSE,
  '["staff"]', NULL, NULL,
  'Your attendance marked present on {{date}}',
  NOW(), NOW()
),
(
  'staff_absent_attendance', 'Staff Absent Attendance', FALSE, FALSE, TRUE, FALSE,
  '["staff"]', NULL, NULL,
  'Your attendance marked absent on {{date}}. Please contact HR.',
  NOW(), NOW()
);
```

## API Request Examples

### Create New Setting
```bash
curl -X POST http://localhost:5000/api/system-settings/notification-settings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "event_key": "custom_alert",
    "event_name": "Custom Alert",
    "enable_email": true,
    "enable_sms": true,
    "enable_app": false,
    "enable_whatsapp": true,
    "recipients": ["student", "guardian"],
    "sms_template_id": "TMPLT_SMS_009",
    "whatsapp_template_id": "TMPLT_WA_007",
    "sample_message": "Alert for {{student_name}}: {{subject}}. Date: {{date}}"
  }'
```

### Bulk Update
```bash
curl -X POST http://localhost:5000/api/system-settings/notification-settings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "settings": [
      {
        "event_key": "student_admission",
        "enable_email": true,
        "enable_sms": true,
        "recipients": ["student", "guardian", "staff"]
      },
      {
        "event_key": "exam_result",
        "enable_whatsapp": true,
        "sms_template_id": "TMPLT_SMS_002"
      }
    ]
  }'
```

### Export to CSV
```bash
curl -X GET "http://localhost:5000/api/system-settings/notification-settings/export?format=csv" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o notification_settings.csv
```

## Template ID Naming Convention

### SMS Templates
- `TMPLT_SMS_001` - Student Admission
- `TMPLT_SMS_002` - Admission Fees Processing
- `TMPLT_SMS_003` - Fee Submission/Processing
- `TMPLT_SMS_004` - Student Attendance
- `TMPLT_SMS_005` - Fees Reminder
- `TMPLT_SMS_006` - Course Purchase
- `TMPLT_SMS_007` - Exam Result
- `TMPLT_SMS_008` - CBSE Result
- `TMPLT_SMS_009` - Custom Alert

### WhatsApp Templates
- `TMPLT_WA_001` - Student Admission / Login Credentials
- `TMPLT_WA_002` - Exam Result / CBSE Result
- `TMPLT_WA_003` - Fee Processing
- `TMPLT_WA_004` - Live Class / Meeting
- `TMPLT_WA_005` - Homework
- `TMPLT_WA_006` - CBSE Exam Result
- `TMPLT_WA_007` - Custom Alert

## Database Backup & Restore

### PostgreSQL Backup
```bash
pg_dump -U postgres mindwhile_notification_settings > backup.sql

# Restore
psql -U postgres mindwhile_notification_settings < backup.sql
```

### SQLite Backup
```bash
cp notification_settings.db notification_settings.db.backup
```

## Migration Script (if moving from SQLite to PostgreSQL)

```python
# migrate.py

from app.main import create_app
from app.models import db, NotificationSetting
import json

# Source (SQLite)
app_sqlite = create_app()
app_sqlite.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///notification_settings.db'

# Destination (PostgreSQL)
app_postgres = create_app()
app_postgres.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:pass@localhost/db'

with app_sqlite.app_context():
    settings = NotificationSetting.query.all()
    data = [s.to_dict() for s in settings]

with app_postgres.app_context():
    db.create_all()
    for setting_dict in data:
        setting = NotificationSetting(**setting_dict)
        db.session.add(setting)
    db.session.commit()

print(f"Migrated {len(data)} notification settings")
```

## Monitoring & Analytics Queries

```sql
-- Count events by channel
SELECT 
  SUM(CASE WHEN enable_email THEN 1 ELSE 0 END) as email_count,
  SUM(CASE WHEN enable_sms THEN 1 ELSE 0 END) as sms_count,
  SUM(CASE WHEN enable_app THEN 1 ELSE 0 END) as app_count,
  SUM(CASE WHEN enable_whatsapp THEN 1 ELSE 0 END) as whatsapp_count
FROM notification_settings;

-- Most recently updated events
SELECT event_name, updated_at, updated_by
FROM notification_settings
ORDER BY updated_at DESC
LIMIT 10;

-- Events without sample messages
SELECT event_name, recipients
FROM notification_settings
WHERE sample_message IS NULL OR sample_message = '';

-- Events with all channels enabled
SELECT event_name, recipients
FROM notification_settings
WHERE enable_email = true
  AND enable_sms = true
  AND enable_app = true
  AND enable_whatsapp = true;
```
