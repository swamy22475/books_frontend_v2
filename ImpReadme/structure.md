# Project Implementation Plan - Mindwhile ERP

Based on the analysis of the reference website (Preskool), here is the detailed plan for the ReactJS project structure, modules, and required packages.

## User Review Required
> [!NOTE]
> This plan proposes finding and installing specific npm packages to match functionality (charts, calendars, tables).

## Project Structure
We will adopt a scalable folder structure:

```
src/
├── assets/          # Images, fonts, static files
├── components/      # Reusable UI components
│   ├── Common/      # Buttons, Inputs, Cards, Modal
│   ├── Layout/      # Sidebar, Header, Footer
│   └── Tables/      # DataTable wrappers
├── context/         # React Context for global state (Auth, Theme)
├── hooks/           # Custom hooks
├── layouts/         # Layout wrappers (MainLayout, AuthLayout)
├── pages/           # Page components (routed)
│   ├── Dashboard/
│   ├── Students/
│   ├── Teachers/
│   ├── Departments/
│   ├── Accounts/
│   └── ...
├── routes/          # Router configuration
├── services/        # API calls (mock or real)
├── utils/           # Helper functions
└── App.jsx
```

## Required Packages

We will need to install the following dependencies:

| Category | Package | Purpose |
| :--- | :--- | :--- |
| **Routing** | `react-router-dom` | Navigation between pages. |
| **Icons** | `react-feather` or `lucide-react` | Icons matching the template style. |
| **Charts** | `recharts` | Dashboard statistics and graphs. |
| **Calendar** | `react-big-calendar` or `@fullcalendar/react` | Event calendar and timetables. |
| **Date Handling** | `date-fns` | Date formatting and manipulation. |
| **Tables** | `@tanstack/react-table` | Advanced data tables (pagination, sorting). |
| **Forms** | `react-hook-form` | Efficient form handling. |
| **Validation** | `yup` | Schema validation for forms. |
| **UI Components** | *Custom CSS / Bootstrap / Tailwind* | (We are using Vanilla CSS/Custom as per previous context, but `bootstrap` is often used in these templates. *Sticking to Vanilla/Custom as per user preference earlier*). |

## Modules Breakdown

### 1. Dashboard
- **Admin Dashboard**: Key metrics (Students, Awards, Department), Revenue Chart, Student Chart, Star Students, Activity Feed.
- **Teacher/Student Dashboards**: (Future scope/Placeholder).

### 2. Students Module
- **List View**: DataTable with ID, Name, Class, DOB, Parent Name, Mobile, Address. Actions: View, Edit.
- **Student Details**: Profile view.
- **Add Student**: Comprehensive form (Basic Info, Parents Info, Other Info).

### 3. Teachers Module
- **List View**: ID, Name, Gender, Subject, Section, Mobile, Address.
- **Teacher Details**: Profile view.
- **Add Teacher**: Form.

### 4. Departments & Subjects
- List and Management of academic departments and subjects.

### 5. Accounts (Fees)
- **Fees Collection**: Table of student fees.
- **Expenses/Salary**: Tracking costs.

### 6. Events & Holiday
- Calendar view.

## Execution Steps for This Plan

1.  **Install Dependencies**: Run `npm install` for the identified packages.
2.  **Scaffold Layout**: Create `MainLayout`, `Sidebar`, `Header`.
3.  **Setup Routing**: Define routes for Dashboard, Students, etc.
4.  **Implement Dashboard**: Create the widget cards and charts using `recharts`.

## Next Immediate Steps
1.  Install packages.
2.  Create the `MainLayout` with a responsive Sidebar and Header.
