import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

function getSaveduser() {
    try {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    } catch {
        localStorage.removeItem("user");
        return null;
    }
}

// 1. LOGIN
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await api.post("/auth/login", { email, password });
            return {
                ...response.data.user,
                session: response.data.session,
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to login."
            );
        }
    }
);

// GOOGLE LOGIN
export const googleAuthLogin = createAsyncThunk(
    "auth/googleAuthLogin",
    async (credential, { rejectWithValue }) => {
        try {
            const response = await api.post("/auth/google", {
                credential,
            });

            return {
                ...response.data.user,
                session: response.data.session,
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Google authentication failed."
            );
        }
    }
);

// 2. SIGNUP
export const signupUser = createAsyncThunk(
    "auth/signupUser",
    async ({ name, email, password }, { rejectWithValue }) => {
        try {
            const response = await api.post("/auth/signup", { name, email, password });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to create account."
            );
        }
    }
);

// 3. LOGOUT
export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, { rejectWithValue }) => {
        try {
            await api.post("/auth/logout");
            return true;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Logout request failed."
            );
        }
    }
);

const initialState = {
    user: getSaveduser(),

    loginStatus: "idle",
    loginError: null,
    signupStatus: "idle",
    signupError: null,
    logoutStatus: "idle",
};

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        clearAuthErrors(state) {
            state.loginError = null;
            state.signupError = null;
        },
    },

    extraReducers: (builder) => {
        // LOGIN
        builder
            .addCase(loginUser.pending, (state) => {
                state.loginStatus = "loading";
                state.loginError = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loginStatus = "succeeded";
                state.loginError = null;
                state.user = action.payload;
                localStorage.setItem("user", JSON.stringify(action.payload));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loginStatus = "failed";
                state.loginError =
                    action.payload || action.error.message;
            });

        // SIGNUP
        builder
            .addCase(signupUser.pending, (state) => {
                state.signupStatus = "loading";
                state.signupError = null;
            })
            .addCase(signupUser.fulfilled, (state) => {
                state.signupStatus = "succeeded";
                state.signupError = null;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.signupStatus = "failed";
                state.signupError =
                    action.payload || action.error.message;
            });

        // LOGOUT
        builder
            .addCase(logoutUser.pending, (state) => {
                state.logoutStatus = "loading";
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.logoutStatus = "succeeded";
                localStorage.removeItem("user");
            })
            .addCase(logoutUser.rejected, (state) => {
                state.user = null;
                state.logoutStatus = "failed";
                localStorage.removeItem("user");
            });

        // GOOGLE LOGIN
        builder
            .addCase(googleAuthLogin.pending, (state) => {
                state.loginStatus = "loading";
                state.loginError = null;
            })
            .addCase(googleAuthLogin.fulfilled, (state, action) => {
                state.loginStatus = "succeeded";
                state.loginError = null;
                state.user = action.payload;

                localStorage.setItem(
                    "user",
                    JSON.stringify(action.payload)
                );
            })
            .addCase(googleAuthLogin.rejected, (state, action) => {
                state.loginStatus = "failed";
                state.loginError =
                    action.payload || action.error.message;
            });
    },
});

export const { clearAuthErrors } = authSlice.actions;

export default authSlice.reducer;