import axios from "axios";

const instance = axios.create({
  baseURL: "https://ecommercebackend-ahz8.onrender.com",
  withCredentials: true,
});


instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);



export default instance;
