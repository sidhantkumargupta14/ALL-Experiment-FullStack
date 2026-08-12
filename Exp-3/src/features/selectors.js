import { createSelector } from "reselect";
import { draftSelectors } from "./drafts/draftsSlice";
import { postSelectors } from "./posts/postsSlice";

export const selectDrafts = draftSelectors.selectAll;
export const selectPosts = postSelectors.selectAll;

export const selectDraftCount = createSelector(
  [selectDrafts],
  drafts => drafts.length
);

export const selectPostCount = createSelector(
  [selectPosts],
  posts => posts.length
);

export const selectPlatformStats = createSelector(
  [selectPosts],
  posts => {
    const stats = {};
    posts.forEach(post => {
      post.platforms.forEach(platform => {
        stats[platform] = (stats[platform] || 0) + 1;
      });
    });
    return stats;
  }
);
