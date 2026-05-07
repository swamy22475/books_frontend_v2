/**
 * ADVANCED TABLE FILTER SYSTEM INTEGRATION GUIDE
 * 
 * This document provides examples for integrating the TableFilter component
 * into all remaining table pages across the application.
 * 
 * Main Component: src/components/common/TableFilter.jsx
 * Styling: src/components/common/TableFilter.css
 * 
 * ============================================================================
 * EXAMPLE 1: BEHAVIOR RECORDS
 * ============================================================================
 * 
 * File: src/school/pages/StudentInformation/BehaviorRecords.jsx
 * 
 * Add these imports:
 * import TableFilter from '../../../components/common/TableFilter';
 * import { useMemo } from 'react';
 * 
 * Add state after existing useState declarations:
 * const [visibleColumns, setVisibleColumns] = useState(new Set([
 *   'student', 'class', 'title', 'type', 'date', 'reportedBy', 'actions'
 * ]));
 * const [selectedFilters, setSelectedFilters] = useState({});
 * 
 * Add column definitions:
 * const columns = [
 *   { key: 'student', label: 'Student' },
 *   { key: 'class', label: 'Class' },
 *   { key: 'title', label: 'Title' },
 *   { key: 'type', label: 'Type' },
 *   { key: 'date', label: 'Date' },
 *   { key: 'reportedBy', label: 'Reported By' },
 *   { key: 'actions', label: 'Actions' }
 * ];
 * 
 * Add filter definitions:
 * const uniqueClasses = useMemo(() => {
 *   return [...new Set(behaviorRecords.map(r => r.className).filter(Boolean))].sort();
 * }, [behaviorRecords]);
 * 
 * const uniqueTypes = useMemo(() => {
 *   return [...new Set(behaviorRecords.map(r => r.type).filter(Boolean))].sort();
 * }, [behaviorRecords]);
 * 
 * const filters = [
 *   { key: 'class', label: 'Class', options: uniqueClasses },
 *   { key: 'type', label: 'Type', options: uniqueTypes }
 * ];
 * 
 * Update the filtered data logic:
 * const filtered = useMemo(() => {
 *   let data = behaviorRecords.filter(r => {
 *     if (!q) return true;
 *     const s = q.toLowerCase();
 *     return [r.studentName, r.title, r.reportedBy, r.type, r.className]
 *       .some(v => (v || '').toLowerCase().includes(s));
 *   });
 *   
 *   // Apply row filters
 *   if (selectedFilters.class) {
 *     data = data.filter(r => r.className === selectedFilters.class);
 *   }
 *   if (selectedFilters.type) {
 *     data = data.filter(r => r.type === selectedFilters.type);
 *   }
 *   
 *   return data;
 * }, [behaviorRecords, q, selectedFilters]);
 * 
 * Replace the filter bar with TableFilter:
 * <div className="filter-bar">
 *   <TableFilter
 *     columns={columns}
 *     filters={filters}
 *     visibleColumns={visibleColumns}
 *     setVisibleColumns={setVisibleColumns}
 *     selectedFilters={selectedFilters}
 *     setSelectedFilters={setSelectedFilters}
 *     searchQuery={q}
 *     setSearchQuery={setQ}
 *     pageKey="behaviorRecords"
 *   />
 * </div>
 * 
 * Update table header to conditionally render columns:
 * <thead>
 *   <tr>
 *     {visibleColumns.has('student') && <th>Student</th>}
 *     {visibleColumns.has('class') && <th>Class</th>}
 *     {visibleColumns.has('title') && <th>Title</th>}
 *     {visibleColumns.has('type') && <th>Type</th>}
 *     {visibleColumns.has('date') && <th>Date</th>}
 *     {visibleColumns.has('reportedBy') && <th>Reported By</th>}
 *     {visibleColumns.has('actions') && <th>Actions</th>}
 *   </tr>
 * </thead>
 * 
 * ============================================================================
 * EXAMPLE 2: STUDENT CATEGORIES
 * ============================================================================
 * 
 * File: src/school/pages/StudentInformation/StudentCategories.jsx
 * 
 * This page has a simple table with just Category and Actions columns.
 * 
 * Add imports:
 * import TableFilter from '../../../components/common/TableFilter';
 * 
 * Add state:
 * const [visibleColumns, setVisibleColumns] = useState(new Set([
 *   'category', 'actions'
 * ]));
 * 
 * Add columns:
 * const columns = [
 *   { key: 'category', label: 'Category' },
 *   { key: 'actions', label: 'Actions' }
 * ];
 * 
 * No filters needed for this page (no filter options).
 * 
 * Add TableFilter component:
 * <div className="filter-bar">
 *   <TableFilter
 *     columns={columns}
 *     filters={[]}
 *     visibleColumns={visibleColumns}
 *     setVisibleColumns={setVisibleColumns}
 *     selectedFilters={{}}
 *     setSelectedFilters={() => {}}
 *     searchQuery={q}
 *     setSearchQuery={setQ}
 *     pageKey="studentCategories"
 *   />
 * </div>
 * 
 * ============================================================================
 * EXAMPLE 3: DISABLED STUDENTS
 * ============================================================================
 * 
 * File: src/school/pages/StudentInformation/DisabledStudents.jsx
 * 
 * Add imports:
 * import TableFilter from '../../../components/common/TableFilter';
 * import { useMemo } from 'react';
 * 
 * Add state:
 * const [searchQuery, setSearchQuery] = useState('');
 * const [visibleColumns, setVisibleColumns] = useState(new Set([
 *   'admission', 'photo', 'name', 'class', 'disabledOn', 'reason', 'actions'
 * ]));
 * const [selectedFilters, setSelectedFilters] = useState({});
 * 
 * Add column definitions:
 * const columns = [
 *   { key: 'admission', label: 'Adm No.' },
 *   { key: 'photo', label: 'Photo' },
 *   { key: 'name', label: 'Name' },
 *   { key: 'class', label: 'Class' },
 *   { key: 'disabledOn', label: 'Disabled On' },
 *   { key: 'reason', label: 'Reason' },
 *   { key: 'actions', label: 'Actions' }
 * ];
 * 
 * Add filter definitions:
 * const uniqueClasses = useMemo(() => {
 *   return [...new Set(disabledStudents.map(s => s.class || s.className).filter(Boolean))].sort();
 * }, [disabledStudents]);
 * 
 * const filters = [
 *   { key: 'class', label: 'Class', options: uniqueClasses }
 * ];
 * 
 * Update filtering logic:
 * const filteredStudents = useMemo(() => {
 *   let data = disabledStudents.filter(d =>
 *     (d.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
 *     (d.admissionNo || d.id || '').toLowerCase().includes(searchQuery.toLowerCase())
 *   );
 *   
 *   if (selectedFilters.class) {
 *     data = data.filter(d => (d.class || d.className) === selectedFilters.class);
 *   }
 *   
 *   return data;
 * }, [disabledStudents, searchQuery, selectedFilters]);
 * 
 * ============================================================================
 * EXAMPLE 4: BULK EDIT
 * ============================================================================
 * 
 * File: src/school/pages/StudentInformation/BulkEdit.jsx
 * 
 * This is a complex table with many columns and bulk editing functionality.
 * 
 * Add imports:
 * import TableFilter from '../../../components/common/TableFilter';
 * 
 * Add state (after existing useState declarations):
 * const [visibleColumns, setVisibleColumns] = useState(new Set([
 *   'checkbox', 'admission', 'name', 'class', 'rollNo', 'dob', 'gender',
 *   'father', 'phone', 'address', 'actions'
 * ]));
 * const [selectedRowFilters, setSelectedRowFilters] = useState({});
 * 
 * Add column definitions capturing all visible columns in the table.
 * 
 * Add filter definitions:
 * const uniqueClasses = useMemo(() => {
 *   return [...new Set(students.map(s => s.class || s.className).filter(Boolean))].sort();
 * }, [students]);
 * 
 * const filters = [
 *   { key: 'class', label: 'Class', options: uniqueClasses }
 * ];
 * 
 * Update filtering logic to respect both search and row filters.
 * 
 * ============================================================================
 * CONFIGURATION GUIDELINES
 * ============================================================================
 * 
 * 1. PAGE KEY (localStorage persistence):
 *    - Must be unique per page
 *    - Use lowercase, hyphen-separated names (e.g., 'behavior-records', 'disabled-students')
 *    - Stored key: `${pageKey}-column-visibility`
 * 
 * 2. COLUMN DEFINITIONS:
 *    - key: Must match the data field key (used in visibleColumns Set)
 *    - label: Display name shown in the "Show/Hide Columns" menu
 *    - Order in array doesn't matter (UI determines table order)
 * 
 * 3. FILTER DEFINITIONS:
 *    - key: Used in selectedFilters object
 *    - label: Display name in the filter dropdown
 *    - options: Array of unique values to filter by
 *    - Always sorted for better UX
 * 
 * 4. PERFORMANCE CONSIDERATIONS:
 *    - Use useMemo for filtered data to avoid unnecessary recalculations
 *    - Use useMemo for unique values extraction (classes, sections, etc.)
 *    - Column visibility is persisted in localStorage
 *    - All filtering is client-side
 * 
 * 5. DARK MODE:
 *    - TableFilter automatically respects system dark mode preference
 *    - Uses CSS variables for theme compatibility:
 *      - --sl-bg, --sl-bg-hover, --sl-text, --sl-text-muted, --sl-border, --sl-border-hover
 *    - Fallback to default values if variables not defined
 * 
 * ============================================================================
 * UX RULES (FOLLOW THESE TO MAINTAIN CONSISTENCY)
 * ============================================================================
 * 
 * 1. FILTER BUTTON PLACEMENT:
 *    - Place TableFilter component inside .filter-bar or equivalent
 *    - Position before other controls (search, sort, export)
 *    - Align filter button to the left
 * 
 * 2. ACTIVE FILTER BADGES:
 *    - Show near filter button when filters are active
 *    - Display filter name and value (e.g., "Class: 5")
 *    - Allow clicking X to remove individual filters
 * 
 * 3. COLUMN VISIBILITY:
 *    - Default: Show all important columns
 *    - Hidden columns don't break table layout
 *    - Checkbox column should be toggleable
 *    - Warn if all columns would be hidden
 * 
 * 4. RESPONSIVE BEHAVIOR:
 *    - Filter menu centers on mobile (position: fixed)
 *    - Filters stack vertically on small screens
 *    - Search input takes full width on mobile
 * 
 * ============================================================================
 * INTEGRATION CHECKLIST
 * ============================================================================
 * 
 * For each page you integrate TableFilter into:
 * 
 * - [ ] Import TableFilter component
 * - [ ] Add useState for visibleColumns and setVisibleColumns
 * - [ ] Add useState for selectedFilters and setSelectedFilters (if filters exist)
 * - [ ] Add useState for searchQuery if not already present
 * - [ ] Define columns array with all table columns
 * - [ ] Define filters array (if applicable) with unique options
 * - [ ] Create useMemo for unique values (classes, sections, statuses, etc.)
 * - [ ] Update filtering logic to include selectedFilters
 * - [ ] Replace old filter bar with TableFilter component
 * - [ ] Update table headers to conditionally render via visibleColumns.has()
 * - [ ] Update table rows to conditionally render via visibleColumns.has()
 * - [ ] Update pagination/selection logic for filtered data
 * - [ ] Test column visibility persistence (localStorage)
 * - [ ] Test with dark mode
 * - [ ] Test on mobile devices
 * - [ ] Test that all filters work correctly
 * - [ ] Test that search + filters work together (AND condition)
 * 
 * ============================================================================
 * TROUBLESHOOTING
 * ============================================================================
 * 
 * Issue: Filter not persisting across page reloads
 * Solution: Check that pageKey is unique and consistent
 *           Verify localStorage isn't disabled in browser
 * 
 * Issue: Columns not showing/hiding
 * Solution: Ensure visibleColumns.has(columnKey) checks are in place
 *           Verify column keys match between columns[] definition and JSX
 * 
 * Issue: Filter dropdown not closing
 * Solution: Check that click-outside event listener is working
 *           Verify no other elements have higher z-index blocking clicks
 * 
 * Issue: Table layout breaking when columns hidden
 * Solution: CSS is set to handle dynamic columns
 *           If issue persists, check for fixed-width styles on table cells
 * 
 * Issue: Filters not working with search
 * Solution: Ensure useMemo combines both searchQuery and selectedFilters
 *           Check filter key matches the data field name exactly
 * 
 * ============================================================================
 */

// This file serves as documentation and reference for integration.
// It is not executed as code.
