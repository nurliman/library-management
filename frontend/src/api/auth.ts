import { base } from "./base";
import type { CredentialUser, LoginRequest, Nullable, ServerResponse } from "@/types";

export const authApi = base.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<Nullable<CredentialUser>, LoginRequest>({
      query: (credentials) => ({
        url: "/api/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: ServerResponse<Nullable<CredentialUser>>) => response.data,
      extraOptions: {
        maxRetries: 0,
      },
    }),
  }),
});

export const { useLoginMutation } = authApi;
