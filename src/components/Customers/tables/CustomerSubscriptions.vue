<template>
    <v-data-table-server :items="subscriptions" :headers="headers" v-model:itemsPerPage="itemsPerPage" item-value="id"
        :items-length="totalItems" @update:options="requestServerItems" :items-per-page-options="[15, 20, 25]">
        <template v-slot:top>
            <v-toolbar flat>
                <v-text-field class="ml-1" v-model="search" append-inner-icon="mdi-magnify" label="Search" single-line
                    hide-details></v-text-field>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-btn color="green" prepend-icon="mdi-shopping" @click="openNewSubscriptionDialog">Add Subscription</v-btn>
            </v-toolbar>
        </template>
        <template v-slot:item.startDate="{ item }">
            {{ formatDateString(item.startDate) }}
        </template>
        <template v-slot:item.endDate="{ item }">
            {{ formatDateString(item.endDate) }}
        </template>
        <template v-slot:item.active="{ item }">
            <v-icon v-if="item.active" color="green">mdi-check</v-icon>
            <v-icon v-else color="red">mdi-close</v-icon>
        </template>
        <template v-slot:item.number="{ item }">
            <v-icon v-if="item.networkEntity.deviceType == 'MOBILE'" color="green">mdi-phone</v-icon>
            <v-icon v-else color="blue">mdi-router-wireless</v-icon>
            {{ item.networkEntity.networkIdentifier }}
        </template>
        <template v-slot:item.actions="{ item }">
            <v-btn size="30" icon @click.stop="changeActive(item)">
                <v-icon v-if="item.active" color="red">mdi-bell-off-outline</v-icon>
                <v-icon v-else color="green">mdi-bell-outline</v-icon>
            </v-btn>
        </template>
    </v-data-table-server>
    <v-dialog v-model="dialog" max-width="500px" @click:outside="close">
        <v-card>
            <v-card-title class="text-h6">New Subscription</v-card-title>
            <v-card-text>
                <v-window v-model="step">
                    <v-window-item :value="1">
                        <v-select v-model="deviceType" label="Device type" :items="['MOBILE', 'ROUTER']" required
                            item-value="id" item-title="brand"></v-select>
                        <v-select v-model="subscription.networkEntityId" label="Phone number" required chips
                            :disabled="!deviceType" :items="availableNetworkEntities" item-value="id"
                            item-title="networkIdentifier" no-data-text="No phone numbers was found for this customer"
                            hint="Only the numbers without an active subscpiption" persistent-hint>
                        </v-select>
                        <v-select v-model="subscription.planId" label="Plan" required :disabled="!deviceType"
                            :items="availablePlans" item-value="id" item-title="name">
                        </v-select>
                        <OfferedPromotionsByCustomerAndType v-model="subscription.promotionId" :promotion="subscription.promotionId" :customerId="props.id" type="PLAN"/>
                    </v-window-item>
                    <v-window-item :value="2">
                        <v-progress-linear v-if="responseObj.loading" indeterminate color="primary"></v-progress-linear>
                        <div v-else class="pa-4 text-center">
                            <v-icon size="80" color="green">mdi-check</v-icon>
                            <h3 class="text-h6 font-weight-light mb-2">{{ responseObj.success ? 'Success' :
        'Fail' }}!</h3>
                            <span class="text-caption text-grey">{{ responseObj.message }}</span>
                        </div>
                    </v-window-item>
                </v-window>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="close">Close</v-btn>
                <v-btn v-if="step == 1" color="primary" text @click="addNewSubscription"
                    :disabled="!subscription.planId || !subscription.networkEntityId">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogActive" max-width="500px">
        <v-card>
            <v-card-title class="text-h6 text-center">
                Are you sure you want to {{ itemToChange.active ? 'deactivate' : 'activate' }} this item?
            </v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue" @click="closeActiveChangeDialog">Cancel</v-btn>
                <v-btn color="blue" @click="changeActiveStatus">Confirm</v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { getSubscriptionsByCustomer, changeSubscriptionStatus } from '@/services/rest/subscriptions-api'
import { getNetworkEntitiesOfCustomerByType } from '@/services/rest/network-entities-api'
import { getActivePlansByType } from '@/services/rest/plans-api'
import { addSubscription } from '@/services/rest/subscriptions-api'
import { formatDateString } from '@/services/date-formatting.js'
import OfferedPromotionsByCustomerAndType from '@/components/offered-promotions/OfferedPromotionsByCustomerAndType.vue';
import { watch } from 'vue';

const props = defineProps(['id'])

const emit = defineEmits(['invoice-created'])

const headers = ref([
    { title: 'ID', key: 'id' },
    { title: 'Active', key: 'active' },
    { title: 'Plan', key: 'plan.name' },
    { title: 'Number', key: 'number', sortable: false },
    { title: 'Tag', key: 'networkEntity.tag', sortable: false },
    { title: 'Start date', key: 'startDate' },
    { title: 'End date', key: 'endDate' },
    { title: 'Price (HUF)', key: 'plan.price', align: 'end' },
    { title: 'Actions', value: 'actions', align: 'center', sortable: false }
]);
const subscriptions = ref([])
const deviceType = ref('')
const step = ref(1)
const search = ref('')
const responseObj = ref({ loading: false, success: false, message: '' })
const dialog = ref(false)
const totalItems = ref(0)
const itemsPerPage = ref(15)
const itemToChange = ref(null)
const dialogActive = ref(false)
const defaultSubscription = {
    networkEntityId: null,
    planId: null,
    promotionId: null
}
const subscription = ref(Object.assign({}, defaultSubscription))
const availableNetworkEntities = ref([])
const availablePlans = ref([])

function requestServerItems({ page, itemsPerPage }) {
    getCustomerSubscriptions({ page, itemsPerPage }, props.id)
}

const getCustomerSubscriptions = async ({ page, itemsPerPage }, id) => {
    getSubscriptionsByCustomer(id, { page, itemsPerPage }).then(response => {
        totalItems.value = response.totalElements
        subscriptions.value = response.content
    }).catch(error => {
        console.log(error)
    })
}

const addNewSubscription = async () => {
    step.value = 2
    responseObj.value.loading = true
    addSubscription(subscription.value.networkEntityId, subscription.value.planId, subscription.value.promotionId).then(response => {
        responseObj.value.loading = false
        responseObj.value.success = true
        responseObj.value.message = 'Subscription added successfully'
        requestServerItems({ page: 1, itemsPerPage: itemsPerPage.value })
        emit('invoice-created')
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

function openNewSubscriptionDialog() {
    dialog.value = true
}

function close() {
    dialog.value = false
    step.value = 1
    responseObj.value.loading = false
    responseObj.value.success = false
    responseObj.value.message = ''
    deviceType.value = ''
    subscription.value = Object.assign({}, defaultSubscription)
}

const getNetworkEntitiesOfCustomer = async (deviceType) => {
    getNetworkEntitiesOfCustomerByType(props.id, deviceType).then(response => {
        availableNetworkEntities.value = response.content.map((item) => {
            return {
                id: item.id,
                networkIdentifier: `${item.networkIdentifier} (${item.tag})`
            }
        })
    }).catch(error => {
        console.log(error)
    })
}

const getAvailablePlans = async (deviceType) => {
    getActivePlansByType(deviceType).then(response => {
        availablePlans.value = response.content.map((item) => {
            return {
                id: item.id,
                name: item.name
            }
        })
    }).catch(error => {
        console.log(error)
    })
}

function changeActive(promotion) {
    itemToChange.value = promotion
    dialogActive.value = true
}

function closeActiveChangeDialog() {
    dialogActive.value = false
    itemToChange.value = null
}

function changeActiveStatus() {
    changeSubscriptionStatus(itemToChange.value.id, (itemToChange.value.active ? 'deactivate' : 'activate')).then(response => {
        dialogActive.value = false
        subscriptions.value = subscriptions.value.map(subscription => {
            if (subscription.id === response.id) {
                subscription.active = response.active
            }
            return subscription
        })
    }).catch(error => {
        console.log(error)
    })
}

watch(deviceType, (newValue) => {
    getNetworkEntitiesOfCustomer(newValue);
    getAvailablePlans(newValue);
})
</script>
