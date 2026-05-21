import axios from "axios";

const API = axios.create({
  baseURL:
    "https://realtime-chat-app-backend-p1by.onrender.com/api",
});

export default API;