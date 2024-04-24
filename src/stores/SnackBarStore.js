import { defineStore } from "pinia";

export const useSnackbarStore = defineStore("snackbarStore", {
    state: () => ({
        show: false,
        icon: "",
        timeout: 3000,
        text: "",
        color: "",
    }),
    actions: {
        showSnackbar(text, icon, color, timeout) {
            this.text = text;
            this.icon = icon;
            this.color = color;
            this.timeout = timeout;
            this.show = true;
        }
    }
});