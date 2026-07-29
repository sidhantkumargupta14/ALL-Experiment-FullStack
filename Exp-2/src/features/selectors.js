import { createSelector } from "reselect";

const selectCounter = (state) => state.counter.value;

export const counterValue = createSelector(
  [selectCounter],
  (value) => value
);