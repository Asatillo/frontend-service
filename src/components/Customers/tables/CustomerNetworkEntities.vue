<template>
    <v-data-table-server :items="entities" @update:options="requestServerItems" :items-per-page-options="[15, 20, 25]"
        :headers="headers" v-model:items-per-page="itemsPerPage" :items-length="totalItems" :search="search">
        <template v-slot:top>
            <v-toolbar flat>
                <v-text-field class="ml-1" v-model="search" append-inner-icon="mdi-magnify" label="Search" single-line
                    hide-details></v-text-field>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-btn color="green" prepend-icon="mdi-sim" @click="openAddNumberDialog">Add Number</v-btn>
            </v-toolbar>
        </template>
        <template v-slot:item.networkIdentifier="{ item }">
            <v-icon v-if="item.deviceType == 'MOBILE'" color="green">mdi-phone</v-icon>
            <v-icon v-else color="blue">mdi-router-wireless</v-icon>
            {{ item.networkIdentifier }}
        </template>
        <template v-slot:item.active="{ item }">
            <v-icon v-if="item.active" color="green">mdi-check</v-icon>
            <v-icon v-else color="red">mdi-close</v-icon>
        </template>
    </v-data-table-server>
    <v-dialog v-model="dialog" max-width="500px" @click:outside="close">
        <v-card>
            <v-card-title class="text-h6 text-center">New Number</v-card-title>
            <v-card-text>
                <v-window v-model="step">
                    <v-window-item :value="1" class="ma-1">
                        <v-select v-model="newDeviceType" label="Device type" :items="['MOBILE', 'ROUTER']" required
                            item-value="id" item-title="brand"></v-select>
                        <v-autocomplete :disabled="!newDeviceType" v-model="newEntityId" label="Number" :items="availableEntities"
                            required chips item-title="name" item-value="id" @update:search="updateAvailableEntities"></v-autocomplete>
                        <v-text-field v-model="newEntity.tag" label="Tag" required></v-text-field> 
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
                <v-btn v-if="step == 1" color="primary" text @click="assignEntity(newEntityId, newEntity)"
                    :disabled="!newEntityId">Sell</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { getNetworkEntitiesByCustomer, getAvailableEntitiesWithoutLimit, assignNetworkEntityToCustomer } from '@/services/rest/network-entities-api'
import { watch } from 'vue';

const props = defineProps(['id'])

const headers = [
    { title: 'ID', value: 'id' },
    { title: 'Active', value: 'active' },
    { title: 'Phone Number/SSID', value: 'networkIdentifier' },
    { title: 'Tag', value: 'tag', align: 'center' },
]
const search = ref('')
const dialog = ref(false)
const totalItems = ref(0)
const newDeviceType = ref(null)
const newEntityId = ref(null)
const responseObj = ref({ loading: false, success: false, message: '' })
const newEntity = ref({
    tag: null,
    ownerId: props.id
})
const step = ref(1)
const availableEntities = ref([])

const entities = ref([])
const itemsPerPage = ref(15)

function requestServerItems({ page, itemsPerPage, search }) {
    getCustomerEntities({ page, itemsPerPage, search }, props.id)
}

const getCustomerEntities = async ({ page, itemsPerPage, search }, id) => {
    getNetworkEntitiesByCustomer(id, { page, itemsPerPage, search }).then(response => {
        if(!response) return
        totalItems.value = response.totalElements
        entities.value = response.content
    })
}

function openAddNumberDialog() {
    dialog.value = true
}

function close() {
    dialog.value = false
    step.value = 1
    newDeviceType.value = null
    newEntityId.value = null
    newEntity.value.tag = null
}

const getAvailableEntities = async (deviceType, search) => {
    getAvailableEntitiesWithoutLimit(deviceType, search).then(response => {
        if(!response) return
        availableEntities.value = response.content.map((entity) => ({
            id: entity.id,
            name: entity.networkIdentifier
        }))
    })
}

const updateAvailableEntities = async (search) => {
    getAvailableEntities(newDeviceType.value, search)
}

const assignEntity = async (entityId, entity) => {
    step.value = 2
    responseObj.value.loading = true
    assignNetworkEntityToCustomer(entityId, entity).then(response => {
        if(!response) return
        responseObj.value.loading = false
        responseObj.value.success = true
        responseObj.value.message = 'Number added successfully'
        getCustomerEntities({ page: 1, itemsPerPage: itemsPerPage.value, search: search.value }, props.id)
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
    getAvailableEntities(newValue, '')
})
</script>