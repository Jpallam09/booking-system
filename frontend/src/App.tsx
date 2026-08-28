import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import { AuthProvider } from "@/context/AuthContext"
import { DashboardLayout } from "@/layouts/DashboardLayout"
import { AppointmentDetailPage } from "@/pages/AppointmentDetailPage"
import { AppointmentsListPage } from "@/pages/AppointmentsListPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { LandingPage } from "@/pages/LandingPage"
import { LoginPage } from "@/pages/LoginPage"
import { NewAppointmentPage } from "@/pages/NewAppointmentPage"
import { RegisterPage } from "@/pages/RegisterPage"
import { ServiceDetailPage } from "@/pages/ServiceDetailPage"
import { ServicesListPage } from "@/pages/ServicesListPage"
import { RequireAuth } from "@/routes/RequireAuth"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              element={
                <RequireAuth>
                  <DashboardLayout />
                </RequireAuth>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/appointments" element={<AppointmentsListPage />} />
              <Route
                path="/appointments/new"
                element={
                  <RequireAuth roles={["patient"]}>
                    <NewAppointmentPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/appointments/:id"
                element={<AppointmentDetailPage />}
              />
              <Route
                path="/services"
                element={
                  <RequireAuth roles={["patient", "admin"]}>
                    <ServicesListPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/services/:id"
                element={
                  <RequireAuth roles={["patient", "admin"]}>
                    <ServiceDetailPage />
                  </RequireAuth>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
