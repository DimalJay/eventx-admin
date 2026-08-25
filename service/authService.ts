import { request } from "@/lib/request";

// login request
export const loginRequest = async (data: any) => {
  const res = await request("/auth/admin-login", {
    method: "POST",
    data: {
      email: data.email,
      password: data.password,
    },
  });
  localStorage.setItem("adminLoggedIn", "true");
  return res;
};

// logout request
export const logoutRequest = async () => {
  const res = await request("/auth/logout", {
    method: "POST"
  });
  localStorage.removeItem("adminLoggedIn");
  return res;
};

// update password request
export const updateAdminPasswordRequest = async (data: any) => {
  return request("/admin/update-password", {
    method: "POST",
    data: {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    },
  });
};
