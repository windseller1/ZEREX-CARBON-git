import * as React from "react"
import { cn } from "@/lib/utils"

interface Share2Props extends React.SVGProps<SVGSVGElement> {
  className?: string
}

const Share2 = React.forwardRef<SVGSVGElement, Share2Props>(
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
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
    </svg>
  )
)
Share2.displayName = "Share2"

export { Share2 }
