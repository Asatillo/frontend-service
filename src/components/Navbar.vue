<template>
    <v-navigation-drawer expand-on-hover rail style="color: azure;"
        image="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg">
        <v-list>
            <v-list-item :prepend-avatar="image" :title="fullname" :subtitle="email"
                @click="redirectToRoute('MyProfile')"></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list>
            <v-list-item @click="redirectToRoute(item.title)" v-for="item in menuItems" :key="item.value"
                :prepend-icon="item.icon" :title="item.title" :value="item.value"></v-list-item>

        </v-list>

        <template v-slot:append>
            <v-list>
                <v-divider></v-divider>
                <v-list-item @click="handleChangeTheme" prepend-icon="mdi-theme-light-dark"
                    :title="isDark ? 'Light mode' : 'Dark mode'"></v-list-item>
                <v-list-item @click="redirectToRoute('Settings')" prepend-icon="mdi-cog" title="Settings"></v-list-item>
                <v-list-item @click="handleLogout" prepend-icon="mdi-logout" title="Logout"></v-list-item>
            </v-list>
        </template>
    </v-navigation-drawer>
</template>

<script setup>
import { ref, onMounted, } from 'vue'
import vuetify from '@/plugins/vuetify';
import router from '@/router';

const menuItems = ref([
    { icon: 'mdi-view-dashboard', title: 'Home', value: '' },
    { icon: 'mdi-account-multiple', title: 'Customers', value: 'customers' },
    { icon: 'mdi-playlist-check', title: 'Subscriptions', value: 'subscriptions' },
    { icon: 'mdi-currency-usd', title: 'Sales', value: 'sales' },
    { icon: 'mdi-format-list-bulleted-type', title: 'Plans', value: 'plans' },
    { icon: 'mdi-account-hard-hat', title: 'Users', value: 'users' },
    { icon: 'mdi-floor-plan', title: 'Services', value: 'services' },
    { icon: 'mdi-router-wireless', title: 'Devices', value: 'devices' },])
const user = ref(null)
const image = ref('')
const username = ref('')
const email = ref('')
const fullname = ref('')
const isDark = ref(null)

function redirectToRoute(routeValue) {
    router.push({ name: routeValue });
};

function handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    router.push({ name: 'Login' });
};

function handleChangeTheme() {
    vuetify.theme.global.name.value = isDark.value ? 'light' : 'dark'
    isDark.value = !isDark.value
};

onMounted(() => {
    isDark.value = vuetify.theme.global.name.value == 'dark'

    if (!localStorage.getItem('accessToken')) {
        router.push({ name: 'Login' });
    }

    if (localStorage.getItem('user')) {
        user.value = JSON.parse(localStorage.getItem('user'));
        image.value = user.value.imageUrl;
        username.value = user.value.username;
        fullname.value = user.value.firstName + ' ' + user.value.lastName;
        email.value = user.value.email;
    }
});
</script>

<style>
.bottom-drawer-items {
    position: absolute;
    bottom: 0;
}
</style>