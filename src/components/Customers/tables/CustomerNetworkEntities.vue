<template>
    <v-data-table-server :items="entities" @update:options="requestServerItems" :items-per-page-options="[15, 20, 25]"
        :headers="headers" v-model:items-per-page="itemsPerPage" :items-length="totalItems">
        <template v-slot:item.networkIdentifier="{ item }">
            <v-icon v-if="item.deviceType == 'MOBILE'" color="green">mdi-phone</v-icon>
            <v-icon v-else color="blue">mdi-router-wireless</v-icon>
            {{ item.networkIdentifier }}
        </template>
        <template v-slot:item.active="{ item }">
            <v-icon v-if="item.active" color="green">mdi-check</v-icon>
            <v-icon v-else color="red">mdi-close</v-icon>
        </template>
    </v-data-table-server>
</template>

<script setup>
import { defineProps } from 'vue'
import { ref } from 'vue'
import axios from 'axios'

const props = defineProps(['id'])

const headers = ref([
    { title: 'ID', value: 'id' },
    { title: 'Number', value: 'networkIdentifier' },
    { title: 'Tag', value: 'tag' },
    { title: 'Active', value: 'active' },
])
const totalItems = ref(0)

const entities = ref([])
const itemsPerPage = ref(15)

function requestServerItems({ page, itemsPerPage }) {
    getCustomerEntities({ page, itemsPerPage }, props.id)
}

const getCustomerEntities = async ({ page, itemsPerPage }, id) => {
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
    };
    try {
        const response = await axios.get(
            `crm/network-entities/customer/${id}?page=${page}&size=${itemsPerPage}`,
            config
        );
        if (response.data) {
            totalItems.value = response.data.totalElements;
            entities.value = response.data.content;
        }
    } catch (error) {
        console.log(error);
    }

}
</script>