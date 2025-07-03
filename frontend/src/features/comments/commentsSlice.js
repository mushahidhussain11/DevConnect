import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import commentsService from "./commentsService";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (credentials, thunkAPI) => {
    try {
      const response = await commentsService.fetchComments(credentials);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const addComment = createAsyncThunk(
  "comments/addComment",
  async (credentials, thunkAPI) => {
    try {
      const response = await commentsService.addComment(credentials);
      console.log(response)
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);



const commentsSlice = createSlice({
  name: "comments",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      
     
  },
});

export default commentsSlice.reducer;
