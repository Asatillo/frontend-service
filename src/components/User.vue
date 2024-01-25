<template>
    <v-container fluid>
        <v-row justify="center" class="text-center">
            <v-col cols="12" md="8">
                <h2 class="text-h2">Users</h2>
            </v-col>
        </v-row>
        <v-data-table-server class="elevation-1 mt-4 border rounded"
            v-model:items-per-page="itemsPerPage"
            :items-length="totalItems" 
            :items="users" 
            item-key="id" 
            :loading="loading"
            single-select
            @update:options="getUsers"
            :headers="headers"
            loading-text="Loading... Please wait"
            @click:row="onRowClick">
        </v-data-table-server>
    </v-container>
</template>
  
<script>
import axios from 'axios';

export default {
    name: 'Users',
    data() {
        return {
            users: [],
            totalItems: 0,
            loading: true,
            options: {},
            itemsPerPage: 10,
            headers: [
                {title: 'Id', value: 'id'},
                {title: 'Username', value: 'username'},
                {title: 'Role', value: 'role'},
                {title: 'Email', value: 'email'},
                {title: 'First Name', value: 'firstName'},
                {title: 'Last Name', value: 'lastName'},
            ]
        }
    },
    methods: {
        async getUsers() {
            this.loading = true;
            const config = {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
                },
            };
            try {
                const response = await axios.get(`/auth-service/users?size=${this.itemsPerPage}`, config);
                if (response.data) {
                    this.totalPages = response.data.totalPages;
                    this.totalItems = response.data.totalElements;
                    this.currentPage = response.data.page;
                    this.loading = false;
                    this.users = response.data.content;
                }
            } catch (err) {
                console.log(err)
            }
        },
        onRowClick(event, item) {
            console.log(item)
            this.$router.push({ name: 'User', params: { id: item.internalItem.raw.id } });
        }
    }
}
</script>
    
  
<style></style>