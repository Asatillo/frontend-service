<template>
    <v-data-table-server :items="offeredPromotions" @update:options="fetchOfferedPromotions"
        :items-per-page-options="[15, 20, 25]" :loading="loading" :headers="headers"
        v-model:items-per-page="itemsPerPage" :items-length="totalItems" :search="search">
        <template v-slot:top>
            <v-toolbar flat color="transparent">
                <v-text-field class="ml-1" v-model="search" append-inner-icon="mdi-magnify" label="Search" single-line
                    hide-details></v-text-field>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-btn color="green" prepend-icon="mdi-shopping" @click="openMakeOfferDialog">Make an Offer</v-btn>
            </v-toolbar>
        </template>
        <template v-slot:item.offerDate="{ item }">
            {{ formatDateString(item.offerDate) }}
        </template>
        <template v-slot:item.decisionDate="{ item }">
            <span v-if="item.decisionDate">{{ formatDateString(item.decisionDate) }}</span>
            <span v-else>-</span>
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
    <NewPromotionOfferDialog ref="newPromotionOfferDialog" :id="props.id" @update-promotions="fetchOfferedPromotions({page: 1, itemsPerPage: itemsPerPage, search})"/>
</template>

<script setup>
import NewPromotionOfferDialog from '@/components/customers/dialogs/NewPromotionOfferDialog.vue'
import { ref } from 'vue'
import { getOfferedPromotionsByCustomerId } from '@/services/rest/offered-promotions-api'
import { formatDateString } from '@/services/date-formatting'

const newPromotionOfferDialog = ref(null) 

const props = defineProps(['id'])
const search = ref('')
const offeredPromotions = ref([])
const loading = ref(false)
const itemsPerPage = ref(15)
const totalItems = ref(0)
const headers = ref([
    { title: 'ID', value: 'id' },
    { title: 'Description', value: 'promotion.description' },
    { title: 'Offer date', value: 'offerDate', align: 'center' },
    { title: 'Expires at', value: 'expiresAt', align: 'center' },
    { title: 'Communication', value: 'communicationType', align: 'center' },
    { title: 'Decision date', value: 'decisionDate', align: 'center' },
    { title: 'Decision', value: 'decision', align: 'center' },
])

function fetchOfferedPromotions({ page, itemsPerPage, search }) {
    loading.value = true
    getOfferedPromotionsByCustomerId(props.id, page, itemsPerPage, search).then(response => {
        offeredPromotions.value = response.content
        totalItems.value = response.totalElements
        loading.value = false
    })
}

function openMakeOfferDialog() {
    newPromotionOfferDialog.value.openNewPromotionDialog()
}
</script>