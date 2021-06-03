import axios from "axios";
import { API_BASE_URL } from "../../config/app.config";

// A mock function to mimic making an async request for data
export function registerUser({ userName, code, fullName, imageFile, mobile }) {
  const bodyFormData = new FormData();
  bodyFormData.append("mobile", mobile);
  bodyFormData.append("code", code);
  bodyFormData.append("username", userName);
  bodyFormData.append("fullName", fullName);
  bodyFormData.append("image", imageFile);

  return axios.post(API_BASE_URL + "/auth/register", bodyFormData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
// A mock function to mimic making an async request for data
export function loginUser({ mobile, code }) {
  return axios.post(API_BASE_URL + "/auth/login", { mobile, code });
}

// A mock function to mimic making an async request for data
export function sendOtpCodeToUser({ mobile }) {
  return axios.post(API_BASE_URL + "/auth/send-otp", { mobile });
}

export function getMe({ token }) {
  return axios.get(API_BASE_URL + "/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}
