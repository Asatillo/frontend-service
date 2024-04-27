<template>
    <v-toolbar flat>
        <v-text-field class="ml-1" v-model="search" append-inner-icon="mdi-magnify" label="Search" single-line
            hide-details></v-text-field>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-btn color="green" prepend-icon="mdi-sim" @click="openAddNumberDialog">New Entity</v-btn>
    </v-toolbar>
    <v-data-table-server :items="entities" @update:options="requestServerItems" :items-per-page-options="[15, 20, 25]"
        :headers="headers" v-model:items-per-page="itemsPerPage" :items-length="totalItems" :search="search"
        v-model:page="page">
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
    <NewNetworkEntityDialog ref="newNetworkEntityDialog" @update-table="updateTable"/>
</template>

<script setup>
import { ref } from 'vue'
import router from '@/plugins/router';
import { getNetworkEntities } from '@/services/rest/network-entities-api'
import NewNetworkEntityDialog from '@/components/network-entities/dialogs/NewNetworkEntityDialog.vue'

const headers = [
    { title: 'ID', value: 'id' },
    { title: 'Active', value: 'active' },
    { title: 'Owner', value: 'owner' },
    { title: 'Phone Number/SSID', value: 'networkIdentifier' },
    { title: 'Tag', value: 'tag', align: 'center' },
]
const search = ref('')
const totalItems = ref(0)
const page = ref(1)
const newNetworkEntityDialog = ref(null)

const entities = ref([])
const itemsPerPage = ref(15)

function requestServerItems({ page, itemsPerPage, search }) {
    getNetworkEntities({ page, itemsPerPage, search }).then(response => {
        if(!response) return
        totalItems.value = response.totalElements
        entities.value = response.content
    })
}

function openAddNumberDialog() {
    newNetworkEntityDialog.value.openDialog()
}

function updateTable() {
    requestServerItems({ page: page.value, itemsPerPage: itemsPerPage.value, search: search.value })
}
</script>