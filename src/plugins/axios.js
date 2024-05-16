import router from "@/plugins/router";
import axios from "axios";
import { useSnackbarStore } from "@/stores/SnackBarStore"
import { refreshToken } from "@/services/rest/auth-api";

const snackbarStore = useSnackbarStore();

const http = axios.create({
    withCredentials: true,
    baseURL: "http://localhost:8765/",
    headers: {
        "Content-type": "application/json",
    },
});

http.interceptors.request.use((config) => {
    config.headers = {
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`
    };
    return config;
});

http.interceptors.response.use(response => response, error => {
    if (error.response.status === 403) {
        snackbarStore.showSnackbar("Forbidden", "mdi-alert-circle", "error", 3000);
    }

    if (error.response.status === 401) {
        snackbarStore.showSnackbar("Unauthorized", "mdi-alert-circle", "error", 3000);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        router.push({ name: "Login", });
    }

    if (error.response.status === 503 || error.response.status === 500) {
        snackbarStore.showSnackbar("Service Temporarily Unavailable", "mdi-alert-circle", "error", 3000);
    }

    if (error.response.status === 400) {
        if (error.response.data.error) {
            var errorText = "";
            if(error.response.data.validationErrors){
                for (var key in error.response.data.validationErrors) {
                    errorText += error.response.data.validationErrors[key] + "\n";
                }
            }
            else if(error.response.data.error){
                errorText += error.response.data.message;
            }
            
            snackbarStore.showSnackbar(errorText, "mdi-alert-circle", "error", 3000);
        }

        if(error.response.data.success === false){
            snackbarStore.showSnackbar(error.response.data.message, "mdi-alert-circle", "error", 3000);
        }
    }

    return Promise.reject(error);
});

export default http;