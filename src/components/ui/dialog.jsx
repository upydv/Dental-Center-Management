"use client"

import React from "react"
import { cn } from "../../lib/utils"

const Dialog = ({ children, open, onOpenChange }) => {
  if (!open) return null

  return (
    <div className="dialog-overlay" onClick={() => onOpenChange(false)}>
      {children}
    </div>
  )
}

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("dialog-content", className)} onClick={(e) => e.stopPropagation()} {...props}>
    {children}
  </div>
))
DialogContent.displayName = "DialogContent"

const DialogHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("dialog-header", className)} {...props} />
))
DialogHeader.displayName = "DialogHeader"

// const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
//   <h2 ref={ref} className={cn("dialog-title", className)} {...props} />
// ))

const DialogTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <h2 ref={ref} className={cn("dialog-title", className)} {...props}>
    {children || "Dialog Title"}
  </h2>
));

DialogTitle.displayName = "DialogTitle"

// const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
//   <p ref={ref} className={cn("dialog-description", className)} {...props} />
// ))
const DialogDescription = React.forwardRef(({ className, children, ...props }, ref) => (
  <p ref={ref} className={cn("dialog-description", className)} {...props}>
    {children || "Dialog description goes here."}
  </p>
));

DialogDescription.displayName = "DialogDescription"

const DialogFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("dialog-footer", className)} {...props} />
))
DialogFooter.displayName = "DialogFooter"

export { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle }
