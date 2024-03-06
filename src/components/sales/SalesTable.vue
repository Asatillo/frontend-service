<template>
    <v-data-table-server :items="sales" @update:options="fetchSales" :items-per-page-options="[15, 20, 25]"
        :loading="loading" v-model:items-per-page="itemsPerPage" :items-length="totalItems" :headers="headers"
        :search="search">
        <template v-slot:top>
            <v-toolbar>
                <v-text-field v-model="search" append-inner-icon="mdi-magnify" label="Search" single-line hide-details
                class="ma-1"></v-text-field>
            </v-toolbar>
        </template>
        <template v-slot:item.paymentDate="{ item }">
            <span v-if="item.paymentDate">{{ formatDateString(item.paymentDate) }}</span>
            <span v-else>-</span>
        </template>
        <template v-slot:item.createDate="{ item }">
            {{ formatDateString(item.createDate) }}
        </template>
        <template v-slot:item.paymentProgress="{ item }">
            <v-chip v-if="item.paymentProgress == 'PAID'" color="success" small
                :prepend-icon="item.paymentMethod == 'CASH' ? 'mdi-cash' : 'mdi-credit-card'">{{ item.paymentProgress
                }}</v-chip>
            <v-chip v-else-if="item.paymentProgress == 'PENDING'" color="warning" small prepend-icon="mdi-timer-sand">{{
                item.paymentProgress }}</v-chip>
            <v-chip v-else-if="item.paymentProgress == 'CANCELED'" color="error" small prepend-icon="mdi-cancel">{{
                item.paymentProgress }}</v-chip>
            <v-chip v-else-if="item.paymentProgress == 'REFUNDED'" color="info" small
                :prepend-icon="item.paymentMethod == 'CASH' ? 'mdi-cash-refund' : 'mdi-credit-card-refund'">{{
                    item.paymentProgress }}</v-chip>
        </template>
        <template v-slot:item.amount="{ item }">
            {{ addCommasToPrice(item.amount) }}
        </template>
        <template v-slot:item.discountAmount="{ item }">
            {{ addCommasToPrice(item.discountAmount) }}
        </template>
        <template v-slot:item.totalAmount="{ item }">
            {{ addCommasToPrice(item.totalAmount) }}
        </template>
    </v-data-table-server>
</template>

<script setup>
import { ref } from 'vue'
import { getSales } from '@/services/rest/sales-api'
import { formatDateString } from '@/services/date-formatting'
import { addCommasToPrice } from '@/services/number-formatting';

const props = defineProps(['id'])

const sales = ref([])
const search = ref('')
const itemsPerPage = ref(15)
const loading = ref(false)
const totalItems = ref(0)
const headers = ref([
    { title: 'ID', value: 'id' },
    { title: 'Created at', value: 'createDate' },
    { title: 'Customer', value: 'customer' },
    { title: 'Description', value: 'description' },
    { title: 'Product type', value: 'productType' },
    { title: 'Promo', value: 'promotion.description' },
    { title: 'Payment date', value: 'paymentDate' },
    { title: 'Payment progress', value: 'paymentProgress', align: 'center' },
    { title: 'Amount', value: 'amount', align: 'end' },
    { title: 'Discount', value: 'discountAmount', align: 'end' },
    { title: 'Total', value: 'totalAmount', align: 'end' },
])

function fetchSales({ page, itemsPerPage, search }) {
    loading.value = true
    getSales(page, itemsPerPage, search).then(response => {
        if (response) {
            sales.value = response.content
            totalItems.value = response.totalElements
            loading.value = false
        }
    })
}
</script>