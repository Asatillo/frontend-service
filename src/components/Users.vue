<template>
    <v-container class="pb-0">
        <div class="text-h5">Users</div>
    </v-container>
    <v-container>
        <v-tabs v-model="tab" class="mb-6">
            <v-text-field v-model="search" append-inner-icon="mdi-magnify" class="ma-1" label="Search"
                single-line></v-text-field>
            <v-divider inset vertical class="mx-4"></v-divider>
            <v-tab v-for="value, key in tabs" :key="key" :value="key">{{ value.name }}</v-tab>
        </v-tabs>

        <v-window v-model="tab">
            <v-window-item v-for="value, key in tabs" :key="key" :value="key">
                <v-row v-if="value.users.length">
                    <v-col v-for="user in value.users" :key="user.id" cols="4">
                        <v-card class="px-2 d-flex align-center" :elevation="1" rounded="lg">
                            <v-avatar size="80" class="ml-1" :image="user.imageUrl"></v-avatar>
                            <v-container class="px-0 py-2 text-truncate" style="max-width: inherit;">
                                <v-card-title class="pr-0 pb-0 d-flex justify-space-between">
                                    <p class="mt-2 text-truncate">{{ user.firstName }} {{ user.lastName }}</p>
                                    <v-menu>
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
                                <v-container class="pt-0 pl-0">
                                    <v-card-subtitle>#{{ user.username }}</v-card-subtitle>
                                    <v-card-subtitle>{{ user.email }}</v-card-subtitle>
                                    <v-card-subtitle v-if="!value.role">{{ user.role }}</v-card-subtitle>
                                </v-container>
                            </v-container>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row v-else>
                    <v-container class="pa-2 text-center">
                        <v-container class="pl-0 py-2" style="max-width: inherit;">
                            <v-card-title class="pb-0">No {{ value.name.toLowerCase() }} so
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
import { onMounted } from 'vue';
import { watch } from 'vue';

const tab = ref(null)
const search = ref('')

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
const itemsPerPage = 24

onMounted(() => {
    for (const [key, value] of Object.entries(tabs.value)) {
        getAllUsers(value)
    }
})

const getAllUsers = async (currentTab) => {
    var page = currentTab.pagination.currentPage;
    var role = currentTab.role;
    getUsersByRole({ page, itemsPerPage, search: search.value }, role).then(response => {
        currentTab.pagination.totalPages = response.totalPages;
        currentTab.users = response.content;
    }).catch(error => {
        console.log(error)
    });
}

function syncTabsAndSearch() {
    var currentTab = tabs.value[tab.value];
    var role = currentTab.role;
    getUsersByRole({ page: 1, itemsPerPage, search: search.value }, role).then(response => {
        currentTab.pagination.totalPages = response.totalPages;
        currentTab.pagination.currentPage = 1;
        currentTab.users = response.content;
    }).catch(error => {
        console.log(error)
    });
}

watch([search, tab], () => {
    syncTabsAndSearch()
})
</script>