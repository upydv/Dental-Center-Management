"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Patient {
  id: string
  name: string
  dob: string
  contact: string
  healthInfo: string
  email?: string
}

export interface FileAttachment {
  name: string
  url: string
  type: string
}

export interface Incident {
  id: string
  patientId: string
  title: string
  description: string
  comments: string
  appointmentDate: string
  cost?: number
  treatment?: string
  status: "Scheduled" | "Completed" | "Cancelled"
  nextDate?: string
  files: FileAttachment[]
}

interface DataContextType {
  patients: Patient[]
  incidents: Incident[]
  addPatient: (patient: Omit<Patient, "id">) => void
  updatePatient: (id: string, patient: Partial<Patient>) => void
  deletePatient: (id: string) => void
  addIncident: (incident: Omit<Incident, "id">) => void
  updateIncident: (id: string, incident: Partial<Incident>) => void
  deleteIncident: (id: string) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

const INITIAL_DATA = {
  patients: [
    {
      id: "p1",
      name: "John Doe",
      dob: "1990-05-10",
      contact: "1234567890",
      healthInfo: "No allergies",
      email: "john@entnt.in",
    },
    {
      id: "p2",
      name: "Jane Smith",
      dob: "1985-08-15",
      contact: "0987654321",
      healthInfo: "Allergic to penicillin",
      email: "jane@entnt.in",
    },
  ],
  incidents: [
    {
      id: "i1",
      patientId: "p1",
      title: "Toothache",
      description: "Upper molar pain",
      comments: "Sensitive to cold",
      appointmentDate: "2025-01-15T10:00:00",
      cost: 80,
      treatment: "Root canal treatment",
      status: "Completed" as const,
      files: [],
    },
    {
      id: "i2",
      patientId: "p1",
      title: "Regular Checkup",
      description: "Routine dental examination",
      comments: "Good oral hygiene",
      appointmentDate: "2025-01-20T14:00:00",
      status: "Scheduled" as const,
      files: [],
    },
    {
      id: "i3",
      patientId: "p2",
      title: "Teeth Cleaning",
      description: "Professional dental cleaning",
      comments: "Plaque buildup",
      appointmentDate: "2025-01-18T09:00:00",
      cost: 60,
      treatment: "Deep cleaning",
      status: "Completed" as const,
      files: [],
    },
  ],
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])

  useEffect(() => {
    const savedPatients = localStorage.getItem("dental_patients")
    const savedIncidents = localStorage.getItem("dental_incidents")

    if (savedPatients) {
      setPatients(JSON.parse(savedPatients))
    } else {
      setPatients(INITIAL_DATA.patients)
      localStorage.setItem("dental_patients", JSON.stringify(INITIAL_DATA.patients))
    }

    if (savedIncidents) {
      setIncidents(JSON.parse(savedIncidents))
    } else {
      setIncidents(INITIAL_DATA.incidents)
      localStorage.setItem("dental_incidents", JSON.stringify(INITIAL_DATA.incidents))
    }
  }, [])

  const addPatient = (patient: Omit<Patient, "id">) => {
    const newPatient = { ...patient, id: `p${Date.now()}` }
    const updatedPatients = [...patients, newPatient]
    setPatients(updatedPatients)
    localStorage.setItem("dental_patients", JSON.stringify(updatedPatients))
  }

  const updatePatient = (id: string, patientUpdate: Partial<Patient>) => {
    const updatedPatients = patients.map((p) => (p.id === id ? { ...p, ...patientUpdate } : p))
    setPatients(updatedPatients)
    localStorage.setItem("dental_patients", JSON.stringify(updatedPatients))
  }

  const deletePatient = (id: string) => {
    const updatedPatients = patients.filter((p) => p.id !== id)
    const updatedIncidents = incidents.filter((i) => i.patientId !== id)
    setPatients(updatedPatients)
    setIncidents(updatedIncidents)
    localStorage.setItem("dental_patients", JSON.stringify(updatedPatients))
    localStorage.setItem("dental_incidents", JSON.stringify(updatedIncidents))
  }

  const addIncident = (incident: Omit<Incident, "id">) => {
    const newIncident = { ...incident, id: `i${Date.now()}` }
    const updatedIncidents = [...incidents, newIncident]
    setIncidents(updatedIncidents)
    localStorage.setItem("dental_incidents", JSON.stringify(updatedIncidents))
  }

  const updateIncident = (id: string, incidentUpdate: Partial<Incident>) => {
    const updatedIncidents = incidents.map((i) => (i.id === id ? { ...i, ...incidentUpdate } : i))
    setIncidents(updatedIncidents)
    localStorage.setItem("dental_incidents", JSON.stringify(updatedIncidents))
  }

  const deleteIncident = (id: string) => {
    const updatedIncidents = incidents.filter((i) => i.id !== id)
    setIncidents(updatedIncidents)
    localStorage.setItem("dental_incidents", JSON.stringify(updatedIncidents))
  }

  return (
    <DataContext.Provider
      value={{
        patients,
        incidents,
        addPatient,
        updatePatient,
        deletePatient,
        addIncident,
        updateIncident,
        deleteIncident,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
