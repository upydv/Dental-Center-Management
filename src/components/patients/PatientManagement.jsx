"use client"

import { useState } from "react"
import { useData } from "../../contexts/DataContext"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Textarea } from "../ui/textarea"
import { Badge } from "../ui/badge"
import { Plus, Edit, Trash2, Search, Upload, X, FileText, ImageIcon, Download, Eye } from "lucide-react"

const PatientManagement = () => {
  const { patients, addPatient, updatePatient, deletePatient, appointments, updateAppointment } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isFilesDialogOpen, setIsFilesDialogOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState(null)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [uploadingFiles, setUploadingFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    emergencyContact: "",
    medicalHistory: "",
  })

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm),
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingPatient) {
      updatePatient(editingPatient.id, formData)
    } else {
      addPatient(formData)
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      address: "",
      emergencyContact: "",
      medicalHistory: "",
    })
    setEditingPatient(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (patient) => {
    setEditingPatient(patient)
    setFormData({
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      dateOfBirth: patient.dateOfBirth,
      address: patient.address,
      emergencyContact: patient.emergencyContact,
      medicalHistory: patient.medicalHistory,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (patientId) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      deletePatient(patientId)
    }
  }

  const handleViewFiles = (patient) => {
    setSelectedPatient(patient)
    setIsFilesDialogOpen(true)
  }

  const getPatientAppointments = (patientId) => {
    return appointments.filter((apt) => apt.patientId === patientId)
  }

  const getAllPatientFiles = (patientId) => {
    const patientAppointments = getPatientAppointments(patientId)
    const allFiles = []
    patientAppointments.forEach((apt) => {
      if (apt.files && apt.files.length > 0) {
        apt.files.forEach((file) => {
          allFiles.push({
            ...file,
            appointmentId: apt.id,
            appointmentType: apt.type,
            appointmentDate: apt.date,
          })
        })
      }
    })
    return allFiles.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
  }

  const handleFileUpload = (files) => {
    const validFiles = []
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    Array.from(files).forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert(`File type ${file.type} is not supported`)
        return
      }
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 5MB`)
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const fileData = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          data: e.target.result,
          uploadDate: new Date().toISOString(),
        }
        setUploadingFiles((prev) => [...prev, fileData])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const removeUploadingFile = (fileId) => {
    setUploadingFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const saveFilesToPatient = () => {
    if (uploadingFiles.length === 0) {
      alert("Please select files to upload")
      return
    }

    // Create a new appointment for the files or add to existing one
    const patientAppointments = getPatientAppointments(selectedPatient.id)
    const today = new Date().toISOString().split("T")[0]

    // Find today's appointment or create a new one
    const targetAppointment = patientAppointments.find((apt) => apt.date === today && apt.type === "File Upload")

    if (!targetAppointment) {
      // Create new appointment for file upload
      const newAppointment = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        date: today,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "File Upload",
        status: "Completed",
        notes: "Treatment records uploaded",
        files: uploadingFiles,
        createdAt: new Date().toISOString(),
      }

      // Add the new appointment (this would need to be added to DataContext)
      // For now, we'll update an existing appointment or create a simple file record
      const updatedAppointments = [...appointments, newAppointment]
      localStorage.setItem("dental_appointments", JSON.stringify(updatedAppointments))
    } else {
      // Add files to existing appointment
      const updatedFiles = [...(targetAppointment.files || []), ...uploadingFiles]
      updateAppointment(targetAppointment.id, { files: updatedFiles })
    }

    setUploadingFiles([])
    alert("Files uploaded successfully!")
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
      return <ImageIcon className="h-4 w-4 text-blue-500" />
    }
    return <FileText className="h-4 w-4 text-gray-500" />
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getPatientStats = (patientId) => {
    const patientAppointments = getPatientAppointments(patientId)
    const completed = patientAppointments.filter((apt) => apt.status === "Completed").length
    const scheduled = patientAppointments.filter(
      (apt) => apt.status === "Scheduled" || apt.status === "Confirmed",
    ).length
    const totalFiles = getAllPatientFiles(patientId).length
    return { completed, scheduled, totalFiles }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-gray-600">Manage patient records, appointments, and treatment files</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Patient
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search patients by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => {
          const stats = getPatientStats(patient.id)
          return (
            <Card key={patient.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{patient.name}</span>
                  <div className="flex space-x-1">
                    <Button variant="outline" size="sm" onClick={() => handleViewFiles(patient)} title="View Files">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(patient)} title="Edit Patient">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(patient.id)}
                      title="Delete Patient"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>{patient.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Phone:</strong> {patient.phone}
                  </p>
                  <p>
                    <strong>DOB:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Address:</strong> {patient.address}
                  </p>
                  <p>
                    <strong>Emergency:</strong> {patient.emergencyContact}
                  </p>
                  {patient.medicalHistory && (
                    <p>
                      <strong>Medical History:</strong> {patient.medicalHistory}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="outline">{stats.completed} Completed</Badge>
                    <Badge variant="outline">{stats.scheduled} Scheduled</Badge>
                    <Badge variant="outline">{stats.totalFiles} Files</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredPatients.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No patients found</p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Patient Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPatient ? "Edit Patient" : "Add New Patient"}</DialogTitle>
            <DialogDescription>
              {editingPatient ? "Update patient information" : "Enter patient details to create a new record"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="form-row">
                <div className="form-group">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  placeholder="Name - Phone Number"
                  required
                />
              </div>
              <div className="form-group">
                <Label htmlFor="medicalHistory">Medical History</Label>
                <Textarea
                  id="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                  placeholder="Allergies, medications, previous treatments..."
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">{editingPatient ? "Update Patient" : "Add Patient"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Patient Files Dialog */}
      <Dialog open={isFilesDialogOpen} onOpenChange={setIsFilesDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Treatment Files - {selectedPatient?.name}</DialogTitle>
            <DialogDescription>
              Upload and manage treatment records, X-rays, and other medical documents
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* File Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div
                className={`text-center ${dragActive ? "border-blue-500 bg-blue-50" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">Upload Treatment Files</p>
                <p className="text-sm text-gray-600 mb-4">Drag and drop files here, or click to select files</p>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <Button type="button" variant="outline" onClick={() => document.getElementById("file-upload").click()}>
                  Select Files
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Supported: Images (PNG, JPG, GIF), PDF, Word documents. Max 5MB per file.
                </p>
              </div>

              {/* Uploading Files Preview */}
              {uploadingFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Files to Upload:</h4>
                  <div className="space-y-2">
                    {uploadingFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file.type)}
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeUploadingFile(file.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setUploadingFiles([])}>
                      Clear All
                    </Button>
                    <Button onClick={saveFilesToPatient}>Upload Files</Button>
                  </div>
                </div>
              )}
            </div>

            {/* Existing Files */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Treatment Records</h4>
              {selectedPatient && (
                <div className="space-y-4">
                  {getAllPatientFiles(selectedPatient.id).length > 0 ? (
                    getAllPatientFiles(selectedPatient.id).map((file) => (
                      <div key={file.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-md">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file.type)}
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)} • {file.appointmentType} •{" "}
                              {new Date(file.appointmentDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => downloadFile(file)}>
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No treatment files found</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFilesDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PatientManagement
