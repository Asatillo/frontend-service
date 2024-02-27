<template>
    <v-data-table-server :items="sales" @update:options="fetchSales" :items-per-page-options="[15, 20, 25]"
        :loading="loading" v-model:items-per-page="itemsPerPage" :items-length="totalItems" :headers="headers">
        <template v-slot:item.paymentDate="{ item }">
            <span v-if="item.paymentDate">{{ formatDateString(item.paymentDate) }}</span>
            <span v-else>-</span>
        </template>
        <template v-slot:item.createDate="{ item }">
            {{ formatDateString(item.createDate) }}
        </template>
        <template v-slot:item.paymentProgress="{ item }">
            <v-chip v-if="item.paymentProgress == 'PAID'" color="success" small
                :prepend-icon="item.paymentMethod == 'CASH' ? 'mdi-credit-card' : 'mdi-cash'">{{ item.paymentProgress
                }}</v-chip>
            <v-chip v-else-if="item.paymentProgress == 'PENDING'" color="warning" small>{{ item.paymentProgress }}</v-chip>
            <v-chip v-else-if="item.paymentProgress == 'CANCELED'" color="error" small>{{ item.paymentProgress }}</v-chip>
            <v-chip v-else-if="item.paymentProgress == 'REFUNDED'" color="info" small>{{ item.paymentProgress }}</v-chip>
        </template>
    </v-data-table-server>
</template>

<script setup>
import { ref } from 'vue'
import { getSales } from '@/services/rest/sales-api'
import { getPlanById } from '@/services/rest/plans-api'
import { getDeviceById } from '@/services/rest/devices-api'
import { getServiceById } from '@/services/rest/services-api'

import { formatDateString } from '@/services/date-formatting'
import { watch } from 'vue'

const props = defineProps(['id'])

const sales = ref([])
const itemsPerPage = ref(15)
const loading = ref(false)
const totalItems = ref(0)
const headers = ref([
    { title: 'ID', value: 'id'},
    { title: 'Customer', value: 'customer' },
    { title: 'Description', value: 'description' },
    { title: 'Product type', value: 'productType' },
    { title: 'Promo', value: 'promotion.description' },
    { title: 'Amount', value: 'amount', align: 'end' },
    { title: 'Discount amount', value: 'discountAmount', align: 'end' },
    { title: 'Total amount', value: 'totalAmount', align: 'end' },
    { title: 'Payment progress', value: 'paymentProgress', align: 'center' },
    { title: 'Payment date', value: 'paymentDate' },
    { title: 'Create date', value: 'createDate' },
])

function fetchSales({ page, itemsPerPage }) {
    getSales(page, itemsPerPage).then(response => {
        sales.value = response.content
        totalItems.value = response.totalElements
    })
}

// watch(sales, (sales) =>{
//     sales.forEach(sale => {


//         if(sale.productType == 'PLAN'){
//             getPlanNameById(sale.productId).then(name =>{
//                 sale.product = name
//             })
//         }else if(sale.productType == 'DEVICE'){
//             getDeviceNameById(sale.productId).then(name =>{
//                 sale.product = name
//             })
//         }else if(sale.productType == 'SERVICE'){
//             getServiceNameById(sale.productId).then(name =>{
//                 sale.product = name
//             })
//         }
//     });
// })

// const getPlanNameById = async (id) =>{
//     return getPlanById(id).then(plan =>{
//         return plan.name
//     })
// }

// const getDeviceNameById = async (id) => {
//     return getDeviceById(id).then(device =>{
//         return `${device.deviceTemplate.brand} ${device.deviceTemplate.model}`
//     })
// }

// function getServiceNameById(id) {
//     return getServiceById(id).then(service =>{
//         return service.name
//     })
// }
</script>