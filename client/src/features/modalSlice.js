// used to show and hide different modals
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  quizTypeModal: false,
  quizModal: false,
  pollModal: false,
  title: "",
  quizUpdating: false,
  quizUpdateId: null,
  pollUpdating: false,
  pollUpdateId: null,
  copyModal:false,
  copyLink:null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setQuizTypeModal: (state) => {
      state.quizTypeModal = !state.quizTypeModal;
    },
    setQuizModal: (state) => {
      state.quizModal = !state.quizModal;
    },

    setPollModal: (state) => {
      state.pollModal = !state.pollModal;
    },
    setCopyModal: (state) => {
      state.copyModal = !state.copyModal;
    },
    setTitle: (state, { payload }) => {
      state.title = payload;
    },
    setQuizUpdating: (state) => {
      state.quizUpdating = !state.quizUpdating;
      state.quizModal = !state.quizModal;
    },
    setQuizUpdateId: (state, { payload }) => {
      state.quizUpdateId = payload;
    },
    setPollUpdating: (state) => {
      state.pollUpdating = !state.pollUpdating;
      state.pollModal = !state.pollModal;
    },
    setPollUpdateId: (state, { payload }) => {
      state.pollUpdateId = payload;
    },
    setCopyLink:(state,{payload})=>{
      state.copyLink = payload;
    }
  },
});

export const {
  setQuizTypeModal,
  setQuizModal,
  setPollModal,
  setCopyModal,
  setTitle,
  setQuizUpdating,
  setQuizUpdateId,
  setPollUpdating,
  setPollUpdateId,
  setCopyLink
} = modalSlice.actions;

export default modalSlice.reducer;
