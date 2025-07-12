import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService";

const initialState = {
  profileUser: null,
  suggestedUsers: null,
  notifications: null,
  searchedUsers:null,
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
      console.log(response);
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
      console.log(response);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const getSuggestedUsers = createAsyncThunk(
  "user/getSuggestedUsers",
  async (_, thunkAPI) => {
    try {
      const response = await userService.getSuggestedUsers();
      console.log(response);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const followUser = createAsyncThunk(
  "user/followUser",
  async (credentials, thunkAPI) => {
    try {
      const response = await userService.followUser(credentials);
      console.log(response);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const unfollowUser = createAsyncThunk(
  "user/unfollowUser",
  async (credentials, thunkAPI) => {
    try {
      const response = await userService.unfollowUser(credentials);
      console.log(response);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const getSearchedUsers = createAsyncThunk(
  "user/getSearchedUsers",
  async (credentials, thunkAPI) => {
    try {
      const response = await userService.getSearchedUsers(credentials);
      console.log(response);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const fetchNotifications = createAsyncThunk(
  "user/fetchNotifications",
  async (credentials, thunkAPI) => {
    try {
      const response = await userService.fetchNotifications(credentials);
      console.log(response);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
export const deleteNotification = createAsyncThunk(
  "user/deleteNotification",
  async (credentials, thunkAPI) => {
    try {
      const response = await userService.deleteNotification(credentials);
      console.log(response);
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
  reducers: {
    updateProfileUserInfo(state, action) {
      const formDataObj = action?.payload?.formDataObj;

      if (state?.profileUser) {
        // Separate profilePic from the rest of the fields
        const { profilePic, ...otherFields } = formDataObj;

        // Update all other fields except profilePic
        state.profileUser = {
          ...state.profileUser,
          ...otherFields,
        };

        // If profilePic is in formData, update it using action.profilePic
        if (formDataObj.hasOwnProperty("profilePic") && action?.payload?.profilePic) {
          state.profileUser.profilePic = action?.payload?.profilePic;
        }
      }

      console.log(state.profileUser);
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getProfileUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfileUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profileUser = action.payload?.user;
      })
      .addCase(getProfileUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(getSuggestedUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSuggestedUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.suggestedUsers = action.payload?.users;
      })
      .addCase(getSuggestedUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(followUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profileUser = action.payload?.userToFollow;
        state.suggestedUsers = state.suggestedUsers.filter(user => user?._id !== action.payload?.userToFollow?._id);
      })
      .addCase(followUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(unfollowUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profileUser = action.payload?.userToUnfollow;
        state.suggestedUsers = [...state.suggestedUsers, action.payload?.userToUnfollow];
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

       .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notifications = action.payload?.notifications;
       
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

        .addCase(deleteNotification.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notifications = state.notifications.filter(notification => notification?._id !== action.payload?.notification?._id);
       
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
  },
});

export default userSlice.reducer;
export const { updateProfileUserInfo } = userSlice.actions;
