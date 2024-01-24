import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { authApi } from "@/api/auth";
import { Credential, CredentialUser } from "@/types";

type User = {
  id: string;
  username: string;
};

type AuthState = {
  credential: Credential | null;
  user: User | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  credential: null,
  user: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentialUser: (
      state,
      action: PayloadAction<CredentialUser & { isAuthenticated: boolean }>,
    ) => {
      state.credential = {
        access_token: action.payload.credentials.access_token,
        refresh_token: action.payload.credentials.refresh_token,
      };
      state.user = {
        id: action.payload.user.id,
        username: action.payload.user.username,
      };
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    logout: (state) => {
      state.credential = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
      if (action.payload) {
        state.credential = {
          access_token: action.payload.credentials.access_token,
          refresh_token: action.payload.credentials.refresh_token,
        };
        state.user = {
          id: action.payload.user.id,
          username: action.payload.user.username,
        };
        state.isAuthenticated = true;
      }
    });
  },
});

export const { setCredentialUser, logout } = authSlice.actions;

const persistedAuthReducer = persistReducer(
  {
    key: "Auth",
    version: 1,
    storage,
    whitelist: ["credential", "user", "isAuthenticated"],
  },
  authSlice.reducer,
);

export default persistedAuthReducer;
