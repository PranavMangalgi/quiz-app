// used to show and hide different modals
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  quizTypeModal: false,
  quizModal: false,
  pollModal: false,
  copyModal: false,
  title:'',
  quizUpdating:false,
  quizUpdateId:null,
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
    },
    setQuizUpdating:(state)=>{
      state.quizUpdating = !state.quizUpdating;
      state.quizModal = !state.quizModal;
    },
    setQuizUpdateId:(state,{payload})=>{
      state.quizUpdateId = payload;
    }
  },
});

export const {setQuizTypeModal,setQuizModal,setPollModal,setCopyModal,setTitle,setQuizUpdating,setQuizUpdateId} = modalSlice.actions;
export default modalSlice.reducer;
