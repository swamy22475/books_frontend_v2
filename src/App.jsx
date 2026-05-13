import { RouterProvider } from 'react-router-dom';
import router from './routes/Router';
import './css/globals.css';
import { ThemeProvider } from './components/provider/theme-provider';
import { AuthProvider } from './context/AuthContext';
import { AcademicsProvider } from './context/AcademicsContext';
import { QueryProvider } from './lib/query-provider';

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <AcademicsProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <RouterProvider router={router} />
          </ThemeProvider>
        </AcademicsProvider>
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
