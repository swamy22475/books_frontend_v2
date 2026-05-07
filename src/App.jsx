import { RouterProvider } from 'react-router-dom';
import router from './routes/Router';
import './css/globals.css';
import { ThemeProvider } from './components/provider/theme-provider';
import { StudentProvider } from './context/StudentContext';
import { AcademicsProvider } from './context/AcademicsContext';
import { FeeProvider } from './context/FeeContext';
import { ScheduleProvider } from './context/ScheduleContext';
import { AuthProvider } from './context/AuthContext';
import { QueryProvider } from './lib/query-provider';
import { CommunicationProvider } from './context/CommunicationContext';
import { TransportProvider } from './context/TransportContext';
import { ExaminationProvider } from './context/ExaminationContext';

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <StudentProvider>
            <AcademicsProvider>
              <TransportProvider>
                <ExaminationProvider>
                  <FeeProvider>
                    <CommunicationProvider>
                      <ScheduleProvider>
                        <RouterProvider router={router} />
                      </ScheduleProvider>
                    </CommunicationProvider>
                  </FeeProvider>
                </ExaminationProvider>
              </TransportProvider>
            </AcademicsProvider>
          </StudentProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
