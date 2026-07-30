import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

const initialState = {
  comments: []
};

const commentsSlice = createSlice({
  name: "comments",

  initialState,

  reducers: {

    // Add Comment
    addComment: (state, action) => {

      state.comments.push({
        id: uuid(),
        postId: action.payload.postId,
        author: action.payload.author,
        text: action.payload.text,
        editing: false,
        date: new Date().toLocaleString()
      });

    },

    // Delete Comment
    deleteComment: (state, action) => {

      state.comments = state.comments.filter(
        comment => comment.id !== action.payload
      );

    },

    // Start Editing
    startEditingComment: (state, action) => {

      const comment = state.comments.find(
        comment => comment.id === action.payload
      );

      if(comment){

        comment.editing = true;

      }

    },

    // Cancel Editing
    cancelEditingComment: (state, action) => {

      const comment = state.comments.find(
        comment => comment.id === action.payload
      );

      if(comment){

        comment.editing = false;

      }

    },

    // Update Comment
    updateComment: (state, action) => {

      const comment = state.comments.find(
        comment => comment.id === action.payload.id
      );

      if(comment){

        comment.text = action.payload.text;

        comment.editing = false;

      }

    }

  }

});

export const {

  addComment,

  deleteComment,

  startEditingComment,

  cancelEditingComment,

  updateComment

} = commentsSlice.actions;

export default commentsSlice.reducer;