import router from "@/router";
import axios from "axios";

const unauthorizedEndpoints = ["auth-service/auth/authenticate", "auth-service/auth/register"];

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
    return response;
}, (error) => {
    if (error.response.status === 403) {
        router.push({name: "Forbidden"});
    }
    else if (error.response.status === 401) {
        localStorage.removeItem("accessToken");
        router.push({name: "Login", });
    }
    else if (error.response.status === 503) {
        router.push({name: "ServiceUnavailable"});
    }
    else{
        router.push({name: "Unhandled"});
    }
    
    return Promise.reject(error);
});

export default http;