import { request } from "@/lib/request";

export interface DashboardStatsResponse {
  success: boolean;
  message: string;
  data: {
    activeUsers: {
      value: string;
      change: string;
      isPositive: boolean;
    };
    eventsCreated: {
      value: string;
      change: string;
      isPositive: boolean;
    };
    registrations: {
      value: string;
      change: string;
      isPositive: boolean;
    };
    uptime: {
      value: string;
      change: string;
      isPositive: boolean;
    };
    recentActivities?: Array<{
      id: string;
      type: 'user' | 'event';
      title: string;
      time: string;
      timestamp: number;
    }>;
    chartData?: Array<{
      label: string;
      registrations: number;
      regPercentage: number;
      revenue: number;
      revPercentage: number;
    }>;
  };
}

export const getDashboardStatsRequest = async (range?: string): Promise<DashboardStatsResponse> => {
  return request("/admin/dashboard-stats", {
    method: "GET",
    params: range ? { range } : {},
  });
};
