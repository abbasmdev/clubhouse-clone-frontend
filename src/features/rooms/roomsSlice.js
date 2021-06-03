import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getUserJoinedRooms,
  createRoom,
  getJoinedRoomDetail,
  getPublicRooms,
} from "./roomsAPI";

const initialState = {
  joinedRooms: [],
  publicRooms: [],
  createRoomStatus: "idle",
  getJoinedRoomDetailStatus: "idle",
  currentRoom: null,
  currentRoomId: null,
};

export const getUserJoinedRoomsAsync = createAsyncThunk(
  "rooms/getUserJoinedRooms",
  async (undefined, thunkAPI) => {
    const token = thunkAPI?.getState()?.auth?.token;
    const response = await getUserJoinedRooms({ token });

    return response?.data?.rooms;
  }
);

export const getPublicRoomsAsync = createAsyncThunk(
  "rooms/getPublicRooms",
  async (undefined, thunkAPI) => {
    const token = thunkAPI?.getState()?.auth?.token;
    console.log(token);
    const response = await getPublicRooms({ token });

    return response?.data?.rooms;
  }
);

export const createRoomAsync = createAsyncThunk(
  "rooms/createRoom",
  async ({ roomName, roomType }, thunkAPI) => {
    const token = thunkAPI?.getState()?.auth?.token;
    const response = await createRoom({ token, roomName, roomType });
    return response?.data?.room;
  }
);

export const getJoinedRoomDetailAsync = createAsyncThunk(
  "rooms/getJoinedRoomDetail",
  async ({ roomId }, thunkAPI) => {
    const token = thunkAPI?.getState()?.auth?.token;
    const response = await getJoinedRoomDetail({ token, roomId });

    return response?.data?.room;
  }
);

// export const sendOtpCodeToUserAsync = createAsyncThunk(
//   "auth/sendOtpCodeToUser",
//   async ({ mobile }) => {
//     const response = await sendOtpCodeToUser({ mobile });
//     return response.data;
//   }
// );

export const roomsSlice = createSlice({
  name: "rooms",
  initialState,

  reducers: {
    setCreateRoomStatus: (state, action) => {
      state.createRoomStatus = action.payload || "idle";
    },
    setCurrentRoom: (state, action) => {
      state.currentRoom = action.payload;
    },
    setCurrentRoomId: (state, action) => {
      state.currentRoomId = action.payload;
    },
    setGetJoinedRoomDetailStatus: (state, action) => {
      state.getJoinedRoomDetailStatus = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getUserJoinedRoomsAsync.pending, (state) => {})
      .addCase(getUserJoinedRoomsAsync.rejected, (state) => {})
      .addCase(getUserJoinedRoomsAsync.fulfilled, (state, action) => {
        const rooms = action.payload;
        if (rooms?.length >= 0) state.joinedRooms = rooms;
      })
      .addCase(createRoomAsync.pending, (state) => {
        state.createRoomStatus = "pending";
      })
      .addCase(createRoomAsync.rejected, (state) => {
        state.createRoomStatus = "rejected";
      })
      .addCase(createRoomAsync.fulfilled, (state, action) => {
        const room = action.payload;
        state.createRoomStatus = "succeed";
      })
      .addCase(getPublicRoomsAsync.rejected, (state) => {})
      .addCase(getPublicRoomsAsync.fulfilled, (state, action) => {
        const rooms = action.payload;
        if (rooms?.length >= 0) state.publicRooms = rooms;
      })
      .addCase(getJoinedRoomDetailAsync.pending, (state) => {
        state.getJoinedRoomDetailStatus = "pending";
      })
      .addCase(getJoinedRoomDetailAsync.rejected, (state) => {
        state.getJoinedRoomDetailStatus = "rejected";
      })
      .addCase(getJoinedRoomDetailAsync.fulfilled, (state, action) => {
        const room = action.payload;

        state.currentRoom = room;
        state.getJoinedRoomDetailStatus = "succeed";
      });
  },
});

export const {
  setCreateRoomStatus,
  setCurrentRoomId,
  setCurrentRoom,
  setGetJoinedRoomDetailStatus,
} = roomsSlice.actions;

export const selectRooms = (state) => state.rooms.value;
export const getJoinedRoomDetailStatus = (state) =>
  state.rooms.getJoinedRoomDetailStatus;
export const selectCurrentRoom = (state) => state.rooms.currentRoom;
export const selectCurrentRoomId = (state) => state.rooms.currentRoomId;
export const selectJoinedRooms = (state) => state.rooms.joinedRooms;
export const selectPublicRooms = (state) => state.rooms.publicRooms;
export const selectCreateRoomStatus = (state) => state.rooms.createRoomStatus;

export default roomsSlice.reducer;
