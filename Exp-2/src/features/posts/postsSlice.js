import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

// Fetch Sample Posts
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async () => {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts?_limit=5"
    );

    const data = await response.json();

    return data;
  }
);

const initialState = {
  posts: [],
  loading: false,
  search: "",
};

const postsSlice = createSlice({
  name: "posts",

  initialState,

  reducers: {
    addPost: (state, action) => {
      state.posts.unshift({
        id: uuid(),
        author: action.payload.author,
        platform: action.payload.platform,
        content: action.payload.content,
        likes: 0,
        editing: false,
        date: new Date().toLocaleString(),
      });
    },

    deletePost: (state, action) => {
      state.posts = state.posts.filter(
        (post) => post.id !== action.payload
      );
    },

    likePost: (state, action) => {
      const post = state.posts.find(
        (post) => post.id === action.payload
      );

      if (post) {
        post.likes++;
      }
    },

    startEditing: (state, action) => {
      const post = state.posts.find(
        (post) => post.id === action.payload
      );

      if (post) {
        post.editing = true;
      }
    },

    cancelEditing: (state, action) => {
      const post = state.posts.find(
        (post) => post.id === action.payload
      );

      if (post) {
        post.editing = false;
      }
    },

    updatePost: (state, action) => {
      const post = state.posts.find(
        (post) => post.id === action.payload.id
      );

      if (post) {
        post.content = action.payload.content;
        post.platform = action.payload.platform;
        post.editing = false;
      }
    },

    setSearch: (state, action) => {
      state.search = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;

        state.posts = action.payload.map((item) => ({
          id: item.id,
          author: "Demo User",
          platform: "LinkedIn",
          content: item.title,
          likes: Math.floor(Math.random() * 100),
          editing: false,
          date: "Fetched",
        }));
      })

      .addCase(fetchPosts.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  addPost,
  deletePost,
  likePost,
  startEditing,
  cancelEditing,
  updatePost,
  setSearch,
} = postsSlice.actions;

export default postsSlice.reducer;