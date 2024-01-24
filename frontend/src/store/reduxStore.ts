import type { ThunkAction, Action } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { base } from "@/api/base";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [base.reducerPath]: base.reducer,
      auth: authReducer,
    },
    middleware: (gDM) => gDM().concat(base.middleware),
  });
};

const reduxstore = makeStore();

type AppStore = ReturnType<typeof makeStore>;

export type AppState = ReturnType<AppStore["getState"]>;

export type AppDispatch = AppStore["dispatch"];

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export { reduxstore };
