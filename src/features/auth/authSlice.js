import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser, sendOtpCodeToUser, getMe } from "./authAPI";

const initialState = {
  initalized: false,
  token: null,
  user: null,
  sendOtpCodeToUserStatus: "idle",
  loginUserStatus: "idle",
  registerUserStatus: "idle",
  registerUserErrorMessage: null,
};

export const loginUserAync = createAsyncThunk(
  "auth/loginUser",
  async ({ mobile, code }) => {
    const response = await loginUser({ mobile, code });
    return response.data;
  }
);

export const registerUserAync = createAsyncThunk(
  "auth/registerUser",
  async (
    { userName, code, fullName, imageFile, mobile },
    { rejectWithValue }
  ) => {
    try {
      const response = await registerUser({
        userName,
        code,
        fullName,
        imageFile,
        mobile,
      });

      return response.data;
    } catch (err) {
      console.log(err.response.data);
      console.log(err.response);
      return rejectWithValue(err.response.data);
    }
  }
);

export const getMeAsync = createAsyncThunk(
  "auth/getMe",
  async (undefined, thunkApi) => {
    const token = thunkApi?.getState()?.auth?.token;
    const response = await getMe({ token });
    return response.data;
  }
);

export const sendOtpCodeToUserAsync = createAsyncThunk(
  "auth/sendOtpCodeToUser",
  async ({ mobile }) => {
    try {
      const response = await sendOtpCodeToUser({ mobile });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setToken: (state, action) => {
      const token = action.payload;
      state.token = token;
      localStorage.setItem("token", token);
    },
    setUser: (state, action) => {
      const user = action?.payload;
      state.user = user;
    },
    logoutUser: (state) => {
      localStorage.removeItem("token");
      state.token = null;
      state.user = null;
    },
    fetchLocalAndSetToken: (state) => {
      const token = localStorage.getItem("token");
      state.token = token;
      state.initalized = true;
    },
    sendOtpCodeToUserStatusIdle: (state, action) => {
      state.sendOtpCodeToUserStatus = "idle";
    },
    loginUserStatusIdle: (state, action) => {
      state.loginUserStatus = "idle";
    },
    setRegisterUserStatusMsgIdle: (state, action) => {
      state.registerUserStatus = "idle";
      state.registerUserErrorMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(sendOtpCodeToUserAsync.pending, (state) => {
        state.sendOtpCodeToUserStatus = "loading";
      })
      .addCase(sendOtpCodeToUserAsync.rejected, (state) => {
        state.sendOtpCodeToUserStatus = "rejected";
      })
      .addCase(sendOtpCodeToUserAsync.fulfilled, (state) => {
        state.sendOtpCodeToUserStatus = "succeed";
      })
      .addCase(loginUserAync.pending, (state) => {
        state.loginUserStatus = "loading";
      })
      .addCase(loginUserAync.rejected, (state) => {
        state.loginUserStatus = "rejected";
      })
      .addCase(loginUserAync.fulfilled, (state, action) => {
        const token = action?.payload?.token;
        state.token = token;
        localStorage.setItem("token", token);
        state.loginUserStatus = "succeed";
      })
      .addCase(registerUserAync.pending, (state) => {
        state.registerUserStatus = "loading";
      })
      .addCase(registerUserAync.rejected, (state, action) => {
        state.registerUserStatus = "rejected";
        const message = action?.payload?.message || "Unknown error";
        state.registerUserErrorMessage = message;
      })
      .addCase(registerUserAync.fulfilled, (state, action) => {
        const token = action?.payload?.token;
        state.token = token;
        localStorage.setItem("token", token);
        state.registerUserStatus = "succeed";
      })
      .addCase(getMeAsync.fulfilled, (state, action) => {
        const user = action?.payload?.user;
        state.user = user;
      });
  },
});

export const {
  loginUserStatusIdle,
  sendOtpCodeToUserStatusIdle,
  setToken,
  fetchLocalAndSetToken,
  setUser,
  logoutUser,
  setRegisterUserStatusMsgIdle,
} = authSlice.actions;

export const selectAuth = (state) => state.auth.value;
export const selectAuthUser = (state) => state.auth.user;
export const selectInitalized = (state) => state.auth.initalized;
export const selectAuthToken = (state) => state.auth.token;
export const selectLoginUserStatus = (state) => state.auth.loginUserStatus;
export const selectAuthSendOtpCodeToUserStatus = (state) =>
  state.auth.sendOtpCodeToUserStatus;
export const selectRegisterUserStatus = (state) =>
  state.auth.registerUserStatus;
export const selectRegisterUserErrorMessage = (state) =>
  state.auth.registerUserErrorMessage;
export default authSlice.reducer;
