import PocketBase from "pocketbase";

// PocketBase URL - can be configured via environment variables
const POCKETBASE_URL =
  "gradinapp-pocketbase-w4hu9n-991329-161-97-86-243.traefik.me";

// Create and export a PocketBase client instance
export const pb = new PocketBase(POCKETBASE_URL);

// Helper function to get the auth token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

// Helper function to set the auth token in localStorage
export const setAuthToken = (token: string) => {
  localStorage.setItem("authToken", token);
};

// Helper function to clear the auth token from localStorage
export const clearAuthToken = () => {
  localStorage.removeItem("authToken");
};

// Helper function to check if the user is logged in
export const isLoggedIn = () => {
  if (typeof window !== "undefined") {
    return !!getAuthToken();
  }
  return false;
};

export const setUserInfo = (user: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("userInfo", JSON.stringify(user));
  }
};

export const getUserInfo = () => {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem("userInfo") || "{}");
  }
};

export const clearUserInfo = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("userInfo");
  }
};
