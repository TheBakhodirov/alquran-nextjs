import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import playerReducer from "./playerSlice";
import prayerSlice from "./prayerSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    player: playerReducer,
    prayer: prayerSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
