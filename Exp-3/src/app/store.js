import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import draftsReducer from "../features/drafts/draftsSlice";
import postsReducer from "../features/posts/postsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    drafts: draftsReducer,
    posts: postsReducer
  }
});
