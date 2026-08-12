import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import api from "../../api";

const draftsAdapter = createEntityAdapter({
  sortComparer: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
});

export const fetchDrafts = createAsyncThunk("drafts/fetch", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/drafts");
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Could not load drafts.");
  }
});

export const createDraft = createAsyncThunk("drafts/create", async (draft, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/drafts", draft);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Could not create draft.");
  }
});

export const updateDraft = createAsyncThunk("drafts/update", async ({ id, ...draft }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/drafts/${id}`, draft);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Could not update draft.");
  }
});

export const deleteDraft = createAsyncThunk("drafts/delete", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/drafts/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Could not delete draft.");
  }
});

const slice = createSlice({
  name: "drafts",
  initialState: draftsAdapter.getInitialState({ loading: false, error: null }),
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchDrafts.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchDrafts.fulfilled, (state, action) => {
        state.loading = false;
        draftsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchDrafts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createDraft.fulfilled, (state, action) => {
        draftsAdapter.addOne(state, action.payload);
      })
      .addCase(updateDraft.fulfilled, (state, action) => {
        draftsAdapter.upsertOne(state, action.payload);
      })
      .addCase(deleteDraft.fulfilled, (state, action) => {
        draftsAdapter.removeOne(state, action.payload);
      });
  }
});

export const draftSelectors = draftsAdapter.getSelectors(state => state.drafts);
export default slice.reducer;
