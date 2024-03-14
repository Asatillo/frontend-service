<template>
    <v-toolbar flat>
        <v-text-field class="ml-1" v-model="search" append-inner-icon="mdi-magnify" label="Search" single-line
            hide-details></v-text-field>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-btn color="green" prepend-icon="mdi-sim" @click="openAddNumberDialog">New Entity</v-btn>
    </v-toolbar>
    <v-data-table-server :items="entities" @update:options="requestServerItems" :items-per-page-options="[15, 20, 25]"
        :headers="headers" v-model:items-per-page="itemsPerPage" :items-length="totalItems" :search="search">
        <template v-slot:item.networkIdentifier="{ item }">
            <v-icon v-if="item.deviceType == 'MOBILE'" color="green">mdi-phone</v-icon>
            <v-icon v-else color="blue">mdi-router-wireless</v-icon>
            {{ item.networkIdentifier }}
        </template>
        <template v-slot:item.active="{ item }">
            <v-icon v-if="item.active" color="green">mdi-check</v-icon>
            <v-icon v-else color="red">mdi-close</v-icon>
        </template>
        <template v-slot:item.owner="{ item }">
            <v-chip v-if="item.owner" color="primary"
                @click="router.push({ name: 'Customer', params: { id: item.owner.id } });">{{ item.owner.firstName + ' '
            + item.owner.lastName }}</v-chip>
            <v-chip v-else color="grey" text>Unassigned</v-chip>
        </template>
    </v-data-table-server>
    <v-dialog v-model="dialog" max-width="500px" @click:outside="close">
        <v-card>
            <v-card-title class="text-h6">New Entity</v-card-title>
            <v-card-text>
                <v-window v-model="step">
                    <v-window-item :value="1">
                        <v-select v-model="newDeviceType" label="Device type" :items="['MOBILE', 'ROUTER']" required
                            item-value="id" item-title="brand"></v-select>
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
                    :disabled="!newEntityId">Create</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref } from 'vue'
import router from '@/router';
import { assignNetworkEntityToCustomer, getNetworkEntities } from '@/services/rest/network-entities-api'

const headers = [
    { title: 'ID', value: 'id' },
    { title: 'Active', value: 'active' },
    { title: 'Owner', value: 'owner' },
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
    tag: null
})
const step = ref(1)
const availableEntities = ref([])

const entities = ref([])
const itemsPerPage = ref(15)

function requestServerItems({ page, itemsPerPage, search }) {
    getNetworkEntities({ page, itemsPerPage, search }).then(response => {
        totalItems.value = response.totalElements
        entities.value = response.content
    }).catch(error => {
        console.log(error)
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

const assignEntity = async (entityId, entity) => {
    step.value = 2
    responseObj.value.loading = true
    assignNetworkEntityToCustomer(entityId, entity).then(response => {
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
        console.log(error)
    })

}
</script>