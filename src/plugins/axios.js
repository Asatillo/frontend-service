import router from "@/router";
import axios from "axios";
import { useSnackbarStore } from "@/stores/SnackBarStore"
import { useAuthStore } from "@/stores/AuthStore";
import { refreshToken } from "@/services/rest/auth-api";

const unauthorizedEndpoints = ["auth-service/auth/authenticate", "auth-service/auth/register"];
const snackbarStore = useSnackbarStore();

const http = axios.create({
    withCredentials: true,
    baseURL: "http://localhost:8765/",
    headers: {
        "Content-type": "application/json",
    },
});

http.interceptors.request.use((config) => {
    if (!unauthorizedEndpoints.includes(config.url)) {
        config.headers = {
            "Authorization": `Bearer ${useAuthStore().getAccessToken}`
        };
    }
    return config;
});

http.interceptors.response.use(response => response, error => {
    if (error.response.status === 403) {
        snackbarStore.showSnackbar("Forbidden", "mdi-alert-circle", "error", 3000);
    }
    
    if (error.response.status === 401) {
        snackbarStore.showSnackbar("Unauthorized", "mdi-alert-circle", "error", 3000);
        useAuthStore().logout();
        router.push({name: "Login", });
    }
    
    if (error.response.status === 503 || error.response.status === 500) {
        snackbarStore.showSnackbar("Service Temporarily Unavailable", "mdi-alert-circle", "error", 3000);
    }
    
    return Promise.reject(error);
});

export default http;