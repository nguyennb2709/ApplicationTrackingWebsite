import type { ApplicationStatus } from "@/types/job-application";
import { APPLICATION_STATUSES } from "@/types/job-application";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusFilterProps {
  selectedStatus: ApplicationStatus | "all";
  onStatusChange: (status: ApplicationStatus | "all") => void;
  applicationCounts: Record<ApplicationStatus | "all", number>;
}

const getStatusColor = (status: ApplicationStatus): string => {
  switch (status) {
    case "Applied":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Interviewing":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Technical":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "Final Round":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "Offer":
      return "bg-green-100 text-green-800 border-green-200";
    case "Rejected":
      return "bg-red-100 text-red-800 border-red-200";
    case "Withdrawn":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export function StatusFilter({
  selectedStatus,
  onStatusChange,
  applicationCounts,
}: StatusFilterProps) {
  return (
    <div className="space-y-4">
      {/* Mobile Select */}
      <div className="md:hidden">
        <Select
          value={selectedStatus}
          onValueChange={(value: ApplicationStatus | "all") =>
            onStatusChange(value)
          }
        >
          <SelectTrigger className="w-full">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              All Applications ({applicationCounts.all})
            </SelectItem>
            {APPLICATION_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {status} ({applicationCounts[status] || 0})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Filter Buttons */}
      <div className="hidden md:flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Filter className="h-4 w-4" />
          Filter by status:
        </div>

        <Button
          variant={selectedStatus === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => onStatusChange("all")}
          className="gap-2"
        >
          All
          <Badge
            variant="secondary"
            className="ml-1 bg-muted text-muted-foreground"
          >
            {applicationCounts.all}
          </Badge>
        </Button>

        {APPLICATION_STATUSES.map((status) => (
          <Button
            key={status}
            variant={selectedStatus === status ? "default" : "outline"}
            size="sm"
            onClick={() => onStatusChange(status)}
            className={cn(
              "gap-2",
              selectedStatus === status && "ring-2 ring-primary ring-offset-2"
            )}
          >
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                getStatusColor(status).split(" ")[0]
              )}
            />
            {status}
            <Badge
              variant="secondary"
              className="ml-1 bg-muted text-muted-foreground"
            >
              {applicationCounts[status] || 0}
            </Badge>
          </Button>
        ))}

        {selectedStatus !== "all" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onStatusChange("all")}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            Clear filter
          </Button>
        )}
      </div>
    </div>
  );
}
