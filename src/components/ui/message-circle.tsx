import * as React from "react"
import { cn } from "@/lib/utils"

interface MessageCircleProps extends React.SVGProps<SVGSVGElement> {
  className?: string
}

const MessageCircle = React.forwardRef<SVGSVGElement, MessageCircleProps>(
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
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  )
)
MessageCircle.displayName = "MessageCircle"

export { MessageCircle }
