import { request } from "@/lib/request";

export interface UserResponse {
  success: boolean;
  message: string;
  data: Array<{
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    loginType: string;
    isVerified: boolean;
    role: string;
    profilePicture: string | null;
    accountStatus: string;
    createdAt: string;
    phoneNumber: string | null;
    updatedAt: string | null;
    lastLogin: string | null;
  }>;
}

export const getAllUsersRequest = async (): Promise<UserResponse> => {
  return request("/users", {
    method: "GET",
  });
};

export const getUserRegistrationsRequest = async (userId: number): Promise<any> => {
  return request(`/user/registrations?userId=${userId}`, {
    method: "GET",
  });
};

export const updateUserStatusRequest = async (userId: number, status: string): Promise<any> => {
  return request(`/users/status`, {
    method: "PUT",
    data: { userId, status },
  });
};
