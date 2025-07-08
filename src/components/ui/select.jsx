"use client"

import React, { useState } from "react"
import { cn } from "../../lib/utils"
import { ChevronDown } from "lucide-react"

const Select = ({ children, value, onValueChange }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      {React.Children.map(children, (child) => React.cloneElement(child, { value, onValueChange, open, setOpen }))}
    </div>
  )
}

const SelectTrigger = React.forwardRef(({ className, children, open, setOpen, ...props }, ref) => (
  <button ref={ref} type="button" className={cn("select", className)} onClick={() => setOpen(!open)} {...props}>
    {children}
    <ChevronDown className="h-4 w-4" />
  </button>
))
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder, value }) => {
  return <span>{value || placeholder}</span>
}

const SelectContent = React.forwardRef(
  ({ className, children, open, value, onValueChange, setOpen, ...props }, ref) => {
    if (!open) return null

    return (
      <div ref={ref} className={cn("select-content", className)} {...props}>
        {React.Children.map(children, (child) => React.cloneElement(child, { value, onValueChange, setOpen }))}
      </div>
    )
  },
)
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef(
  ({ className, children, value: itemValue, value, onValueChange, setOpen, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("select-item", className)}
      onClick={() => {
        onValueChange(itemValue)
        setOpen(false)
      }}
      {...props}
    >
      {children}
    </div>
  ),
)
SelectItem.displayName = "SelectItem"

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }
