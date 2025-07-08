import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService";

const initialState = {

  user: null,
  isLoading: true,
  isSuccess: false,
  isError: false,
  message: "",

};



export const getProfileUser = createAsyncThunk(
  "user/fetchUserById",
  async (credentials, thunkAPI) => {
    try {
      const response = await userService.getProfileUser(credentials);
      console.log(response)
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const updateUserInfo = createAsyncThunk(
  "user/updateUserInfo",
  async (credentials, thunkAPI) => {
    try {
      const response = await userService.updateUserInfo(credentials);
      console.log(response)
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);










const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder


  },
});

export default userSlice.reducer;
