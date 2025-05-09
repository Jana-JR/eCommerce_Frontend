import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5001",
  withCredentials: true,
});


instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);



export default instance;
