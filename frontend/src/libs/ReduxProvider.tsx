"use client";

import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import store from "@/store";
import type { PropsWithChildren } from "react";

export default function ReduxProvider({ children }: PropsWithChildren<object>) {
  const persistor = persistStore(store, {}, () => {
    persistor.getState();
  });

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {() => <>{children}</>}
      </PersistGate>
    </Provider>
  );
}
