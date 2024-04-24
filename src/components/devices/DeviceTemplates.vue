<template>
    <v-container>
        <v-tabs v-model="tab" class="mb-6" @update:model-value="handleTabChange">
            <v-dialog v-model="dialog" max-width="500px" @click:outside="close">
                <v-card>
                    <v-card-title class="text-h6">New Template</v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col class="py-0" cols="12">
                                <v-text-field v-model="newDeviceTemplate.model" label="Model" required></v-text-field>
                            </v-col>
                            <v-col class="py-0" cols="12">
                                <v-text-field v-model="newDeviceTemplate.brand" label="Brand" required></v-text-field>
                            </v-col>
                            <v-col class="py-0" cols="6">
                                <v-text-field v-model="newDeviceTemplate.price" label="Price" required
                                    type="number"></v-text-field>
                            </v-col>
                            <v-col class="py-0" cols="6">
                                <v-text-field v-model="newDeviceTemplate.color" label="Color" required></v-text-field>
                            </v-col>
                            <v-col class="py-0" cols="6">
                                <v-text-field v-model="newDeviceTemplate.storage" label="Storage (GB)" required
                                    type="number"></v-text-field>
                            </v-col>
                            <v-col class="py-0" cols="6">
                                <v-select v-model="newDeviceTemplate.deviceType" label="Type" required
                                    :items="['MOBILE', 'ROUTER']"></v-select>
                            </v-col>
                            <v-col class="py-0" cols="12">
                                <v-text-field v-model="newDeviceTemplate.imageUrl" label="Image URL"
                                    required></v-text-field>
                            </v-col>
                            <div class="text-subtitle-1">Warranty Duration</div>
                            <v-divider></v-divider>
                            <v-col cols="4">
                                <v-text-field label="Years" type="number"></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field label="Months" type="number"></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field label="Days" type="number"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" text @click="close">Cancel</v-btn>
                        <v-btn color="primary" text @click="createDeviceTemplate(newDeviceTemplate)"
                            :disabled="!newDeviceTemplate">Create</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-text-field v-model="search" append-inner-icon="mdi-magnify" label="Search" class="mx-3" single-line
                hide-details v-on:update:model-value="fetchBySearch"></v-text-field>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-btn color="primary" class="mt-2 mr-3" @click="openNewTemplateDialog" prepend-icon="mdi-plus">
                New Template
            </v-btn>
            <v-tab v-for="value, key in tabs" :key="key" :value="key">{{ key }}</v-tab>
        </v-tabs>
        <v-window v-model="tab">
            <v-window-item v-for="value, key in tabs" :key="key" :value="key">
                <v-row v-if="value.templates.length">
                    <v-col xs="6" sm="4" md="3" lg="2" v-for="deviceTemplate in value.templates" :key="deviceTemplate.id">
                        <DeviceTemplateCard :deviceTemplate=deviceTemplate />
                    </v-col>
                </v-row>
                <v-row v-else>
                    <v-container class="pa-2 text-center">
                        <v-container class="pl-0 py-2" style="max-width: inherit;">
                            <v-icon size="80" color="blue">mdi-google-downasaur</v-icon>
                            <v-card-title class="pb-0" prepend-icon="">No {{ key.toLowerCase() }}s so
                                far...</v-card-title>
                        </v-container>
                    </v-container>
                </v-row>
                <v-pagination v-if="value.templates.length" class="pt-6" :length="value.pagination.totalPages"
                    v-on:update:model-value="loadDeviceTemplates">
                </v-pagination>
            </v-window-item>
        </v-window>
    </v-container>
</template>

<script setup>
import { getDeviceTemplatesByType, addDeviceTemplate } from '@/services/rest/device-templates-api'
import DeviceTemplateCard from '@/components/devices/DeviceTemplateCard.vue'
import { convertDateToPeriod } from '@/services/date-formatting'
import { onMounted } from 'vue'
import { ref } from 'vue'

const newDeviceTemplate = ref({
    model: '',
    brand: '',
    color: '',
    price: null,
    imageUrl: '',
    storage: null,
    deviceType: '',
    active: true,
    warrantyDuration: ''
})
const search = ref(null)
const dialog = ref(false)
const defaultPagination = {
    currentPage: 1,
    totalPages: 0,
    itemsPerPage: 16
}

const tab = ref(null)
const tabs = ref({
    'MOBILE': {
        templates: {},
        pagination: Object.assign({}, defaultPagination)
    },
    'ROUTER': {
        templates: {},
        pagination: Object.assign({}, defaultPagination)
    },
})

function handleTabChange() {
    search.value = ''
    loadDeviceTemplates(tabs.value[tab.value].pagination.currentPage, search.value)
}

onMounted(() => {
    for (const [key, value] of Object.entries(tabs.value)) {
        getDeviceTemplatesByType(key, value.pagination.itemsPerPage, value.pagination.currentPage, '').then(response => {
            if (!response) return
            var currentTab = tabs.value[key]
            currentTab.devices = response.content
            currentTab.pagination.totalPages = response.totalPages
            currentTab.pagination.currentPage = response.page
        })
    }
})

function loadDeviceTemplates(page, search) {
    var currentTab = tabs.value[tab.value]
    getDeviceTemplatesByType(tab.value, currentTab.pagination.itemsPerPage, page, search).then(response => {
        if (!response) return
        currentTab.templates = response.content
        currentTab.pagination.totalPages = response.totalPages
        currentTab.pagination.currentPage = response.page
    })
}

function createDeviceTemplate() {
    var deviceTemplate = {
        model: newDeviceTemplate.model,
        brand: newDeviceTemplate.brand,
        color: newDeviceTemplate.color,
        price: newDeviceTemplate.price,
        imageUrl: newDeviceTemplate.imageUrl,
        storage: newDeviceTemplate.storage,
        deviceType: newDeviceTemplate.deviceType,
        active: true,
        warrantyDuration: convertDateToPeriod(newDeviceTemplate.days, newDeviceTemplate.months, newDeviceTemplate.years)
    }
    addDeviceTemplate(deviceTemplate).then(response => {
        tab.value = response.deviceTemplate.deviceType
        loadDeviceTemplates(tabs.value[response.deviceTemplate.deviceType].pagination.currentPage, search.value)
    });
    close()
}

function close() {
    dialog.value = false
}

function fetchBySearch(search) {
    loadDeviceTemplates(tabs.value[tab.value].pagination.currentPage, search)
}

function openNewTemplateDialog() {
    dialog.value = true
}
</script>