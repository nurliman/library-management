import { base } from "./base";
import type { ServerResponse } from "@/types";

export const booksApi = base.injectEndpoints({
  endpoints: (build) => ({
    getBooks: build.query<any, void>({
      query: () => "/api/books",
      transformResponse: (response: ServerResponse<any>) => response.data,
      providesTags: (result = []) => [
        ...result.map(({ id }: any) => ({ type: "Books", id }) as const),
        { type: "Books" as const, id: "LIST" },
      ],
    }),
    addBook: build.mutation<any, any>({
      query: (book) => ({
        url: "/api/books",
        method: "POST",
        body: book,
      }),
      transformResponse: (response: ServerResponse<any>) => response.data,
      invalidatesTags: [{ type: "Books", id: "LIST" }],
    }),
    deleteBook: build.mutation<any, any>({
      query: (id) => ({
        url: `/api/books/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ServerResponse<any>) => response.data,
      invalidatesTags: (_result, _error, id) => [{ type: "Books", id }],
    }),
    editBook: build.mutation<any, any>({
      query: ({ id, ...book }) => ({
        url: `/api/books/${id}`,
        method: "PATCH",
        body: book,
      }),
      transformResponse: (response: ServerResponse<any>) => response.data,
      invalidatesTags: (_result, _error, payload) => [{ type: "Books", id: payload?.id }],
    }),
  }),
});

export const { useGetBooksQuery, useAddBookMutation, useDeleteBookMutation, useEditBookMutation } =
  booksApi;
