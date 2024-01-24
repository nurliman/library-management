import axios, { AxiosInstance } from "axios";
import axiosRetry from "axios-retry";
import { logout, setCredentialUser } from "@/store/authSlice";
import type { AxiosRequestConfig, AxiosError } from "axios";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";

let theAxios: AxiosInstance | null;

export type AxiosBaseQueryOptions = {
  baseUrl?: string;
};

export const axiosBaseQuery = ({
  baseUrl = "",
}: AxiosBaseQueryOptions): BaseQueryFn<
  | string
  | {
      url: string;
      method?: AxiosRequestConfig["method"];
      body?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
      timeout?: AxiosRequestConfig["timeout"];
    },
  unknown,
  unknown
> => {
  return async (args, api) => {
    if (!theAxios) {
      theAxios = axios.create({
        timeout: 5000,
      });

      theAxios.interceptors.request.use((config) => {
        const access_token = localStorage.getItem("access_token");

        if (access_token) {
          config.headers?.set?.("Authorization", `Bearer ${access_token}`);
        }

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
            return (
              axiosRetry.isNetworkOrIdempotentRequestError(error) || error.code === "ECONNABORTED"
            );
          }
          const refresh_token = localStorage.getItem("refresh_token");
          const res = await axios
            .post(
              "/api/auth/refresh-token",
              {},
              {
                baseURL: baseUrl,
                headers: {
                  Authorization: refresh_token && `Bearer ${refresh_token}`,
                },
              },
            )
            .catch((refreshTokenError) => {
              if (refreshTokenError.response?.status >= 400) {
                api.dispatch(logout());
              }
            });
          if (!res?.data?.data?.access_token) {
            return false;
          }
          api.dispatch(setCredentialUser({ ...res.data.data, isAuthenticated: true }));
          error.config?.headers?.set?.("Authorization", `Bearer ${res.data.data.access_token}`);
          return true;
        },
      });
    }

    try {
      let data;
      if (typeof args === "string") {
        data = await theAxios(args, { baseURL: baseUrl }).then((res) => res.data);
      } else {
        data = await theAxios({
          baseURL: baseUrl,
          url: args.url,
          method: args.method,
          data: args.body,
          params: args.params,
          headers: args.headers,
          timeout: args.timeout,
        }).then((res) => res.data);
      }
      return { data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
};
