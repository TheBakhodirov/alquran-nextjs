import { createSlice } from "@reduxjs/toolkit";

type PlayerType = {
  audioArray: [];
  showPlayer: boolean;
  currentSurah: string;
  currentSurahNumber: number;
  currentAudio: string;
  currentAudioNumber: number;
  isPlaying: boolean;
  playingSurah: boolean;
};

const initialState: PlayerType = {
  audioArray: [],
  showPlayer: false,
  currentSurah: "",
  currentSurahNumber: 1,
  currentAudio: "",
  currentAudioNumber: 0,
  isPlaying: false,
  playingSurah: false,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    showPlayer(state) {
      state.showPlayer = true;
    },
    closePlayer(state) {
      state.showPlayer = false;
      state.isPlaying = false;
      state.currentSurahNumber = 0;
      state.currentAudioNumber = 0;
    },
    setAudios(state, { payload }) {
      state.audioArray = payload;
    },
    setCurrentSurahName(state, { payload }) {
      state.currentSurah = payload;
    },
    setCurrentSurahNumber(state, { payload }) {
      state.currentSurahNumber = payload;
    },
    setCurrentAudio(state, { payload }) {
      state.currentAudio = payload;
    },
    setCurrentAudioNumber(state, { payload }) {
      state.currentAudioNumber = payload;
    },
    play(state) {
      state.isPlaying = true;
    },
    pause(state) {
      state.isPlaying = false;
    },
    setPlayingSurah(state, { payload }) {
      state.playingSurah = payload;
    },
  },
});

export const playerActions = playerSlice.actions;
export default playerSlice.reducer;
