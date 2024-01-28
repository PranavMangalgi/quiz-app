import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
// import axios from "axios";

const initialState = {
  isAuthenticated: Cookies.get("token") ? true : false,
  user: null,
};

// export const fetchUser = createAsyncThunk("fetchUserSlice",async()=>{
//   const token = Cookies.get("token");
//   const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/getuser`,{
//     headers:{
//       Authorization:`Bearer ${token}`
//     }
//   })
//   return response.data;
// })

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, { payload }) => {
      state.isAuthenticated = true;
      state.user = payload;
    },
    logout: () => initialState,
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
