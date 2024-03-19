<template>
    <v-autocomplete label="Customer" :items="customers" chips item-title="name"
        item-value="id" @update:search="updateCustomers" no-data-text="No customer with such name"
        density="comfortable">
    </v-autocomplete>
</template>

<script setup>

import { onMounted, ref } from 'vue'
import { searchCustomers } from '@/services/rest/customers-api'

const customers = ref([])
const loading = ref(false)

const props = defineProps(['customerId'])

onMounted(() => {
    updateCustomers('')
})

function updateCustomers(search) {
    loading.value = true
    searchCustomers(search).then(response => {
        customers.value = response
    }).finally(loading.value = false)
}
</script>