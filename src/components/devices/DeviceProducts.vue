<template>
    <v-container>
        <v-tabs v-model="tab" class="mb-6" @update:model-value="handleTabChange">
            <v-dialog v-model="dialog" max-width="500px" @click:outside="close">
                <v-card>
                    <v-card-title class="text-h6">Add New Devices</v-card-title>
                    <v-card-text>
                        <v-window v-model="step">
                            <v-window-item :value="1">
                                <v-select v-model="newDeviceTemplate" label="Device template" :items="deviceTemplates"
                                    required chips item-title="name" item-value="id"></v-select>
                                <v-text-field v-model="newDeviceAmount" label="Amount" required
                                    type="number"></v-text-field>
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
                        <v-btn v-if="step == 1" color="primary" text
                            @click="createDevice(newDeviceTemplate, newDeviceAmount)"
                            :disabled="!newDeviceTemplate || !newDeviceAmount || newDeviceAmount < 1">Create</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-text-field v-model="search" append-inner-icon="mdi-magnify" label="Search" class="mx-2" single-line
                hide-details v-on:update:model-value="fetchBySearch" ></v-text-field>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-btn color="primary" class="mt-2 mr-3" @click="openNewDeviceDialog" prepend-icon="mdi-plus">
                New Devices
            </v-btn>
            <v-tab v-for="value, key in tabs" :key="key" :value="key">{{ key }}</v-tab>
        </v-tabs>
        <v-window v-model="tab">
            <v-window-item v-for="value, key in tabs" :key="key" :value="key">
                <v-row v-if="value.devices.length">
                    <v-col xs="6" sm="4" md="3" lg="2" v-for="device in value.devices" :key="device.id">
                        <DeviceCard :device=device @sell="openSellDeviceDialog" />
                    </v-col>
                </v-row>
                <v-row v-else>
                    <v-container class="pa-2 text-center">
                        <v-container class="pl-0 py-2" style="max-width: inherit;">
                            <v-icon size="80" color="blue">mdi-google-downasaur</v-icon>
                            <v-card-title class="pb-0" prepend-icon="">No {{ key.toLowerCase() }}s so far...</v-card-title>
                        </v-container>
                    </v-container>
                </v-row>
                <v-pagination v-if="value.devices.length" class="pt-6" :length="value.pagination.totalPages"
                    v-on:update:model-value="loadDevices">
                </v-pagination>
            </v-window-item>
        </v-window>
        <v-dialog v-model="sellDialog" max-width="500px">
            <v-card v-if="deviceToSell">
                <v-card-title class="text-h6">Sell {{ deviceToSell.deviceTemplate.model }}</v-card-title>
                <v-card-text>
                    <SelectCustomer v-model="selectedCustomer" :customerId="selectedCustomer"/>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="closeSellDialog">Cancel</v-btn>
                    <v-btn color="primary" text @click="sellDevice(deviceToSell.id, selectedCustomer)"
                        :disabled="!selectedCustomer">Sell</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
  
<script setup>
import { addDevice, getDevices, sellDeviceToCustomer } from '@/services/rest/devices-api'
import { getDeviceTemplates } from '@/services/rest/device-templates-api'
import SelectCustomer from '@/components/customers/components/SelectCustomer.vue'
import DeviceCard from '@/components/devices/DeviceCard.vue'

import { onMounted } from 'vue'
import { ref } from 'vue'

const newDeviceTemplate = ref(null)
const newDeviceAmount = ref(null)
const sellDialog = ref(false)
const selectedCustomer = ref(null)
const deviceToSell = ref(null)
const search = ref('')
const loading = ref(false)
const responseObj = ref({
    loading: false,
    success: false,
    message: ''
})
const step = ref(1)
const dialog = ref(false)
const deviceTemplates = ref([])
const defaultPagination = {
    currentPage: 1,
    totalPages: 0,
    itemsPerPage: 16
}

const tab = ref(null)
const tabs = ref({
    'MOBILE': {
        devices: {},
        pagination: Object.assign({}, defaultPagination)
    },
    'ROUTER': {
        devices: {},
        pagination: Object.assign({}, defaultPagination)
    },
})

function handleTabChange() {
    search.value = ''
    loadDevices(tabs.value[tab.value].pagination.currentPage, search.value)
}

onMounted(() => {
    for (const [key, value] of Object.entries(tabs.value)) {
        getDevices(key, value.pagination.itemsPerPage, value.pagination.currentPage, '').then(response => {
            if (!response) return
            var currentTab = tabs.value[key]
            currentTab.devices = response.content
            currentTab.pagination.totalPages = response.totalPages
            currentTab.pagination.currentPage = response.page
        })
    }
})

function loadDevices(page, search) {
    if (search == null) {
        search = ''
    }
    var currentTab = tabs.value[tab.value]
    getDevices(tab.value, currentTab.pagination.itemsPerPage, page, search).then(response => {
        if (!response) return
        currentTab.devices = response.content
        currentTab.pagination.totalPages = response.totalPages
        currentTab.pagination.currentPage = response.page
    })
}

const openNewDeviceDialog = async () => {
    dialog.value = true
    getDeviceTemplates(false).then(response => {
        if(!response) return
        deviceTemplates.value = response
    })
}

function createDevice(deviceTemplateId, amount) {
    responseObj.value.loading = true
    step.value = 2

    addDevice(deviceTemplateId, amount).then(response => {
        if (response.success) {
            responseObj.value.loading = false
            responseObj.value.success = response.success
            responseObj.value.message = response.message
            loadDevices(tabs.value[tab.value].pagination.currentPage, search.value)
        }
    });
}

function close() {
    newDeviceTemplate.value = null
    newDeviceAmount.value = null
    step.value = 1
    responseObj.value.loading = false
    responseObj.value.success = false
    responseObj.value.message = ''
    dialog.value = false
}

function openSellDeviceDialog(data) {
    deviceToSell.value = data
    sellDialog.value = true
}

function closeSellDialog() {
    sellDialog.value = false
    selectedCustomer.value = null
    deviceToSell.value = null
}

function sellDevice(deviceId, customerId) {
    sellDeviceToCustomer(customerId, deviceId, null).then(response => {
        if (response) {
            closeSellDialog()
            loadDevices(tabs.value[tab.value].pagination.currentPage, search.value)
        }
    })
}

function fetchBySearch(search) {
    loadDevices(tabs.value[tab.value].pagination.currentPage, search)
}

</script>