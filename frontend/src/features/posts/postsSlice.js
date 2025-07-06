import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import postsService from "./postsService";

const initialState = {
  posts: null,
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

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (credentials, thunkAPI) => {
    try {
      const response = await postsService.createPost(credentials);
      console.log(response)
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const setAndUnsetReaction = createAsyncThunk(
  "posts/setAndUnsetReaction",
  async (credentials, thunkAPI) => {
    try {
      const response = await postsService.setAndUnsetReaction(credentials);
      console.log(response)
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (credentials, thunkAPI) => {
    try {
      const response = await postsService.updatePost(credentials);
      console.log(response)
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (credentials, thunkAPI) => {
    try {
      const response = await postsService.deletePost(credentials);
      console.log(response)
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);






const postsSlice = createSlice({
  name: "posts",
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

       .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(post => post?._id !== action.payload?.deletedPost?._id);
      })

      .addCase(createPost.fulfilled, (state, action) => {
        console.log(action.payload);
        state.posts = [action.payload?.createdPost, ...state.posts];
      })
     
  },
});

export default postsSlice.reducer;
