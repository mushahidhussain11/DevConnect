import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import messagesService from "./messagesService";

const initialState = {
  messages: null,
  isSuccess: false,
  isError: false,
  message: "",
};

export const fetchUserConversations = createAsyncThunk(
  "messages/fetchUserConversations",
  async (credentials, thunkAPI) => {
    try {
      const response = await messagesService.fetchUserConversations(credentials);
      console.log(response)
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);


export const createConversationWithUser = createAsyncThunk(
  "messages/createConversationWithUser",
  async (credentials, thunkAPI) => {
    try {
      const response = await messagesService.createConversationWithUser(credentials);
      console.log(response)
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);


export const fetchConversationMessages = createAsyncThunk(
  "messages/fetchConversationMessages",
  async (credentials, thunkAPI) => {
    try {
      const response = await messagesService.fetchConversationMessages(credentials);
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

      // .addCase(fetchAllPosts.pending, (state) => {
      //   state.isLoading = true;
      // })
      // .addCase(fetchAllPosts.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   state.isSuccess = true;
      //   state.posts = action.payload?.posts;
      // })
      // .addCase(fetchAllPosts.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.isError = true;
      //   state.message = action.payload;
      // })

     
  },
});

export default messagesSlice.reducer;
