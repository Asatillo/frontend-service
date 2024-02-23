<template>
    <v-container class="pb-0">
        <div class="text-h5">Users</div>
    </v-container>
    <v-container fluid>
        <v-tabs v-model="tab" class="mb-6">
            <v-text-field v-model="search" prepend-inner-icon="mdi-magnify"></v-text-field>
            <v-spacer></v-spacer>
            <v-tab v-for="value, key in tabs" :key="key" :value="value.name">{{ value.name }}</v-tab>
        </v-tabs>

        <v-window v-model="tab">
            <v-window-item v-for="value, key in tabs" :key="key" :value="value.name">
                <v-row v-if="value.users.length">
                    <v-col v-for="user in value.users" :key="user.id" cols="4">
                        <v-card class="pa-2 d-flex align-center" :elevation="2" rounded="xl">
                            <v-avatar size="80" class="ml-1" :image="user.imageUrl"></v-avatar>
                            <v-container class="px-0 py-2 text-truncate" style="max-width: inherit;">
                                <v-card-title class="pr-0 d-flex justify-space-between">
                                    <p class="ma-2 mp-2 text-truncate">{{ user.firstName }} {{ user.lastName }}</p>
                                    <v-menu class="ma-2 mp-2">
                                        <template v-slot:activator="{ props }">
                                            <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
                                        </template>
                                        <v-list>
                                            <v-list-item>
                                                <v-btn variant="text">Edit</v-btn>
                                            </v-list-item>
                                        </v-list>
                                    </v-menu>
                                </v-card-title>
                                <v-card-subtitle>#{{ user.username }}</v-card-subtitle>
                                <v-card-subtitle>{{ user.email }}</v-card-subtitle>
                                <v-card-subtitle v-if="!value.role">{{ user.role }}</v-card-subtitle>
                            </v-container>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row v-else>
                    <v-container class="pa-2 text-center">
                        <v-container class="pl-0 py-2" style="max-width: inherit;">
                            <v-icon size="80" color="blue">mdi-emoticon-happy-outline</v-icon>
                            <v-card-title class="pb-0" prepend-icon="">No {{ value.name.toLowerCase() }} so
                                far...</v-card-title>
                        </v-container>
                    </v-container>
                </v-row>
                <v-pagination v-if="value.users.length" class="pt-6" v-model="value.pagination.currentPage"
                    :length="value.pagination.totalPages" v-on:update:model-value="getAllUsers(value)"></v-pagination>
            </v-window-item>
        </v-window>


    </v-container>
</template>
  
<script setup>
import { ref } from 'vue';
import { getUsersByRole } from '@/services/rest/auth-api';
import router from '@/router';
import { onMounted } from 'vue';
import { watch } from 'vue';

const tab = ref(null)
const search = ref(null)

const defaultPagination = {
    currentPage: 1,
    totalPages: 0,
}

const tabs = ref({
    "allUsers": {
        name: "All Users",
        role: "",
        users: {},
        pagination: Object.assign({}, defaultPagination)
    },
    "newUsers": {
        name: "New Users",
        role: "USER",
        users: {},
        pagination: Object.assign({}, defaultPagination)
    },
    "agents": {
        name: "Agents",
        role: "AGENT",
        users: {},
        pagination: Object.assign({}, defaultPagination)
    },
    "admins": {
        name: "Admins",
        role: "ADMIN",
        users: {},
        pagination: Object.assign({}, defaultPagination)
    }
})
const itemsPerPage = 12

onMounted(() => {
    for (const [key, value] of Object.entries(tabs.value)) {
        getAllUsers(value)
    }
})

const getAllUsers = async (tab) => {
    var page = tab.pagination.currentPage;
    var role = tab.role;
    getUsersByRole({ page, itemsPerPage }, role).then(response => {
        tab.pagination.totalPages = response.totalPages;
        tab.users = response.content;
    }).catch(error => {
        console.log(error)
    });
}

watch(search, (newValue, oldValue) => {
    if (newValue.length > 3) {
        console.log(newValue)
    }
})

</script>