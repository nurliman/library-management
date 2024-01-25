import { base } from "./base";
import type { ServerResponse } from "@/types";

export const dashboardApi = base.injectEndpoints({
  endpoints: (build) => ({
    getDashboardData: build.query<any, void>({
      query: () => "/api/dashboard",
      transformResponse: (response: ServerResponse<any>) => response.data,
    }),
    getTotalBooksData: build.query<any, void>({
      query: () => "/api/dashboard/total-books",
      transformResponse: (response: ServerResponse<any>) => response.data,
      providesTags: [{ type: "Books", id: "LIST" }],
    }),
    getTotalBooksCount: build.query<any, void>({
      query: () => "/api/dashboard/total-books-count",
      transformResponse: (response: ServerResponse<any>) => response.data,
      providesTags: [{ type: "Books", id: "COUNT" }],
    }),
    getTotalBorrowedBooksData: build.query<any, void>({
      query: () => "/api/dashboard/total-borrowed-books",
      transformResponse: (response: ServerResponse<any>) => response.data,
      providesTags: [{ type: "Borrowed", id: "LIST" }],
    }),
    getTotalBorrowedBooksCount: build.query<any, void>({
      query: () => "/api/dashboard/total-borrowed-books-count",
      transformResponse: (response: ServerResponse<any>) => response.data,
      providesTags: [{ type: "Borrowed", id: "COUNT" }],
    }),
    getBorrowedBooks24hData: build.query<any, void>({
      query: () => "/api/dashboard/total-borrowed-books-24",
      transformResponse: (response: ServerResponse<any>) => response.data,
      providesTags: [{ type: "Borrowed", id: "COUNT" }],
    }),
    getTotalBorrowedBooks24hCount: build.query<any, void>({
      query: () => "/api/dashboard/total-borrowed-books-24-count",
      transformResponse: (response: ServerResponse<any>) => response.data,
      providesTags: [{ type: "Borrowed", id: "COUNT" }],
    }),
    getReturnedBooks24hData: build.query<any, void>({
      query: () => "/api/dashboard/total-returned-books-24",
      transformResponse: (response: ServerResponse<any>) => response.data,
      providesTags: [{ type: "Borrowed", id: "COUNT" }],
    }),
    // returned books count in 24h
    getTotalReturnedBooks24hCount: build.query<any, void>({
      query: () => "/api/dashboard/total-returned-books-24-count",
      transformResponse: (response: ServerResponse<any>) => response.data,
      providesTags: [{ type: "Borrowed", id: "COUNT" }],
    }),
  }),
});

export const {
  useGetDashboardDataQuery,
  useGetTotalBooksDataQuery,
  useGetTotalBooksCountQuery,
  useGetTotalBorrowedBooksDataQuery,
  useGetTotalBorrowedBooksCountQuery,
  useGetBorrowedBooks24hDataQuery,
  useGetTotalBorrowedBooks24hCountQuery,
  useGetReturnedBooks24hDataQuery,
  useGetTotalReturnedBooks24hCountQuery,
} = dashboardApi;
