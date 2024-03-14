<template>
    <v-toolbar flat>
        <v-text-field v-model="search" append-inner-icon="mdi-magnify" label="Search" single-line hide-details
            class="ma-1"></v-text-field>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-btn prepend-icon="mdi-plus" color="blue-darken-1" @click="openMakeOfferDialog">Make Offer</v-btn>
    </v-toolbar>
    <NewPromotionOfferDialog ref="offerPromotionDialog" @update-promotions="updateOfferedPromotionsTable" />
    <v-data-table-server :items="offeredPromotions" :items-length="totalItems" :itemsPerPageOptions="[15, 20, 25]"
        :loading="loading" @update:options="getAllOfferedPromotions" :search="search"
        v-model:itemsPerPage="itemsPerPage" :headers="headers" v-model:page="page">
        <template v-slot:item.offerDate="{ item }">
            {{ formatDateString(item.offerDate) }}
        </template>

        <template v-slot:item.customerId="{ item }">
            <v-chip @click="$router.push({ name: 'Customer', params: { id: item.customerId } })">{{ item.customer
                }}</v-chip>
        </template>

        <template v-slot:item.decisionDate="{ item }">
            <span v-if="item.decisionDate">{{ formatDateString(item.decisionDate) }}</span>
            <span v-else>-</span>
        </template>

        <template v-slot:item.communicationType="{ item }">
            <v-chip v-if="item.communicationType === 'SMS'" prepend-icon="mdi-message">{{ item.communicationType }}</v-chip>
            <v-chip v-else-if="item.communicationType === 'EMAIL'" prepend-icon="mdi-gmail">{{ item.communicationType }}</v-chip>
            <v-chip v-else-if="item.communicationType === 'CALL'" prepend-icon="mdi-phone">{{ item.communicationType }}</v-chip>
            <v-chip v-else-if="item.communicationType === 'IN_PERSON'" prepend-icon="mdi-account-voice">{{ item.communicationType }}</v-chip>
        </template>

        <template v-slot:item.expiresAt="{ item }">
            {{ formatDateString(item.promotion.endDate) }}
        </template>

        <template v-slot:item.decision="{ item }">
            <v-chip v-if="item.decision == 'ACCEPTED'" color="green" text-color="white">Accepted</v-chip>
            <v-chip v-else-if="item.decision == 'REJECTED'" color="red" text-color="white">Rejected</v-chip>
            <v-chip v-else-if="item.decision == 'PENDING'" color="blue" text-color="white">Pending</v-chip>
        </template>
    </v-data-table-server>
</template>

<script setup>
import { ref } from 'vue'
import { getOfferedPromotions } from '@/services/rest/offered-promotions-api'
import { getCustomersFullName } from '@/services/rest/customers-api'
import { formatDateString } from '@/services/date-formatting'
import NewPromotionOfferDialog from '@/components/offered-promotions/dialog/NewPromotionOfferDialog.vue'

const offerPromotionDialog = ref(null)

const offeredPromotions = ref([])
const loading = ref(false)
const totalItems = ref(0)
const itemsPerPage = ref(15)
const search = ref('')
const page = ref(1)

const headers = [
    { title: 'ID', value: 'id' },
    { title: 'Customer', value: 'customerId' },
    { title: 'Description', value: 'promotion.description' },
    { title: 'Offer date', value: 'offerDate', align: 'center' },
    { title: 'Expires at', value: 'expiresAt', align: 'center' },
    { title: 'Communication', value: 'communicationType', align: 'center' },
    { title: 'Decision date', value: 'decisionDate', align: 'center' },
    { title: 'Decision', value: 'decision', align: 'center' },
]

const getAllOfferedPromotions = async ({ page, itemsPerPage, search }) => {
    loading.value = true
    getOfferedPromotions(page, itemsPerPage, search).then(response => {
        offeredPromotions.value = response.content
        offeredPromotions.value.forEach(async (offeredPromotion) => {
            offeredPromotion.customer = await getCutomersFullName(offeredPromotion.customerId)
        })
        totalItems.value = response.totalElements
    }).catch(error => {
        console.log(error)
    }).finally(() => loading.value = false)
}

const getCutomersFullName = async (customerId) => {
    return await getCustomersFullName(customerId).then(response => {
        return response
    }).catch(error => {
        console.log(error)
    })
}

function openMakeOfferDialog() {
    offerPromotionDialog.value.openNewPromotionDialog()
}

function updateOfferedPromotionsTable(){
    getAllOfferedPromotions({ page: page.value, itemsPerPage: itemsPerPage.value, search: search.value })
}
</script>