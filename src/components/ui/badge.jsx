import React from "react"
import { cn } from "../../lib/utils"

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variantClasses = {
    default: "badge-default",
    success: "badge-success",
    warning: "badge-warning",
    destructive: "badge-destructive",
    outline: "badge-outline",
    error: "badge-error",
  }

  return <div ref={ref} className={cn("badge", variantClasses[variant], className)} {...props} />
})

Badge.displayName = "Badge"

export { Badge }
