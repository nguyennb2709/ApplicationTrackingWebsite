import { format } from "date-fns";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  APPLICATION_STATUSES,
  type JobApplication,
  type ApplicationStatus,
} from "@/types/job-application";

interface JobApplicationsTableProps {
  applications: JobApplication[];
  onEdit: (application: JobApplication) => void;
  onUpdateStatus: (data: JobApplication) => void;
}

type BadgeVariant = "secondary" | "default" | "destructive" | "outline";

const getStatusColors = (status: ApplicationStatus) => {
  const colors = {
    applied:
      "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200",
    interviewing:
      "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200",
    offer:
      "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200",
    rejected:
      "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200",
    withdrawn:
      "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-200",
  };
  return colors[status] || colors.applied;
};

export function JobApplicationsTable({
  applications,
  onEdit,
  onUpdateStatus,
}: JobApplicationsTableProps) {
  if (applications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No job applications found. Add your first application to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Applied</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell className="font-medium">
                  {application.company}
                </TableCell>
                <TableCell>{application.position}</TableCell>
                <TableCell>
                  <Select
                    value={application.status}
                    onValueChange={(value: ApplicationStatus) => {
                      application.status = value;
                      onUpdateStatus(application);
                    }}
                  >
                    <SelectTrigger
                      className={`w-[150px] h-8 border-0 px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer ${getStatusColors(
                        application.status
                      )}`}
                    >
                      <div className="flex items-center gap-2">
                        <span>
                          {
                            APPLICATION_STATUSES.find(
                              (s) => s.value === application.status
                            )?.label
                          }
                        </span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {APPLICATION_STATUSES.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {format(new Date(application.dateApplied), "MMM dd, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(application)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
