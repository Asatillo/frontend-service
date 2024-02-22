<template>
    <v-container fluid>
        <v-tabs v-model="tab" class="mb-6" @update:model-value="handleTabChange">
            <v-dialog v-model="dialog" max-width="500px" @click:outside="close">
                <template v-slot:activator="{ props }">
                    <v-btn color="primary" class="my-auto" @click="openNewDeviceDialog" v-bind="props">
                        <v-icon left>mdi-plus</v-icon>
                        <span>New device</span>
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title class="text-h5">New device</v-card-title>
                    <v-card-text>
                        <v-select v-model="newDeviceTemplate" label="Device template" :items="deviceTemplates" required
                            chips item-title="name" item-value="id"></v-select>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" text @click="close">Cancel</v-btn>
                        <v-btn color="primary" text @click="createDevice(newDeviceTemplate)"
                            :disabled="!newDeviceTemplate">Create</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Search" class="mx-3" single-line
                hide-details v-on:update:model-value="fetchBySearch"></v-text-field>
            <v-tab v-for="value, key in tabs" :key="key" :value="key">{{ key }}</v-tab>
        </v-tabs>
        <v-window v-model="tab">
            <v-window-item v-for="value, key in tabs" :key="key" :value="key">
                <v-row v-if="value.devices.length">
                    <v-col cols="5" md="4" lg="3" v-for="device in value.devices" :key="device.id">
                        <DeviceCard :device=device @sell="openSellDeviceDialog" />
                    </v-col>
                </v-row>
                <v-row v-else>
                    <v-container class="pa-2 text-center">
                        <v-container class="pl-0 py-2" style="max-width: inherit;">
                            <v-icon size="80" color="blue">mdi-emoticon-happy-outline</v-icon>
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
                <v-card-title class="text-h5">Sell {{ deviceToSell.deviceTemplate.model }}</v-card-title>
                <v-card-text>
                    <v-autocomplete v-model="selectedCustomer" label="To Customer" :items="customers" required chips
                        item-title="name" item-value="id" @update:search="updateCustomers"
                        no-data-text="No customer with such name">
                    </v-autocomplete>
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
import { addDevice, getDevices } from '@/services/rest/devices-api'
import { getDeviceTemplates } from '@/services/rest/device-templates-api'
import { searchCustomers } from '@/services/rest/customers-api'
import DeviceCard from './DeviceCard.vue'
import { onMounted } from 'vue'
import { ref } from 'vue'

const newDeviceTemplate = ref(null)
const sellDialog = ref(false)
const selectedCustomer = ref(null)
const customers = ref([])
const deviceToSell = ref(null)
const search = ref(null)
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
            var currentTab = tabs.value[key]
            currentTab.devices = response.content
            currentTab.pagination.totalPages = response.totalPages
            currentTab.pagination.currentPage = response.page
        })
    }
})

function loadDevices(page, search) {
    var currentTab = tabs.value[tab.value]
    getDevices(tab.value, currentTab.pagination.itemsPerPage, page, search).then(response => {
        currentTab.devices = response.content
        currentTab.pagination.totalPages = response.totalPages
        currentTab.pagination.currentPage = response.page
    })
}

const openNewDeviceDialog = async () => {
    dialog.value = true
    getDeviceTemplates(false).then(response => {
        deviceTemplates.value = response
    })
}

function createDevice(deviceTemplateId) {
    addDevice(deviceTemplateId).then(response => {
        tab.value = response.deviceTemplate.deviceType
        loadDevices(tabs.value[response.deviceTemplate.deviceType].pagination.currentPage, search.value)
    });
    close()
}

function close() {
    newDeviceTemplate.value = null
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
    console.log(deviceId, customerId)
    closeSellDialog()
}

function updateCustomers(search) {
    searchCustomers(search).then(response => {
        customers.value = response
    })
}

function fetchBySearch(search) {
    loadDevices(tabs.value[tab.value].pagination.currentPage, search)
}

</script>