<template>
    <v-container fluid>
        <v-row justify="center" class="text-center">
            <v-col cols="12" md="8">
                <h2 class="text-h2">Users</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col v-for="user in users" :key="user.id" cols="4">
                <v-card class="pa-2 d-flex align-center" :elevation="2" rounded="xl">
                    <v-avatar size="80" class="mx-3" :image="user.imageUrl"></v-avatar>
                    <v-container>
                        <v-card-title class="text-h5">{{ user.firstName }} {{ user.lastName }}</v-card-title>
                        <v-card-subtitle class="text-muted">{{ user.email }}</v-card-subtitle>
                        <v-card-subtitle class="text-muted">{{ user.username }}</v-card-subtitle>
                        <v-card-subtitle class="text-muted">{{ user.role }}</v-card-subtitle>
                    </v-container>
                </v-card>
            </v-col>
        </v-row>
        <v-pagination class="pt-6" v-model="currentPage" :length="totalPages" v-on:update:model-value="getUsers"></v-pagination>
    </v-container>
</template>
  
<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const router = useRouter()

const users = ref([])
const totalItems = ref(0)
const loading = ref(true)
const currentPage = ref(1)
const totalPages = ref(0)
const options = ref({})
const itemsPerPage = ref(9)
const getUsers = async () => {
    loading.value = true;
    const config = {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
    };
    try {
        const response = await axios.get(`/auth-service/users?page=${currentPage.value}&size=${itemsPerPage.value}`, config);
        if (response.data) {
            totalItems.value = response.data.totalElements;
            totalPages.value = response.data.totalPages;
            loading.value = false;
            users.value = response.data.content;
        }
    } catch (err) {
        console.log(err)
    }
}

onMounted(() => {
    getUsers()
})
</script>