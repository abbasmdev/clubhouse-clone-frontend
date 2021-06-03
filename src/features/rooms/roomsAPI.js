import axios from "axios";
import { API_BASE_URL } from "../../config/app.config";

// A mock function to mimic making an async request for data
export function getUserJoinedRooms({ token }) {
  return axios.get(API_BASE_URL + "/rooms/get-joined-rooms", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

//get public not joined
export function getPublicRooms({ token }) {
  return axios.get(API_BASE_URL + "/rooms/get-public-rooms", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getJoinedRoomDetail({ token, roomId }) {
  return axios.post(
    API_BASE_URL + "/rooms/get-joined-room-detail",
    { roomId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}

export function createRoom({ token, roomName, roomType }) {
  return axios.post(
    API_BASE_URL + "/rooms/create-room",
    { name: roomName, type: roomType },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}
