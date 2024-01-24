import { theAxios } from "@/libs/theAxios";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";

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
  return async (args) => {
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
