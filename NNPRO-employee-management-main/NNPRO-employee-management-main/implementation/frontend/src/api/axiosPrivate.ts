import axios, {AxiosError} from "axios";
import {getToken} from "../services/tokenService.ts";

const axiosPrivate = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

axiosPrivate.interceptors.request.use(
    (config) => {
        const token = getToken('access');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("user_data");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default axiosPrivate;