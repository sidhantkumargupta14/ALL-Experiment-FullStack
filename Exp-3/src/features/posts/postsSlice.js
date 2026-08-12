import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import api from "../../api";

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
});

export const fetchPosts = createAsyncThunk("posts/fetch", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/posts");
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Could not load posts.");
  }
});

export const publishPost = createAsyncThunk("posts/publish", async (post, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/posts", post);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Could not publish post.");
  }
});

export const updatePost = createAsyncThunk(
  "posts/update",
  async ({ id, ...post }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/posts/${id}`, post);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Could not update post.");
    }
  }
);

export const deletePost = createAsyncThunk("posts/delete", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/posts/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Could not delete post.");
  }
});

const slice = createSlice({
  name: "posts",
  initialState: postsAdapter.getInitialState({ loading: false, error: null }),
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPosts.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        postsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(publishPost.fulfilled, (state, action) => {
        postsAdapter.addOne(state, action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        postsAdapter.upsertOne(state, action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        postsAdapter.removeOne(state, action.payload);
      });
  }
});

export const postSelectors = postsAdapter.getSelectors(state => state.posts);
export default slice.reducer;
