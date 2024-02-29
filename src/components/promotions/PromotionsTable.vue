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
    <v-data-table-server :items="promotions" :headers="headers" :items-length="totalItems"
        :itemsPerPageOptions="[15, 20, 25]" :loading="loading" @update:options="getAllPromotions"
        v-model:itemsPerPage="itemsPerPage">
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
                <v-btn color="blue" size="30" icon class="mr-2" @click.stop="$emit('editPromotionFromChild', item)">
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

const promotions = ref([])
const dialog = ref(false)
const loading = ref(false)
const itemsPerPage = ref(15)
const totalItems = ref(0)
const itemToChange = ref(null)
const headers = [
    { title: 'Active', value: 'active', align: 'center' },
    { title: 'Description', value: 'description' },
    { title: 'Renewable', value: 'renewable', align: 'center' },
    { title: 'Max Amount', value: 'maxAmount', align: 'center' },
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
    // api call to change active status
}

const getAllPromotions = async ({ page, itemsPerPage }) => {
    loading.value = true
    getPromotions(page, itemsPerPage).then(response => {
        loading.value = false
        promotions.value = response.content
        totalItems.value = response.totalElements
    }).catch(error => {
        console.log(error)
    })
}



</script>

<style scoped>
.hover-card:hover {
    background-color: #c2c7cc;
}
</style>