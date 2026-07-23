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
  return request(`/event/registrations?eventId=${eventId}`, {
    method: "GET",
  });
};
