# Notification Settings - API Documentation

## Base URL
```
http://localhost:5000/api/system-settings
```

## Authentication
All endpoints require Bearer token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. GET /notification-settings
**Fetch all notification settings**

#### Request
```http
GET /api/system-settings/notification-settings?page=1&per_page=100
```

#### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number (1-indexed) |
| per_page | integer | 100 | Records per page (max 1000) |

#### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "event_key": "student_admission",
      "event_name": "Student Admission",
      "enable_email": true,
      "enable_sms": false,
      "enable_app": true,
      "enable_whatsapp": false,
      "recipients": ["student", "guardian"],
      "sms_template_id": null,
      "whatsapp_template_id": null,
      "sample_message": "Congratulations {{student_name}}! You have been admitted to {{class}} {{section}}. Admission No: {{admission_no}}",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "updated_by": null
    },
    // ... more settings
  ],
  "pagination": {
    "page": 1,
    "per_page": 100,
    "total": 34,
    "pages": 1
  }
}
```

#### Error Responses
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

---

### 2. GET /notification-settings/{event_key}
**Fetch a single notification setting**

#### Request
```http
GET /api/system-settings/notification-settings/student_admission
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "event_key": "student_admission",
    "event_name": "Student Admission",
    // ... full setting object
  }
}
```

#### Error Responses
```json
{
  "success": false,
  "error": "Setting not found"
}
```

---

### 3. POST /notification-settings
**Create or bulk update notification settings**

#### Request - Single Create
```http
POST /api/system-settings/notification-settings
Content-Type: application/json

{
  "event_key": "custom_event",
  "event_name": "Custom Event",
  "enable_email": true,
  "enable_sms": true,
  "enable_app": false,
  "enable_whatsapp": true,
  "recipients": ["student", "guardian"],
  "sms_template_id": "TMPLT_SMS_001",
  "whatsapp_template_id": "TMPLT_WA_001",
  "sample_message": "Hello {{student_name}}, this is a test on {{date}}"
}
```

#### Request - Bulk Update
```http
POST /api/system-settings/notification-settings
Content-Type: application/json

{
  "settings": [
    {
      "event_key": "student_admission",
      "enable_email": true,
      "recipients": ["student", "guardian"]
    },
    {
      "event_key": "exam_result",
      "enable_sms": true,
      "sms_template_id": "TMPLT_SMS_002"
    }
  ]
}
```

#### Response (201 Created / 200 OK)
```json
{
  "success": true,
  "data": {
    "id": 35,
    "event_key": "custom_event",
    "event_name": "Custom Event",
    // ... setting details
  }
}
```

#### Bulk Response
```json
{
  "success": true,
  "data": {
    "updated": [
      { "id": 1, "event_key": "student_admission", ... },
      { "id": 2, "event_key": "exam_result", ... }
    ],
    "errors": [],
    "total_updated": 2,
    "total_errors": 0
  }
}
```

#### Error Responses
```json
{
  "success": false,
  "error": "Setting for event 'student_admission' already exists"
}
```

```json
{
  "success": false,
  "errors": [
    "SMS Template ID is required when SMS is enabled",
    "At least one notification channel must be enabled"
  ]
}
```

---

### 4. PUT /notification-settings
**Update a specific notification setting**

#### Request
```http
PUT /api/system-settings/notification-settings
Content-Type: application/json
X-User-ID: admin@school.com

{
  "event_key": "student_admission",
  "enable_email": true,
  "enable_sms": true,
  "enable_app": false,
  "enable_whatsapp": true,
  "recipients": ["student", "guardian", "staff"],
  "sms_template_id": "TMPLT_SMS_001",
  "whatsapp_template_id": "TMPLT_WA_001",
  "sample_message": "Updated message for {{student_name}}"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "event_key": "student_admission",
    "event_name": "Student Admission",
    "enable_email": true,
    "enable_sms": true,
    "enable_app": false,
    "enable_whatsapp": true,
    "recipients": ["student", "guardian", "staff"],
    "sms_template_id": "TMPLT_SMS_001",
    "whatsapp_template_id": "TMPLT_WA_001",
    "sample_message": "Updated message for {{student_name}}",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-20T15:45:00Z",
    "updated_by": "admin@school.com"
  }
}
```

#### Error Responses
```json
{
  "success": false,
  "error": "Setting for event 'student_admission' not found"
}
```

---

### 5. DELETE /notification-settings/{event_key}
**Delete a notification setting**

#### Request
```http
DELETE /api/system-settings/notification-settings/custom_event
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Setting for event 'custom_event' deleted successfully"
}
```

#### Error Responses
```json
{
  "success": false,
  "error": "Setting for event 'custom_event' not found"
}
```

---

### 6. GET /notification-settings/export
**Export notification settings**

#### Request
```http
GET /api/system-settings/notification-settings/export?format=csv
```

#### Query Parameters
| Parameter | Type | Required | Values |
|-----------|------|----------|--------|
| format | string | No | json, csv, excel |

#### Response - CSV (200 OK)
```
Event Name,Email Enabled,SMS Enabled,Mobile App Enabled,WhatsApp Enabled,Recipients,SMS Template ID,WhatsApp Template ID,Sample Message
Student Admission,Yes,Yes,No,Yes,"student; guardian",TMPLT_SMS_001,TMPLT_WA_001,"Congratulations {{student_name}}!..."
Exam Result,Yes,No,Yes,No,"student",,,""
...
```

#### Response - JSON (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "event_key": "student_admission",
      // ... full settings
    },
    // ... more settings
  ]
}
```

#### Response - Excel (200 OK)
File download with `.xlsx` extension

#### Error Responses
```json
{
  "success": false,
  "error": "Invalid format"
}
```

---

### 7. GET /notification-templates
**Get available template IDs for a channel**

#### Request
```http
GET /api/system-settings/notification-templates?channel=sms
```

#### Query Parameters
| Parameter | Type | Required | Values |
|-----------|------|----------|--------|
| channel | string | No | sms, whatsapp, email |

#### Response (200 OK)
```json
{
  "success": true,
  "channel": "sms",
  "templates": [
    {
      "id": "TMPLT_SMS_001",
      "name": "Student Admission"
    },
    {
      "id": "TMPLT_SMS_002",
      "name": "Fee Submission"
    },
    {
      "id": "TMPLT_SMS_003",
      "name": "Exam Result"
    },
    {
      "id": "TMPLT_SMS_004",
      "name": "Attendance"
    },
    {
      "id": "TMPLT_SMS_005",
      "name": "Homework"
    }
  ]
}
```

---

### 8. GET /health
**Health check endpoint**

#### Request
```http
GET /api/system-settings/health
```

#### Response (200 OK)
```json
{
  "status": "ok",
  "service": "notification-settings"
}
```

---

## Request Headers

| Header | Required | Value |
|--------|----------|-------|
| Authorization | Yes | Bearer <jwt_token> |
| Content-Type | Yes (for POST/PUT) | application/json |
| X-User-ID | No | admin@school.com (for audit trail) |

---

## Response Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request body or parameters |
| 404 | Not Found | Resource not found |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | User doesn't have permission |
| 500 | Server Error | Internal server error |

---

## Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "errors": ["error1", "error2"],  // Array of validation errors
  "status_code": 400
}
```

---

## Validation Rules

### SMS Template ID
- **Required**: When `enable_sms: true`
- **Format**: String, max 255 characters
- **Example**: `TMPLT_SMS_001`

### WhatsApp Template ID
- **Required**: When `enable_whatsapp: true`
- **Format**: String, max 255 characters
- **Example**: `TMPLT_WA_001`

### Recipients Array
- **Valid values**: `"student"`, `"guardian"`, `"staff"`
- **At least one channel**: Must have at least one of email/sms/app/whatsapp enabled

### Sample Message
- **Max length**: 5000 characters
- **Supported placeholders**:
  - `{{student_name}}`
  - `{{admission_no}}`
  - `{{class}}`
  - `{{section}}`
  - `{{date}}`
  - `{{amount}}`
  - `{{subject}}`
  - `{{staff_name}}`
  - `{{meeting_link}}`
  - `{{time}}`
  - `{{fee_category}}`
  - `{{due_date}}`
  - `{{status}}`
  - `{{mark}}`
  - `{{result}}`

---

## Example Usage

### cURL Examples

#### Get all settings
```bash
curl -X GET http://localhost:5000/api/system-settings/notification-settings \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

#### Update single setting
```bash
curl -X PUT http://localhost:5000/api/system-settings/notification-settings \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -H "X-User-ID: admin@school.com" \
  -d '{
    "event_key": "student_admission",
    "enable_email": true,
    "recipients": ["student", "guardian"]
  }'
```

#### Bulk export as CSV
```bash
curl -X GET "http://localhost:5000/api/system-settings/notification-settings/export?format=csv" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -o notification-settings.csv
```

### JavaScript/Fetch Examples

#### Get all settings
```javascript
const response = await fetch(
  'http://localhost:5000/api/system-settings/notification-settings',
  {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
);
const data = await response.json();
console.log(data);
```

#### Update multiple settings
```javascript
const updates = [
  {
    event_key: 'student_admission',
    enable_email: true,
    enable_sms: true,
    recipients: ['student', 'guardian']
  },
  {
    event_key: 'exam_result',
    enable_email: true,
    recipients: ['student']
  }
];

const response = await fetch(
  'http://localhost:5000/api/system-settings/notification-settings',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-User-ID': 'admin@school.com'
    },
    body: JSON.stringify({ settings: updates })
  }
);
const result = await response.json();
console.log(result);
```

---

## Rate Limiting

Currently no rate limiting implemented. Consider adding:
- 100 requests per minute per user
- Contact support for higher limits

---

## Backward Compatibility

This API follows semantic versioning. Breaking changes will increment the major version number (e.g., v2.0).

---

## Deprecation Policy

Endpoints will be marked as deprecated 6 months before removal. A `Deprecation` header will be sent with deprecation notice.

---

## Support

For API issues or feature requests, contact the backend team or create an issue in the repository.
