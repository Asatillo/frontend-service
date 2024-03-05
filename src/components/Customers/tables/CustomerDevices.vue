<template>
    <v-dialog v-model="dialog" max-width="500px" @click:outside="close">
        <v-card>
            <v-card-title class="text-h6">Sell device</v-card-title>
            <v-card-text>
                <v-window v-model="step">
                    <v-window-item :value="1">
                        <v-select v-model="newDeviceType" label="Device type" :items="['MOBILE', 'ROUTER']" required
                            item-value="id" item-title="brand"></v-select>
                        <v-select :disabled="!newDeviceType" v-model="newDeviceTemplate" label="Device template"
                            :items="availableDevices" required chips item-title="name" item-value="id"></v-select>
                    </v-window-item>
                    <v-window-item :value="2">
                        <div v-if="!responseObj.loading" class="pa-4 text-center">
                            <v-icon v-if="responseObj.success" size="80" color="green">mdi-check</v-icon>
                            <v-icon v-else size="80" color="red">mdi-message-alert</v-icon>
                            <h3 class="text-h6 font-weight-light mb-2">{{ responseObj.message }}</h3>
                        </div>
                        <v-progress-linear v-else indeterminate color="primary"></v-progress-linear>
                    </v-window-item>
                </v-window>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="close">Close</v-btn>
                <v-btn v-if="step == 1" color="primary" text @click="sellDevice(id, newDeviceTemplate)"
                    :disabled="!newDeviceTemplate">Sell</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-data-table-server :items="devices" @update:options="requestServerItems" :items-per-page-options="[15, 20, 25]"
        :headers="headers" v-model:items-per-page="itemsPerPage" :items-length="totalItems" :search="search">
        <template v-slot:top>
            <v-toolbar flat color="transparent">
                <v-text-field class="ml-1" v-model="search" append-inner-icon="mdi-magnify" label="Search" single-line
                    hide-details></v-text-field>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-btn color="green" prepend-icon="mdi-shopping" @click="openSellDeviceDialog">Add Device</v-btn>
            </v-toolbar>
        </template>
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
import { getDevicesByCustomer, getAvailableDevicesWithoutPagination, sellDeviceToCustomer } from '@/services/rest/devices-api'
import { formatDateString, convertPeriodToDate } from '@/services/date-formatting.js'
import { watch } from 'vue';

const props = defineProps(['id'])


const devices = ref([])
const step = ref(1)
const availableDevices = ref([])
const newDeviceType = ref(null)
const newDeviceTemplate = ref(null)
const dialog = ref(false)
const itemsPerPage = ref(15)
const totalItems = ref(0)
const search = ref('')
const responseObj = ref({ loading: false, success: null, message: '' })
const headers = ref([
    { title: 'ID', value: 'id' },
    { title: 'Name', value: 'name' },
    { title: 'Purchase Date', value: 'purchaseDate' },
    { title: 'Warranty period', value: 'warrantyPeriod' },
    { title: 'Warranty ends', value: 'WarrantyEndDate' },
])

const requestServerItems = async({ page, itemsPerPage, sortBy, groupBy, search }) => {
    getDevicesByCustomer(props.id, { page, itemsPerPage, search }).then(response => {
        totalItems.value = response.totalElements
        devices.value = response.content
    }).catch(error => {
        console.log(error)
    })
}

function openSellDeviceDialog() {
    dialog.value = true

}

function close() {
    dialog.value = false
    step.value = 1
    responseObj.value = { loading: false, success: false, message: '' }
    newDeviceType.value = null
    newDeviceTemplate.value = null
}

function sellDevice(customerId, deviceTemplateId) {
    step.value = 2
    responseObj.value.loading = true
    sellDeviceToCustomer(customerId, deviceTemplateId).then(response => {
        if (response) {
            responseObj.value.message = 'Device sold successfully'
            responseObj.value.success = true
            requestServerItems({ page: 1, itemsPerPage: itemsPerPage.value, search: search.value })
            this.$emit('invoice-created')
            setTimeout(() => {
                if (dialog.value) {
                    close()
                }
            }, 5000)
        }else{
            responseObj.value.message = 'Something went wrong. Please try again later...'
            responseObj.value.success = false
        }

    }).catch(error => {
    }).finally(() => {
        responseObj.value.loading = false
    })
}

watch(newDeviceType, (newValue) => {
    newDeviceTemplate.value = null
    getAvailableDevicesWithoutPagination(newValue).then(response => {
        availableDevices.value = response.content.map((item) => {
            return {
                id: item.id,
                name: item.deviceTemplate.brand + ' ' + item.deviceTemplate.model,
            }
        })
    }).catch(error => {
        console.log(error)
    })
})

</script>