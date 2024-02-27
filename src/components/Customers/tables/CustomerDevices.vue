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
                            <v-icon size="80" color="green">mdi-check</v-icon>
                            <h3 class="text-h6 font-weight-light mb-2">{{ responseObj.success ? 'Success' :
                                'Something went wrong' }}!</h3>
                            <span class="text-caption text-grey">{{ responseObj.message }}</span>
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
            <v-toolbar flat>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
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
const responseObj = ref({ loading: false, success: false, message: '' })
const headers = ref([
    { title: 'ID', value: 'id' },
    { title: 'Name', value: 'name' },
    { title: 'Purchase Date', value: 'purchaseDate' },
    { title: 'Warranty period', value: 'warrantyPeriod' },
    { title: 'Warranty ends', value: 'WarrantyEndDate' },
])

function requestServerItems({ page, itemsPerPage, sortBy, groupBy, search }) {
    getCustomerDevices({ page, itemsPerPage, search }, props.id)
}

const getCustomerDevices = async ({ page, itemsPerPage, search }, customerId) => {
    getDevicesByCustomer(customerId, { page, itemsPerPage, search }).then(response => {
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
        responseObj.value.loading = false
        responseObj.value.success = true
        responseObj.value.message = 'Device sold successfully'
        requestServerItems({ page: 1, itemsPerPage: itemsPerPage.value, search: search.value })
        setTimeout(() => {
            if (dialog.value) {
                close()
            }
        }, 2000)
    }).catch(error => {
        responseObj.value.loading = false
        responseObj.value.success = false
        responseObj.value.message = 'Something went wrong'
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