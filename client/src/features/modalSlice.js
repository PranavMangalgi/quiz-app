// used to show and hide different modals
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  quizTypeModal: false,
  quizModal: false,
  pollModal: false,
  copyModal: false,
  title:'',
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
    setTitle:(state, {payload})=>{
      state.title = payload;
    }
  },
});

export const {setQuizTypeModal,setQuizModal,setPollModal,setCopyModal,setTitle} = modalSlice.actions;
export default modalSlice.reducer;
