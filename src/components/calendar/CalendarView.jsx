"use client"

import { useState } from "react"
import { useData } from "../../contexts/DataContext"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const CalendarView = () => {
  const { appointments } = useData()
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  const formatDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const getAppointmentsForDate = (year, month, day) => {
    const dateStr = formatDate(year, month, day)
    return appointments.filter((apt) => apt.date === dateStr)
  }

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const today = new Date()

    const days = []
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    // Header row with day names
    dayNames.forEach((day) => {
      days.push(
        <div key={day} className="calendar-day-header text-center font-semibold p-2 bg-gray-50">
          {day}
        </div>,
      )
    })

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day other-month"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year

      const dayAppointments = getAppointmentsForDate(year, month, day)

      days.push(
        <div key={day} className={`calendar-day ${isToday ? "today" : ""}`}>
          <div className={`calendar-day-number ${isToday ? "today" : ""}`}>{day}</div>
          <div className="space-y-1">
            {dayAppointments.slice(0, 3).map((appointment) => (
              <div
                key={appointment.id}
                className={`calendar-appointment ${appointment.status.toLowerCase()}`}
                title={`${appointment.patientName} - ${appointment.type} at ${appointment.time}`}
              >
                {appointment.time} - {appointment.patientName}
              </div>
            ))}
            {dayAppointments.length > 3 && (
              <div className="text-xs text-gray-500 px-1">+{dayAppointments.length - 3} more</div>
            )}
          </div>
        </div>,
      )
    }

    return days
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar View</h1>
          <p className="text-gray-600">View appointments in calendar format</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth(-1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateMonth(1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="calendar-grid">{renderCalendarDays()}</div>

          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-200 rounded"></div>
              <span className="text-sm">Scheduled</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-200 rounded"></div>
              <span className="text-sm">Completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-200 rounded"></div>
              <span className="text-sm">Cancelled</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Appointments Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {appointments.filter((apt) => apt.status === "Scheduled" || apt.status === "Confirmed").length}
              </div>
              <div className="text-sm text-gray-600">Scheduled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {appointments.filter((apt) => apt.status === "Completed").length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {appointments.filter((apt) => apt.status === "Cancelled").length}
              </div>
              <div className="text-sm text-gray-600">Cancelled</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CalendarView
