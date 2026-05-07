import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { StudentProvider } from './context/StudentContext';
import Login from './components/Login/Login';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Income from './pages/Accounts/Income';
import Expense from './pages/Accounts/Expense';
import ExpenseHeads from './pages/Accounts/ExpenseHeads';
import CollectFees from './pages/Finance/CollectFees';
import SearchDueFees from './pages/Finance/SearchDueFees';
import AllTransactions from './pages/Finance/AllTransactions';
import OnlineTransactions from './pages/Finance/OnlineTransactions';
import FeesCarryForward from './pages/Finance/FeesCarryForward';
import AssignFees from './pages/Finance/AssignFees';
import AssignFeesNew from './pages/Finance/AssignFeesNew';
import AssignFeesEdit from './pages/Finance/AssignFeesEdit';
import FeeGroups from './pages/Finance/FeeGroups';
import FeesDiscount from './pages/Finance/FeesDiscount';
import FeeTypes from './pages/Finance/FeeTypes';
import FeePermissions from './pages/Finance/FeePermissions';
import FeeReport from './pages/Finance/FeeReport';
import CollectFeeIndividual from './pages/Finance/CollectFeeIndividual';

import StudentList from './pages/StudentInformation/StudentList';
import StudentAttendance from './pages/StudentInformation/AttendanceTeacher';
import AttendancePortal from './pages/StudentInformation/AttendancePortal';
import BehaviorRecords from './pages/StudentInformation/BehaviorRecords';
import BehaviorRecordsListPage from './pages/StudentInformation/BehaviorRecordsListPage';
import AddBehaviorRecordPage from './pages/StudentInformation/AddBehaviorRecordPage';
import StudentCategories from './pages/StudentInformation/StudentCategories';
import AddStudentCategoryPage from './pages/StudentInformation/AddStudentCategoryPage';

import DisabledStudents from './pages/StudentInformation/DisabledStudents';
import AddStudent from './pages/StudentInformation/AddStudent';
import StudentProfile from './pages/StudentInformation/StudentProfile';
import DisableStudentPage from './pages/StudentInformation/DisableStudentPage';

import Classes from './pages/Academics/Classes';
import Sections from './pages/Academics/Sections';
import Subjects from './pages/Academics/Subjects';
import AssignSubjects from './pages/Academics/AssignSubjects';
import AssignClassTeacher from './pages/Academics/AssignClassTeacher';
import ManagePeriods from './pages/Academics/ManagePeriods';
import ClassTimetable from './pages/Academics/ClassTimetable';
import PromoteStudents from './pages/Academics/PromoteStudents';
import Homework from './pages/Academics/Homework';
import ExamDashboard from './pages/Examination/ExamDashboard';

import SendEmail from './pages/Communicate/SendEmail';
import SendSMS from './pages/Communicate/SendSMS';
import EmailTemplate from './pages/Communicate/EmailTemplate';
import SMSTemplate from './pages/Communicate/SMSTemplate';
import SendWhatsapp from './pages/Communicate/SendWhatsapp';
import WhatsappTemplate from './pages/Communicate/WhatsappTemplate';

import { AcademicsProvider } from './context/AcademicsContext';

import ReportsDashboard from './pages/Reports/ReportsDashboard';
import StudentReport from './pages/Reports/StudentReport';
import ProgressReport from './pages/Reports/ProgressReport';
import FeesReport from './pages/Reports/FeesReport';
import AttendanceReport from './pages/Reports/AttendanceReport';
import SalaryReport from './pages/Reports/SalaryReport';
import ReportPlaceholder from './pages/Reports/ReportPlaceholder';

import HumanResourceDashboard from './pages/HumanResource/HumanResourceDashboard';
import StaffDirectory from './pages/HumanResource/StaffDirectory';
import AddStaff from './pages/HumanResource/AddStaff';
import StaffAttendance from './pages/HumanResource/StaffAttendance';
import Payroll from './pages/HumanResource/Payroll';
import ApproveLeaveRequests from './pages/HumanResource/ApproveLeaveRequests';
import Departments from './pages/HumanResource/Departments';
import Designations from './pages/HumanResource/Designations';
import SetSalary from './pages/HumanResource/SetSalary';
import LeaveTypes from './pages/HumanResource/LeaveTypes';

import BookSalesDashboard from './pages/BookSales/BookSalesDashboard';
import Vendors from './pages/BookSales/Vendors';
import Inventory from './pages/BookSales/Inventory';
import SalesEntry from './pages/BookSales/SalesEntry';
import Returns from './pages/BookSales/Returns';
import BookSalesReports from './pages/BookSales/BookSalesReports';

function App() {
  return (
    <ThemeProvider>
      <StudentProvider>
        <AcademicsProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />

              {/* Protected Routes Wrapper */}
              <Route path="/" element={<MainLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="teacher-dashboard" element={<TeacherDashboard />} />
                <Route path="student-dashboard" element={<StudentDashboard />} />
                <Route path="students" element={<div>Students Page</div>} />
                <Route path="teachers" element={<div>Teachers Page</div>} />
                <Route path="departments" element={<div>Departments Page</div>} />
                <Route path="accounts" element={<div>Accounts Page</div>} />
                <Route path="accounts/income" element={<Income />} />
                <Route path="accounts/expense" element={<Expense />} />
                <Route path="accounts/expense-heads" element={<ExpenseHeads />} />

                {/* Exam Routes */}
                <Route path="school/exam/dashboard" element={<ExamDashboard />} />
                <Route path="school/exam/schedule" element={<div>Exam Schedule Page</div>} />

                {/* Finance & Fees Routes */}
                <Route path="school/finance/collect-fees" element={<CollectFees />} />
                <Route path="school/finance/collect-fees/:studentId" element={<CollectFeeIndividual />} />
                <Route path="school/finance/fee-report" element={<FeeReport />} />
                <Route path="school/finance/search-due-fees" element={<SearchDueFees />} />
                <Route path="school/finance/all-transactions" element={<AllTransactions />} />
                <Route path="school/finance/online-transactions" element={<OnlineTransactions />} />
                <Route path="school/finance/fees-carry-forward" element={<FeesCarryForward />} />
                <Route path="school/finance/assign-fees" element={<AssignFees />} />
                <Route path="school/finance/assign-fees/new" element={<AssignFeesNew />} />
                <Route path="school/finance/assign-fees/edit/:studentId" element={<AssignFeesEdit />} />
                <Route path="school/finance/fee-groups" element={<FeeGroups />} />
                <Route path="school/finance/fees-discount" element={<FeesDiscount />} />
                <Route path="school/finance/fee-types" element={<FeeTypes />} />
                <Route path="school/finance/fee-permissions" element={<FeePermissions />} />

                {/* Student Information Routes */}
                <Route path="school/student-list" element={<StudentList />} />
                <Route path="school/student-list/add" element={<AddStudent />} />
                <Route path="school/student-list/profile/:id" element={<StudentProfile />} />
                <Route path="school/student-list/disable/:id" element={<DisableStudentPage />} />
                <Route path="school/student-attendance" element={<StudentAttendance />} />
                <Route path="school/student-attendance/add/portal" element={<AttendancePortal />} />
                <Route path="school/behavior-records" element={<BehaviorRecordsListPage />} />
                <Route path="school/behavior-records/add" element={<AddBehaviorRecordPage />} />
                <Route path="school/student-categories" element={<StudentCategories />} />
                <Route path="school/student-categories/add" element={<AddStudentCategoryPage />} />
                <Route path="school/disabled-students" element={<DisabledStudents />} />
                <Route path="students/disabled" element={<DisabledStudents />} />

                {/* Academics Routes */}
                <Route path="academics/classes" element={<Classes />} />
                <Route path="academics/classes/add" element={<AddClass />} />
                <Route path="academics/classes/edit/:id" element={<EditClass />} />
                <Route path="academics/sections" element={<Sections />} />
                <Route path="academics/sections/add" element={<AddSection />} />
                <Route path="academics/sections/edit/:id" element={<EditSection />} />
                <Route path="academics/subjects" element={<Subjects />} />
                <Route path="academics/subjects/add" element={<AddSubject />} />
                <Route path="academics/subjects/edit/:id" element={<EditSubject />} />
                <Route path="academics/assign-subjects" element={<AssignSubjects />} />
                <Route path="academics/assign-subjects/add" element={<AddSubjectAssignment />} />
                <Route path="academics/assign-subjects/edit/:id" element={<EditSubjectAssignment />} />
                <Route path="academics/assign-class-teacher" element={<AssignClassTeacher />} />
                <Route path="academics/assign-class-teacher/add" element={<AddClassTeacherAssignment />} />
                <Route path="academics/assign-class-teacher/edit/:id" element={<EditClassTeacherAssignment />} />
                <Route path="academics/manage-periods" element={<ManagePeriods />} />
                <Route path="academics/manage-periods/add" element={<AddPeriod />} />
                <Route path="academics/manage-periods/edit/:id" element={<EditPeriod />} />
                <Route path="academics/class-timetable" element={<ClassTimetable />} />
                <Route path="academics/promote-students" element={<PromoteStudents />} />
                <Route path="academics/homework" element={<Homework />} />
                <Route path="academics/homework/add" element={<AddHomework />} />
                <Route path="academics/homework/edit/:id" element={<EditHomework />} />

                {/* Communication Routes */}
                <Route path="school/communicate/send-email" element={<SendEmail />} />
                <Route path="school/communicate/send-sms" element={<SendSMS />} />
                <Route path="school/communicate/email-template" element={<EmailTemplate />} />
                <Route path="school/communicate/sms-template" element={<SMSTemplate />} />
                <Route path="school/communicate/send-whatsapp" element={<SendWhatsapp />} />
                <Route path="school/communicate/whatsapp-template" element={<WhatsappTemplate />} />

                {/* Human Resource Routes */}
                <Route path="school/hr" element={<HumanResourceDashboard />} />
                <Route path="school/hr/staff" element={<StaffDirectory />} />
                <Route path="school/hr/staff/add" element={<AddStaff />} />
                <Route path="school/hr/attendance" element={<StaffAttendance />} />
                <Route path="school/hr/payroll" element={<Payroll />} />
                <Route path="school/hr/leave" element={<ApproveLeaveRequests />} />
                <Route path="school/hr/departments" element={<Departments />} />
                <Route path="school/hr/designations" element={<Designations />} />
                <Route path="school/hr/set-salary" element={<SetSalary />} />
                <Route path="school/hr/leave-types" element={<LeaveTypes />} />

                {/* Reports & Analytics Routes */}
                <Route path="school/reports" element={<ReportsDashboard />} />
                <Route path="school/reports/student" element={<StudentReport />} />
                <Route path="school/reports/progress-report" element={<ProgressReport />} />
                <Route path="school/reports/fees" element={<FeesReport />} />
                <Route path="school/reports/attendance" element={<AttendanceReport />} />
                <Route path="school/reports/salary" element={<SalaryReport />} />
                {/* Catch-all for all other report links */}
                <Route path="school/reports/:reportType" element={<ReportPlaceholder />} />

                {/* Book Sales Routes */}
                <Route path="school/book-sales" element={<BookSalesDashboard />} />
                <Route path="school/book-sales/vendors" element={<Vendors />} />
                <Route path="school/book-sales/inventory" element={<Inventory />} />
                <Route path="school/book-sales/sales" element={<SalesEntry />} />
                <Route path="school/book-sales/returns" element={<Returns />} />
                <Route path="school/book-sales/reports" element={<BookSalesReports />} />
              </Route>
            </Routes>
          </Router>
        </AcademicsProvider>
      </StudentProvider>
    </ThemeProvider>
  );
}

export default App;

