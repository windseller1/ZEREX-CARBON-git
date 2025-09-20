import * as React from "react"
import { cn } from "@/lib/utils"

interface BarChart3Props extends React.SVGProps<SVGSVGElement> {
  className?: string
}

const BarChart3 = React.forwardRef<SVGSVGElement, BarChart3Props>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      className={cn("", className)}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  )
)
BarChart3.displayName = "BarChart3"

export { BarChart3 }
