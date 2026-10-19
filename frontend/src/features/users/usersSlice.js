import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { logoutUser } from "../auth/authSlice";

// 1. Fetch all users
export const fetchAllUsers = createAsyncThunk(
    "users/fetchAllUsers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/auth/users");
            const body = response.data;

            // Tumhare existing Dashboard mein res.data use ho raha hai.
            // In common response shapes ko support kar rahe hain.
            const users = body?.data ?? body?.users ?? body;

            if (!Array.isArray(users)) {
                return rejectWithValue(
                    "Unexpected users response. Check the backend response format."
                );
            }

            return users;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to load users list."
            );
        }
    }
);

// 2. Delete a user
export const deleteUserById = createAsyncThunk(
    "users/deleteUserById",
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/users/${id}`);

            // Successful deletion ke baad reducer ko ID milegi.
            return id;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to delete user."
            );
        }
    }
);

const initialState = {
    items: [],

    listStatus: "idle",
    listError: null,

    deletingId: null,
    deleteError: null,
};

const usersSlice = createSlice({
    name: "users",
    initialState,

    reducers: {},

    extraReducers: (builder) => {
        // FETCH USERS
        builder
            .addCase(fetchAllUsers.pending, (state) => {
                state.listStatus = "loading";
                state.listError = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.listStatus = "succeeded";
                state.items = action.payload;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.listStatus = "failed";
                state.listError =
                    action.payload || action.error.message;
            });

        // DELETE USER
        builder
            .addCase(deleteUserById.pending, (state, action) => {
                state.deletingId = action.meta.arg;
                state.deleteError = null;
            })
            .addCase(deleteUserById.fulfilled, (state, action) => {
                state.items = state.items.filter(
                    (user) => user._id !== action.payload
                );

                state.deletingId = null;
            })
            .addCase(deleteUserById.rejected, (state, action) => {
                state.deletingId = null;
                state.deleteError =
                    action.payload || action.error.message;
            });

        // Logout par purani admin users list bhi clear karein
        const resetUsers = (state) => {
            state.items = [];
            state.listStatus = "idle";
            state.listError = null;
            state.deletingId = null;
            state.deleteError = null;
        };

        builder
            .addCase(logoutUser.fulfilled, resetUsers)
            .addCase(logoutUser.rejected, resetUsers);
    },
});

export default usersSlice.reducer;