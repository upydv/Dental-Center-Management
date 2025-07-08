"use client"

import { useState } from "react"
import { useData } from "../../contexts/DataContext"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Card, CardContent } from "../ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { Badge } from "../ui/badge"
import { Plus, Edit, Trash2, Search, FileText, ImageIcon, Download, X, Upload } from "lucide-react"

const AppointmentManagement = () => {
  const { appointments, patients, addAppointment, updateAppointment, deleteAppointment } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState(null)
  const [formData, setFormData] = useState({
    patientId: "",
    date: "",
    time: "",
    type: "",
    status: "Scheduled",
    notes: "",
    files: [],
  })

  const appointmentTypes = ["Consultation", "Cleaning", "Filling", "Root Canal", "Extraction", "Checkup", "Emergency"]
  const statusOptions = ["Scheduled", "Confirmed", "Completed", "Cancelled"]

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)

    files.forEach((file) => {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`)
        return
      }

      // Check file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]
      if (!allowedTypes.includes(file.type)) {
        alert(`File type ${file.type} is not supported.`)
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const newFile = {
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type,
          size: file.size,
          data: e.target.result,
          uploadDate: new Date().toISOString(),
        }

        setFormData((prev) => ({
          ...prev,
          files: [...prev.files, newFile],
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  const removeFile = (fileId) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((file) => file.id !== fileId),
    }))
  }

  const downloadFile = (file) => {
    const link = document.createElement("a")
    link.href = file.data
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingAppointment) {
      updateAppointment(editingAppointment.id, formData)
    } else {
      addAppointment(formData)
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      patientId: "",
      date: "",
      time: "",
      type: "",
      status: "Scheduled",
      notes: "",
      files: [],
    })
    setEditingAppointment(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment)
    setFormData({
      patientId: appointment.patientId,
      date: appointment.date,
      time: appointment.time,
      type: appointment.type,
      status: appointment.status,
      notes: appointment.notes || "",
      files: appointment.files || [],
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (appointmentId) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      deleteAppointment(appointmentId)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointment Management</h1>
          <p className="text-gray-600">Schedule and manage patient appointments with treatment records</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search appointments by patient name or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <Card key={appointment.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-semibold">{appointment.patientName}</h3>
                    <Badge
                      variant={
                        appointment.status === "Completed"
                          ? "success"
                          : appointment.status === "Cancelled"
                            ? "destructive"
                            : appointment.status === "Confirmed"
                              ? "default"
                              : "outline"
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Date</p>
                      <p className="font-medium">{new Date(appointment.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Time</p>
                      <p className="font-medium">{appointment.time}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Type</p>
                      <p className="font-medium">{appointment.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Created</p>
                      <p className="font-medium">{new Date(appointment.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {appointment.notes && (
                    <div className="mt-3">
                      <p className="text-gray-500 text-sm">Notes</p>
                      <p className="text-sm">{appointment.notes}</p>
                    </div>
                  )}
                  {appointment.files && appointment.files.length > 0 && (
                    <div className="mt-3">
                      <p className="text-gray-500 text-sm mb-2">Treatment Records ({appointment.files.length} files)</p>
                      <div className="flex flex-wrap gap-2">
                        {appointment.files.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md border"
                          >
                            {getFileIcon(file.type)}
                            <span className="text-sm font-medium">{file.name}</span>
                            <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => downloadFile(file)}
                              className="h-6 w-6 p-0"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(appointment)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(appointment.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAppointments.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No appointments found</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAppointment ? "Edit Appointment" : "New Appointment"}</DialogTitle>
            <DialogDescription>
              {editingAppointment
                ? "Update appointment details and treatment records"
                : "Schedule a new appointment and upload treatment records"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="form-group">
                <Label htmlFor="patientId">Patient</Label>
                <Select
                  value={formData.patientId}
                  onValueChange={(value) => setFormData({ ...formData, patientId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name} - {patient.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <Label htmlFor="type">Appointment Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {appointmentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="form-group">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="form-group">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes or instructions..."
                />
              </div>

              {/* File Upload Section */}
              <div className="form-group">
                <Label htmlFor="files">Treatment Records</Label>
                <div className="mt-2">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> treatment records
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, PDF, DOC up to 5MB each</p>
                      </div>
                      <Input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Display uploaded files */}
                  {formData.files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-gray-700">Uploaded Files:</p>
                      {formData.files.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                        >
                          <div className="flex items-center space-x-3">
                            {getFileIcon(file.type)}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{file.name}</p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(file.size)} • Uploaded {new Date(file.uploadDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => downloadFile(file)}
                              className="h-8 w-8 p-0"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(file.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">{editingAppointment ? "Update Appointment" : "Schedule Appointment"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AppointmentManagement
