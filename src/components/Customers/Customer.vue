<template>
    <v-container fluid>
        <v-dialog v-model="dialogChangeActive" max-width="500px">
            <v-card>
                <v-card-title class="text-h6 text-center">Are you sure you want to {{
                    customer.active ? 'deactivate' : 'activate' }} this customer?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="dialogChangeActive = false">Cancel</v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="changeActiveConfirm">Confirm</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogEditCustomer" max-width="500px" @click:outside="close">
            <v-card>
                <v-card-title>
                    <span class="text-h5">Edit Customer</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="6">
                                <v-text-field v-model="editedItem.firstName" label="First name"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field v-model="editedItem.lastName" label="Last name"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field v-model="editedItem.email" label="Email"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field v-model="editedItem.address" label="Address"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-autocomplete v-model="editedItem.city" :items="hu_cities" label="City"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field v-model="editedItem.dob" label="Birth date" type="date"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-select v-model="editedItem.segment" label="Segment"
                                    :items="['PREMIUM', 'GOLD', 'SILVER', 'BRONZE', 'EXPLORE']"></v-select>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="close">Cancel</v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="save">Save</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-card flat tile class="mx-auto">
            <v-card-title class="justify-center align-center">
                <v-row class="px-1 mt-1">
                    <v-icon color="blue" size="40">mdi-account</v-icon>
                    <span class="text-h4 font-weight-bold">{{ customer.firstName }} {{ customer.lastName }}</span>

                    <v-chip :color="customer.active ? 'green' : 'red'" class="mt-1 ml-1">{{ customer.active ? 'active' :
                        'inactive' }}</v-chip>
                    <v-spacer></v-spacer>

                    <v-menu class="ma-2 mp-2">
                        <template v-slot:activator="{ props }">
                            <v-btn icon="mdi-dots-vertical" variant="plain" v-bind="props">
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item class="pa-0" @click="openEditDialog">
                                <v-btn variant="text">
                                    Edit
                                </v-btn>
                            </v-list-item>
                            <v-list-item class="pa-0" @click="dialogChangeActive = true">
                                <v-btn variant="text">
                                    {{ customer.active ? 'Deactivate' : 'Activate' }}
                                </v-btn>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-row>
            </v-card-title>
            <v-card-text class="pb-1">
                <b>Member since:</b> {{ formatDateString(customer.accCreationDate) }}
            </v-card-text>
            <v-divider></v-divider>
            <v-card-text class="py-0">
                <v-row>
                    <v-col cols="12" md="6">
                        <v-list dense>
                            <v-list-item>
                                <v-icon color="red">mdi-seal</v-icon>
                                {{ customer.segment }}
                            </v-list-item>
                            <v-list-item>
                                <v-icon color="green">mdi-at</v-icon> {{ customer.email }}
                            </v-list-item>
                            <v-list-item>
                                <v-icon>mdi-home</v-icon>
                                {{ customer.address }}, {{ customer.city }}
                            </v-list-item>
                        </v-list>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-list dense>
                            <v-list-item>
                                <v-icon color="primary">mdi-cake</v-icon>
                                {{ formatDateString(customer.dob) }}
                            </v-list-item>
                            <v-list-item>
                                <v-icon
                                    :color="customer.wiredInternetAvailable ? 'green' : 'red'">mdi-router-wireless</v-icon>
                                {{ customer.wiredInternetAvailable ? 'Available' : 'Unavailable' }}
                            </v-list-item>
                        </v-list>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <v-card>
            <v-tabs v-model="tab" bg-color="">
                <v-tab value="subscriptions">Subscriptions</v-tab>
                <v-tab value="devices">Devices</v-tab>
                <v-tab value="phone_numbers">Phone numbers</v-tab>
                <v-tab value="sales">Sales</v-tab>
                <v-tab value="offers">Offers</v-tab>
            </v-tabs>

            <v-card-text>
                <v-window v-model="tab">
                    <v-window-item value="subscriptions">
                        <CustomerSubscriptions v-bind:id=route.params.id />
                    </v-window-item>

                    <v-window-item value="devices">
                        <CustomerDevices v-bind:id=route.params.id />
                    </v-window-item>

                    <v-window-item value="phone_numbers">
                        <CustomerNetworkEntities v-bind:id=route.params.id />
                    </v-window-item>

                    <v-window-item value="sales">
                        <CustomerSales v-bind:id=route.params.id />
                    </v-window-item>

                    <v-window-item value="offers">
                        <CustomerOfferedPromotions v-bind:id=route.params.id />
                    </v-window-item>
                </v-window>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
import { onMounted } from 'vue';
import { ref } from 'vue';
import { getCustomerById, editCustomer, changeCustomerStatus } from '@/services/rest/customers-api';
import { useRoute } from 'vue-router';
import { formatDateString } from '@/services/date-formatting'
import CustomerNetworkEntities from '@/components/customers/tables/CustomerNetworkEntities.vue';
import CustomerSubscriptions from '@/components/customers/tables/CustomerSubscriptions.vue';
import CustomerDevices from '@/components/customers/tables/CustomerDevices.vue';
import CustomerOfferedPromotions from '@/components/customers/tables/CustomerOfferedPromotions.vue';
import CustomerSales from '@/components/customers/tables/CustomerSales.vue';

const route = useRoute();
const tab = ref('subscriptions');

const customer = ref({});
const activeId = ref(null);
const dialogChangeActive = ref(false);
const dialogEditCustomer = ref(false);

const hu_cities = ref(require('@/assets/hu_cities.json'));

const defaultItem = ref({
    id: 0,
    firstName: null,
    lastName: null,
    email: null,
    address: null,
    city: null,
    dob: null,
    segment: null,
    accCreationDate: null,
    active: null,
});
const editedItem = ref(Object.assign({}, defaultItem.value));

onMounted(() => {
    var id = route.params.id;
    activeId.value = id;
    getCustomer(id);
});

const getCustomer = async (id) => {
    getCustomerById(id).then(response => {
        customer.value = response;
    }).catch(error => {
        console.log(error);
    });
};


function openEditDialog() {
    dialogEditCustomer.value = true;
    editedItem.value = { ...customer.value };
}

function changeActiveConfirm() {
    changeCustomerActive(activeId.value, customer.value.active ? 'deactivate' : 'activate');
    dialogChangeActive.value = false;;
}

function save() {
    changeCustomer(editedItem.value);
    close();
}

function close() {
    dialogEditCustomer.value = false;
    editedItem.value = Object.assign({}, defaultItem.value);
}

const changeCustomer = async (item) => {
    var customerData = {
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
        address: item.address,
        city: item.city,
        dob: item.dob,
        segment: item.segment,
    }
    editCustomer(item.id, customerData).then(response => {
        customer.value = response;
    }).catch(error => {
        console.log(error);
    });
};

const changeCustomerActive = async (id, mode) => {
    changeCustomerStatus(id, mode).then(response => {
        customer.value = response;
    }).catch(error => {
        console.log(error);
    });
};
</script>