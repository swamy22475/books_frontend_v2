# FilterDropdown Component Integration Guide

## Overview

`FilterDropdown` is a premium, reusable filter dropdown component for managing table column visibility. It provides a polished, accessible UI that matches the Teachers List design with smooth animations, proper overflow handling, and dark mode support.

**Key Files:**
- Component: `src/components/common/FilterDropdown.jsx` (131 lines)
- Styling: `src/components/common/FilterDropdown.css` (380+ lines)

## Features

✅ **Premium Design** - Matches Teachers List filter panel style
✅ **Floating Panel** - Positioned absolutely with high z-index (9999)
✅ **No Clipping** - Proper parent overflow management
✅ **Accessibility** - ARIA labels, keyboard navigation (Escape, Tab), focus management
✅ **Smooth Animations** - Chevron rotation, panel slide-in transitions
✅ **Dark Mode Support** - Automatic theme detection and styling
✅ **Responsive Design** - Mobile-optimized with center positioning on small screens
✅ **Apply/Reset Logic** - Temporary state management with explicit save/cancel
✅ **Column Warning** - Warns when all columns would be hidden

## Component Props

```javascript
<FilterDropdown
  columns={Array}           // Column definitions: [{key: 'name', label: 'Name'}, ...]
  visibleColumns={Set}      // Set of currently visible column keys
  onApply={Function}        // Callback when Apply button clicked: (newVisibleSet) => {}
  onReset={Function}        // Callback when Reset button clicked: () => {}
  title={String}            // Panel header title (default: "Show/Hide Columns")
/>
```

### Example Column Definition

```javascript
const columns = [
  { key: 'checkbox', label: 'Checkbox' },
  { key: 'name', label: 'Student Name' },
  { key: 'class', label: 'Class' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'actions', label: 'Actions' }
];
```

## Integration Steps

### Step 1: Import Component

```javascript
import FilterDropdown from '../../../components/common/FilterDropdown';
```

### Step 2: Set Up State

```javascript
// State for visible columns
const [visibleColumns, setVisibleColumns] = useState(new Set([
  'checkbox', 'name', 'class', 'phone', 'actions'
]));

// Handler for applying changes
const handleColumnsApply = (newVisibleSet) => {
  setVisibleColumns(newVisibleSet);
  // Optionally save to localStorage
  localStorage.setItem('studentList_visibleColumns', JSON.stringify([...newVisibleSet]));
};

// Handler for resetting to defaults
const handleColumnsReset = () => {
  const defaultColumns = new Set(['checkbox', 'name', 'class', 'phone', 'actions']);
  setVisibleColumns(defaultColumns);
  localStorage.setItem('studentList_visibleColumns', JSON.stringify([...defaultColumns]));
};

// Load from localStorage on mount
useEffect(() => {
  const saved = localStorage.getItem('studentList_visibleColumns');
  if (saved) {
    try {
      setVisibleColumns(new Set(JSON.parse(saved)));
    } catch (e) {
      console.warn('Failed to load column preferences:', e);
    }
  }
}, []);
```

### Step 3: Render Component

Place `FilterDropdown` in your filter bar:

```jsx
<div className="filter-bar">
  <FilterDropdown
    columns={columns}
    visibleColumns={visibleColumns}
    onApply={handleColumnsApply}
    onReset={handleColumnsReset}
    title="Show/Hide Columns"
  />
  
  {/* Other filter controls can go here */}
</div>
```

### Step 4: Ensure Parent Overflow Visibility

**CRITICAL:** Add these CSS rules to parent containers to prevent clipping:

```css
/* In your page CSS or global CSS */

.filter-bar {
  overflow: visible;
  position: relative;
}

.card.table-card,
.soft-card {
  overflow: visible;
}

.table-toolbar {
  overflow: visible;
  position: relative;
}
```

OR add directly to your page's style:

```jsx
const pageContainerStyle = {
  overflow: 'visible'
};
```

## Complete Example: StudentList Integration

```jsx
import React, { useState, useEffect, useMemo } from 'react';
import FilterDropdown from '../../../components/common/FilterDropdown';
import './StudentList.css';

const StudentList = () => {
  const [visibleColumns, setVisibleColumns] = useState(new Set([
    'checkbox', 'name', 'class', 'phone', 'actions'
  ]));

  // Column definitions
  const columns = [
    { key: 'checkbox', label: 'Checkbox' },
    { key: 'adm', label: 'Adm No.' },
    { key: 'photo', label: 'Photo' },
    { key: 'name', label: 'Name' },
    { key: 'class', label: 'Class' },
    { key: 'father', label: 'Father Name' },
    { key: 'phone', label: 'Father Phone' },
    { key: 'assigned', label: 'Total Assigned' },
    { key: 'due', label: 'Total Due' },
    { key: 'actions', label: 'Actions' }
  ];

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('studentList_visibleColumns');
    if (saved) {
      try {
        setVisibleColumns(new Set(JSON.parse(saved)));
      } catch (e) {
        console.warn('Failed to load column preferences:', e);
      }
    }
  }, []);

  // Apply changes
  const handleColumnsApply = (newVisibleSet) => {
    setVisibleColumns(newVisibleSet);
    localStorage.setItem('studentList_visibleColumns', JSON.stringify([...newVisibleSet]));
  };

  // Reset to defaults
  const handleColumnsReset = () => {
    const defaultColumns = new Set(['checkbox', 'adm', 'photo', 'name', 'class', 'father', 'phone', 'assigned', 'due', 'actions']);
    setVisibleColumns(defaultColumns);
    localStorage.setItem('studentList_visibleColumns', JSON.stringify([...defaultColumns]));
  };

  return (
    <div className="page-container">
      {/* Content with appropriate overflow handling */}
      <div className="card table-card soft-card">
        <div className="filter-bar">
          <FilterDropdown
            columns={columns}
            visibleColumns={visibleColumns}
            onApply={handleColumnsApply}
            onReset={handleColumnsReset}
            title="Show/Hide Columns"
          />
        </div>

        {/* Table with conditional column rendering */}
        <table className="table">
          <thead>
            <tr>
              {visibleColumns.has('checkbox') && <th><input type="checkbox" /></th>}
              {visibleColumns.has('adm') && <th>Adm No.</th>}
              {visibleColumns.has('photo') && <th>Photo</th>}
              {visibleColumns.has('name') && <th>Name</th>}
              {visibleColumns.has('class') && <th>Class</th>}
              {visibleColumns.has('father') && <th>Father Name</th>}
              {visibleColumns.has('phone') && <th>Father Phone</th>}
              {visibleColumns.has('assigned') && <th>Total Assigned</th>}
              {visibleColumns.has('due') && <th>Total Due</th>}
              {visibleColumns.has('actions') && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {/* Render rows with visible columns only */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;
```

## Migration from TableFilter

If migrating from `TableFilter` to `FilterDropdown`:

### Old Way (TableFilter - All-in-one)
```jsx
<TableFilter
  columns={columns}
  filters={filters}
  visibleColumns={visibleColumns}
  setVisibleColumns={setVisibleColumns}
  selectedFilters={selectedFilters}
  setSelectedFilters={setSelectedFilters}
  searchQuery={searchQuery}
  setSearchQuery={setSearchQuery}
  pageKey="studentList"
/>
```

### New Way (FilterDropdown + Separate Controls)
```jsx
<div className="filter-bar">
  <FilterDropdown
    columns={columns}
    visibleColumns={visibleColumns}
    onApply={handleColumnsApply}
    onReset={handleColumnsReset}
  />
  
  {/* Separate search control */}
  <input 
    type="text" 
    placeholder="Search students..." 
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
  
  {/* Separate row filters if needed */}
  <select value={selectedFilters.class || ''} onChange={(e) => setSelectedFilters({...selectedFilters, class: e.target.value})}>
    <option value="">All Classes</option>
    {uniqueClasses.map(c => <option key={c}>{c}</option>)}
  </select>
</div>
```

## Styling & Customization

### Use CSS Variables

The component respects these CSS variables for theming:

```css
--sl-card-bg           /* Panel background */
--sl-border-color      /* Border color */
--sl-bg-hover          /* Hover state background */
--sl-text-base         /* Primary text color */
--sl-text-muted        /* Secondary text color */
--sl-primary-color     /* Accent color (default: #3b82f6) */
```

Update in your theme:

```css
:root {
  --sl-card-bg: #ffffff;
  --sl-border-color: #e2e8f0;
  --sl-text-base: #2d3748;
  --sl-primary-color: #3b82f6;
}

@media (prefers-color-scheme: dark) {
  :root {
    --sl-card-bg: #1f2937;
    --sl-border-color: #374151;
    --sl-text-base: #e5e7eb;
  }
}
```

### Z-Index Management

The component uses `z-index: 9999` to ensure it appears above most UI elements. If you need to adjust:

```css
.filter-dropdown-panel {
  z-index: 9999; /* Adjust as needed */
}
```

Higher z-index values (10000+) may be needed if other high-z-index elements exist.

### Parent Overflow Fix

**MOST IMPORTANT:** Ensure parent containers don't clip the dropdown:

```css
/* REQUIRED for proper dropdown display */
.filter-bar {
  overflow: visible; /* NOT: overflow: hidden or overflow: auto */
}

.card.table-card {
  overflow: visible; /* Remove clip forcing */
}

.table-toolbar {
  overflow: visible;
}
```

## Keyboard Navigation

- **Tab**: Cycle through checkboxes
- **Space/Enter**: Toggle checkbox
- **Escape**: Close dropdown and discard changes
- **Click outside**: Close dropdown and discard changes
- **Click Apply**: Save column visibility changes
- **Click Reset**: Revert to default columns

## Accessibility Features

- ✅ ARIA labels on all interactive elements
- ✅ Semantic HTML (button, input type="checkbox")
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Screen reader friendly
- ✅ High contrast color support
- ✅ Reduced motion support (animations still smooth)

## Troubleshooting

### Dropdown gets clipped/cut off

**Solution:** Add `overflow: visible` to all parent containers:

```css
.card { overflow: visible !important; }
.filter-bar { overflow: visible !important; }
```

### Dropdown appears behind other elements

**Solution:** Increase z-index:

```css
.filter-dropdown-panel {
  z-index: 10000; /* Higher than current 9999 */
}
```

### Animations not smooth

**Solution:** Check browser developer tools for CSS errors. Ensure `FilterDropdown.css` is properly imported in JSX.

### Dark mode not working

**Solution:** Ensure your HTML has `data-theme="dark"` or `prefers-color-scheme: dark` is set. Check CSS cascade order.

## Performance Considerations

- Component uses `useCallback` to memoize handlers
- State updates are minimal and batched
- No re-renders on click-outside events
- Smooth 60fps animations via CSS transforms

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

All modern browsers with CSS Grid and Flexbox support.

## Files & References

- **Component:** `src/components/common/FilterDropdown.jsx`
- **Styles:** `src/components/common/FilterDropdown.css`
- **Example:** See StudentList integration above
- **Teachers List:** Uses enhanced version with additional styling

---

**Note:** FilterDropdown is designed as a simpler, premium alternative to TableFilter, focusing on column visibility. For complex filtering needs with row filters, continue using TableFilter or combine FilterDropdown with separate filter controls.
