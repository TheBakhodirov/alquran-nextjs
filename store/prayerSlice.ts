import { createSlice } from "@reduxjs/toolkit";
import { type } from "os";

type StateType = {
  region: string;
};

type ChangeRegionArgs = {
  state: StateType;
  action: { payload: string };
};

const initialState: StateType = {
  region: "Toshkent",
};

const prayerSlice = createSlice({
  name: "prayer",
  initialState,
  reducers: {
    changeRegion(state, { payload }) {
      state.region = payload;
    },
  },
});

export const { changeRegion } = prayerSlice.actions;
export default prayerSlice.reducer;
