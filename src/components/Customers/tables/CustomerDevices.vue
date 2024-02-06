<template>
    <v-data-table-server :items="devices" @update:options="requestServerItems" :items-per-page-options="[15, 20, 25]"
        :headers="headers" v-model:items-per-page="itemsPerPage" :items-length="totalItems">
        <template v-slot:item.purchaseDate="{ item }">
            {{ formatDateString(item.purchaseDate) }}
        </template>
        <template v-slot:item.name="{ item }">
            <v-icon v-if="item.deviceTemplate.deviceType == 'MOBILE'" color="green">mdi-cellphone</v-icon>
            <v-icon v-else color="blue">mdi-router-wireless</v-icon>
            {{ item.deviceTemplate.brand }} {{ item.deviceTemplate.model }}
        </template>
        <template v-slot:item.warrantyPeriod="{ item }">
            {{ convertPeriodToDate(item.deviceTemplate.warrantyDuration) }}
        </template>
    </v-data-table-server>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { formatDateString, convertPeriodToDate } from '@/services/date-formatting.js'

const props = defineProps(['id'])

const devices = ref([])
const itemsPerPage = ref(15)
const totalItems = ref(0)
const headers = ref([
    { title: 'ID', value: 'id' },
    { title: 'Name', value: 'name' },
    { title: 'Purchase Date', value: 'purchaseDate'},
    { title: 'Warranty period', value: 'warrantyPeriod' },
    { title: 'Warranty ends', value: 'WarrantyEndDate' },
])

function requestServerItems({ page, itemsPerPage }) {
    getCustomerDevices({ page, itemsPerPage }, props.id)
}

const getCustomerDevices = async ({ page, itemsPerPage }, customerId) => {
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
    };
    try {
        const response = await axios.get(
            `crm/customers/${customerId}/devices?page=${page}&size=${itemsPerPage}`,
            config
        );
        if (response.data) {
            totalItems.value = response.data.totalElements;
            devices.value = response.data.content;
        }
    } catch (error) {
        console.log(error);
    }

}

</script>