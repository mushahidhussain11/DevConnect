import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import postsService from "./messagesService";

const initialState = {
  messages: null,
  userPosts:null,
  areUserPostsLoading: false,
  isLoading: true,
  isSuccess: false,
  isError: false,
  message: "",
};

export const fetchAllPosts = createAsyncThunk(
  "posts/fetchAllPosts",
  async (_, thunkAPI) => {
    try {
      const response = await postsService.fetchAllPosts();
      console.log(response)
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);





const messagesSlice = createSlice({
  name: "messages",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchAllPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts = action.payload?.posts;
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

     
  },
});

export default messagesSlice.reducer;
