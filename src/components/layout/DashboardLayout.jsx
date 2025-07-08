"use client"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { Button } from "../ui/button"
import { LayoutDashboard, Users, Calendar, CalendarDays, LogOut, User } from "lucide-react"

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const adminNavItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/patients", label: "Patients", icon: Users },
    { path: "/appointments", label: "Appointments", icon: Calendar },
    { path: "/calendar", label: "Calendar View", icon: CalendarDays },
  ]

  const patientNavItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/my-appointments", label: "My Appointments", icon: Calendar },
  ]

  const navItems = user?.role === "Admin" ? adminNavItems : patientNavItems

  return (
    <div className="dashboard-layout">
      <div className="sidebar">
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#1e293b" }}>Dental Center</h2>
          <p style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Management System</p>
        </div>

        <nav style={{ marginBottom: "2rem" }}>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <Link key={item.path} to={item.path} className={`nav-item ${isActive ? "active" : ""}`}>
                <Icon size={20} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div
          style={{
            marginTop: "auto",
            paddingTop: "2rem",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
              padding: "0.75rem",
              backgroundColor: "#f8fafc",
              borderRadius: "0.375rem",
            }}
          >
            <User size={16} style={{ marginRight: "0.5rem", color: "#6b7280" }} />
            <div>
              <p style={{ fontSize: "0.875rem", fontWeight: "500" }}>{user?.name}</p>
              <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>{user?.role}</p>
            </div>
          </div>

          <Button variant="outline" onClick={handleLogout} style={{ width: "100%" }}>
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </div>

      <div className="main-content">{children}</div>
    </div>
  )
}

export default DashboardLayout
