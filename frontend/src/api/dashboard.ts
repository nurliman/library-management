import { base } from "./base";
import type { ServerResponse } from "@/types";

export const dashboardApi = base.injectEndpoints({
  endpoints: (build) => ({
    getDashboardData: build.query<any, void>({
      query: () => "/api/dashboard",
      transformResponse: (response: ServerResponse<any>) => response.data,
    }),
  }),
});

export const { useGetDashboardDataQuery } = dashboardApi;
