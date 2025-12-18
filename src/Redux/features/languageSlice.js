import { createSlice } from "@reduxjs/toolkit";
import i18n from "@/i18n";

const initialState = {
  language: localStorage.getItem("lan") || "en",
};

const languageSlice = createSlice({
  name: "language",
  initialState,

  reducers: {
    // accetta opzionalmente la lingua di destinazione (payload)
    setLanguage: (state, action) => {
      let nextLang = action?.payload;

      if (!nextLang) {
        if (!state.language) {
          nextLang = "en";
        } else if (state.language === "en") {
          nextLang = "it";
        } else if (state.language === "it") {
          nextLang = "en";
        }
      }

      state.language = nextLang;

      i18n.changeLanguage(nextLang);
      localStorage.setItem("lan", nextLang);
      localStorage.setItem("i18nextLng", nextLang);
      // ❌ niente reload qui
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
