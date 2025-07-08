import React from "react"
import { cn } from "../../lib/utils"

const Label = React.forwardRef(({ className, ...props }, ref) => {
  return <label ref={ref} className={cn("label", className)} {...props} />
})

Label.displayName = "Label"

export { Label }
