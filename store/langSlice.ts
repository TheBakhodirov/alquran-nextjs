import { createSlice } from "@reduxjs/toolkit";

type Langs = "en" | "uz" | "ru";

type ActionType = {
  payload: Langs;
};

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
    setLanguage(state, action: ActionType) {
      state.lang = action.payload;
    },
  },
});

export const { setLanguage } = langSlice.actions;
export default langSlice.reducer;
