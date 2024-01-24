import axios from "axios";
import axiosRetry from "axios-retry";
import { toast } from "react-toastify";
// import store from "@/store";
// import { logout, setCredentialUZser } from "@/store/authSlice";
import { env } from "@/env.mjs";

const theAxios = axios.create({
  timeout: 8000,
});

theAxios.interceptors.request.use((config) => {
  // const credential = store?.getState?.()?.auth?.credential;

  // if (credential?.access_token) {
  //   config.headers?.set?.("Authorization", `Bearer ${credential.access_token}`);
  // }

  return config;
});

axiosRetry(theAxios, {
  retries: 3,
  shouldResetTimeout: true,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: async (error) => {
    if (error.config?.url?.includes("login")) {
      return axiosRetry.isNetworkError(error) || error.code === "ECONNABORTED";
    }
    if (error.response?.status !== 401) {
      return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.code === "ECONNABORTED";
    }
    const credential = '' as any// store?.getState?.()?.auth?.credential;
    const res = await axios
      .post(
        "/api/auth/refresh-token",
        {},
        {
          baseURL: env.NEXT_PUBLIC_BASE_URL,
          headers: {
            Authorization: `Bearer ${credential?.refresh_token}`,
          },
        },
      )
      .catch((refreshTokenError) => {
        if (refreshTokenError.response?.status >= 400) {
          // store?.dispatch?.(logout());
          toast.error("Your session has expired. Please login.");
          window.location.href = "/login";
        }
      });
    if (!res?.data?.data?.access_token) {
      return false;
    }
    // store?.dispatch?.Z(setCredentialUser({ ...res.data.data, isAuthenticated: true }));
    error.config?.headers?.set?.("Authorization", `Bearer ${res.data.data.access_token}`);
    return true;
  },
});

export { theAxios };
