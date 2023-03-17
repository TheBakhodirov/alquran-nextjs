import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "./themeSlice";
import playerSlice from "./playerSlice";
import prayerSlice from "./prayerSlice";
import langSlice from "./langSlice";

export const store = configureStore({
  reducer: {
    theme: themeSlice,
    language: langSlice,
    player: playerSlice,
    prayer: prayerSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
