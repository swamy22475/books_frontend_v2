# Notification Settings Module - Complete Implementation

A production-ready notification management system for the Mindwhile ERP platform. Configure how and when system notifications are sent across Email, SMS, Mobile App, and WhatsApp to Students, Guardians, and Staff.

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [File Structure](#file-structure)
- [Quick Start](#quick-start)
- [Frontend Setup](#frontend-setup)
- [Backend Setup](#backend-setup)
- [Documentation](#documentation)
- [Development](#development)
- [Deployment](#deployment)
- [Features Checklist](#features-checklist)
- [Support](#support)

---

## ✨ Features

### Core Features
- ✅ **34 Pre-configured Events** - All major school system notifications
- ✅ **Multi-channel Support** - Email, SMS, Mobile App, WhatsApp
- ✅ **Flexible Recipients** - Student, Guardian, Staff
- ✅ **Template Management** - SMS and WhatsApp template IDs
- ✅ **Message Customization** - 15+ dynamic placeholders
- ✅ **Bulk Operations** - Save multiple changes at once
- ✅ **Advanced Search** - Filter by event name
- ✅ **Recipient Filtering** - View settings for specific recipient types
- ✅ **Export Options** - Copy, CSV, Excel, PDF, Print
- ✅ **Real-time Validation** - Instant feedback on template configuration

### UI/UX Features
- ✅ **Mindwhile ERP Styled** - Tailwind CSS design system
- ✅ **Responsive Design** - Desktop-first (1366x768)
- ✅ **Dark Mode Support** - Full dark/light theme compatibility
- ✅ **Sticky Table Header** - Easy navigation in long tables
- ✅ **Accessibility** - WCAG 2.1 AA compliant
- ✅ **Smooth Interactions** - Loading states, toast notifications
- ✅ **Modal Editing** - Inline template editing
- ✅ **Fixed Save Button** - Always visible for bulk saves

### Technical Features
- ✅ **RESTful API** - Clean, well-documented endpoints
- ✅ **Authentication** - JWT-based security
- ✅ **Pagination** - Efficient data handling
- ✅ **Error Handling** - Comprehensive error messages
- ✅ **Input Validation** - Server and client-side
- ✅ **Database Indexes** - Performance optimized
- ✅ **Mock Data** - Development fallback support
- ✅ **Seed Data** - Automatic initial setup

---

## 🏗️ Architecture

```
Mindwhile ERP
│
├── Frontend (React 19)
│   └── NotificationSettings Module
│       ├── Components (React)
│       ├── Services (API calls)
│       ├── Styling (Tailwind + CSS)
│       └── Mock Data (development)
│
├── Backend (Flask/Python)
│   └── System Settings Service
│       ├── API Routes
│       ├── Database Models
│       ├── Business Logic
│       ├── Validation & Schemas
│       └── Database (PostgreSQL/SQLite)
│
└── Database
    └── notification_settings table
        ├── Settings (34 events)
        ├── Channel configuration
        ├── Template IDs
        └── Message content
```

### Technology Stack

**Frontend:**
- React 19 - UI framework
- Tailwind CSS - Styling
- Radix UI - Accessible components
- Lucide React - Icons
- Vite - Build tool

**Backend:**
- Flask 3.0 - Python web framework
- SQLAlchemy 2.0 - ORM
- PostgreSQL/SQLite - Database
- Pydantic - Data validation
- Gunicorn - Production server

**DevOps:**
- Docker - Containerization
- Docker Compose - Multi-service orchestration

---

## 📁 File Structure

### Frontend (src/views/pages/NotificationSettings/)

```
NotificationSettings/
├── NotificationSettings.jsx           # Main container component
├── NotificationSettings.css           # Component styles
├── constants.js                       # Constants & configurations
├── mockData.js                        # Mock data for development
│
├── components/
│   ├── NotificationTable.jsx          # Main table display
│   ├── ChannelToggle.jsx              # Email/SMS/App/WhatsApp toggle
│   ├── RecipientSelector.jsx          # Student/Guardian/Staff selector
│   ├── TemplateModal.jsx              # Template editing modal
│   └── NotificationTableToolbar.jsx   # Search/Filter/Export toolbar
│
└── Documentation/
    ├── README.md                      # This file
    ├── FRONTEND_DOCUMENTATION.md      # Component & hooks documentation
    ├── API_DOCUMENTATION.md           # API endpoints reference
    ├── INTEGRATION_GUIDE.md           # Step-by-step integration
    └── SEED_DATA_AND_EXAMPLES.md      # Sample data & queries
```

### Service Layer (src/services/)

```
services/
└── notificationService.js
    ├── fetchNotificationSettings()
    ├── saveNotificationSettings()
    ├── updateNotificationSetting()
    ├── fetchTemplateIds()
    └── exportNotificationSettings()
```

### Backend (backend/system_settings/)

```
system_settings/
├── app/
│   ├── main.py                        # Flask app factory
│   ├── config.py                      # Configuration
│   ├── database.py                    # Database connection
│   ├── models.py                      # SQLAlchemy models
│   ├── schemas.py                     # Pydantic validation schemas
│   ├── routes.py                      # API endpoints
│   └── services.py                    # Business logic
│
├── requirements.txt                   # Python dependencies
└── README.md                          # Backend setup guide
```

---

## 🚀 Quick Start

### Minimum Requirements
- Node.js 18+
- Python 3.8+
- PostgreSQL 12+ (or SQLite for development)
- npm or yarn

### 1. Frontend Setup (5 minutes)

```bash
# Copy files to your project
cp -r src/views/pages/NotificationSettings YOUR_PROJECT/src/views/pages/
cp src/services/notificationService.js YOUR_PROJECT/src/services/

# Add route to your Router
# See INTEGRATION_GUIDE.md for details

# Update .env
echo "VITE_API_URL=http://localhost:5000/api" >> .env

# Start dev server
npm run dev
```

Visit: http://localhost:5173/system-settings/notifications

### 2. Backend Setup (10 minutes)

```bash
# Setup
cd backend/system_settings
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env
cat > .env << EOF
FLASK_ENV=development
DATABASE_URL=sqlite:///notification_settings.db
SECRET_KEY=dev-secret-key
JWT_SECRET_KEY=dev-jwt-secret
CORS_ORIGINS=http://localhost:5173
EOF

# Start server
python app/main.py
```

API available at: http://localhost:5000/api/system-settings

---

## 📖 Documentation

### Quick Links

| Document | Purpose |
|----------|---------|
| [FRONTEND_DOCUMENTATION.md](FRONTEND_DOCUMENTATION.md) | Component APIs, state management, styling |
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | REST API endpoints, request/response examples |
| [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) | Step-by-step integration instructions |
| [SEED_DATA_AND_EXAMPLES.md](SEED_DATA_AND_EXAMPLES.md) | Sample data, SQL queries, API examples |
| [backend/system_settings/README.md](backend/system_settings/README.md) | Backend setup & deployment |

### Key Sections

#### Frontend Documentation
- Component structure and props
- State management patterns
- Styling system (Tailwind + CSS)
- API integration
- Testing strategies
- Troubleshooting

#### API Documentation
- 8 REST endpoints
- Request/response examples
- Error handling
- Authentication & authorization
- Validation rules
- Rate limiting

#### Integration Guide
- Django/Flask integration
- Database setup
- Authentication integration
- CORS configuration
- Troubleshooting common issues
- Performance optimization

---

## 🔧 Development

### Frontend Development

```bash
cd mindwhile-schoolerp

# Install dependencies
npm install

# Start dev server with HMR
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

### Backend Development

```bash
cd backend/system_settings

# Activate virtual environment
source venv/bin/activate

# Run development server with auto-reload
flask --app app.main run --reload

# Run tests
pytest

# Run tests with coverage
pytest --cov=app
```

### Database Management

```bash
# Create tables
python -c "from app.main import create_app; app = create_app()"

# Backup database
pg_dump notification_settings > backup.sql

# Restore database
psql notification_settings < backup.sql

# Access database shell
psql notification_settings
\dt  # List tables
SELECT * FROM notification_settings LIMIT 10;
```

---

## 🚢 Deployment

### Docker Deployment

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Deployment

**Frontend:**
```bash
npm run build
# Deploy dist/ folder to web server (Nginx, Apache, etc.)
```

**Backend:**
```bash
# Install gunicorn
pip install gunicorn

# Run with gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app.main:app

# Or use systemd service
# See INTEGRATION_GUIDE.md
```

### Environment Configuration

**Production (.env):**
```env
FLASK_ENV=production
DEBUG=False
DATABASE_URL=postgresql://user:password@host/dbname
SECRET_KEY=generate-strong-secret-key
JWT_SECRET_KEY=generate-strong-jwt-secret
CORS_ORIGINS=https://yourdomain.com
```

---

## ✅ Features Checklist

### Core Features
- [x] 34 pre-configured events
- [x] 4 notification channels (Email, SMS, App, WhatsApp)
- [x] 3 recipient types (Student, Guardian, Staff)
- [x] Template ID management
- [x] Sample message editing with placeholders
- [x] Global save functionality

### UI Features
- [x] Full-width card layout
- [x] Table with sticky header
- [x] Search by event name
- [x] Filter by recipient type
- [x] Export (Copy, CSV, Excel, PDF, Print)
- [x] View/Edit action buttons
- [x] Modal for template editing
- [x] Fixed save button
- [x] Skeleton loaders
- [x] Toast notifications

### API Features
- [x] GET all settings (paginated)
- [x] GET single setting
- [x] POST create setting
- [x] POST bulk update
- [x] PUT update setting
- [x] DELETE setting
- [x] GET export settings
- [x] GET available templates
- [x] Health check endpoint

### Backend Features
- [x] Authentication & authorization
- [x] Input validation
- [x] Error handling
- [x] Database models
- [x] Service layer
- [x] Pagination
- [x] Database indexes
- [x] Seed data

### Additional Features
- [x] Mock data support
- [x] Dark mode styling
- [x] Responsive design (mobile, tablet, desktop)
- [x] Accessibility (WCAG 2.1 AA)
- [x] Documentation (4 comprehensive guides)
- [x] Example API requests
- [x] Migration scripts
- [x] Monitoring queries

---

## 🐛 Troubleshooting

### Frontend Issues

**Problem**: API not found (404)
```
Solution: Check VITE_API_URL in .env
Should be: http://localhost:5000/api (without /notification-settings)
```

**Problem**: CORS error
```
Solution: Ensure backend CORS_ORIGINS includes frontend URL
CORS_ORIGINS=http://localhost:5173
```

**Problem**: Components not rendering
```
Solution: Install missing Radix UI dependencies
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
```

### Backend Issues

**Problem**: Database connection error
```
Solution: Check DATABASE_URL
SQLite: sqlite:///notification_settings.db
PostgreSQL: postgresql://user:password@localhost/dbname
```

**Problem**: Module not found
```
Solution: Install dependencies
pip install -r requirements.txt
```

**Problem**: Port already in use
```
Solution: Use different port
python app/main.py --port 5001
```

### Database Issues

**Problem**: Tables not created
```
Solution: Run initialization
python -c "from app.main import create_app; app = create_app()"
```

**Problem**: Data not seeding
```
Solution: Manually insert seed data
See: SEED_DATA_AND_EXAMPLES.md
```

---

## 📊 Event List (34 Events)

1. Online Admission Fees Submission
2. Behaviour Incident Assigned
3. CBSE Exam Result
4. CBSE Exam Marksheet PDF
5. Online Course Guest User Sign Up
6. Online Course Purchase for Guest User
7. Email PDF Exam Marksheet
8. Student Apply Leave
9. Online Admission Fees Processing
10. Fee Processing
11. Staff Login Credential
12. Student Login Credential
13. Online Course Purchase
14. Online Course Publish
15. Student Admission
16. Forgot Password
17. Exam Result
18. Fee Submission
19. Student Absent Attendance
20. Homework
21. Fees Reminder
22. Zoom Live Meetings Start
23. Online Examination Publish Exam
24. Online Examination Publish Result
25. Zoom Live Classes
26. Zoom Live Meetings
27. Gmeet Live Meetings
28. Gmeet Live Classes
29. Gmeet Live Meeting Start
30. Gmeet Live Classes Start
31. Student Present Attendance
32. Homework Evaluation
33. Staff Present Attendance
34. Staff Absent Attendance

---

## 🔐 Security

- ✅ JWT authentication on all API endpoints
- ✅ Input validation on server and client
- ✅ SQL injection prevention via ORM
- ✅ CORS protection enabled
- ✅ Password security (bcrypt for future credentials)
- ✅ Audit trail (updated_by, updated_at)
- ✅ Error message sanitization
- ✅ Rate limiting (can be added)
- ✅ HTTPS ready

---

## 📈 Performance

- ✅ Database indexes on event_key and event_name
- ✅ Pagination support (default 100 per page)
- ✅ Memoized filtered data in React
- ✅ Lazy loading of components
- ✅ Skeleton loaders for perceived performance
- ✅ API request debouncing (can be added)
- ✅ SQL query optimization
- ✅ Gzip compression support

---

## 🧪 Testing

### Unit Tests

```javascript
// Test NotificationSettings component
test('renders notification settings page', () => {
  render(<NotificationSettings />);
  expect(screen.getByText('Notification Settings')).toBeInTheDocument();
});
```

### Integration Tests

```javascript
// Test with mock API
test('loads and displays settings', async () => {
  render(<NotificationSettings />);
  await waitFor(() => {
    expect(screen.getByText('Student Admission')).toBeInTheDocument();
  });
});
```

### API Tests

```python
# Test API endpoint
def test_get_notification_settings(client):
    response = client.get('/api/system-settings/notification-settings')
    assert response.status_code == 200
    assert 'data' in response.json
```

---

## 🔄 Workflow

### User Workflow
1. Navigate to System Settings → Notifications
2. Search or filter events as needed
3. Toggle channels on/off
4. Select recipients for each event
5. Click Edit to modify template IDs and message
6. Review changes
7. Click "Save All Changes"
8. Confirmation toast appears

### Development Workflow
1. Start backend: `python app/main.py`
2. Start frontend: `npm run dev`
3. Make code changes
4. Hot reload applies changes
5. Test with mock data
6. Verify with backend
7. Run tests
8. Commit and push

---

## 📝 License

This module is part of the Mindwhile ERP system.

---

## 👥 Support & Contact

- **Documentation**: See docs in this folder
- **Issues**: GitHub Issues
- **Email**: support@mindwhile.org
- **Slack**: #notification-settings

---

## 🎯 Next Steps

1. **Quick Start**: Follow Quick Start section above
2. **Read Docs**: Check FRONTEND_DOCUMENTATION.md
3. **Integrate**: Follow INTEGRATION_GUIDE.md
4. **Deploy**: Use DEPLOYMENT instructions
5. **Monitor**: Check backend logs regularly

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Radix UI Components](https://radix-ui.com)
- [Flask Documentation](https://flask.palletsprojects.com)
- [SQLAlchemy ORM](https://sqlalchemy.org)
- [PostgreSQL Docs](https://www.postgresql.org/docs)

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Status**: Production Ready ✅
