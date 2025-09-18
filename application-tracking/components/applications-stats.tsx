import type { JobApplication } from "@/types/job-application";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, Users, Calendar } from "lucide-react";

interface ApplicationsStatsProps {
  applications: JobApplication[];
}

export function ApplicationsStats({ applications }: ApplicationsStatsProps) {
  const totalApplications = applications.length;
  const interviewingCount = applications.filter((app) =>
    ["Interviewing", "Technical", "Final Round"].includes(app.status)
  ).length;
  const offersCount = applications.filter(
    (app) => app.status === "Offer"
  ).length;
  const rejectedCount = applications.filter(
    (app) => app.status === "Rejected"
  ).length;
  const pendingCount = applications.filter(
    (app) => app.status === "Applied"
  ).length;

  // Calculate success rate (offers / total non-pending applications)
  const nonPendingCount = totalApplications - pendingCount;
  const successRate =
    nonPendingCount > 0 ? (offersCount / nonPendingCount) * 100 : 0;

  // Calculate interview rate (interviewing + offers / total applications)
  const interviewRate =
    totalApplications > 0
      ? ((interviewingCount + offersCount) / totalApplications) * 100
      : 0;

  // Recent activity (applications in last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentApplications = applications.filter(
    (app) => new Date(app.dateApplied) >= thirtyDaysAgo
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Applications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Applications
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {totalApplications}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {recentApplications} in last 30 days
          </p>
        </CardContent>
      </Card>

      {/* Active Interviews */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Active Interviews
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {interviewingCount}
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Interview Rate</span>
              <span>{interviewRate.toFixed(1)}%</span>
            </div>
            <Progress value={interviewRate} className="h-1" />
          </div>
        </CardContent>
      </Card>

      {/* Offers Received */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Offers Received
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{offersCount}</div>
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Success Rate</span>
              <span>{successRate.toFixed(1)}%</span>
            </div>
            <Progress value={successRate} className="h-1" />
          </div>
        </CardContent>
      </Card>

      {/* Pending Applications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Pending Response
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {pendingCount}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {rejectedCount} rejected
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
