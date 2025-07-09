import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

const initialState = {
  user: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  isAuthenticated: false,
  message: "",
};

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      const response = await authService.fetchCurrentUser();

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await authService.login(credentials);

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const signUpUser = createAsyncThunk(
  "auth/signup",
  async (credentials, thunkAPI) => {
    try {
      const response = await authService.signup(credentials);
      console.log(response, "at thunk");
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const socialLogin = createAsyncThunk(
  "auth/socialLogin",
  async (credentials, thunkAPI) => {
    try {
      const response = await authService.socialLogin(credentials);
      console.log(response, "at thunk");
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (credentials, thunkAPI) => {
    try {
      const response = await authService.forgotPassword(credentials);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (credentials, thunkAPI) => {
    try {
      const response = await authService.resetPassword(credentials);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const response = await authService.logout();
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    decrementPostCount(state) {
      if (state?.user?.user) {
        state.user.user.numberOfPosts -= 1;
      }
    },

    incrementPostCount(state) {
      if (state?.user?.user) {
        state.user.user.numberOfPosts += 1;
      }
    },

    updateCurrentUserInfo(state, action) {
      if (state?.user?.user) {
        // Destructure profilePic if it exists in formDataObj
        const { profilePic, ...otherFields } = action?.payload?.formDataObj;

        // Update all fields except profilePic
        state.user.user = {
          ...state.user.user,
          ...otherFields,
        };

        // If profilePic was in the formData, update it from action.profilePic
        if (
          action?.payload?.formDataObj?.hasOwnProperty("profilePic") &&
          action?.payload?.profilePic
        ) {
          state.user.user.profilePic = action?.payload?.profilePic;
        }
      }
    },

    
  },
  extraReducers: (builder) => {
    builder

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log(action);
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(socialLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(socialLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(socialLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(signUpUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // state.user = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // state.user = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        console.log(action);
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isAuthenticated = false;
        state.user = null;
        // state.user = action.payload;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export default authSlice.reducer;
export const {
  decrementPostCount,
  incrementPostCount,
 
  updateCurrentUserInfo,
} = authSlice.actions;
