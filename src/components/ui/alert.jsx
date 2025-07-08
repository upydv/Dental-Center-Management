import React from "react"
import { cn } from "../../lib/utils"

const Alert = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variantClasses = {
    default: "alert-default",
    destructive: "alert-destructive",
    success: "alert-success",
  }

  return <div ref={ref} className={cn("alert", variantClasses[variant], className)} {...props} />
})
Alert.displayName = "Alert"

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm", className)} {...props} />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertDescription }
