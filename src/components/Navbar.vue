<template>
    <v-card>
        <v-layout>
            <v-navigation-drawer expand-on-hover rail :elevation="2"
                image="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg">
                <v-list>
                    <v-list-item prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg" title="Sandra Adams"
                        subtitle="sandra_a88@gmailcom"></v-list-item>
                </v-list>

                <v-divider></v-divider>

                <v-list density="compact" nav>
                    <v-list-item @click="redirectToRoute(item.value)" v-for="item in menuItems" :key="item.value" :prepend-icon="item.icon" :title="item.title" :value="item.value">
                    </v-list-item>
                </v-list>
            </v-navigation-drawer>

            <v-main class="h-screen transition-all">
                <slot></slot>
            </v-main>
        </v-layout>
    </v-card>
</template>

<script>
export default {
    data() {
        return {
            menuItems: [
                { icon: 'mdi-view-dashboard', title: 'Home', value: '' },
                { icon: 'mdi-playlist-check', title: 'Subscriptions', value: 'subscriptions' },
                { icon: 'mdi-currency-usd', title: 'Sales', value: 'sales' },
                { icon: 'mdi-account-hard-hat', title: 'Users', value: 'users' },
                { icon: 'mdi-account-multiple', title: 'Customers', value: 'customers' },
                { icon: 'mdi-format-list-bulleted-type', title: 'Plans', value: 'plans' },
                { icon: 'mdi-router-wireless', title: 'Devices', value: 'devices' },
                { icon: 'mdi-cog', title: 'Settings', value: 'settings' },
                { icon: 'mdi-logout', title: 'Logout', value: 'login' },
            ],
        };
    },
    methods: {
        redirectToRoute(routeValue) {
            this.$router.push('/' + routeValue);
        },
    },
};
</script>