<template>
    <v-dialog v-model="dialog" max-width="500px">
        <v-card>
            <v-card-title class="text-h6 text-center">
                Are you sure you want to {{ itemToChange.active ? 'deactivate' : 'activate' }} this item?
            </v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue" @click="close">Cancel</v-btn>
                <v-btn color="blue" @click="changeActiveStatus()">Confirm</v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-toolbar flat>
        <v-text-field v-model="search" append-inner-icon="mdi-magnify" label="Search" single-line hide-details
            class="ma-1"></v-text-field>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-btn prepend-icon="mdi-plus" color="blue-darken-1" @click="openNewPromotionDialog">New
            Promotion</v-btn>
    </v-toolbar>
    <v-data-table-server :items="promotions" :headers="headers" :items-length="totalItems"
        :itemsPerPageOptions="[15, 20, 25]" :loading="loading" @update:options="getAllPromotions"
        v-model:itemsPerPage="itemsPerPage" :search="search">
        <template v-slot:item.active="{ item }">
            <v-icon v-if="item.active" color="green">mdi-check</v-icon>
            <v-icon v-else color="red">mdi-close</v-icon>
        </template>

        <template v-slot:item.renewable="{ item }">
            <v-icon v-if="item.renewable" color="green">mdi-check</v-icon>
            <v-icon v-else color="red">mdi-close</v-icon>
        </template>

        <template v-slot:item.startDate="{ item }">
            {{ formatDateString(item.startDate) }}
        </template>

        <template v-slot:item.endDate="{ item }">
            {{ formatDateString(item.endDate) }}
        </template>

        <template v-slot:item.actions="{ item }">
            <v-row>
                <v-btn color="blue" size="30" icon class="mr-2" @click.stop="$emit('edit-promotion-from-child', item)">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn size="30" icon @click.stop="changeActive(item)">
                    <v-icon v-if="item.active" color="red">mdi-bell-off-outline</v-icon>
                    <v-icon v-else color="green">mdi-bell-outline</v-icon>
                </v-btn>
            </v-row>
        </template>
    </v-data-table-server>
</template>

<script setup>
import { formatDateString } from '@/services/date-formatting'
import { getPromotions, changePromotionStatus } from '@/services/rest/promotions-api'
import { ref } from 'vue'

defineEmits(['edit-promotion-from-child'])

const promotions = ref([])
const dialog = ref(false)
const loading = ref(false)
const itemsPerPage = ref(15)
const totalItems = ref(0)
const itemToChange = ref(null)
const search = ref('')
const headers = [
    { title: 'Active', value: 'active', align: 'center' },
    { title: 'Description', value: 'description' },
    { title: 'Product Type', value: 'productType', align: 'center'},
    { title: 'Renewable', value: 'renewable', align: 'center' },
    { title: 'Max Amount', value: 'maxAmount', align: 'center' },
    { title: 'Type', value: 'type', align: 'center' },
    { title: 'Start Date', value: 'startDate', align: 'center' },
    { title: 'End Date', value: 'endDate', align: 'center' },
    { title: 'Actions', value: 'actions' }
]

function changeActive(promotion) {
    itemToChange.value = promotion
    dialog.value = true
}

function close() {
    dialog.value = false
}

function changeActiveStatus() {
    changePromotionStatus(itemToChange.value.id, (itemToChange.value.active ? 'deactivate' : 'activate')).then(response => {
        dialog.value = false
        promotions.value = promotions.value.map(promotion => {
            if (promotion.id === response.id) {
                promotion.active = response.active
            }
            return promotion
        })
    }).catch(error => {
        console.log(error)
    })
}

const getAllPromotions = async ({ page, itemsPerPage, search }) => {
    loading.value = true
    getPromotions(page, itemsPerPage, search).then(response => {
        promotions.value = response.content
        totalItems.value = response.totalElements
    }).catch(error => {
        console.log(error)
    }).finally(() => loading.value = false)
}



</script>

<style scoped>
.hover-card:hover {
    background-color: #c2c7cc;
}
</style>