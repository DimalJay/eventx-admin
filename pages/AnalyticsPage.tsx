"use client";

import React, { useState } from "react";
import { Download, Users, Ticket } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStatsRequest } from "@/service/dashboardService";
import { getAllUsersRequest } from "@/service/userService";
import { getPublicEventsRequest } from "@/service/eventService";
import { BarChartCard } from "@/components/admin/BarChartCard";
import { ReportGeneratorForm } from "@/components/admin/ReportGeneratorForm";
import { ReportPreviewTable } from "@/components/admin/ReportPreviewTable";
import DailyRegistrationsChart from "@/components/admin/DailyRegistrationsChart";
import EventsScaleChart from "@/components/admin/EventsScaleChart";

export default function AnalyticsPage() {
  const [reportType, setReportType] = useState("User Activity Report");
  const [dateRange, setDateRange] = useState("This Year");
  const [generatedReport, setGeneratedReport] = useState<{
    headers: string[];
    rows: any[][];
    title: string;
  } | null>(null);

  // Queries
  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => getDashboardStatsRequest(),
  });

  const { data: usersData, isLoading: isUsersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsersRequest,
  });

  const { data: eventsData, isLoading: isEventsLoading } = useQuery({
    queryKey: ["public-events"],
    queryFn: getPublicEventsRequest,
  });

  const stats = statsData?.data;
  const users = usersData?.data || [];
  const events = eventsData?.data || [];

  // Generate Report logic
  const handleGenerateReport = () => {
    const now = new Date();
    let dateLimit = new Date(0); // Epoch

    if (dateRange === "Last 30 Days") {
      dateLimit = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (dateRange === "Last 3 Months") {
      dateLimit = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    } else if (dateRange === "This Year") {
      dateLimit = new Date(now.getFullYear(), 0, 1);
    }

    if (reportType === "User Activity Report") {
      const filteredUsers = users.filter((u: any) => new Date(u.createdAt) >= dateLimit);
      const rows = filteredUsers.map((u: any) => [
        `${u.firstName} ${u.lastName}`,
        u.email,
        u.role,
        u.accountStatus,
        new Date(u.createdAt).toISOString().split("T")[0],
      ]);
      setGeneratedReport({
        title: `User_Activity_Report_${dateRange.replace(" ", "_")}`,
        headers: ["Name", "Email", "Role", "Status", "Joined Date"],
        rows,
      });
    } else if (reportType === "Event Performance Report") {
      const filteredEvents = events.filter((e: any) => new Date(e.startDate) >= dateLimit);
      const rows = filteredEvents.map((e: any) => [
        e.title,
        e.eventType,
        e.location || "TBA",
        e.capacity > 0 ? e.capacity.toString() : "Unlimited",
        new Date(e.startDate).toISOString().split("T")[0],
      ]);
      setGeneratedReport({
        title: `Event_Performance_Report_${dateRange.replace(" ", "_")}`,
        headers: ["Event Title", "Type", "Location", "Capacity", "Start Date"],
        rows,
      });
    } else if (reportType === "Financial Report") {
      const filteredEvents = events.filter((e: any) => new Date(e.startDate) >= dateLimit);
      const rows = filteredEvents.map((e: any) => [
        e.title,
        e.ticketPrice > 0 ? `$${e.ticketPrice}` : "Free",
        e.capacity > 0 ? e.capacity.toString() : "Unlimited",
        e.ticketPrice > 0 && e.capacity > 0 ? `$${e.ticketPrice * e.capacity}` : "$0",
        new Date(e.startDate).toISOString().split("T")[0],
      ]);
      setGeneratedReport({
        title: `Financial_Report_${dateRange.replace(" ", "_")}`,
        headers: ["Event Title", "Ticket Price", "Capacity Limit", "Max Potential Revenue", "Start Date"],
        rows,
      });
    }
  };

  // Download CSV logic
  const handleExportCSV = (headers: string[], rows: any[][], fileName: string) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${val}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 tracking-tight">Analytics & Reports</h1>
          <p className="text-zinc-500 text-sm mt-1">Deep dive into platform statistics and generate custom reports.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (users.length || events.length) {
                // Export users as simple CSV
                const headers = ["First Name", "Last Name", "Email", "Role", "Status", "Joined"];
                const rows = users.map((u: any) => [u.firstName, u.lastName, u.email, u.role, u.accountStatus, u.createdAt]);
                handleExportCSV(headers, rows, "Platform_Users_Export");
              }
            }}
            disabled={isUsersLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-black/90 transition shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <Download size={14} /> Export Users Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Growth (Daily Registration last 7 days) */}
        <BarChartCard
          title="Daily Registrations"
          subtitle="Last 7 Days"
          icon={<Users size={18} />}
          iconBgClass="bg-blue-50"
          iconTextClass="text-blue-600"
          isLoading={isStatsLoading}
          isEmpty={!stats?.chartData || stats.chartData.length === 0}
          emptyMessage="No registration metrics available."
        >
          <DailyRegistrationsChart chartData={stats?.chartData} />
        </BarChartCard>

        {/* Capacity / Ticket Price Distribution */}
        <BarChartCard
          title="Upcoming Events Scale"
          subtitle="Scale Overview"
          icon={<Ticket size={18} />}
          iconBgClass="bg-emerald-50"
          iconTextClass="text-emerald-600"
          isLoading={isEventsLoading}
          isEmpty={events.length === 0}
          emptyMessage="No platform events found."
        >
          <EventsScaleChart events={events} />
        </BarChartCard>
      </div>

      {/* Report Generator */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-zinc-200/60 shadow-xs p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">Custom Report Generation</h2>
          <p className="text-zinc-500 text-xs mt-0.5">Filter criteria to dynamically gather platform records.</p>
        </div>

        <ReportGeneratorForm
          reportType={reportType}
          setReportType={setReportType}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onGenerate={handleGenerateReport}
        />

        {generatedReport && (
          <ReportPreviewTable
            generatedReport={generatedReport}
            onDownloadCSV={() => handleExportCSV(generatedReport.headers, generatedReport.rows, generatedReport.title)}
          />
        )}
      </div>
    </div>
  );
}
