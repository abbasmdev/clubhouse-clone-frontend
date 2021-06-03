// export const API_BASE_URL = "https://cloub-house-server.herokuapp.com/api";
export const API_BASE_URL = "https://cloub-house-server.herokuapp.com/api";
export const SERVER_BASE_URL = "https://cloub-house-server.herokuapp.com";
export const PROIFLE_IMAGES_BASE_URL =
  "https://cloub-house-server.herokuapp.com/public/uploads/profile-images";

export const PEER_OPT = {
  config: {
    iceServers: [
      {
        url: "stun:global.stun.twilio.com:3478?transport=udp",
        urls: "stun:global.stun.twilio.com:3478?transport=udp",
      },
      {
        url: "turn:global.turn.twilio.com:3478?transport=udp",
        username:
          "08f8cf846b5139f453c7c869ab5ba68b0fcb10181b9f6a6257924d305da019b8",
        urls: "turn:global.turn.twilio.com:3478?transport=udp",
        credential: "kWYghdUkQ722xruhiO7rZVgyZ2UmfCyVLk+LzAWXivE=",
      },
    ],
  },
  debug: 3,
};
