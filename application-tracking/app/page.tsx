import { useState, useEffect, useMemo } from "react";
import type {
  JobApplication,
  ApplicationStatus,
} from "@/types/job-application";
import { APPLICATION_STATUSES } from "@/types/job-application";
import { getApplications } from "@/lib/job-applications";
import { ApplicationsTable } from "@/components/applications-table";
import { AddApplicationForm } from "@/components/add-application-form";
import { ApplicationsStats } from "@/components/applications-stats";
import { StatusFilter } from "@/components/status-filter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Briefcase, Search, SortAsc, SortDesc } from "lucide-react";

type SortField = "company" | "position" | "dateApplied" | "status";
type SortOrder = "asc" | "desc";

export default function HomePage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">(
    "all"
  );
  const [sortField, setSortField] = useState<SortField>("dateApplied");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  useEffect(() => {
    const loadApplications = () => {
      const apps = getApplications();
      setApplications(apps);
      setIsLoading(false);
    };

    loadApplications();
  }, []);

  // Filter and sort applications
  const filteredAndSortedApplications = useMemo(() => {
    let filtered = applications;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.company.toLowerCase().includes(query) ||
          app.position.toLowerCase().includes(query) ||
          (app.notes && app.notes.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case "company":
          aValue = a.company.toLowerCase();
          bValue = b.company.toLowerCase();
          break;
        case "position":
          aValue = a.position.toLowerCase();
          bValue = b.position.toLowerCase();
          break;
        case "dateApplied":
          aValue = new Date(a.dateApplied).getTime();
          bValue = new Date(b.dateApplied).getTime();
          break;
        case "status":
          aValue = APPLICATION_STATUSES.indexOf(a.status);
          bValue = APPLICATION_STATUSES.indexOf(b.status);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [applications, searchQuery, statusFilter, sortField, sortOrder]);

  // Calculate application counts for filter
  const applicationCounts = useMemo(() => {
    const counts: Record<ApplicationStatus | "all", number> = {
      all: applications.length,
    };

    APPLICATION_STATUSES.forEach((status) => {
      counts[status] = applications.filter(
        (app) => app.status === status
      ).length;
    });

    return counts;
  }, [applications]);

  const handleApplicationAdded = (newApplication: JobApplication) => {
    setApplications((prev) => [...prev, newApplication]);
    setShowAddForm(false);
  };

  const handleApplicationUpdated = (updatedApplication: JobApplication) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === updatedApplication.id ? updatedApplication : app
      )
    );
  };

  const handleApplicationDeleted = (deletedId: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== deletedId));
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Briefcase className="h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-balance">
              Job Application Tracker
            </h1>
          </div>
          <p className="text-muted-foreground text-pretty">
            Keep track of your job applications and stay organized in your job
            search.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <ApplicationsStats applications={applications} />
        </div>

        {/* Add Application Form */}
        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Application</CardTitle>
              <CardDescription>
                Fill in the details for your new job application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AddApplicationForm
                onApplicationAdded={handleApplicationAdded}
                onCancel={() => setShowAddForm(false)}
              />
            </CardContent>
          </Card>
        )}

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Applications</CardTitle>
                <CardDescription>
                  {filteredAndSortedApplications.length} of{" "}
                  {applications.length} applications
                  {searchQuery && ` matching "${searchQuery}"`}
                  {statusFilter !== "all" && ` with status "${statusFilter}"`}
                </CardDescription>
              </div>
              <Button
                onClick={() => setShowAddForm(true)}
                className="gap-2"
                disabled={showAddForm}
              >
                <Plus className="h-4 w-4" />
                Add Application
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Filters and Search */}
            <div className="space-y-4">
              {/* Search and Sort */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search companies, positions, or notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select
                    value={`${sortField}-${sortOrder}`}
                    onValueChange={(value) => {
                      const [field, order] = value.split("-") as [
                        SortField,
                        SortOrder
                      ];
                      setSortField(field);
                      setSortOrder(order);
                    }}
                  >
                    <SelectTrigger className="w-[200px]">
                      <div className="flex items-center gap-2">
                        {sortOrder === "asc" ? (
                          <SortAsc className="h-4 w-4" />
                        ) : (
                          <SortDesc className="h-4 w-4" />
                        )}
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dateApplied-desc">
                        Newest First
                      </SelectItem>
                      <SelectItem value="dateApplied-asc">
                        Oldest First
                      </SelectItem>
                      <SelectItem value="company-asc">Company A-Z</SelectItem>
                      <SelectItem value="company-desc">Company Z-A</SelectItem>
                      <SelectItem value="position-asc">Position A-Z</SelectItem>
                      <SelectItem value="position-desc">
                        Position Z-A
                      </SelectItem>
                      <SelectItem value="status-asc">Status A-Z</SelectItem>
                      <SelectItem value="status-desc">Status Z-A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Status Filter */}
              <StatusFilter
                selectedStatus={statusFilter}
                onStatusChange={setStatusFilter}
                applicationCounts={applicationCounts}
              />
            </div>

            {/* Applications Table */}
            <ApplicationsTable
              applications={filteredAndSortedApplications}
              onApplicationUpdated={handleApplicationUpdated}
              onApplicationDeleted={handleApplicationDeleted}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
