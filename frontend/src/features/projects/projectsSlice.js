import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import projectsService from "./projectsService";

const initialState = {
  projects: null,
  userProjects:null,
  areUserProjectsLoading: false,
  isLoading: true,
  isSuccess: false,
  isError: false,
  message: "",
};

export const fetchAllProjects = createAsyncThunk(
  "projects/fetchAllProjects",
  async (_, thunkAPI) => {
    try {
      const response = await projectsService.fetchAllProjects();
      console.log(response)
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (credentials, thunkAPI) => {
    try {
      const response = await projectsService.createProject(credentials);
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
  "projects/setAndUnsetReaction",
  async (credentials, thunkAPI) => {
    try {
      const response = await projectsService.setAndUnsetReaction(credentials);
      console.log(response)
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async (credentials, thunkAPI) => {
    try {
      const response = await projectsService.updateProject(credentials);
      console.log(response)
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (credentials, thunkAPI) => {
    try {
      const response = await projectsService.deleteProject(credentials);
      console.log(response)
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const fetchUserProjects = createAsyncThunk(
  "projects/fetchUserProjects",
  async (credentials, thunkAPI) => {
    try {
      const response = await projectsService.fetchUserProjects(credentials);
      console.log(response)
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);






const projectsSlice = createSlice({
  name: "projects",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchAllProjects.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.projects = action.payload?.projects;
      })
      .addCase(fetchAllProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

       .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(project => project?._id !== action.payload?.deletedProject?._id);
      })

      .addCase(createProject.fulfilled, (state, action) => {
        state.projects = [action.payload?.createdProject, ...state.projects];
      })

      .addCase(updateProject.fulfilled, (state, action) => {
        state.projects = state.projects.map(project => project?._id === action.payload?.updatedProject?._id ? action.payload?.updatedProject : project);
      })

        .addCase(fetchUserProjects.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userProjects = action.payload?.projects;
      })
      .addCase(fetchUserProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
 
  },
});

export default projectsSlice.reducer;
