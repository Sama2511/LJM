"use client";

import { useEffect, useState } from "react";
import AdminProfile from "../components/AdminProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Users, FileText, CalendarPlus } from "lucide-react";
import {
  FetchDashboardStats,
  FetchRecentApplications,
  FetchUpcomingEvents,
  type DashboardStats,
  type RecentApplication,
  type UpcomingEvent,
} from "@/actions/dashboard";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [applications, setApplications] = useState<RecentApplication[]>([]);
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      const [statsData, applicationsData, eventsData] = await Promise.all([
        FetchDashboardStats(),
        FetchRecentApplications(),
        FetchUpcomingEvents(),
      ]);

      setStats(statsData);
      setApplications(applicationsData);
      setEvents(eventsData);
      setLoading(false);
    }

    loadDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-accent/20 text-accent-foreground";
      case "approved":
        return "bg-secondary/30 text-secondary-foreground";
      case "rejected":
        return "bg-destructive/20 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="w-full p-4 md:p-6">
        <AdminProfile pageName="Dashboard" />
        <div className="mt-4 grid grid-cols-2 gap-3 md:mt-6 md:grid-cols-3 md:gap-4 lg:grid-cols-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-24 md:h-28" />
          ))}
        </div>
        <div className="mt-4 grid gap-4 md:mt-6 lg:grid-cols-3">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-5 pr-5 pb-10">
      <AdminProfile pageName="Dashboard" />

      {/* Stats Cards */}
      <div className="mt-4 grid grid-cols-2 gap-3 md:mt-6 md:grid-cols-3 md:gap-4 lg:grid-cols-6">
        <Card className="bg-muted border-accent-foreground">
          <CardContent className="p-3 md:p-4">
            <p className="text-xl font-bold md:text-2xl">
              {stats?.totalEvents}
            </p>
            <p className="text-muted-foreground text-xs md:text-sm">
              Total Events
            </p>
          </CardContent>
        </Card>

        <Card className="bg-muted border-accent-foreground">
          <CardContent className="p-3 md:p-4">
            <p className="text-xl font-bold md:text-2xl">
              {stats?.upcomingEvents}
            </p>
            <p className="text-muted-foreground text-xs md:text-sm">
              Upcoming Events
            </p>
          </CardContent>
        </Card>

        <Card className="bg-muted border-accent-foreground">
          <CardContent className="p-3 md:p-4">
            <p className="text-xl font-bold md:text-2xl">
              {stats?.totalVolunteers}
            </p>
            <p className="text-muted-foreground text-xs md:text-sm">
              Volunteers
            </p>
          </CardContent>
        </Card>

        <Card className="bg-muted border-accent-foreground">
          <CardContent className="p-3 md:p-4">
            <p className="text-xl font-bold md:text-2xl">
              {stats?.pendingApplications}
            </p>
            <p className="text-muted-foreground text-xs md:text-sm">Pending</p>
          </CardContent>
        </Card>

        <Card className="bg-muted border-accent-foreground">
          <CardContent className="p-3 md:p-4">
            <p className="text-xl font-bold md:text-2xl">
              {stats?.totalArticles}
            </p>
            <p className="text-muted-foreground text-xs md:text-sm">Articles</p>
          </CardContent>
        </Card>

        <Card className="bg-muted border-accent-foreground">
          <CardContent className="p-3 md:p-4">
            <p className="text-xl font-bold md:text-2xl">
              {stats?.totalDocuments}
            </p>
            <p className="text-muted-foreground text-xs md:text-sm">
              Documents
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 flex flex-wrap gap-2 md:mt-6 md:gap-3">
        <Link href="/dashboard/EventManagement">
          <Button size="sm" variant="outline">
            <CalendarPlus className="mr-1 h-3 w-3 md:mr-2 md:h-4 md:w-4" />
            New Event
          </Button>
        </Link>
        <Link href="/dashboard/ArticleManagement">
          <Button size="sm" variant="outline" className="text-xs md:text-sm">
            <FileText className="mr-1 h-3 w-3 md:mr-2 md:h-4 md:w-4" />
            New Article
          </Button>
        </Link>
        <Link href="/dashboard/CrewApplication">
          <Button size="sm" variant="outline" className="text-xs md:text-sm">
            <Users className="mr-1 h-3 w-3 md:mr-2 md:h-4 md:w-4" />
            Applications
          </Button>
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="mt-4 grid gap-4 md:mt-6 lg:grid-cols-3">
        {/* Upcoming Events */}
        <Card className="bg-muted border-accent-foreground lg:col-span-2">
          <CardHeader className="pb-2 md:pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base md:text-lg">
                Upcoming Events
              </CardTitle>
              <Link href="/dashboard/EventManagement">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
            {events.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center text-sm">
                No upcoming events
              </p>
            ) : (
              <div className="space-y-2 md:space-y-3">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between rounded-lg border p-2 md:p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium md:text-base">
                        {event.title}
                      </p>
                      <p className="text-muted-foreground text-xs md:text-sm">
                        {formatDate(event.date)} • {event.time}
                      </p>
                    </div>
                    <div className="ml-2 text-right">
                      <p className="text-sm font-semibold md:text-base">
                        {event.current_signups}/{event.capacity}
                      </p>
                      <p className="text-muted-foreground text-xs">signups</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card className="bg-muted border-accent-foreground">
          <CardHeader className="pb-2 md:pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base md:text-lg">
                Recent Applications
              </CardTitle>
              <Link href="/dashboard/CrewApplication">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
            {applications.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center text-sm">
                No recent applications
              </p>
            ) : (
              <div className="space-y-2 md:space-y-3">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between rounded-lg border p-2 md:p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {app.firstname} {app.lastname}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {formatTimeAgo(app.created_at)}
                      </p>
                    </div>
                    <Badge
                      className={`ml-2 text-xs capitalize ${getStatusColor(app.status)}`}
                    >
                      {app.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
