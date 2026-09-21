import { request } from "@/lib/request";

export interface EventResponse {
  success: boolean;
  message: string;
  data: Array<{
    id: number;
    title: string;
    eventType: string;
    description: string | null;
    startDate: string;
    endDate: string;
    location: string | null;
    organizerId: number;
    coverImage: string | null;
    isPublic: boolean;
    status: string | null;
    createdAt: string;
    updatedAt: string;
    capacity: number;
    ticketPrice: number;
    regDeadline: string | null;
    agenda: string | null;
    waitlistEnabled: boolean;
  }>;
}

export const getPublicEventsRequest = async (): Promise<EventResponse> => {
  return request("/discover-events", {
    method: "GET",
  });
};

export const getEventRegistrationsRequest = async (eventId: number): Promise<any> => {
  try {
    return await request(`/event/registrations?eventId=${eventId}`, {
      method: "GET",
    });
  } catch (error: any) {
    // Graceful fallback if Admin does not have organizer permissions for this event
    console.warn(`Skipping registrations for event ${eventId} (Access Denied/403)`);
    return { data: [] };
  }
};

// Admin-level endpoint: returns all events' registration counts in one call
// Shape: { success: true, data: [{ eventId: number, count: number }] }
export const getAdminEventRegistrationCountsRequest = async (): Promise<any> => {
  return request("/admin/event-registration-counts", {
    method: "GET",
  });
};

export const updateAdminEventStatusRequest = async (eventId: number, status: string): Promise<any> => {
  return request(`/admin/event-status`, {
    method: "PUT",
    data: { eventId, status },
  });
};


