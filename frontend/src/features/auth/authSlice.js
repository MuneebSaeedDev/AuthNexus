import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// createSlice() aapki state aur us state ko update karne ke rules define karta hai.
// createAsyncThunk() asynchronous operations, jaise backend API se login karna ya users ki list fetch karna, manage karne mein help karta hai.

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
)


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
    'auth/logoutUser',
    async (_, { rejectWithValue }) => {
        try {
            await api.post('auth/logout');
            return true
        } catch (error) {
            rejectWithValue(
                error.respose?.data?.message || "Logout request failed."
            )
        }
    }
)

const initialState = {
    user: getSaveduser(),

    loginStatus: "idle",
    loginError: null,

    logoutStatus: "idle",
}

const authSlice = createSlice({

    // createSlice() ek Redux state section banata hai.Ismein aap define karte ho:
    // - State ka naam kya hai.
    // - Starting state kya hogi.
    // - State ko manually update karne ke rules kya hain.
    // - API requests ke results aane par state kaise update hogi.

    name: "auth",
    initialState,

    // reducers
    // Aapke slice ke andar define kiye gaye normal actions handle karta hai.
    // Example: clearAuthErrors()

    reducers: {
        clearAuthErrors(state) {
            state.loginError = null;
            state.signupError = null;
        },
    },

    // extraReducers
    // Slice ke bahar define hue actions, jaise createAsyncThunk() ke pending, fulfilled aur rejected      actions, handle karta hai.
    // Example: loginUser.pending

    extraReducers: (builder) => {
        // LOGIN
        // builder.addCase(action, reducerFunction);
        builder
            .addCase(loginUser.pending, (state) => {
                state.loginStatus = "loading";
                state.loginError = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loginStatus = "succeeded";
                state.user = action.payload;
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
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.signupStatus = "failed";
                state.signupError =
                    action.payload || action.error.message;
            })

        // LOGOUT
        builder
            .addCase(logoutUser.pending, (state) => {
                state.logoutStatus = "loading";
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.logoutStatus = "succeeded";
            })
            .addCase(logoutUser.rejected, (state) => {
                // Local UI state clear kar dein,
                // chahe server request fail ho jaye.
                state.user = null;
                state.logoutStatus = "failed";
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

    }
})

export const { clearAuthErrors } = authSlice.actions;



export default authSlice.reducer;