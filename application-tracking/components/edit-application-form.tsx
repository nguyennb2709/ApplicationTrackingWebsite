import type React from "react";

import { useState } from "react";
import type {
  JobApplication,
  ApplicationStatus,
} from "@/types/job-application";
import { APPLICATION_STATUSES } from "@/types/job-application";
import { updateApplication } from "@/lib/job-applications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building, User, Calendar, FileText, Save, X } from "lucide-react";

interface EditApplicationFormProps {
  application: JobApplication;
  onApplicationUpdated: (application: JobApplication) => void;
  onCancel: () => void;
}

interface FormData {
  company: string;
  position: string;
  status: ApplicationStatus;
  dateApplied: string;
  notes: string;
}

export function EditApplicationForm({
  application,
  onApplicationUpdated,
  onCancel,
}: EditApplicationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    company: application.company,
    position: application.position,
    status: application.status,
    dateApplied: application.dateApplied,
    notes: application.notes || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
    }

    if (!formData.position.trim()) {
      newErrors.position = "Position is required";
    }

    if (!formData.dateApplied) {
      newErrors.dateApplied = "Date applied is required";
    } else {
      const selectedDate = new Date(formData.dateApplied);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today

      if (selectedDate > today) {
        newErrors.dateApplied = "Date cannot be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedApplication = updateApplication(application.id, {
        company: formData.company.trim(),
        position: formData.position.trim(),
        status: formData.status,
        dateApplied: formData.dateApplied,
        notes: formData.notes.trim() || undefined,
      });

      if (updatedApplication) {
        onApplicationUpdated(updatedApplication);
      }
    } catch (error) {
      console.error("Failed to update application:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company */}
        <div className="space-y-2">
          <Label
            htmlFor="company"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <Building className="h-4 w-4" />
            Company Name *
          </Label>
          <Input
            id="company"
            type="text"
            placeholder="e.g., Google, Microsoft, Apple"
            value={formData.company}
            onChange={(e) => handleInputChange("company", e.target.value)}
            className={
              errors.company
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.company && (
            <p className="text-sm text-destructive">{errors.company}</p>
          )}
        </div>

        {/* Position */}
        <div className="space-y-2">
          <Label
            htmlFor="position"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <User className="h-4 w-4" />
            Position *
          </Label>
          <Input
            id="position"
            type="text"
            placeholder="e.g., Software Engineer, Product Manager"
            value={formData.position}
            onChange={(e) => handleInputChange("position", e.target.value)}
            className={
              errors.position
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.position && (
            <p className="text-sm text-destructive">{errors.position}</p>
          )}
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm font-medium">
            Status
          </Label>
          <Select
            value={formData.status}
            onValueChange={(value: ApplicationStatus) =>
              handleInputChange("status", value)
            }
          >
            <SelectTrigger>
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
        </div>

        {/* Date Applied */}
        <div className="space-y-2">
          <Label
            htmlFor="dateApplied"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <Calendar className="h-4 w-4" />
            Date Applied *
          </Label>
          <Input
            id="dateApplied"
            type="date"
            value={formData.dateApplied}
            onChange={(e) => handleInputChange("dateApplied", e.target.value)}
            max={new Date().toISOString().split("T")[0]} // Prevent future dates
            className={
              errors.dateApplied
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.dateApplied && (
            <p className="text-sm text-destructive">{errors.dateApplied}</p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label
          htmlFor="notes"
          className="flex items-center gap-2 text-sm font-medium"
        >
          <FileText className="h-4 w-4" />
          Notes (Optional)
        </Label>
        <Textarea
          id="notes"
          placeholder="Add any additional notes about this application..."
          value={formData.notes}
          onChange={(e) => handleInputChange("notes", e.target.value)}
          rows={3}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">
          You can include details like how you found the job, referrals, or
          interview notes.
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex items-center gap-3 pt-4 border-t">
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="gap-2 bg-transparent"
        >
          <X className="h-4 w-4" />
          Cancel
        </Button>
      </div>
    </form>
  );
}
