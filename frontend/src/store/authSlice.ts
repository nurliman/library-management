import type { CredentialUser, User } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "@/api/auth";
import { jotaiStore } from "@/store/jotaiStore";
import { accessTokenAtom } from "@/store/accessTokenAtom";
import { refreshTokenAtom } from "@/store/refreshTokenAtom";
import { isAuthenticatedAtom } from "@/store/isAuthenticatedAtom";

type AuthState = {
  user: User | null;
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
      state.user = {
        id: action.payload.user.id,
        username: action.payload.user.username,
        email: action.payload.user.email,
        role: action.payload.user.role,
      };

      jotaiStore.set(accessTokenAtom, action.payload.credentials.access_token);
      jotaiStore.set(refreshTokenAtom, action.payload.credentials.refresh_token);
      jotaiStore.set(isAuthenticatedAtom, action.payload.isAuthenticated);
    },
    logout: () => {
      jotaiStore.set(accessTokenAtom, null);
      jotaiStore.set(refreshTokenAtom, null);
      jotaiStore.set(isAuthenticatedAtom, false);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
      if (action.payload) {
        state.user = {
          id: action.payload.user.id,
          username: action.payload.user.username,
          email: action.payload.user.email,
          role: action.payload.user.role,
        };

        jotaiStore.set(accessTokenAtom, action.payload.credentials.access_token);
        jotaiStore.set(refreshTokenAtom, action.payload.credentials.refresh_token);
        jotaiStore.set(isAuthenticatedAtom, true);
      }
    });
  },
});

export const { setCredentialUser, logout } = authSlice.actions;

export default authSlice.reducer;
