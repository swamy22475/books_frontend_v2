# Notification Settings - Integration Guide

## Quick Start

This guide will help you integrate the Notification Settings module into your Mindwhile ERP application.

## Prerequisites

- React 19+
- Tailwind CSS configured
- Radix UI components installed
- Node.js 16+
- Flask backend (Python 3.8+)

## Frontend Integration

### Step 1: Copy Files

Copy the NotificationSettings folder to your project:

```bash
cp -r src/views/pages/NotificationSettings/ YOUR_PROJECT/src/views/pages/
cp -r src/services/notificationService.js YOUR_PROJECT/src/services/
```

### Step 2: Install Dependencies (if needed)

All required packages should already be in your project. If not:

```bash
npm install @radix-ui/react-checkbox @radix-ui/react-dialog
npm install @radix-ui/react-dropdown-menu lucide-react
```

### Step 3: Add Route

Update your Router configuration:

```javascript
// src/routes/Router.tsx or your routing file

import NotificationSettings from '../views/pages/NotificationSettings/NotificationSettings';

const routes = [
  // ... other routes
  {
    path: '/system-settings/notifications',
    element: <NotificationSettings />,
    requiresAuth: true,
    // Add permission check if needed
    // requiredRole: 'admin'
  },
];

export default routes;
```

### Step 4: Configure Environment Variables

Create or update your `.env` file:

```env
# Frontend API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_APP_ENV=development
```

### Step 5: Update Navigation/Sidebar

Add a link to Notification Settings in your admin menu:

```javascript
// In your admin/settings navigation component

{
  title: 'Notification Settings',
  path: '/system-settings/notifications',
  icon: 'bell', // or your icon component
  requiredRole: 'admin',
  requiredPermission: 'manage_notifications'
}
```

### Step 6: Test Frontend

```bash
npm run dev

# Navigate to http://localhost:5173/system-settings/notifications
```

---

## Backend Integration

### Step 1: Create Backend Directory

```bash
mkdir -p backend/system_settings/app
cd backend/system_settings
```

### Step 2: Copy Backend Files

Copy all files from the backend/system_settings/ folder to your project.

### Step 3: Install Python Dependencies

```bash
cd backend/system_settings

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 4: Configure Database

Create `.env` file in `backend/system_settings/`:

```env
# Database Configuration
FLASK_ENV=development
DEBUG=True

# SQLite (for development)
DATABASE_URL=sqlite:///notification_settings.db

# PostgreSQL (for production)
# DATABASE_URL=postgresql://user:password@localhost:5432/mindwhile_erp

# Security
SECRET_KEY=your-secret-key-here-change-in-production
JWT_SECRET_KEY=your-jwt-secret-here-change-in-production

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Server
FLASK_HOST=0.0.0.0
FLASK_PORT=5000
```

### Step 5: Create Database

```bash
cd backend/system_settings

python -c "
from app.main import create_app
app = create_app()
with app.app_context():
    from app.models import db
    db.create_all()
    print('Database tables created!')
"
```

This will automatically seed the initial notification settings.

### Step 6: Start Backend Server

```bash
# Development with Flask
python app/main.py

# Or with auto-reload
flask --app app.main run --reload

# Production with Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app.main:app
```

The API will be available at `http://localhost:5000/api/system-settings`

### Step 7: Integrate with Existing Backend

If integrating with an existing Flask project:

#### Option A: Blueprint Registration

```python
# In your main app.py or main Flask application

from backend.system_settings.app.routes import notification_bp

app.register_blueprint(notification_bp)
```

#### Option B: Microservice

Keep it as a separate microservice running on a different port.

---

## Database Integration

### PostgreSQL Setup

If using PostgreSQL instead of SQLite:

```bash
# Create database
createdb mindwhile_notification_settings

# Or in psql:
# CREATE DATABASE mindwhile_notification_settings;

# Then update DATABASE_URL:
# DATABASE_URL=postgresql://username:password@localhost:5432/mindwhile_notification_settings
```

### SQLAlchemy Configuration

If your main app uses SQLAlchemy, ensure compatible versions:

```bash
pip show sqlalchemy flask-sqlalchemy
```

Should be:
- SQLAlchemy >= 2.0.0
- Flask-SQLAlchemy >= 3.0.0

---

## API Authentication

### JWT Integration

If using JWT authentication in your main app:

```python
# app/routes.py - Update authentication wrapper

from functools import wraps
from flask import request, jsonify
import jwt

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if not token:
            return jsonify({'error': 'Missing token'}), 401
        
        try:
            # Your JWT validation logic
            payload = jwt.decode(
                token,
                app.config['JWT_SECRET_KEY'],
                algorithms=['HS256']
            )
            request.current_user = payload
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(*args, **kwargs)
    return decorated
```

### OAuth Integration

For OAuth-based authentication, update the token validation in `routes.py`.

---

## CORS Configuration

### Development

For local development with separate frontend/backend:

```env
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:5174
```

### Production

```env
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com,https://admin.yourdomain.com
```

---

## Frontend-Backend Communication

### API Service Configuration

The `notificationService.js` automatically uses `VITE_API_URL`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

### Custom Headers

If you need to add custom headers (e.g., school ID):

```javascript
// src/services/notificationService.js

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
  'X-School-ID': localStorage.getItem('schoolId'), // Add custom header
};
```

---

## Testing Integration

### Frontend Tests

```bash
cd your-project

# Run tests with Mock API
npm run test

# Test with real backend
VITE_API_URL=http://localhost:5000/api npm run test
```

### Backend Tests

```bash
cd backend/system_settings

# Run pytest
pytest

# Run with coverage
pytest --cov=app

# Run specific test
pytest tests/test_routes.py::test_get_all_settings
```

### Manual Testing

1. Start backend: `python app/main.py`
2. Start frontend: `npm run dev`
3. Navigate to http://localhost:5173/system-settings/notifications
4. Test CRUD operations

---

## Monitoring & Logging

### Frontend Logging

Enable debug logging:

```javascript
// In NotificationSettings.jsx or your service

const isDev = import.meta.env.DEV;

if (isDev) {
  console.log('Fetching notification settings...');
}
```

### Backend Logging

```python
# app/main.py

import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info('Notification settings service started')
```

### Log Files

Configure file logging:

```python
# app/config.py

import logging
from logging.handlers import RotatingFileHandler

file_handler = RotatingFileHandler(
    'notification_settings.log',
    maxBytes=10485760,  # 10MB
    backupCount=10
)
file_handler.setFormatter(logging.Formatter(
    '%(asctime)s %(levelname)s: %(message)s'
))
```

---

## Performance Optimization

### Frontend Optimization

1. **Lazy Loading**: Load NotificationSettings only when needed
```javascript
const NotificationSettings = React.lazy(() =>
  import('./views/pages/NotificationSettings')
);
```

2. **Memoization**: Already implemented in component

3. **Virtual Scrolling**: For 1000+ events
```bash
npm install react-window
```

### Backend Optimization

1. **Database Indexing**: Already applied to `event_key` and `event_name`

2. **Pagination**: Always use pagination for large datasets

3. **Caching**: Add Redis caching
```python
from flask_caching import Cache

cache = Cache(app, config={'CACHE_TYPE': 'redis'})

@notification_bp.route('/notification-settings')
@cache.cached(timeout=3600)
def get_notification_settings():
    # ...
```

---

## Troubleshooting Integration

### Issue: CORS Error

**Solution**:
```env
# .env in backend
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Issue: API 404 Not Found

**Solution**:
```javascript
// Check VITE_API_URL
console.log(import.meta.env.VITE_API_URL);

// Should be: http://localhost:5000/api (without trailing /notification-settings)
```

### Issue: Authentication Failed

**Solution**:
```javascript
// Ensure token is in localStorage
localStorage.setItem('authToken', token);

// Check Authorization header in network tab
```

### Issue: Database Connection Error

**Solution**:
```bash
# Check database URL
echo $DATABASE_URL

# Test connection
python -c "from app.models import db; print(db.engine.url)"
```

### Issue: Module Not Found

**Solution**:
```bash
# Ensure all dependencies installed
pip install -r requirements.txt

# Check Python path
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
```

---

## Deployment

### Docker Deployment

```dockerfile
# Dockerfile

FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

ENV FLASK_ENV=production
ENV DATABASE_URL=postgresql://...

EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app.main:app"]
```

### Docker Compose

```yaml
# docker-compose.yml

version: '3.8'

services:
  notification-backend:
    build: ./backend/system_settings
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgresql://postgres:password@db:5432/notifications
      FLASK_ENV: production
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: notifications
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Deployment Checklist

- [ ] Backend API running on production server
- [ ] Frontend environment variables configured
- [ ] HTTPS enabled for API endpoints
- [ ] Database backed up
- [ ] Email/SMS provider credentials configured
- [ ] WhatsApp Business API keys configured
- [ ] Monitoring and alerting set up
- [ ] Rate limiting configured
- [ ] Access logs enabled
- [ ] User provided with admin documentation

---

## Security Considerations

### 1. API Security
- ✅ Authentication required on all endpoints
- ✅ Authorization checks for admin operations
- ✅ Input validation on all fields
- ✅ SQL injection prevention via ORM

### 2. Data Security
- [ ] Enable HTTPS/TLS
- [ ] Encrypt sensitive data at rest
- [ ] Hash template IDs if storing secrets
- [ ] Implement audit trail

### 3. Access Control
- [ ] Role-based authorization
- [ ] Permission checks for admin operations
- [ ] API key management for service-to-service calls

### 4. Code Security
- [ ] Regular dependency updates
- [ ] SAST/DAST scanning
- [ ] Code review process

---

## Support & Help

### Documentation
- Frontend: See [FRONTEND_DOCUMENTATION.md](FRONTEND_DOCUMENTATION.md)
- API: See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- Backend: See [backend/system_settings/README.md](../../backend/system_settings/README.md)

### Issues
1. Check troubleshooting section above
2. Review logs: `notification_settings.log`
3. Check browser console for frontend errors
4. Check backend logs for API errors
5. Create an issue with:
   - Error message
   - Steps to reproduce
   - Environment details (OS, Node version, Python version)

### Getting Help
- Email: support@mindwhile.org
- Slack: #notification-settings
- GitHub Issues: mindwhile-erp/issues
