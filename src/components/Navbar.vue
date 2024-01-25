<template>
<v-navigation-drawer expand-on-hover rail :elevation="2" style="color: azure;"
    image="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg" >
    <v-list>
        <v-list-item prepend-avatar="https://randomuser.me/api/portraits/men/3.jpg" :title="fullname"
            :subtitle="email" @click="redirectToRoute('my-profile')"></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav >
        <v-list-item @click="redirectToRoute(item.value)" v-for="item in menuItems" :key="item.value"
            :prepend-icon="item.icon" :title="item.title" :value="item.value"></v-list-item>
    <v-list-item @click="handleLogout" prepend-icon="mdi-logout" title="Logout"></v-list-item>
    </v-list>
</v-navigation-drawer>
</template>

<script>
export default {
    data() {
        return {
            menuItems: [
                { icon: 'mdi-view-dashboard', title: 'Home', value: '' },
                { icon: 'mdi-account-multiple', title: 'Customers', value: 'customers' },
                { icon: 'mdi-playlist-check', title: 'Subscriptions', value: 'subscriptions' },
                { icon: 'mdi-currency-usd', title: 'Sales', value: 'sales' },
                { icon: 'mdi-format-list-bulleted-type', title: 'Plans', value: 'plans' },
                { icon: 'mdi-account-hard-hat', title: 'Users', value: 'users' },
                { icon: 'mdi-floor-plan', title: 'Services', value: 'services'},
                { icon: 'mdi-router-wireless', title: 'Devices', value: 'devices' },
                { icon: 'mdi-cog', title: 'Settings', value: 'settings' },
            ],
            username: '',
            email: '',
            fullname: '',
        };
    },
    methods: {
        redirectToRoute(routeValue) {
            this.$router.push('/' + routeValue);
        },
        handleLogout() {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            this.$router.push('/login');
        },
    },
    mounted() {
        if (!localStorage.getItem('accessToken')) {
            this.$router.push('/login');
        }

        if (localStorage.getItem('user')) {
            const user = JSON.parse(localStorage.getItem('user'));
            this.username = user.username;
            this.fullname = user.firstName + ' ' + user.lastName;
            this.email = user.email;
        }
    },
};
</script>