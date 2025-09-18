import type { ApplicationStatus } from "@/types/job-application"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: ApplicationStatus
  className?: string
}

const getStatusColor = (status: ApplicationStatus): string => {
  switch (status) {
    case "Applied":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "Interviewing":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Technical":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "Final Round":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "Offer":
      return "bg-green-100 text-green-800 border-green-200"
    case "Rejected":
      return "bg-red-100 text-red-800 border-red-200"
    case "Withdrawn":
      return "bg-gray-100 text-gray-800 border-gray-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn(getStatusColor(status), className)}>
      {status}
    </Badge>
  )
}
