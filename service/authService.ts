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
