# Notification Settings - Frontend Documentation

## Overview

The Notification Settings module allows administrators to configure how and when system notifications are sent across multiple channels (Email, SMS, Mobile App, WhatsApp) to different recipients (Student, Guardian, Staff).

## Features

### 1. Notification Configuration
- **34 Pre-configured Events**: All major school system events
- **4 Communication Channels**: Email, SMS, Mobile App, WhatsApp
- **3 Recipient Types**: Student, Guardian, Staff
- **Template Management**: SMS and WhatsApp template IDs
- **Message Customization**: Sample messages with placeholders

### 2. User Interface
- **Full-width card layout** matching Mindwhile ERP style
- **Sticky table header** for easy navigation
- **Horizontal scrolling** for responsive design
- **Search functionality** to filter events
- **Recipient filter** to show specific notification types
- **Export options**: Copy, CSV, Excel, PDF, Print
- **Inline editing** with modal for templates
- **Fixed save button** for bulk changes

### 3. Data Management
- **Real-time updates** in table
- **Validation** for required fields
- **Bulk save** for all changes
- **Toast notifications** for feedback
- **Skeleton loaders** during data fetch
- **Error handling** with user-friendly messages

## File Structure

```
src/views/pages/NotificationSettings/
├── NotificationSettings.jsx          # Main component
├── NotificationSettings.css          # Styles
├── constants.js                      # Constants & configurations
├── mockData.js                       # Mock data for development
├── components/
│   ├── NotificationTable.jsx         # Main table component
│   ├── ChannelToggle.jsx             # Channel toggle switches
│   ├── RecipientSelector.jsx         # Recipient checkboxes
│   ├── TemplateModal.jsx             # Modal for editing templates
│   └── NotificationTableToolbar.jsx  # Toolbar with search/export

src/services/
└── notificationService.js            # API service layer
```

## Component Details

### NotificationSettings.jsx
**Main container component** that manages:
- State for all notification settings
- Fetching data from API
- Filtering (search & recipient)
- Save operations
- Export functionality
- Modal state management

**Props**: None (uses hooks)

**State**:
```javascript
{
  settings: [],           // All notification settings
  filteredSettings: [],   // Filtered based on search/recipient
  isLoading: boolean,
  isSaving: boolean,
  hasChanges: boolean,
  searchQuery: string,
  selectedRecipient: string,
  templateModalOpen: boolean,
  selectedSetting: object
}
```

### NotificationTable.jsx
**Displays the main table** with:
- Event names
- Channel toggles for each event
- Recipient selector for each event
- Template IDs (display only)
- Sample message preview
- Action buttons (View/Edit)

**Props**:
```javascript
{
  settings: NotificationSetting[],    // Array of notification settings
  onSettingChange: (eventKey, changes) => void,
  onTemplateEdit: (setting, mode) => void,
  isLoading: boolean
}
```

### ChannelToggle.jsx
**Individual channel toggle** for Email/SMS/Mobile App/WhatsApp

**Props**:
```javascript
{
  channel: 'email' | 'sms' | 'app' | 'whatsapp',
  enabled: boolean,
  onChange: (isEnabled) => void,
  disabled: boolean
}
```

### RecipientSelector.jsx
**Checkbox group** for selecting recipients

**Props**:
```javascript
{
  recipients: string[],      // ['student', 'guardian', 'staff']
  onChange: (recipients) => void,
  disabled: boolean
}
```

### TemplateModal.jsx
**Modal dialog** for editing template IDs and sample messages

**Props**:
```javascript
{
  open: boolean,
  onOpenChange: (isOpen) => void,
  eventName: string,
  smsTemplateId: string,
  whatsappTemplateId: string,
  sampleMessage: string,
  onSave: (formData) => void,
  availablePlaceholders: string[]
}
```

### NotificationTableToolbar.jsx
**Top toolbar** with search, filter, and export options

**Props**:
```javascript
{
  searchQuery: string,
  onSearchChange: (query) => void,
  selectedRecipient: string,
  onRecipientChange: (recipient) => void,
  onExport: (format) => void,
  onPrint: () => void
}
```

## Data Model

### NotificationSetting Object
```javascript
{
  id: number,
  event_key: string,              // 'student_admission'
  event_name: string,             // 'Student Admission'
  enable_email: boolean,
  enable_sms: boolean,
  enable_app: boolean,
  enable_whatsapp: boolean,
  recipients: string[],           // ['student', 'guardian']
  sms_template_id: string,        // 'TMPLT_SMS_001'
  whatsapp_template_id: string,   // 'TMPLT_WA_001'
  sample_message: string,         // 'Hello {{student_name}}'
  created_at: ISO8601,
  updated_at: ISO8601,
  updated_by: string
}
```

## Available Placeholders

The following placeholders can be used in sample messages:
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

## API Integration

### Service Methods

#### fetchNotificationSettings()
Fetches all notification settings from the API.
```javascript
const response = await fetchNotificationSettings();
// Returns: { data: [...], pagination: {...} }
```

#### saveNotificationSettings(settings)
Saves all notification settings.
```javascript
const response = await saveNotificationSettings({ settings });
// Returns: { success: true, data: {...} }
```

#### updateNotificationSetting(eventKey, updatedSetting)
Updates a specific notification setting.
```javascript
const response = await updateNotificationSetting('student_admission', {
  enable_email: true,
  recipients: ['student', 'guardian']
});
```

#### fetchTemplateIds(channel)
Gets available template IDs for a channel.
```javascript
const templates = await fetchTemplateIds('sms');
// Returns: { templates: [{id: 'TMPLT_SMS_001', name: '...'}, ...] }
```

#### exportNotificationSettings(format)
Exports settings in different formats.
```javascript
const blob = await exportNotificationSettings('csv');
```

## Usage Example

### Installation
1. Copy the NotificationSettings folder to `src/views/pages/`
2. Ensure all components use correct import paths
3. Install any missing Radix UI dependencies

### Adding to Routes
```javascript
// In your Router.tsx or routes configuration
import NotificationSettings from './views/pages/NotificationSettings/NotificationSettings';

const routes = [
  {
    path: '/settings/notifications',
    element: <NotificationSettings />,
    requiresAuth: true,
    requiresAdmin: true
  }
];
```

### Using with API
```javascript
// In .env or environment configuration
VITE_API_URL=http://localhost:5000/api
```

## Styling

The component uses:
- **Tailwind CSS** for responsive design
- **Custom CSS** for specific styling in NotificationSettings.css
- **Radix UI** for accessible components
- **Lucide React** for icons

### Desktop-first Design
Optimized for 1366x768 desktop resolution with responsive breakpoints:
- `md:` (768px+): Medium screens
- `lg:` (1024px+): Large screens
- Mobile: Full-width responsive

### Dark Mode
Includes dark mode support using `dark:` Tailwind classes.

## State Management

The component manages local state using React hooks:
- `useState` for UI state
- `useEffect` for side effects
- `useMemo` for filtering
- `useContext` for toast notifications

For larger applications, consider using Redux or Zustand.

## Error Handling

Errors are handled with:
1. **Try-catch blocks** in async operations
2. **Toast notifications** for user feedback
3. **Fallback to mock data** if API unavailable
4. **Validation errors** displayed inline

## Validation

### Frontend Validation
- SMS Template ID: Required if SMS enabled
- WhatsApp Template ID: Required if WhatsApp enabled
- At least one channel must be enabled

### Backend Validation
Same rules applied on the server for data integrity.

## Performance Optimizations

1. **Memoization**: Filtered settings are memoized
2. **Lazy loading**: Skeleton loaders during fetch
3. **Pagination**: Backend pagination for large datasets
4. **Virtual scrolling**: Can be added for 1000+ events

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus management in modals
- Color contrast compliant
- Screen reader friendly

## Testing

### Unit Tests
```javascript
// Test component rendering
test('renders notification settings page', () => {
  render(<NotificationSettings />);
  expect(screen.getByText('Notification Settings')).toBeInTheDocument();
});

// Test channel toggle
test('toggles email channel', () => {
  const onChange = jest.fn();
  render(<ChannelToggle channel="email" enabled={false} onChange={onChange} />);
  fireEvent.click(screen.getByRole('checkbox'));
  expect(onChange).toHaveBeenCalled();
});
```

### Integration Tests
```javascript
// Test API integration
test('fetches and displays notification settings', async () => {
  const mockData = [/* ... */];
  global.fetch = jest.fn(() => 
    Promise.resolve({ json: () => Promise.resolve({ data: mockData }) })
  );
  
  render(<NotificationSettings />);
  await waitFor(() => {
    expect(screen.getByText(mockData[0].event_name)).toBeInTheDocument();
  });
});
```

## Troubleshooting

### Issue: Settings not loading
- Check browser console for API errors
- Verify API is running at `VITE_API_URL`
- Check authentication token in localStorage
- Fallback to mock data should work

### Issue: Changes not saving
- Check network tab for POST errors
- Verify user has admin permissions
- Check validation errors in toast
- Review backend logs

### Issue: Styling issues
- Ensure Tailwind CSS is configured
- Check for CSS class conflicts
- Verify dark mode settings
- Clear browser cache

## Future Enhancements

1. **Template preview**: Real-time message preview with variables
2. **Batch operations**: Select multiple events for bulk changes
3. **Audit trail**: View change history
4. **Email testing**: Send test emails
5. **SMS schedule**: Configure when to send
6. **Webhook integration**: External notification systems
7. **Analytics**: Track notification delivery rates

## Support & Maintenance

- Review and update placeholder list quarterly
- Monitor API logs for errors
- Test export functionality after updates
- Backup database regularly
- Update dependencies monthly
