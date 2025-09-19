import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showToast } from "@/components/simple-toast";
import {
  APPLICATION_STATUSES,
  type JobApplication,
  type ApplicationStatus,
} from "@/types/job-application";

//
// 🔑 Discriminated union for props
//
interface BaseProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AddProps extends BaseProps {
  mode: "add";
  onSubmit: (
    data: Omit<JobApplication, "id" | "createdAt" | "updatedAt" | "dateApplied">
  ) => Promise<JobApplication>;
  application?: never;
}

interface EditProps extends BaseProps {
  mode: "edit";
  onSubmit: (application: JobApplication) => Promise<JobApplication>;
  application: JobApplication;
}

export type ApplicationModalProps = AddProps | EditProps;

export function ApplicationModal(props: ApplicationModalProps) {
  const { mode, isOpen, onClose } = props;

  const [formData, setFormData] = useState({
    company: "",
    position: "",
    status: "applied" as ApplicationStatus,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  //
  // 🔄 Pre-fill in edit mode
  //
  useEffect(() => {
    if (mode === "edit" && props.application) {
      setFormData({
        company: props.application.company,
        position: props.application.position,
        status: props.application.status,
      });
    } else {
      setFormData({ company: "", position: "", status: "applied" });
    }
  }, [mode, props]);

  //
  // 📝 Handle submit
  //
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.company.trim() || !formData.position.trim()) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "add") {
        await props.onSubmit({
          company: formData.company.trim(),
          position: formData.position.trim(),
          status: "applied",
        });
        showToast("Application added successfully.", "success");
      } else {
        await props.onSubmit({
          ...props.application,
          company: formData.company.trim(),
          position: formData.position.trim(),
          status: formData.status,
        });
        showToast("Application updated successfully.", "success");
      }
      onClose();
    } catch (error) {
      showToast(
        mode === "add"
          ? "Failed to add application."
          : "Failed to update application.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Application" : "Add New Application"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Make changes to your job application details here."
              : "Record a new job application to track your progress."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                placeholder="e.g., Google, Microsoft, Apple"
                value={formData.company}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, company: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                placeholder="e.g., Software Engineer, Product Manager"
                value={formData.position}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, position: e.target.value }))
                }
                required
              />
            </div>

            {mode === "edit" && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: ApplicationStatus) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {APPLICATION_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? mode === "edit"
                  ? "Saving..."
                  : "Adding..."
                : mode === "edit"
                ? "Save Changes"
                : "Add Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
