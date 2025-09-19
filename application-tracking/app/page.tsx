"use client";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { JobApplicationsTable } from "@/components/job-applications-table";
import { ApplicationModal } from "@/components/application-modal";
import { useJobApplicationStore } from "@/stores/store";
import type { JobApplication } from "@/types/job-application";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pagination } from "@/components/pagination";

export default function JobTrackerPage() {
  const {
    applications,
    addApplication,
    updateApplication,
    totalPages,
    currentPage,
    fetchApplication,
  } = useJobApplicationStore();

  const [editingApplication, setEditingApplication] =
    useState<JobApplication | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-balance">
          Job Application Tracker
        </h1>
        <p className="text-muted-foreground mt-2">
          Keep track of your job applications and their current status
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Applications</CardTitle>
              <CardDescription className="mt-2">
                View and manage your job applications
              </CardDescription>
            </div>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Application
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <JobApplicationsTable
            applications={applications}
            onEdit={setEditingApplication}
            onUpdateStatus={updateApplication}
          />
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="mt-8 sm:mt-12 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={fetchApplication}
          />
        </div>
      )}

      {/* Add Mode */}
      <ApplicationModal
        mode="add"
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={addApplication}
      />

      {/* Edit Mode */}
      {editingApplication && (
        <ApplicationModal
          mode="edit"
          isOpen={!!editingApplication}
          application={editingApplication}
          onClose={() => setEditingApplication(null)}
          onSubmit={updateApplication}
        />
      )}
    </div>
  );
}
