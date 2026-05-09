# FilterDropdown - 5-Minute Quick Start

Add column visibility filtering to any table in 5 minutes.

## 1. Import Component (30 seconds)

```jsx
import FilterDropdown from '../../../components/common/FilterDropdown';
import { useState } from 'react';
```

## 2. Set Up State (1 minute)

```jsx
const [visibleColumns, setVisibleColumns] = useState(new Set([
  'checkbox', 'name', 'class', 'email', 'actions'
]));

const columns = [
  { key: 'checkbox', label: 'Checkbox' },
  { key: 'name', label: 'Name' },
  { key: 'class', label: 'Class' },
  { key: 'email', label: 'Email' },
  { key: 'actions', label: 'Actions' }
];
```

## 3. Add Handlers (1 minute)

```jsx
const handleApply = (newVisibleSet) => {
  setVisibleColumns(newVisibleSet);
};

const handleReset = () => {
  setVisibleColumns(new Set(['checkbox', 'name', 'class', 'email', 'actions']));
};
```

## 4. Render Component (1 minute)

```jsx
<div className="filter-bar">
  <FilterDropdown
    columns={columns}
    visibleColumns={visibleColumns}
    onApply={handleApply}
    onReset={handleReset}
    title="Show/Hide Columns"
  />
</div>
```

## 5. Show Conditional Columns (1 minute)

```jsx
<table>
  <thead>
    <tr>
      {visibleColumns.has('checkbox') && <th><input type="checkbox" /></th>}
      {visibleColumns.has('name') && <th>Name</th>}
      {visibleColumns.has('class') && <th>Class</th>}
      {visibleColumns.has('email') && <th>Email</th>}
      {visibleColumns.has('actions') && <th>Actions</th>}
    </tr>
  </thead>
  <tbody>
    {/* Rows with conditional rendering */}
  </tbody>
</table>
```

## That's it! ✅

Your table now has a premium filter dropdown with:
- ✅ Column visibility toggle
- ✅ Apply/Reset buttons
- ✅ Dark mode support
- ✅ Smooth animations
- ✅ Keyboard accessible (Escape, Tab)
- ✅ No clipping issues (z-index: 9999)

## Optional: localStorage Persistence

```jsx
useEffect(() => {
  const saved = localStorage.getItem('myTable_columns');
  if (saved) setVisibleColumns(new Set(JSON.parse(saved)));
}, []);

const handleApply = (newVisibleSet) => {
  setVisibleColumns(newVisibleSet);
  localStorage.setItem('myTable_columns', JSON.stringify([...newVisibleSet]));
};
```

## Customization

### Change Position
```jsx
/* Add to your page CSS */
.filter-bar {
  position: relative;
  margin-bottom: 20px;
}
```

### Change Theme Colors
```css
/* Add to your CSS */
:root {
  --sl-card-bg: #ffffff;
  --sl-border-color: #e2e8f0;
  --sl-primary-color: #3b82f6;
}
```

### Multiple Dropdowns
Just create another `FilterDropdown` with different columns:
```jsx
<FilterDropdown columns={columns1} visibleColumns={visible1} ... />
<FilterDropdown columns={columns2} visibleColumns={visible2} ... />
```

---

**Need more details?** See `FILTER_DROPDOWN_INTEGRATION_GUIDE.md`

**Issues?** Check troubleshooting section in guide.
