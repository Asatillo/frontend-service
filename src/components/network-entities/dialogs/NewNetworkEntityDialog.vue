<template>
    <v-dialog v-model="dialog" max-width="500px" @click:outside="close">
        <v-card>
            <v-card-title class="text-h6 text-center">New Network Entity</v-card-title>
            <v-card-text>
                <v-window v-model="step">
                    <v-window-item :value="1" class="ma-1">
                        <v-select v-model="editedItem.deviceType" label="Device type" cols="12" sm="6" md="6"
                            :items="['MOBILE', 'ROUTER']">
                        </v-select>
                        <v-text-field :prefix="prefix" v-model="editedItem.networkIdentifier" label="Network Identifier" type="number"></v-text-field>
                        <SelectCustomer :customerId="editedItem.ownerId" v-model="editedItem.ownerId"/>
                        <v-text-field v-model="editedItem.tag" label="Tag" type="text"></v-text-field>
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
                <v-btn v-if="step == 1" color="primary" text @click="createEntity()"
                    :disabled="saveButtonDisabled">Create</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { computed, ref } from 'vue'
import { addNetworkEntity } from '@/services/rest/network-entities-api'
import SelectCustomer from '@/components/customers/components/SelectCustomer.vue'

defineExpose({ openDialog })
const emit = defineEmits(['update-table'])

const defaultItem = {
    networkIdentifier: null,
    deviceType: null,
    ownerId: null,
    tag: ''
}
const editedItem = ref(Object.assign({}, defaultItem))
const responseObj = ref({ loading: false, success: false, message: '' })
const step = ref(1)
const dialog = ref(false)
const saveButtonDisabled = computed(() => {
    return !editedItem.value.networkIdentifier && !editedItem.value.deviceType
})

const prefix = computed(() => {
    return editedItem.value.deviceType === 'MOBILE' ? '+36' : ''
})

function openDialog() {
    dialog.value = true
}

function close() {
    dialog.value = false
    editedItem.value = Object.assign({}, defaultItem)
    responseObj.value = { loading: false, success: false, message: '' }
    step.value = 1
}

const createEntity = () => {
    responseObj.value.loading = true
    var data = editedItem.value
    data.networkIdentifier = prefix.value + data.networkIdentifier
    addNetworkEntity(data)
        .then((response) => {
            responseObj.value.success = true
            responseObj.value.message = 'Network entity created successfully'
            emit('update-table')
        }).finally(() => {
            responseObj.value.loading = false
            step.value = 2
        })
}
</script>