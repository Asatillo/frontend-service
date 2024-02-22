<template>
    <v-data-table-server :items="subscriptions" :headers="headers" v-model:itemsPerPage="itemsPerPage" item-value="id"
        :items-length="totalItems" @update:options="requestServerItems" :items-per-page-options="[15, 20, 25]">
        <template v-slot:item.startDate="{ item }">
            {{ formatDateString(item.startDate) }}
        </template>
        <template v-slot:item.endDate="{ item }">
            {{ formatDateString(item.endDate) }}
        </template>
        <template v-slot:item.number="{ item }">
            <v-icon v-if="item.networkEntity.deviceType == 'MOBILE'" color="green">mdi-phone</v-icon>
            <v-icon v-else color="blue">mdi-router-wireless</v-icon>
            {{ item.networkEntity.networkIdentifier }}
        </template>
    </v-data-table-server>
</template>

<script setup>
import { defineProps } from 'vue'
import { ref } from 'vue'
import { getSubscriptionsByCustomer } from '@/services/rest/subscriptions-api'
import { formatDateString } from '@/services/date-formatting.js'

const props = defineProps(['id'])

const headers = ref([
    { title: 'ID', key: 'id' },
    { title: 'Plan', key: 'plan.name' },
    { title: 'Number', key: 'number', sortable: false },
    { title: 'Tag', key: 'networkEntity.tag', sortable: false },
    { title: 'Start date', key: 'startDate' },
    { title: 'End date', key: 'endDate' },
    { title: 'Price (HUF)', key: 'plan.price', align: 'end' },
]);
const subscriptions = ref([])
const totalItems = ref(0)
const itemsPerPage = ref(15)

function requestServerItems({ page, itemsPerPage }) {
    getCustomerSubscriptions({ page, itemsPerPage }, props.id)
}

const getCustomerSubscriptions = async ({ page, itemsPerPage }, id) => {
    getSubscriptionsByCustomer(id, { page, itemsPerPage }).then(response => {
        totalItems.value = response.totalElements
        subscriptions.value = response.content
    }).catch(error => {
        console.log(error)
    })
}
</script>
