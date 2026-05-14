# Class-wise Analytics Feature - Implementation Guide

## 📋 Overview
Created a comprehensive **Class-wise Student Analytics** report that displays all students in a selected class/section with their complete data, similar to the sales entry format.

---

## 🎯 Features Implemented

### 1. **Dual Dropdown Filters**
   - **Class Dropdown**: Select from active classes fetched from AcademicsContext
   - **Section Dropdown**: Dynamically populated based on selected class
   - **Search Box**: Real-time search by student name, phone, admission number, or roll number
   - **Reset Behavior**: Section automatically resets when class changes

### 2. **Student Data Display**
The table shows comprehensive student information:
   - **#** - Row number with pagination offset
   - **Student Name** - Full name of student
   - **Phone** - Student contact number
   - **Admission No** - Unique admission number (highlighted in purple)
   - **Roll No** - Class roll number with background badge
   - **Books Purchased** - List of all books purchased with quantities
   - **Total Amount** - Total revenue per student (green color)
   - **Paid** - Amount paid by student (blue color)
   - **Due** - Outstanding balance (red if due, green if paid)
   - **Last Purchase** - Date of most recent purchase
   - **Guardian Contact** - Guardian name and phone number

### 3. **Summary Statistics**
Four KPI cards display above the table:
   - 👨‍🎓 **Total Students** - Count of students in selected class
   - 💰 **Total Revenue** - Sum of all transactions
   - ✓ **Total Paid** - Sum of all payments collected
   - ₹ **Total Due** - Outstanding balance

### 4. **Data Aggregation**
   - Automatically aggregates multiple transactions per student
   - Combines books purchased across multiple sales records
   - Calculates net totals and balances

### 5. **Pagination**
   - 15 students per page
   - Full pagination controls (first, previous, next, last)
   - Subtotal row on each page showing aggregated data

### 6. **Color-coded Information**
   - Blue badges for class identifiers
   - Green for revenue/positive amounts
   - Blue for paid amounts
   - Red for due amounts
   - Purple for admission numbers

---

## 📁 Files Created & Modified

### New File Created:
```
d:\Books_Project\books_frontend_v2-main\books_frontend_v2-main\src\school\pages\Reports\ClassWiseAnalytics.jsx
```

### Files Modified:
1. **App.jsx** (src/school/App.jsx)
   - Added import: `import ClassWiseAnalytics from './pages/Reports/ClassWiseAnalytics'`
   - Added route: `<Route path="school/reports/class-wise" element={<ClassWiseAnalytics />} />`

2. **ReportsDashboard.jsx** (src/school/pages/Reports/ReportsDashboard.jsx)
   - Added navigation link in quickReportLinks
   - Label: "Class-wise Analytics"
   - Path: "/school/reports/class-wise"
   - Icon: "📊"

3. **Reports.css** (src/school/pages/Reports/Reports.css)
   - Added `.rpt-search-input` styles
   - Added `.rpt-card-header` enhancements

---

## 🚀 How to Use

### 1. Navigate to the Feature
   - Go to Dashboard → Reports & Analytics
   - Click on **"📊 Class-wise Analytics"** card
   - Or navigate directly to: `/school/reports/class-wise`

### 2. Select Class
   - Click on the **Class** dropdown
   - Select a class from active classes list

### 3. Select Section (Optional)
   - If sections exist for that class, they appear automatically
   - Can select **"All Sections"** to see entire class
   - Can also leave empty to show all sections

### 4. Search (Optional)
   - Use the search box to filter by:
     - Student name (partial match)
     - Phone number
     - Admission number
     - Roll number

### 5. View Results
   - Table shows all matching students
   - Summary KPIs update automatically
   - Pagination at bottom for navigation

---

## 💾 Data Source
The component fetches data from:
- **Sales Service API** - Gets all student purchase transactions
- **Inventory Service API** - Gets book details
- **AcademicsContext** - Gets classes and sections structure

The data is then:
1. Filtered by selected class and section
2. Aggregated by student (combining multiple transactions)
3. Enriched with calculated fields (totals, balances)
4. Paginated for optimal display

---

## 🎨 UI/UX Features

### Responsive Design
- Grid layout adapts to screen size
- Filters stack on mobile
- Table scrolls horizontally on small screens
- KPI cards collapse on small screens

### Interactive Elements
- Hover effects on table rows
- Color-coded status indicators
- Smooth transitions and animations
- Disabled state for section dropdown until class selected
- Disabled pagination buttons at boundaries

### Performance
- Pagination (15 items/page) for better performance
- Memoized calculations using useMemo
- Efficient filtering and sorting

---

## 📊 Example Data Display

```
Class: Class 5 | Section: A
┌─────────────────────────────────────────────────────────┐
│  Total Students: 35  │  Total Revenue: ₹85,420  │  etc  │
└─────────────────────────────────────────────────────────┘

│ # │ Student Name  │ Phone      │ Adm No   │ Books    │
│─────────────────────────────────────────────────────────│
│ 1 │ Aarav Sharma  │ 9000001001 │ LEO-1001 │ Math(2)  │
│   │               │            │          │ Science(1)
│   │ Amount: ₹850  │ Paid: ₹600 │ Due: ₹250│          │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Customization Options

### To modify table columns:
Edit the table header in `ClassWiseAnalytics.jsx` (line ~220)

### To change items per page:
Modify `perPage` variable (line ~27):
```javascript
const perPage = 15; // Change to your preferred number
```

### To add more filters:
Add new state variables and filter conditions in the `useMemo` hook

### To customize colors:
Modify the color values in the component or Reports.css

---

## ✅ Testing Checklist

- [ ] Component loads without errors
- [ ] Class dropdown populates with classes
- [ ] Section dropdown shows only sections for selected class
- [ ] Students display in table when selections made
- [ ] Summary KPIs update correctly
- [ ] Search filter works for name, phone, adm no, roll no
- [ ] Pagination works (first, prev, next, last buttons)
- [ ] Table shows correct totals in footer
- [ ] Page title and breadcrumb display correctly
- [ ] Responsive design works on mobile

---

## 🐛 Troubleshooting

### No students appear in table
- Check if class actually has sales records in database
- Verify that sales records have proper class and section fields
- Check browser console for API errors

### Sections dropdown empty
- Verify sections are created for that class in academics module
- Check that section status is "Active"

### Data not updating
- Clear browser cache
- Refresh the page
- Check network tab in DevTools for API calls

### Styling issues
- Ensure Reports.css is properly linked
- Clear browser cache
- Check for conflicting global CSS

---

## 📞 Support

For issues or feature requests, check:
1. AcademicsContext - ensure proper class/section data
2. Sales API - ensure proper data structure
3. Console errors for specific error messages

---

## 🎓 Learning Resources

This component demonstrates:
- React hooks (useState, useContext, useMemo, useEffect)
- Data aggregation and filtering patterns
- Pagination implementation
- Form controls with conditional dependencies
- Color-coded information display
- Responsive grid layouts
- CSS styling for enterprise UIs
