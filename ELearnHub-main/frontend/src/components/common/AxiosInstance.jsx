import axios from "axios";

const axiosInstance = axios.create({
   baseURL: "http://localhost:5001/", // ✅ Change to 5000
   headers: {
      "Content-Type": "application/json",
   },
});

export default axiosInstance;
