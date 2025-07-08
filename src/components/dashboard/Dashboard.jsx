"use client"

import { useAuth } from "../../contexts/AuthContext"
import { useData } from "../../contexts/DataContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Calendar, Users, Clock, CheckCircle } from "lucide-react"

const Dashboard = () => {
  const { user } = useAuth()
  const { patients, appointments } = useData()

  const todayAppointments = appointments.filter((apt) => {
    const today = new Date().toISOString().split("T")[0]
    return apt.date === today
  })

  const completedAppointments = appointments.filter((apt) => apt.status === "Completed")
  const scheduledAppointments = appointments.filter((apt) => apt.status === "Scheduled" || apt.status === "Confirmed")

  if (user.role === "Patient") {
    const myAppointments = appointments.filter((apt) => apt.patientId === user.id)
    const upcomingAppointments = myAppointments.filter((apt) => {
      const today = new Date()
      const aptDate = new Date(apt.date)
      return aptDate >= today && (apt.status === "Scheduled" || apt.status === "Confirmed")
    })

    return (
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}</h1>
          <p className="text-gray-600">Here's your appointment overview</p>
        </div>

        <div className="stats-grid">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myAppointments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
            <CardDescription>Your latest appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myAppointments.slice(0, 5).map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{appointment.type}</p>
                    <p className="text-sm text-gray-600">
                      {appointment.date} at {appointment.time}
                    </p>
                    {appointment.notes && <p className="text-sm text-gray-500 mt-1">{appointment.notes}</p>}
                  </div>
                  <Badge
                    variant={
                      appointment.status === "Completed"
                        ? "success"
                        : appointment.status === "Cancelled"
                          ? "destructive"
                          : "default"
                    }
                  >
                    {appointment.status}
                  </Badge>
                </div>
              ))}
              {myAppointments.length === 0 && <p className="text-gray-500 text-center py-4">No appointments found</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.name}</p>
      </div>

      <div className="stats-grid">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledAppointments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedAppointments.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
            <CardDescription>Latest registered patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patients.slice(0, 5).map((patient) => (
                <div key={patient.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-gray-600">{patient.email}</p>
                  </div>
                  <p className="text-sm text-gray-500">{patient.phone}</p>
                </div>
              ))}
              {patients.length === 0 && <p className="text-gray-500 text-center py-4">No patients found</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Appointments</CardTitle>
            <CardDescription>Appointments scheduled for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{appointment.patientName}</p>
                    <p className="text-sm text-gray-600">
                      {appointment.type} at {appointment.time}
                    </p>
                  </div>
                  <Badge
                    variant={
                      appointment.status === "Completed"
                        ? "success"
                        : appointment.status === "Cancelled"
                          ? "destructive"
                          : "default"
                    }
                  >
                    {appointment.status}
                  </Badge>
                </div>
              ))}
              {todayAppointments.length === 0 && (
                <p className="text-gray-500 text-center py-4">No appointments today</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
