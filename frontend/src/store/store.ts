import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import type { ThunkAction, Action } from "@reduxjs/toolkit";
import type { TypedUseSelectorHook } from "react-redux";
import authReducer from "./authSlice";
import { base } from "@/api/base";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [base.reducerPath]: base.reducer,
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(base.middleware);
    },
  });
};

const store = makeStore();

type AppStore = ReturnType<typeof makeStore>;

export type AppState = ReturnType<AppStore["getState"]>;

export type AppDispatch = AppStore["dispatch"];

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export default store;
