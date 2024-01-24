import { createApi } from "@reduxjs/toolkit/query/react";
import { env } from "@/env.mjs";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { AppState } from "@/store";
import { setCredentialUser, logout } from "@/store/authSlice";
import { Mutex } from "async-mutex";

const mutex = new Mutex();
const baseQuery = fetchBaseQuery({
  baseUrl: env.NEXT_PUBLIC_BASE_URL,
  prepareHeaders: (headers, { getState, endpoint }) => {
    const token = endpoint.includes("refresh-token")
      ? (getState() as AppState).auth.credential?.refresh_token
      : (getState() as AppState).auth.credential?.access_token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery("/api/auth/refresh-token", api, extraOptions);
        if (refreshResult.data) {
          api.dispatch(
            setCredentialUser({ ...(refreshResult.data as any), isAuthenticated: true }),
          );
          // retry the initial query
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
          window.location.href = "/login";
        }
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export const base = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Books"],
  endpoints: () => ({}),
});
