<template>
    <v-navigation-drawer v-model="drawer" permanent
        style="color: azure; background-color: rgb(45, 47, 64); max-width: fit-content;" elevation="10" :rail="rail"
        @click="rail = false">
        <v-list density="compact">
            <v-list-item prepend-avatar="logo_nova.png" title="NOVA" @click="redirectToRoute('Home')">
                <template v-slot:append>
                    <v-btn v-if="!rail" variant="text" icon="mdi-chevron-left" @click.stop="rail = !rail"></v-btn>
                </template>
            </v-list-item>
        </v-list>
        <v-divider></v-divider>

        <v-list :lines="false" density="compact" nav>
            <template v-for="item in menuItems">
                <v-list-item @click="redirectToRoute(item.value)" :title="item.title"
                    v-if="isVisible(item.roleRequired)">
                    <template v-slot:prepend>
                        <v-icon :icon="item.icon" size="18"></v-icon>
                    </template>
                </v-list-item>
            </template>
        </v-list>

        <template v-slot:append>
            <v-list :lines="false" density="compact" nav>
                <v-list-item @click="handleChangeTheme" :title="isDark ? 'Light mode' : 'Dark mode'">
                    <template v-slot:prepend>
                        <v-icon icon="mdi-theme-light-dark" size="18"></v-icon>
                    </template>
                </v-list-item>
                <!-- <v-list-item @click="redirectToRoute('Settings')" title="Settings">
                    <template v-slot:prepend>
                        <v-icon icon="mdi-cog" size="18"></v-icon>
                    </template>
                </v-list-item> -->
                <v-divider thickness="3" class="pb-1"></v-divider>
                <v-list-item v-if="user.username" :prepend-avatar="user.imageUrl" :title="user.username">
                    <template v-slot:append>
                        <v-btn class="ml-2" variant="text" @click.stop="handleLogout" icon="mdi-logout"></v-btn>
                    </template>
                </v-list-item>
            </v-list>
        </template>
    </v-navigation-drawer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import vuetify from '@/plugins/vuetify';
import router from '@/plugins/router';
import { useSnackbarStore } from '@/stores/SnackBarStore';
import { refreshToken } from '@/services/rest/auth-api';

const drawer = ref(true)
const rail = ref(false)
const menuItems = [
    { icon: 'mdi-account-multiple', value: 'Customers', title: 'Customers', roleRequired: ['admin', 'agent'] },
    { icon: 'mdi-playlist-check', value: 'Subscriptions', title: 'Subscriptions', roleRequired: ['admin', 'agent', 'sales'] },
    { icon: 'mdi-currency-usd', value: 'Sales', title: 'Sales', roleRequired: ['admin', 'sales'] },
    { icon: 'mdi-gift', value: 'Promotions', title: 'Promotions', roleRequired: ['admin', 'sales'] },
    { icon: 'mdi-account-question', value: 'OfferedPromotions', title: 'Offered Promotions', roleRequired: ['admin', 'sales'] },
    { icon: 'mdi-format-list-bulleted-type', value: 'Plans', title: 'Plans', roleRequired: ['admin', 'agent'] },
    { icon: 'mdi-floor-plan', value: 'Services', title: 'Services', roleRequired: ['admin', 'agent', 'sales'] },
    { icon: 'mdi-router-wireless', value: 'Devices', title: 'Devices', roleRequired: ['admin', 'agent', 'sales'] },
    { icon: 'mdi-phone-dial', value: 'NetworkEntities', title: 'Network Entities', roleRequired: ['admin', 'agent'] },
]
var user = {};
const isDark = ref(null)

onMounted(() => {
    isDark.value = vuetify.theme.global.name.value == 'dark'
    var authToken = localStorage.getItem('access_token');
    var refreshToken = localStorage.getItem('refresh_token');
    user = JSON.parse(localStorage.getItem('user'));
    if (!authToken || !refreshToken || !user){
        router.push({ name: 'Login' });
    }
});

function redirectToRoute(routeValue) {
    router.push({ name: routeValue });
};

function handleLogout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    useSnackbarStore().showSnackbar('Logged out successfully', 'mdi-check', 'success', 3000);
    router.push({ name: 'Login' });
};

function handleChangeTheme() {
    vuetify.theme.global.name.value = isDark.value ? 'light' : 'dark'
    isDark.value = !isDark.value
};

function isVisible(rolesRequired) {
  var setA = new Set(user.roles);
  var setB = new Set(rolesRequired);
  var intersection = new Set([...setA].filter(x => setB.has(x)));
  return Array.from(intersection).length > 0;
}
</script>

<style>
.bottom-drawer-items {
    position: absolute;
    bottom: 0;
}

/* TODO: place it to the global css file */
.v-table {
    border-radius: 13px;
    padding: 10px;
}
</style>