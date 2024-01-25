import { base } from "./base";
import type { ServerResponse } from "@/types";

export const borrowedApi = base.injectEndpoints({
  endpoints: (build) => ({
    getAllBorrowed: build.query<any, any>({
      query: ({ filter }: any) => ({
        url: `/api/borrowed-books`,
        method: "GET",
        params: { filter },
      }),
      transformResponse: (response: ServerResponse<any>) => response.data,
      providesTags: (result = []) => [
        ...result.map(({ id }: any) => ({ type: "Borrowed", id }) as const),
        { type: "Borrowed" as const, id: "LIST" },
      ],
    }),
    borrowBook: build.mutation<any, any>({
      query: (body) => ({
        url: "/api/borrowed-books",
        method: "POST",
        body,
      }),
      transformResponse: (response: ServerResponse<any>) => response.data,
      invalidatesTags: [{ type: "Borrowed", id: "LIST" }],
    }),
    returnBook: build.mutation<any, any>({
      query: ({ id, ...body }) => ({
        url: `/api/borrowed-books/${id}/return`,
        method: "POST",
        body,
      }),
      transformResponse: (response: ServerResponse<any>) => response.data,
      invalidatesTags: (_result, _error, id) => [
        { type: "Borrowed", id },
        { type: "Borrowed", id: "LIST" },
      ],
    }),
    extendBorrowing: build.mutation<any, any>({
      query: ({ id, ...body }) => ({
        url: `/api/borrowed-books/${id}/extend`,
        method: "POST",
        body: body,
      }),
      transformResponse: (response: ServerResponse<any>) => response.data,
      invalidatesTags: (_result, _error, id) => [
        { type: "Borrowed", id },
        { type: "Borrowed", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllBorrowedQuery,
  useBorrowBookMutation,
  useReturnBookMutation,
  useExtendBorrowingMutation,
} = borrowedApi;
