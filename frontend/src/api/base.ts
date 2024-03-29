import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";
import { env } from "@/env.mjs";

const base = createApi({
  baseQuery: axiosBaseQuery({ baseUrl: env.NEXT_PUBLIC_BASE_URL }),
  tagTypes: ["Books", "Borrowed", "Users", "Settings"],
  endpoints: () => ({}),
});

export { base };
