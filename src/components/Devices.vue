<template>
    <v-container fluid>
        <v-tabs v-model="tab" class="mb-6">
            <v-text-field v-model="search" prepend-inner-icon="mdi-magnify"></v-text-field>
            <v-dialog v-model="dialog" max-width="500px" @click:outside="close">
                <template v-slot:activator="{ props }">
                    <v-btn color="primary" @click="addNewDevice" v-bind="props">
                        <v-icon left>mdi-plus</v-icon>
                        <span>New device</span>
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title class="text-h5">Add new device</v-card-title>
                    <v-card-text>
                        <v-select v-model="newDevice" label="Device template" :items="[]" required
                        chips item-title="name" item-value="id"></v-select>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" text @click="close">Cancel</v-btn>
                        <v-btn color="primary" text @click="close">Save</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-spacer></v-spacer>
            <v-tab v-for="value, key in tabs" :key="key" :value="value.name">{{ key }}</v-tab>
        </v-tabs>
        <v-window v-model="tab">
            <v-window-item v-for="value, key in tabs" :key="key" :value="value.name">
                <v-row v-if="value.devices.length">
                    <v-col cols="5" md="4" lg="3" v-for="device in value.devices" :key="device.id">
                        <v-card class="rounded-xl">
                            <v-img class="mt-3" :src="device.deviceTemplate.imageUrl" height="200px"></v-img>
                            <v-card-title class="d-flex justify-space-between ">
                                <p class="ma-2 mp-2 text-truncate">{{ device.deviceTemplate.brand + ' ' +
                                    device.deviceTemplate.model }}</p>

                                <v-menu class="ma-2 mp-2">
                                    <template v-slot:activator="{ props }">
                                        <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props">
                                        </v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-item class="pa-0">
                                            <v-btn variant="text">
                                                Edit
                                            </v-btn>
                                        </v-list-item>
                                        <v-list-item class="pa-0">
                                            <v-btn variant="text">
                                                Delete
                                            </v-btn>
                                        </v-list-item>
                                        <v-list-item class="pa-0">
                                            <v-btn variant="text">
                                                Sell
                                            </v-btn>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </v-card-title>

                            <v-container v-if="device.deviceTemplate.deviceType == 'MOBILE'" class="pt-0">
                                <v-card-subtitle>
                                    Warranty period of {{ convertPeriodToDate(device.deviceTemplate.warrantyDuration) }}
                                </v-card-subtitle>
                                <v-card-text class="py-3">
                                    <v-icon>mdi-sd</v-icon>
                                    {{ device.deviceTemplate.storage }} GB
                                </v-card-text>
                                <v-card-text class="py-0">
                                    <v-icon color="green">mdi-cash</v-icon>
                                    {{ addCommasToPrice(device.deviceTemplate.price) }} HUF
                                </v-card-text>
                            </v-container>


                        </v-card>
                    </v-col>
                </v-row>
                <v-row v-else>
                    <v-container class="pa-2 text-center">
                        <v-container class="pl-0 py-2" style="max-width: inherit;">
                            <v-icon size="80" color="blue">mdi-emoticon-happy-outline</v-icon>
                            <v-card-title class="pb-0" prepend-icon="">No {{ value.name.toLowerCase() }} so
                                far...</v-card-title>
                        </v-container>
                    </v-container>
                </v-row>
                <v-pagination v-if="value.devices.length" class="pt-6" v-model="value.pagination.currentPage"
                    :length="value.pagination.totalPages" v-on:update:model-value="getDevices(value)">
                </v-pagination>
            </v-window-item>
        </v-window>
    </v-container>
</template>
  
<script setup>
import axios from 'axios';
import { onMounted } from 'vue';
import { ref } from 'vue'
import { convertPeriodToDate } from '../services/date-formatting'
import { addCommasToPrice } from '../services/number-formatting'

const newDevice = ref(null)
const search = ref(null)
const dialog = ref(false)
const deviceTemplates = ref([])
const defaultPagination = {
    currentPage: 1,
    totalPages: 0,
    itemsPerPage: 12
}

const tab = ref(null)
const tabs = ref({
    'mobiles': {
        name: 'MOBILE',
        devices: {},
        pagination: Object.assign({}, defaultPagination)
    },
    'routers': {
        name: 'ROUTER',
        devices: {},
        pagination: Object.assign({}, defaultPagination)
    },
})


const getDevices = async (type) => {
    try {
        const response = await axios.get(`/crm/devices/type/${type.name}?size=${type.pagination.itemsPerPage}&page=${type.pagination.currentPage}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        })
        type.devices = response.data.content
        type.pagination.totalPages = response.data.totalPages
        type.pagination.currentPage = response.data.number + 1

    } catch (err) {
        console.log(err)
    }
}

onMounted(() => {
    for (const [key, value] of Object.entries(tabs.value)) {
        getDevices(value)
    }
})

function addNewDevice() {
    // the dialog window to add a new device
    dialog.value = true
    deviceTemplates.value = updateDeviceTemplates()
}

const updateDeviceTemplates = async () => {
    try {
        const response = await axios.get('/crm/device-templates?paginate=false', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        })
        var deviceTemplatesList = [];

        response.data.content.forEach(deviceTemplate => {
            deviceTemplatesList.push({
                id: deviceTemplate.id,
                name: deviceTemplate.brand + ' ' + deviceTemplate.model + ' ' + deviceTemplate.storage + 'GB',
            })
        })
        console.log(deviceTemplatesList)
        return deviceTemplatesList
    } catch (err) {
        console.log(err)
    }
}

function sellDeviceToCustomer() {
    // the dialog window to sell the device to the customer
    // the customer can be selected from the list of customers
}

function assignRouterToCustomer() {
    // the dialog window to assign the router to the customer
    // the customer can be selected from the list of customers
}

function close() {
    // close the dialog window
    dialog.value = false
}


</script>