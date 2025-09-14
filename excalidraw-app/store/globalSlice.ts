import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type RootState } from ".";

interface GlobalStateProps {
  language: "chinese" | "english" | "japanese";
}

export const globalStateSlice = createSlice({
  name: "global",
  initialState: {
    language: "chinese",
  } as GlobalStateProps,
  reducers: {
    setGlobalState: (
      state: GlobalStateProps,
      action: PayloadAction<{
        [key in keyof GlobalStateProps]?: GlobalStateProps[key];
      }>,
    ) => {
      const { language } = action.payload;
      if (language !== undefined) {
        state.language = language;
      }
    },
  },
});

export const { setGlobalState } = globalStateSlice.actions;
export const selectGlobal = (state: RootState) => state.global;
export default globalStateSlice.reducer;
