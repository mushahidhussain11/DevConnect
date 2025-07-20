import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import postsReducer from '../features/posts/postsSlice';
import commentsReducer from '../features/comments/commentsSlice';
import userReducer from '../features/user/userSlice';
import projectsReducer from '../features/projects/projectsSlice';
import messagesReducer from '../features/messages/messagesSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    comments: commentsReducer,
    user: userReducer,
    projects: projectsReducer,
    messages: messagesReducer

  },
});

export default store;
