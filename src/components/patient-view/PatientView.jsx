"use client"

import { useAuth } from "../../contexts/AuthContext"
import { useData } from "../../contexts/DataContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Calendar, Clock, FileText, ImageIcon, Download, DollarSign, Stethoscope } from "lucide-react"

const PatientView = () => {
  const { user } = useAuth()
  const { appointments, patients } = useData()

  // Find the current patient's data - ONLY their own data
  const currentPatient = patients.find((p) => p.email === user.email)

  // Filter appointments to show ONLY this patient's appointments
  const myAppointments = appointments.filter((apt) => apt.patientId === currentPatient?.id)

  const upcomingAppointments = myAppointments.filter((apt) => {
    const today = new Date()
    const aptDate = new Date(apt.date)
    return aptDate >= today && (apt.status === "Scheduled" || apt.status === "Confirmed")
  })

  const pastAppointments = myAppointments.filter((apt) => {
    const today = new Date()
    const aptDate = new Date(apt.date)
    return aptDate < today || apt.status === "Completed"
  })

  const getFileIcon = (fileType) => {
    if (fileType.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4" />
    }
    return <FileText className="h-4 w-4" />
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const downloadFile = (file) => {
    const link = document.createElement("a")
    link.href = file.data
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getTotalCost = () => {
    return pastAppointments.filter((apt) => apt.cost).reduce((total, apt) => total + (apt.cost || 0), 0)
  }

  if (!currentPatient) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Appointments</h1>
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Patient record not found. Please contact the clinic.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
        <p className="text-gray-600">
          View your appointment history, upcoming visits, costs, treatments, and file attachments
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pastAppointments.filter((apt) => apt.status === "Completed").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${getTotalCost()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Upcoming Appointments
            </CardTitle>
            <CardDescription>Your scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 border rounded-lg bg-blue-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{appointment.type}</h3>
                    <Badge variant={appointment.status === "Confirmed" ? "success" : "default"}>
                      {appointment.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center text-sm text-blue-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="font-medium">
                        {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                      </span>
                    </div>

                    {appointment.cost && (
                      <div className="flex items-center text-sm text-green-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span className="font-medium">Cost: ${appointment.cost}</span>
                      </div>
                    )}
                  </div>

                  {appointment.treatment && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700">Treatment:</p>
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{appointment.treatment}</p>
                    </div>
                  )}

                  {appointment.notes && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700">Notes:</p>
                      <p className="text-sm text-gray-600">{appointment.notes}</p>
                    </div>
                  )}

                  {appointment.files && appointment.files.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">File Attachments:</p>
                      <div className="flex flex-wrap gap-2">
                        {appointment.files.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center space-x-2 bg-white px-3 py-2 rounded-md border shadow-sm"
                          >
                            {getFileIcon(file.type)}
                            <span className="text-sm font-medium">{file.name}</span>
                            <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => downloadFile(file)}
                              className="h-6 w-6 p-0 hover:bg-blue-100"
                              title="Download file"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Treatment History */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Stethoscope className="h-5 w-5 mr-2" />
            Treatment History
          </CardTitle>
          <CardDescription>Your past appointments, treatments, costs, and file attachments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pastAppointments.length > 0 ? (
              pastAppointments
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((appointment) => (
                  <div key={appointment.id} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{appointment.type}</h3>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="font-medium">
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                        </span>
                      </div>

                      {appointment.cost && (
                        <div className="flex items-center text-sm text-green-600">
                          <DollarSign className="h-4 w-4 mr-2" />
                          <span className="font-medium">Cost: ${appointment.cost}</span>
                        </div>
                      )}
                    </div>

                    {appointment.treatment && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700">Treatment Provided:</p>
                        <p className="text-sm text-gray-600 bg-white p-2 rounded border">{appointment.treatment}</p>
                      </div>
                    )}

                    {appointment.notes && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700">Doctor's Notes:</p>
                        <p className="text-sm text-gray-600">{appointment.notes}</p>
                      </div>
                    )}

                    {appointment.files && appointment.files.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Treatment File Attachments:</p>
                        <div className="flex flex-wrap gap-2">
                          {appointment.files.map((file) => (
                            <div
                              key={file.id}
                              className="flex items-center space-x-2 bg-white px-3 py-2 rounded-md border shadow-sm"
                            >
                              {getFileIcon(file.type)}
                              <span className="text-sm font-medium">{file.name}</span>
                              <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => downloadFile(file)}
                                className="h-6 w-6 p-0 hover:bg-gray-100"
                                title="Download file"
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
            ) : (
              <div className="text-center py-8">
                <Stethoscope className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No treatment history found</p>
                <p className="text-sm text-gray-400">Your completed appointments will appear here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Patient Information */}
      <Card>
        <CardHeader>
          <CardTitle>My Information</CardTitle>
          <CardDescription>Your registered patient information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">{currentPatient.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email Address</p>
              <p className="font-medium">{currentPatient.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-medium">{currentPatient.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-medium">{new Date(currentPatient.dateOfBirth).toLocaleDateString()}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">{currentPatient.address}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Emergency Contact</p>
              <p className="font-medium">{currentPatient.emergencyContact}</p>
            </div>
            {currentPatient.medicalHistory && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Medical History</p>
                <p className="font-medium bg-yellow-50 p-3 rounded border">{currentPatient.medicalHistory}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PatientView
