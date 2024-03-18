<template>
    <v-navigation-drawer v-model="drawer" permanent
        style="color: azure; background-color: rgb(45, 47, 64); max-width: fit-content;" elevation="10" :rail="rail"
        @click="rail = false">
        <v-list density="compact">
            <v-list-item title="NOVA" @click="redirectToRoute('Home')">
                <template v-slot:append>
                    <v-btn v-if="!rail" variant="text" icon="mdi-chevron-left" @click.stop="rail = !rail"></v-btn>
                </template>
            </v-list-item>
        </v-list>
        <v-divider></v-divider>

        <v-list :lines="false" density="compact" nav>
            <template v-for="item in menuItems">
                <v-list-item @click="redirectToRoute(item.value)" :title="item.title" v-if="isVisible(item.roleRequired)">
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
                <v-list-item @click="redirectToRoute('Settings')" title="Settings">
                    <template v-slot:prepend>
                        <v-icon icon="mdi-cog" size="18"></v-icon>
                    </template>
                </v-list-item>
                <v-divider thickness="3" class="pb-1"></v-divider>
                <v-list-item v-if="user" :prepend-avatar="user.imageUrl" :title="user.firstName"
                    @click="redirectToRoute('MyProfile')">
                    <template v-slot:append>
                        <v-btn class="ml-2" variant="text" @click.stop="handleLogout" icon="mdi-logout"></v-btn>
                    </template>
                </v-list-item>
            </v-list>
        </template>
    </v-navigation-drawer>
</template>

<script setup>
import { ref, onMounted, computed, } from 'vue'
import vuetify from '@/plugins/vuetify';
import router from '@/router';

const drawer = ref(true)
const rail = ref(false)
const menuItems = [
    { icon: 'mdi-account-multiple', value: 'Customers', title: 'Customers', roleRequired: 'AGENT' },
    { icon: 'mdi-playlist-check', value: 'Subscriptions', title: 'Subscriptions', roleRequired: 'AGENT' },
    { icon: 'mdi-currency-usd', value: 'Sales', title: 'Sales', roleRequired: 'SALES' },
    { icon: 'mdi-gift', value: 'Promotions', title: 'Promotions', roleRequired: 'SALES' },
    { icon: 'mdi-account-question', value: 'OfferedPromotions', title: 'Offered Promotions', roleRequired: 'SALES' },
    { icon: 'mdi-format-list-bulleted-type', value: 'Plans', title: 'Plans', roleRequired: 'AGENT' },
    { icon: 'mdi-account-hard-hat', value: 'Users', title: 'Users', roleRequired: 'ADMIN' },
    { icon: 'mdi-floor-plan', value: 'Services', title: 'Services', roleRequired: 'AGENT' },
    { icon: 'mdi-router-wireless', value: 'Devices', title: 'Devices', roleRequired: 'AGENT' },
    { icon: 'mdi-phone-dial', value: 'NetworkEntities', title: 'Network Entities', roleRequired: 'AGENT' },
]
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

function isVisible(role) {
    return user.value && Object.values(user.value.roles).includes(role)
}

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

/* TODO: place it to the global css file */
.v-table {
    border-radius: 13px;
    padding: 10px;
}
</style>