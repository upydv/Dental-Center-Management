import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { DataProvider } from "./contexts/DataContext"
import LoginPage from "./components/auth/LoginPage"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import DashboardLayout from "./components/layout/DashboardLayout"
import Dashboard from "./components/dashboard/Dashboard"
import PatientManagement from "./components/patients/PatientManagement"
import AppointmentManagement from "./components/appointments/AppointmentManagement"
import CalendarView from "./components/calendar/CalendarView"
import PatientView from "./components/patient-view/PatientView"

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/patients" element={<PatientManagement />} />
                      <Route path="/appointments" element={<AppointmentManagement />} />
                      <Route path="/calendar" element={<CalendarView />} />
                      <Route path="/my-appointments" element={<PatientView />} />
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  )
}

export default App
