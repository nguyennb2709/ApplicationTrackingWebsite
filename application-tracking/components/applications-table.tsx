import { useState } from "react";
import type {
  JobApplication,
  ApplicationStatus,
} from "@/types/job-application";
import { APPLICATION_STATUSES } from "@/types/job-application";
import { updateApplication, deleteApplication } from "@/lib/job-applications";
import { EditApplicationForm } from "@/components/edit-application-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Calendar,
  Building,
  User,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ApplicationsTableProps {
  applications: JobApplication[];
  onApplicationUpdated: (application: JobApplication) => void;
  onApplicationDeleted: (id: string) => void;
}

const getStatusColor = (status: ApplicationStatus): string => {
  switch (status) {
    case "Applied":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "Interviewing":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "Technical":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    case "Final Round":
      return "bg-orange-100 text-orange-800 hover:bg-orange-200";
    case "Offer":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "Rejected":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "Withdrawn":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export function ApplicationsTable({
  applications,
  onApplicationUpdated,
  onApplicationDeleted,
}: ApplicationsTableProps) {
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [editingApplication, setEditingApplication] =
    useState<JobApplication | null>(null);

  const handleStatusChange = async (
    applicationId: string,
    newStatus: ApplicationStatus
  ) => {
    const updatedApplication = updateApplication(applicationId, {
      status: newStatus,
    });
    if (updatedApplication) {
      onApplicationUpdated(updatedApplication);
    }
    setEditingStatus(null);
  };

  const handleDelete = async (applicationId: string) => {
    const success = deleteApplication(applicationId);
    if (success) {
      onApplicationDeleted(applicationId);
    }
  };

  const handleEditApplication = (application: JobApplication) => {
    setEditingApplication(application);
    setEditingStatus(null); // Close status editing if open
  };

  const handleApplicationUpdated = (updatedApplication: JobApplication) => {
    onApplicationUpdated(updatedApplication);
    setEditingApplication(null);
  };

  const handleCancelEdit = () => {
    setEditingApplication(null);
  };

  if (editingApplication) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Edit Application</CardTitle>
          <CardDescription>
            Update the details for this job application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditApplicationForm
            application={editingApplication}
            onApplicationUpdated={handleApplicationUpdated}
            onCancel={handleCancelEdit}
          />
        </CardContent>
      </Card>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          No applications yet
        </h3>
        <p className="text-muted-foreground mb-4">
          Get started by adding your first job application.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-muted/50">
            <TableHead className="font-semibold">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Company
              </div>
            </TableHead>
            <TableHead className="font-semibold">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Position
              </div>
            </TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date Applied
              </div>
            </TableHead>
            <TableHead className="font-semibold">Notes</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                {application.company}
              </TableCell>
              <TableCell>{application.position}</TableCell>
              <TableCell>
                {editingStatus === application.id ? (
                  <Select
                    value={application.status}
                    onValueChange={(value: ApplicationStatus) =>
                      handleStatusChange(application.id, value)
                    }
                    onOpenChange={(open) => {
                      if (!open) setEditingStatus(null);
                    }}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {APPLICATION_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge
                    variant="secondary"
                    className={cn(
                      "cursor-pointer transition-colors",
                      getStatusColor(application.status)
                    )}
                    onClick={() => setEditingStatus(application.id)}
                  >
                    {application.status}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(application.dateApplied)}
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-muted-foreground">
                {application.notes || "—"}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleEditApplication(application)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Application
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setEditingStatus(application.id)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Quick Status Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(application.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
