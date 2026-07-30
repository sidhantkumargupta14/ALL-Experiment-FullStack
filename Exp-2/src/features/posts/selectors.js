import { createSelector } from "@reduxjs/toolkit";

const selectPosts = (state) => state.posts.posts;
const selectSearch = (state) => state.posts.search;
const selectComments = (state) => state.comments.comments;

export const selectFilteredPosts = createSelector(
  [selectPosts, selectSearch],
  (posts, search) => {
    if (!search) return posts;

    return posts.filter(
      (post) =>
        post.content.toLowerCase().includes(search.toLowerCase()) ||
        post.author.toLowerCase().includes(search.toLowerCase()) ||
        post.platform.toLowerCase().includes(search.toLowerCase())
    );
  }
);

export const totalPosts = createSelector(
  [selectPosts],
  (posts) => posts.length
);

export const totalLikes = createSelector(
  [selectPosts],
  (posts) => posts.reduce((sum, post) => sum + post.likes, 0)
);

export const averageLikes = createSelector(
  [selectPosts],
  (posts) => {
    if (posts.length === 0) return 0;

    const total = posts.reduce((sum, post) => sum + post.likes, 0);

    return (total / posts.length).toFixed(2);
  }
);

export const totalComments = createSelector(
  [selectComments],
  (comments) => comments.length
);

export const mostLikedPost = createSelector(
  [selectPosts],
  (posts) => {
    if (posts.length === 0) return null;

    return [...posts].sort((a, b) => b.likes - a.likes)[0];
  }
);

export const mostUsedPlatform = createSelector(
  [selectPosts],
  (posts) => {
    if (posts.length === 0) return "-";

    const count = {};

    posts.forEach((post) => {
      count[post.platform] = (count[post.platform] || 0) + 1;
    });

    return Object.keys(count).reduce((a, b) =>
      count[a] > count[b] ? a : b
    );
  }
);

export const engagementRate = createSelector(
  [selectPosts, selectComments],
  (posts, comments) => {
    if (posts.length === 0) return "0%";

    const likes = posts.reduce((sum, post) => sum + post.likes, 0);

    const engagement = ((likes + comments.length) / posts.length).toFixed(1);

    return engagement + "%";
  }
);