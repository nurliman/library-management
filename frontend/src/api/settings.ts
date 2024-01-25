import { base } from "./base";
import type { ServerResponse } from "@/types";

export const settingsApi = base.injectEndpoints({
  endpoints: (build) => ({
    getVariables: build.query<any, void>({
      query: () => "/api/system-variables",
      transformResponse: (response: ServerResponse<any>) => response.data,
      providesTags: (result = []) => [
        ...result.map(({ id }: any) => ({ type: "Settings", id }) as const),
        { type: "Settings" as const, id: "LIST" },
      ],
    }),
    addVariable: build.mutation<any, any>({
      query: (body) => ({
        url: "/api/system-variables",
        method: "POST",
        body,
      }),
      transformResponse: (response: ServerResponse<any>) => response.data,
      invalidatesTags: [{ type: "Settings", id: "LIST" }],
    }),
    deleteVariable: build.mutation<any, any>({
      query: (id) => ({
        url: `/api/system-variables/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ServerResponse<any>) => response.data,
      invalidatesTags: [{ type: "Settings", id: "LIST" }],
    }),
    editVariable: build.mutation<any, any>({
      query: ({ name, value }) => ({
        url: `/api/system-variables/${name}`,
        method: "PATCH",
        body: { value },
      }),
      transformResponse: (response: ServerResponse<any>) => response.data,
      invalidatesTags: [{ type: "Settings", id: "LIST" }],
    }),
  }),
});

export const {
  useGetVariablesQuery,
  useAddVariableMutation,
  useDeleteVariableMutation,
  useEditVariableMutation,
} = settingsApi;
