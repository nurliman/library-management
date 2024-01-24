import type { CredentialUser, Nullable, User } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "@/api/auth";
import { usersApi } from "@/api/users";
import { jotaiStore } from "@/store/jotaiStore";
import { accessTokenAtom } from "@/store/accessTokenAtom";
import { refreshTokenAtom } from "@/store/refreshTokenAtom";
import { isAuthenticatedAtom } from "@/store/isAuthenticatedAtom";

type AuthState = {
  user?: Nullable<User>;
};

const initialState: AuthState = {
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentialUser: (
      state,
      action: PayloadAction<CredentialUser & { isAuthenticated: boolean }>,
    ) => {
      state.user = action.payload.user;
      jotaiStore.set(accessTokenAtom, action.payload.credentials.access_token);
      jotaiStore.set(refreshTokenAtom, action.payload.credentials.refresh_token);
      jotaiStore.set(isAuthenticatedAtom, action.payload.isAuthenticated);
    },
    logout: (state) => {
      state.user = null;
      jotaiStore.set(accessTokenAtom, null);
      jotaiStore.set(refreshTokenAtom, null);
      jotaiStore.set(isAuthenticatedAtom, false);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
      if (action.payload) {
        state.user = action.payload.user;
        jotaiStore.set(accessTokenAtom, action.payload.credentials.access_token);
        jotaiStore.set(refreshTokenAtom, action.payload.credentials.refresh_token);
        jotaiStore.set(isAuthenticatedAtom, true);
      }
    });
    builder.addMatcher(usersApi.endpoints.getMe.matchFulfilled, (state, action) => {
      if (action.payload) {
        state.user = action.payload;
      }
    });
    builder.addMatcher(usersApi.endpoints.getMe.matchRejected, (state) => {
      state.user = null;
    });
  },
});

export const { setCredentialUser, logout } = authSlice.actions;

export default authSlice.reducer;
