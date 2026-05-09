import { lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import DashboardRedirect from './DashboardRedirect';
import ErrorElement from '../components/common/ErrorElement';
import AuthGuard from '../guards/AuthGuard';

/* ***Layouts**** */
const SchoolAdminLayout = Loadable(lazy(() => import('../layouts/school/SchoolAdminLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

// authentication
const SchoolLogin = Loadable(lazy(() => import('../views/authentication/SchoolLogin')));
const Error = Loadable(lazy(() => import('../views/authentication/Error')));

// Admin
const AdminLogin = Loadable(lazy(() => import('../views/admin/AdminLogin')));
const AdminDashboard = Loadable(lazy(() => import('../views/admin/AdminDashboard')));

// Book Sales Pages
const BookSalesDashboard = Loadable(lazy(() => import('../school/pages/BookSales/BookSalesDashboard')));
const BookSalesVendors = Loadable(lazy(() => import('../school/pages/BookSales/Vendors')));
const BookSalesInventory = Loadable(lazy(() => import('../school/pages/BookSales/Inventory')));
const BookSalesStockIn = Loadable(lazy(() => import('../school/pages/BookSales/StockIn')));
const BookSalesSalesEntry = Loadable(lazy(() => import('../school/pages/BookSales/SalesEntry')));
const BookSalesReturns = Loadable(lazy(() => import('../school/pages/BookSales/Returns')));
const BookSalesReports = Loadable(lazy(() => import('../school/pages/BookSales/BookSalesReports')));
const BookSalesTypes = Loadable(lazy(() => import('../school/pages/BookSales/BookTypes')));

const Router = [
  // Landing page at root
  {
    path: '/',
    element: <DashboardRedirect />,
  },

  // Admin Routes
  {
    path: '/admin',
    children: [
      { path: 'login', element: <AdminLogin /> },
      { path: 'dashboard', element: <AdminDashboard /> },
    ],
  },

  // School Admin Routes
  {
    path: '/school',
    element: (
      <AuthGuard>
        <SchoolAdminLayout />
      </AuthGuard>
    ),
    errorElement: <ErrorElement />,
    children: [
      { index: true, element: <DashboardRedirect /> },
      { path: 'dashboard', element: <DashboardRedirect /> },

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

  // Authentication Routes
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: 'login', element: <SchoolLogin /> },
      { path: 'school-login', element: <SchoolLogin /> },
      { path: '403', element: <Error /> },
      { path: '404', element: <Error /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },

  // Catch-all 404
  { path: '*', element: <Navigate to="/auth/404" state={{ from: 'root' }} /> },
];

const router = createBrowserRouter(Router);

export default router;