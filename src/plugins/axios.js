import router from "@/router";
import axios from "axios";
import { useSnackbarStore } from "@/stores/SnackBarStore"

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
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        };
    }
    return config;
});

http.interceptors.response.use((response) => {
    if(response.status === 200 || response.status === 201){
        return response;
    }else{
        snackbarStore.showSnackbar("Unhandled Error", "mdi-alert-circle", "error", 3000);
        return Promise.reject(response);
    }
}, (error) => {
    if (error.response.status === 403) {
        snackbarStore.showSnackbar("Forbidden", "mdi-alert-circle", "error", 3000);
    }
    else if (error.response.status === 401) {
        snackbarStore.showSnackbar("Unauthorized", "mdi-alert-circle", "error", 3000);
        localStorage.removeItem("accessToken");
        router.push({name: "Login", });
    }
    else if (error.response.status === 503 || error.response.status === 500) {
        snackbarStore.showSnackbar("Service Temporarily Unavailable", "mdi-alert-circle", "error", 3000);}
    else{
        router.push({name: "Unhandled"});
    }
    
    return Promise.reject(error);
});

export default http;