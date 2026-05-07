// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import DashboardRedirect from './DashboardRedirect';
import ErrorElement from '../components/common/ErrorElement';
import RoleGuard from '../guards/RoleGuard';
import AuthGuard from '../guards/AuthGuard';

/* ***Layouts**** */
const SchoolAdminLayout = Loadable(lazy(() => import('../layouts/school/SchoolAdminLayout')));
const SuperAdminLayout = Loadable(lazy(() => import('../layouts/super/SuperAdminLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

// authentication
const Login2 = Loadable(lazy(() => import('../views/authentication/auth2/Login')));
const ForgotPassword2 = Loadable(lazy(() => import('../views/authentication/auth2/ForgotPassword')));
const Register2 = Loadable(lazy(() => import('../views/authentication/auth2/Register')));
const Maintainance = Loadable(lazy(() => import('../views/authentication/Maintainance')));
const SchoolLogin = Loadable(lazy(() => import('../views/authentication/SchoolLogin')));
const UpdatePassword = Loadable(lazy(() => import('../views/authentication/UpdatePassword')));

// School Admin Pages
const SchoolDashboard = Loadable(lazy(() => import('../school/pages/Dashboard/index')));
const TeacherDashboard = Loadable(lazy(() => import('../school/pages/TeacherDashboard/index')));
const StudentDashboard = Loadable(lazy(() => import('../school/pages/StudentDashboard/index')));

// Teachers Pages
const AllTeachers = Loadable(lazy(() => import('../school/pages/Teachers/AllTeachers')));
const TeachersList = Loadable(lazy(() => import('../school/pages/Teachers/TeachersList')));
const TeachersGrid = Loadable(lazy(() => import('../school/pages/Teachers/TeachersGrid')));
const TeacherDetails = Loadable(lazy(() => import('../school/pages/Teachers/TeacherDetails')));
const AddTeacher = Loadable(lazy(() => import('../school/pages/Teachers/AddTeacher')));
const Routine = Loadable(lazy(() => import('../school/pages/Teachers/Routine')));
const User = Loadable(lazy(() => import('../school/pages/Teachers/User')));
const EditUser = Loadable(lazy(() => import('../school/pages/Teachers/EditUser')));
const AddUser = Loadable(lazy(() => import('../school/pages/Teachers/AddUser')));

// Academics Pages
const AcademicsDashboard = Loadable(lazy(() => import('../school/pages/Academics/AcademicsDashboard')));
const Classes = Loadable(lazy(() => import('../school/pages/Academics/Classes')));
const AddClass = Loadable(lazy(() => import('../school/pages/Academics/AddClass')));
const EditClass = Loadable(lazy(() => import('../school/pages/Academics/EditClass')));
const Sections = Loadable(lazy(() => import('../school/pages/Academics/Sections')));
const AddSection = Loadable(lazy(() => import('../school/pages/Academics/AddSection')));
const EditSection = Loadable(lazy(() => import('../school/pages/Academics/EditSection')));
const Subjects = Loadable(lazy(() => import('../school/pages/Academics/Subjects')));
const AddSubject = Loadable(lazy(() => import('../school/pages/Academics/AddSubject')));
const EditSubject = Loadable(lazy(() => import('../school/pages/Academics/EditSubject')));
const AssignSubjects = Loadable(lazy(() => import('../school/pages/Academics/AssignSubjects')));
const AddSubjectAssignment = Loadable(lazy(() => import('../school/pages/Academics/AddSubjectAssignment')));
const EditSubjectAssignment = Loadable(lazy(() => import('../school/pages/Academics/EditSubjectAssignment')));
const AssignClassTeacher = Loadable(lazy(() => import('../school/pages/Academics/AssignClassTeacher')));
const AddClassTeacherAssignment = Loadable(lazy(() => import('../school/pages/Academics/AddClassTeacherAssignment')));
const EditClassTeacherAssignment = Loadable(lazy(() => import('../school/pages/Academics/EditClassTeacherAssignment')));
const ManagePeriods = Loadable(lazy(() => import('../school/pages/Academics/ManagePeriods')));
const AddPeriod = Loadable(lazy(() => import('../school/pages/Academics/AddPeriod')));
const EditPeriod = Loadable(lazy(() => import('../school/pages/Academics/EditPeriod')));
const ClassTimetable = Loadable(lazy(() => import('../school/pages/Academics/ClassTimetable')));
const PromoteStudents = Loadable(lazy(() => import('../school/pages/Academics/PromoteStudents')));
const Homework = Loadable(lazy(() => import('../school/pages/Academics/Homework')));
const AddHomework = Loadable(lazy(() => import('../school/pages/Academics/AddHomework')));
const EditHomework = Loadable(lazy(() => import('../school/pages/Academics/EditHomework')));

// Student Pages
const Students = Loadable(lazy(() => import('../school/pages/Students/Students')));
const AddStudent = Loadable(lazy(() => import('../school/pages/StudentInformation/AddStudent')));
const StudentList = Loadable(lazy(() => import('../school/pages/StudentInformation/StudentList')));
const QuickStudentAdmissionList = Loadable(lazy(() => import('../school/pages/StudentInformation/QuickStudentAdmissionList')));
const QuickStudentAdmissionForm = Loadable(lazy(() => import('../school/pages/StudentInformation/QuickStudentAdmissionForm')));
const StudentProfile = Loadable(lazy(() => import('../school/pages/StudentInformation/StudentProfile')));
const StudentAnalytics = Loadable(lazy(() => import('../school/pages/StudentInformation/StudentAnalytics')));
const DisableStudentPage = Loadable(lazy(() => import('../school/pages/StudentInformation/DisableStudentPage')));
const AddAttendancePage = Loadable(lazy(() => import('../school/pages/StudentInformation/AddAttendancePage')));
const StudentAttendance = Loadable(lazy(() => import('../school/pages/StudentInformation/AttendanceTeacher')));
const StudentCategories = Loadable(lazy(() => import('../school/pages/StudentInformation/StudentCategories')));
const AddStudentCategoryPage = Loadable(lazy(() => import('../school/pages/StudentInformation/AddStudentCategoryPage')));
const BehaviorRecords = Loadable(lazy(() => import('../school/pages/StudentInformation/BehaviorRecords')));
const AddBehaviorRecordPage = Loadable(lazy(() => import('../school/pages/StudentInformation/AddBehaviorRecordPage')));
const DisabledStudents = Loadable(lazy(() => import('../school/pages/StudentInformation/DisabledStudents')));
const BulkEdit = Loadable(lazy(() => import('../school/pages/StudentInformation/BulkEdit')));

// Finance Pages
const SearchDueFees = Loadable(lazy(() => import('../school/pages/Finance/SearchDueFees')));
const AllTransactions = Loadable(lazy(() => import('../school/pages/Finance/AllTransactions')));
const OnlineTransactions = Loadable(lazy(() => import('../school/pages/Finance/OnlineTransactions')));
const FeesCarryForward = Loadable(lazy(() => import('../school/pages/Finance/FeesCarryForward')));
const AssignFees = Loadable(lazy(() => import('../school/pages/Finance/AssignFees')));
const AssignFeesEdit = Loadable(lazy(() => import('../school/pages/Finance/AssignFeesEdit')));
const AssignFeesEditGlobal = Loadable(lazy(() => import('../school/pages/Finance/AssignFeesEditGlobal')));
const FeesDiscount = Loadable(lazy(() => import('../school/pages/Finance/FeesDiscount')));
const FeeTypes = Loadable(lazy(() => import('../school/pages/Finance/FeeTypes')));
const FeePermissions = Loadable(lazy(() => import('../school/pages/Finance/FeePermissions')));
const FeeReport = Loadable(lazy(() => import('../school/pages/Finance/FeeReport')));
const CollectFeeIndividual = Loadable(lazy(() => import('../school/pages/Finance/CollectFeeIndividual')));

// Accounts Pages
const Income = Loadable(lazy(() => import('../school/pages/Accounts/Income')));
const IncomeHeads = Loadable(lazy(() => import('../school/pages/Accounts/IncomeHeads')));
const Expense = Loadable(lazy(() => import('../school/pages/Accounts/Expense')));
const ExpenseHeads = Loadable(lazy(() => import('../school/pages/Accounts/ExpenseHeads')));

// Examination Pages
const ExamDashboard = Loadable(lazy(() => import('../school/pages/Examination/ExamDashboard')));
const AssignExam = Loadable(lazy(() => import('../school/pages/Examination/AssignExam')));
const ExamSchedule = Loadable(lazy(() => import('../school/pages/Examination/ExamSchedule')));
const AddExamSchedule = Loadable(lazy(() => import('../school/pages/Examination/AddExamSchedule')));
const AssignExamSchedule = Loadable(lazy(() => import('../school/pages/Examination/AssignExamSchedule')));
const OnlineExam = Loadable(lazy(() => import('../school/pages/Examination/OnlineExam')));
const AddOnlineExam = Loadable(lazy(() => import('../school/pages/Examination/AddOnlineExam')));
const AddOnlineExamPremium = Loadable(lazy(() => import('../school/pages/Examination/AddOnlineExamPremium')));
const EditOnlineExam = Loadable(lazy(() => import('../school/pages/Examination/EditOnlineExam')));
const EditOnlineExamPremium = Loadable(lazy(() => import('../school/pages/Examination/EditOnlineExamPremium')));
const ViewOnlineExamPremium = Loadable(lazy(() => import('../school/pages/Examination/ViewOnlineExamPremium')));
const ManageQuestions = Loadable(lazy(() => import('../school/pages/Examination/ManageQuestions')));

// Transport Pages
const ManageVehicles = Loadable(lazy(() => import('../school/pages/Transport/ManageVehicles')));
const AddVehicle = Loadable(lazy(() => import('../school/pages/Transport/AddVehicle')));
const EditVehicle = Loadable(lazy(() => import('../school/pages/Transport/EditVehicle')));
const ManageRoutes = Loadable(lazy(() => import('../school/pages/Transport/ManageRoutes')));
const AddRoute = Loadable(lazy(() => import('../school/pages/Transport/AddRoute')));
const EditRoute = Loadable(lazy(() => import('../school/pages/Transport/EditRoute')));
const LiveTracking = Loadable(lazy(() => import('../school/pages/Transport/LiveTracking')));
const ManageStudentTransport = Loadable(lazy(() => import('../school/pages/Transport/ManageStudentTransport.jsx')));
const TransportDashboard = Loadable(lazy(() => import('../school/pages/Transport/TransportDashboard.jsx')));

// Study Center Pages
const ManageResources = Loadable(lazy(() => import('../school/pages/StudyCenter/ManageResources.jsx')));

// Front Office Pages
const VisitorBook = Loadable(lazy(() => import('../school/pages/FrontOffice/VisitorBook')));
const Complaints = Loadable(lazy(() => import('../school/pages/FrontOffice/Complaints')));
const PostalRecords = Loadable(lazy(() => import('../school/pages/FrontOffice/PostalRecords')));
const PostalSend = Loadable(lazy(() => import('../school/pages/FrontOffice/PostalSend')));
const PostalReceive = Loadable(lazy(() => import('../school/pages/FrontOffice/PostalReceive')));
const AdmissionEnquiry = Loadable(lazy(() => import('../school/pages/FrontOffice/AdmissionEnquiry')));

// Human Resource / Payroll
const HumanResourceDashboard = Loadable(lazy(() => import('../school/pages/HumanResource/HumanResourceDashboard')));
const StaffDirectory = Loadable(lazy(() => import('../school/pages/HumanResource/StaffDirectory')));
const AddStaff = Loadable(lazy(() => import('../school/pages/HumanResource/AddStaff')));
const ViewStaff = Loadable(lazy(() => import('../school/pages/HumanResource/ViewStaff')));
const EditStaff = Loadable(lazy(() => import('../school/pages/HumanResource/EditStaff')));
const Payroll = Loadable(lazy(() => import('../school/pages/HumanResource/Payroll')));
const StaffAttendance = Loadable(lazy(() => import('../school/pages/HumanResource/StaffAttendance')));
const SetSalary = Loadable(lazy(() => import('../school/pages/HumanResource/SetSalary')));
const ApproveLeaveRequests = Loadable(lazy(() => import('../school/pages/HumanResource/ApproveLeaveRequests')));
const LeaveTypes = Loadable(lazy(() => import('../school/pages/HumanResource/LeaveTypes')));
const Departments = Loadable(lazy(() => import('../school/pages/HumanResource/Departments')));
const Designations = Loadable(lazy(() => import('../school/pages/HumanResource/Designations')));

// System Settings Pages
const GeneralSetting = Loadable(lazy(() => import('../school/pages/SystemSettings/GeneralSetting')));
const SessionSetting = Loadable(lazy(() => import('../school/pages/SystemSettings/SessionSetting')));
const NotificationSetting = Loadable(lazy(() => import('../school/pages/SystemSettings/NotificationSetting')));
const WhatsAppSetting = Loadable(lazy(() => import('../school/pages/SystemSettings/WhatsAppSetting')));
const SMSSetting = Loadable(lazy(() => import('../school/pages/SystemSettings/SMSSetting')));
const EmailSetting = Loadable(lazy(() => import('../school/pages/SystemSettings/EmailSetting')));
const PaymentMethods = Loadable(lazy(() => import('../school/pages/SystemSettings/PaymentMethods')));
const PrintHeaderFooter = Loadable(lazy(() => import('../school/pages/SystemSettings/PrintHeaderFooter')));
const ThermalPrint = Loadable(lazy(() => import('../school/pages/SystemSettings/ThermalPrint')));
const FrontCMSSetting = Loadable(lazy(() => import('../school/pages/SystemSettings/FrontCMSSetting')));
const RolesPermissions = Loadable(lazy(() => import('../school/pages/SystemSettings/RolesPermissions')));
const BackupRestore = Loadable(lazy(() => import('../school/pages/SystemSettings/BackupRestore')));
const Users = Loadable(lazy(() => import('../school/pages/SystemSettings/Users')));
const Modules = Loadable(lazy(() => import('../school/pages/SystemSettings/Modules')));
const CustomFields = Loadable(lazy(() => import('../school/pages/SystemSettings/CustomFields')));
const CaptchaSetting = Loadable(lazy(() => import('../school/pages/SystemSettings/CaptchaSetting')));
const SystemFields = Loadable(lazy(() => import('../school/pages/SystemSettings/SystemFields')));
const StudentProfileUpdate = Loadable(lazy(() => import('../school/pages/SystemSettings/StudentProfileUpdate')));
const OnlineAdmission = Loadable(lazy(() => import('../school/pages/SystemSettings/OnlineAdmission')));
const FileTypes = Loadable(lazy(() => import('../school/pages/SystemSettings/FileTypes')));
const SidebarMenu = Loadable(lazy(() => import('../school/pages/SystemSettings/SidebarMenu')));
const SystemUpdate = Loadable(lazy(() => import('../school/pages/SystemSettings/SystemUpdate')));

// Library Pages
const IssueReturnBook = Loadable(lazy(() => import('../school/pages/Library/IssueReturnBook')));
const IssueNewBook = Loadable(lazy(() => import('../school/pages/Library/IssueNewBook')));
const ManageBooks = Loadable(lazy(() => import('../school/pages/Library/ManageBooks')));
const BookCategories = Loadable(lazy(() => import('../school/pages/Library/BookCategories')));
const LibraryMembers = Loadable(lazy(() => import('../school/pages/Library/LibraryMembers')));

// Hostel Pages
const HostelDashboard = Loadable(lazy(() => import('../school/pages/Hostel/HostelDashboard')));
const HostelAllocation = Loadable(lazy(() => import('../school/pages/Hostel/StudentAllocation')));
const ManageRooms = Loadable(lazy(() => import('../school/pages/Hostel/ManageRooms')));
const RoomTypes = Loadable(lazy(() => import('../school/pages/Hostel/RoomTypes')));
const ManageHostels = Loadable(lazy(() => import('../school/pages/Hostel/ManageHostels')));
const HostelCategory = Loadable(lazy(() => import('../school/pages/Hostel/HostelCategory')));
const HostelPermissions = Loadable(lazy(() => import('../school/pages/Hostel/Permissions')));

// Super Admin Dashboards
const Modern = Loadable(lazy(() => import('../views/dashboards/Modern')));

//pages
const UserProfile = Loadable(lazy(() => import('../views/pages/user-profile/UserProfile')));

/* ****Apps***** */
const Notes = Loadable(lazy(() => import('../views/apps/notes/Notes')));
const Form = Loadable(lazy(() => import('../views/utilities/form/Form')));
const Schools = Loadable(lazy(() => import('../views/utilities/schools/Schools')));
const AddSchool = Loadable(lazy(() => import('../views/utilities/schools/AddSchool')));
const Plans = Loadable(lazy(() => import('../views/utilities/plans/Plans')));
const AddPlan = Loadable(lazy(() => import('../views/utilities/plans/AddPlan')));
const PaymentHistory = Loadable(lazy(() => import('../views/utilities/payment-history/PaymentHistory')));
const PlatformSettings = Loadable(lazy(() => import('../views/utilities/platform-settings/PlatformSettings')));
const PaymentGateways = Loadable(lazy(() => import('../views/utilities/payment-gateways/PaymentGateways')));
const SmsGateways = Loadable(lazy(() => import('../views/utilities/sms-gateways/SmsGateways')));
const NotificationTypes = Loadable(lazy(() => import('../views/utilities/notification-types/NotificationTypes')));
const SpecificSchoolSettings = Loadable(lazy(() => import('../views/utilities/specific-school-settings/SpecificSchoolSettings')));
const MasterMenuBuilder = Loadable(lazy(() => import('../views/utilities/master-menu-builder/MasterMenuBuilder')));
const Tickets = Loadable(lazy(() => import('../views/apps/tickets/Tickets')));
const CreateTickets = Loadable(lazy(() => import('../views/apps/tickets/CreateTickets')));
const EditTickets = Loadable(lazy(() => import('../views/apps/tickets/EditTickets')));
const Leads = Loadable(lazy(() => import('../views/apps/leads/Leads')));
const CreateLead = Loadable(lazy(() => import('../views/apps/leads/CreateLead')));
const EditLeads = Loadable(lazy(() => import('../views/apps/leads/EditLeads')));
const Blog = Loadable(lazy(() => import('../views/apps/blog/Blog')));
const BlogDetail = Loadable(lazy(() => import('../views/apps/blog/BlogDetail')));



// CMS Pages
const CmsPageSections = Loadable(lazy(() => import('../views/cms/PageSections')));
const CmsNavigationMenu = Loadable(lazy(() => import('../views/cms/NavigationMenu')));
const CmsClientLogos = Loadable(lazy(() => import('../views/cms/ClientLogos')));

const Error = Loadable(lazy(() => import('../views/authentication/Error')));

const SolarIcon = Loadable(lazy(() => import('../views/icons/SolarIcon')));

// Communicate Pages
const NoticeBoard = Loadable(lazy(() => import('../school/pages/Communicate/NoticeBoard')));
const EventsHolidays = Loadable(lazy(() => import('../school/pages/Communicate/EventsHolidays')));
const ComposeBroadcast = Loadable(lazy(() => import('../school/pages/Communicate/ComposeBroadcast')));
const BroadcastHistory = Loadable(lazy(() => import('../school/pages/Communicate/BroadcastHistory')));
const SendSMS = Loadable(lazy(() => import('../school/pages/Communicate/SendSMS')));
const SendEmail = Loadable(lazy(() => import('../school/pages/Communicate/SendEmail')));
const EmailSMSLog = Loadable(lazy(() => import('../school/pages/Communicate/EmailSMSLog')));
const ScheduleEmailSMSLog = Loadable(lazy(() => import('../school/pages/Communicate/ScheduleEmailSMSLog')));
const LoginCredentialsSend = Loadable(lazy(() => import('../school/pages/Communicate/LoginCredentialsSend')));
const EmailTemplate = Loadable(lazy(() => import('../school/pages/Communicate/EmailTemplate')));
const SMSTemplate = Loadable(lazy(() => import('../school/pages/Communicate/SMSTemplate')));
const SendWhatsapp = Loadable(lazy(() => import('../school/pages/Communicate/SendWhatsapp')));
const WhatsappTemplate = Loadable(lazy(() => import('../school/pages/Communicate/WhatsappTemplate')));

// Reports Pages
const ReportsDashboard = Loadable(lazy(() => import('../school/pages/Reports/ReportsDashboard')));
const StudentReport = Loadable(lazy(() => import('../school/pages/Reports/StudentReport')));
const AttendanceReport = Loadable(lazy(() => import('../school/pages/Reports/AttendanceReport')));
const FeesReport = Loadable(lazy(() => import('../school/pages/Reports/FeesReport')));
const SalaryReport = Loadable(lazy(() => import('../school/pages/Reports/SalaryReport')));
const HallTicketReport = Loadable(lazy(() => import('../school/pages/Reports/HallTicketReport')));
const HostelReport = Loadable(lazy(() => import('../school/pages/Reports/HostelReport')));
const TransportReport = Loadable(lazy(() => import('../school/pages/Reports/TransportReport')));
const CertificateReport = Loadable(lazy(() => import('../school/pages/Reports/CertificateReport')));
const ReportPlaceholder = Loadable(lazy(() => import('../school/pages/Reports/ReportPlaceholder')));

// Certificates Pages
const CertificateTemplates = Loadable(lazy(() => import('../school/pages/Certificates/CertificateTemplates')));
const GenerateCertificate = Loadable(lazy(() => import('../school/pages/Certificates/GenerateCertificate')));

// Book Sales Pages
const BookSalesDashboard = Loadable(lazy(() => import('../school/pages/BookSales/BookSalesDashboard')));
const BookSalesVendors = Loadable(lazy(() => import('../school/pages/BookSales/Vendors')));
const BookSalesInventory = Loadable(lazy(() => import('../school/pages/BookSales/Inventory')));
const BookSalesStockIn = Loadable(lazy(() => import('../school/pages/BookSales/StockIn')));
const BookSalesSalesEntry = Loadable(lazy(() => import('../school/pages/BookSales/SalesEntry')));
const BookSalesReturns = Loadable(lazy(() => import('../school/pages/BookSales/Returns')));
const BookSalesReports = Loadable(lazy(() => import('../school/pages/BookSales/BookSalesReports')));
const BookSalesTypes = Loadable(lazy(() => import('../school/pages/BookSales/BookTypes')));

// Inventory Components
const InventoryDashboard = Loadable(lazy(() => import('../school/pages/Inventory/InventoryDashboard')));
const ItemList = Loadable(lazy(() => import('../school/pages/Inventory/ItemList')));
const AddStock = Loadable(lazy(() => import('../school/pages/Inventory/AddStock')));
const IssueItem = Loadable(lazy(() => import('../school/pages/Inventory/IssueItem')));
const Categories = Loadable(lazy(() => import('../school/pages/Inventory/Categories')));
const Suppliers = Loadable(lazy(() => import('../school/pages/Inventory/Suppliers')));
const InventoryReports = Loadable(lazy(() => import('../school/pages/Inventory/InventoryReports')));



const Router = [
  // Landing page at root
  {
    path: '/',
    element: <DashboardRedirect />,
  },

  // School Admin Routes
  {
    path: '/school',
    element: <SchoolAdminLayout />,
    errorElement: <ErrorElement />,
    children: [
      { index: true, element: <DashboardRedirect /> },
      { path: 'dashboard', element: <DashboardRedirect /> },
      { path: 'update-password', element: <UpdatePassword /> },

      // Book Sales Routes
      {
        path: 'book-sales',
        children: [
          { index: true, element: <BookSalesDashboard /> },
          { path: 'vendors', element: <BookSalesVendors /> },
          { path: 'inventory', element: <BookSalesInventory /> },
          { path: 'book-types', element: <BookSalesTypes /> },
          { path: 'stock-in', element: <BookSalesStockIn /> },
          { path: 'sales', element: <BookSalesSalesEntry /> },
          { path: 'returns', element: <BookSalesReturns /> },
          { path: 'reports', element: <BookSalesReports /> },
        ],
      },

      // Catch-all 404
      { path: '*', element: <Navigate to="/auth/404" state={{ from: 'school' }} /> },
    ],
  },

  // Redirect legacy HR paths
  { path: '/hr/payroll', element: <Navigate to="/school/payroll" replace /> },
  { path: '/hr/salary', element: <Navigate to="/school/set-salary" replace /> },
  { path: '/hr/leave-requests', element: <Navigate to="/school/approve-leave-requests" replace /> },
  { path: '/hr/leave-types', element: <Navigate to="/school/leave-types" replace /> },
  { path: '/hr/departments', element: <Navigate to="/school/departments" replace /> },
  { path: '/hr/designations', element: <Navigate to="/school/designations" replace /> },

  // Redirect legacy settings paths
  { path: '/settings/general', element: <Navigate to="/school/settings/general" replace /> },
  { path: '/settings/session', element: <Navigate to="/school/settings/session" replace /> },
  { path: '/settings/notifications', element: <Navigate to="/school/settings/notifications" replace /> },
  { path: '/settings/whatsapp', element: <Navigate to="/school/settings/whatsapp" replace /> },
  { path: '/settings/sms', element: <Navigate to="/school/settings/sms" replace /> },
  { path: '/settings/email', element: <Navigate to="/school/settings/email" replace /> },
  { path: '/settings/payments', element: <Navigate to="/school/settings/payments" replace /> },
  { path: '/settings/print', element: <Navigate to="/school/settings/print" replace /> },
  { path: '/settings/thermal-print', element: <Navigate to="/school/settings/thermal-print" replace /> },
  { path: '/settings/cms', element: <Navigate to="/school/settings/cms" replace /> },
  { path: '/settings/roles', element: <Navigate to="/school/settings/roles" replace /> },
  { path: '/settings/backup', element: <Navigate to="/school/settings/backup" replace /> },
  { path: '/settings/users', element: <Navigate to="/school/settings/users" replace /> },
  { path: '/settings/modules', element: <Navigate to="/school/settings/modules" replace /> },
  { path: '/settings/custom-fields', element: <Navigate to="/school/settings/custom-fields" replace /> },
  { path: '/settings/captcha', element: <Navigate to="/school/settings/captcha" replace /> },
  { path: '/settings/system-fields', element: <Navigate to="/school/settings/system-fields" replace /> },
  { path: '/settings/student-profile', element: <Navigate to="/school/settings/student-profile" replace /> },
  { path: '/settings/admission', element: <Navigate to="/school/settings/admission" replace /> },
  { path: '/settings/file-types', element: <Navigate to="/school/settings/file-types" replace /> },
  { path: '/settings/sidebar', element: <Navigate to="/school/settings/sidebar" replace /> },
  { path: '/settings/update', element: <Navigate to="/school/settings/update" replace /> },

  // Super Admin Routes
  {
    path: '/super',
    element: <RoleGuard allowedRoles={['super_admin']}><SuperAdminLayout /></RoleGuard>,
    errorElement: <ErrorElement />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <Modern /> },
      { path: 'update-password', element: <UpdatePassword /> },
      { path: 'apps/notes', element: <Notes /> },
      { path: 'utilities/form', element: <Form /> },
      { path: 'utilities/schools', element: <Schools /> },
      { path: 'utilities/schools/create', element: <AddSchool /> },
      { path: 'utilities/plans', element: <Plans /> },
      { path: 'utilities/plans/create', element: <AddPlan /> },
      { path: 'utilities/payment-history', element: <PaymentHistory /> },
      { path: 'settings/platform', element: <PlatformSettings /> },
      { path: 'settings/payment-gateways', element: <PaymentGateways /> },
      { path: 'settings/sms-gateways', element: <SmsGateways /> },
      { path: 'settings/notification-types', element: <NotificationTypes /> },
      { path: 'apps/tickets', element: <Tickets /> },
      { path: 'apps/tickets/create', element: <CreateTickets /> },
      { path: 'apps/tickets/edit/:id', element: <EditTickets /> },
      { path: 'apps/leads', element: <Leads /> },
      { path: 'apps/leads/create', element: <CreateLead /> },
      { path: 'apps/leads/edit/:id', element: <EditLeads /> },
      { path: 'apps/blog/post', element: <Blog /> },
      { path: 'apps/blog/detail/:id', element: <BlogDetail /> },
      { path: 'user-profile', element: <UserProfile /> },
      { path: 'icons/iconify', element: <SolarIcon /> },
      { path: 'cms/page-sections', element: <CmsPageSections /> },
      { path: 'cms/navigation-menu', element: <CmsNavigationMenu /> },
      { path: 'settings/school-features', element: <SpecificSchoolSettings /> },
      { path: 'settings/menu-builder', element: <MasterMenuBuilder /> },
      { path: 'settings/client-logos', element: <CmsClientLogos /> },
      { path: '*', element: <Navigate to="/auth/404" state={{ from: 'super' }} /> },
    ],
  },

  // Authentication Routes
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: 'login', element: <SchoolLogin /> },
      { path: 'school-login', element: <SchoolLogin /> },
      { path: 'auth2/login', element: <Login2 /> },
      { path: 'auth2/forgot-password', element: <ForgotPassword2 /> },
      { path: 'auth2/register', element: <Register2 /> },
      { path: 'maintenance', element: <Maintainance /> },
      { path: '403', element: <Error /> },
      { path: '404', element: <Error /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },

  // Legacy route redirects for backward compatibility
  { path: '/dashboard', element: <Navigate to="/super/dashboard" replace /> },
  { path: '/school-dashboard', element: <Navigate to="/school/dashboard" replace /> },
  { path: '/teacher-dashboard', element: <Navigate to="/school/teacher-dashboard" replace /> },

  // Catch-all 404
  { path: '*', element: <Navigate to="/auth/404" state={{ from: 'root' }} /> },
];

const router = createBrowserRouter(Router);

export default router;