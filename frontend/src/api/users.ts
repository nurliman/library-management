import { base } from "./base";
import type { ServerResponse } from "@/types";

export const usersApi = base.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<any, void>({
      query: () => "/api/me",
      transformResponse: (response: ServerResponse<any>) => response.data,
      providesTags: (result) => [{ type: "Users", id: result?.id }],
    }),
    getUsers: build.query<any, void>({
      query: () => "/api/users",
      transformResponse: (response: ServerResponse<any>) => response.data,
      providesTags: (result = []) => [
        ...result.map(({ id }: any) => ({ type: "Users", id }) as const),
        { type: "Users" as const, id: "LIST" },
      ],
    }),
    addUser: build.mutation<any, any>({
      query: (user) => ({
        url: "/api/users",
        method: "POST",
        body: user,
      }),
      transformResponse: (response: ServerResponse<any>) => response.data,
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
    editUser: build.mutation<any, any>({
      query: ({ id, ...user }) => ({
        url: `/api/users/${id}`,
        method: "PATCH",
        body: user,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Users", id }],
    }),
    deleteUser: build.mutation<any, any>({
      query: (id) => ({
        url: `/api/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Users", id }],
    }),
  }),
});

export const {
  useGetMeQuery,
  useGetUsersQuery,
  useAddUserMutation,
  useEditUserMutation,
  useDeleteUserMutation,
} = usersApi;
