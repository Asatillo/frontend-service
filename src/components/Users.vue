<template>
    <v-container fluid>
        <v-row justify="center" class="text-center">
            <v-col cols="12" md="8">
                <h2 class="text-h2">Users</h2>
            </v-col>
        </v-row>
        <v-data-table-server class="elevation-1 mt-4 border rounded" v-model:items-per-page="itemsPerPage"
            :itemsPerPageOptions="[10, 15, 20]" :items-length="totalItems" :items="users" item-key="id" :loading="loading"
            single-select @update:options="getUsers" :headers="headers" loading-text="Loading... Please wait"
            @click:row="router.push({ name: 'User', params: { id: item.internalItem.raw.id } })">
        </v-data-table-server>
    </v-container>
</template>
  
<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter()

const users = ref([])
const totalItems = ref(0)
const loading = ref(true)
const options = ref({})
const itemsPerPage = ref(2)
const headers = ref([
    { title: 'Id', value: 'id' },
    { title: 'Username', value: 'username' },
    { title: 'Role', value: 'role' },
    { title: 'Email', value: 'email' },
    { title: 'First Name', value: 'firstName' },
    { title: 'Last Name', value: 'lastName' },
])
const getUsers = async ({ page, itemsPerPage, sortBy }) => {
    loading.value = true;
    const config = {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
    };
    try {
        const response = await axios.get(`/auth-service/users?page=${page}&size=${itemsPerPage}`, config);
        if (response.data) {
            totalItems.value = response.data.totalElements;
            loading.value = false;
            users.value = response.data.content;
        }
    } catch (err) {
        console.log(err)
    }
}
</script>