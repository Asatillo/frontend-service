import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", {
    state: () => ({
        accessToken: "",
        refreshToken: "",
        user: {},
    }),
    actions: {
        setAccessToken(token) {
            this.accessToken = token;
        },
        setRefreshToken(token) {
            this.refreshToken = token;
        },
        setUser(user) {
            this.user = user;
        },
        logout() {
            this.accessToken = "";
            this.refreshToken = "";
            this.user = {};
        }
    },
    getters: {
        getAccessToken() {
            return this.accessToken;
        },
        getRefreshToken() {
            return this.refreshToken;
        },
        getUser() {
            return this.user;
        },
    }

});

