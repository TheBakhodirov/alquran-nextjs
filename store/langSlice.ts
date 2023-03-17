import { createSlice } from "@reduxjs/toolkit";

type Langs = "en" | "uz" | "ru";

interface LangState {
  lang: Langs;
}

const initialState: LangState = {
  lang: "en",
};

const langSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage(state, { payload }) {
      state.lang = payload;
    },
  },
});

export const { setLanguage } = langSlice.actions;
export default langSlice.reducer;
