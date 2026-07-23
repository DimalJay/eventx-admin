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
  };
}

export const getDashboardStatsRequest = async (): Promise<DashboardStatsResponse> => {
  return request("/admin/dashboard-stats", {
    method: "GET",
  });
};
