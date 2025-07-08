import React from "react"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, variant = "primary", size = "default", ...props }, ref) => {
  const baseClasses = "btn"
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "btn-outline",
    destructive: "btn-destructive",
    ghost: "btn-ghost",
  }
  const sizeClasses = {
    default: "",
    sm: "btn-sm",
    icon: "btn-icon",
  }

  return (
    <button className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)} ref={ref} {...props} />
  )
})

Button.displayName = "Button"

export { Button }
