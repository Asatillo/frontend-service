<template>
    <v-container fluid>
        <v-card flat tile class="mx-auto">
            <v-card-title class="justify-center align-center">
                <v-row class="mx-1">
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
                            <v-list-item class="pa-0">
                                <v-btn variant="text">
                                    Edit
                                </v-btn>
                            </v-list-item>
                            <v-list-item class="pa-0">
                                <v-btn variant="text">
                                    {{ customer.active ? 'Deactivate' : 'Activate' }}
                                </v-btn>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-row>
            </v-card-title>
            <v-card-text>
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
                                <v-icon  :color="customer.wiredInternetAvailable ? 'green' : 'red'">mdi-router-wireless</v-icon>
                                {{ customer.wiredInternetAvailable ? 'Available' : 'Unavailable' }}
                            </v-list-item>
                            <v-list-item>
                                <b>Member Since:</b> 
                                {{ formatDateString(customer.accCreationDate) }}
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
                <v-tab value="invoices">Invoices</v-tab>
                <v-tab value="offers">Offers</v-tab> 
            </v-tabs>

            <v-card-text>
                <v-window v-model="tab">
                    <v-window-item value="subscriptions">
                        <v-data-table :items="subscriptions.items" :loading="subscriptions.loading" :headers="subscriptions.headers">
                            <template v-slot:item.startDate="{ item }">
                                {{ formatDateString(item.startDate) }}
                            </template>
                            <template v-slot:item.endDate="{ item }">
                                {{ formatDateString(item.endDate) }}
                            </template>
                            <template v-slot:item.number="{ item }">
                                <v-icon v-if="item.networkEntity.deviceType=='MOBILE'" color="green">mdi-phone</v-icon> 
                                <v-icon v-else color="blue">mdi-router-wireless</v-icon>
                                {{ item.networkEntity.networkIdentifier }}
                            </template>
                        </v-data-table>
                    </v-window-item>

                    <v-window-item value="devices">
                        devices
                    </v-window-item>

                    <v-window-item value="phone_numbers">
                        phone_numbers
                    </v-window-item>

                    <v-window-item value="invoices">
                        invoices
                    </v-window-item>

                    <v-window-item value="offers">
                        offers
                    </v-window-item>
                </v-window>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
import { onMounted } from 'vue';
import { ref } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { formatDateString } from '../services/date-formatting'

const route = useRoute();
const tab = ref('subscriptions');

const customer = ref({});
const subscriptions = ref({
    items: [],
    loading: true,
    headers: [
        {title: 'ID', key: 'id'},
        {title: 'Plan', key: 'plan.name'},
        {title: 'Number', key: 'number'},
        {title: 'Tag', key: 'networkEntity.tag'},
        {title: 'Price (HUF)', key: 'plan.price'},
        {title: 'Start date', key: 'startDate'},
        {title: 'End date', key: 'endDate'},
    ],
    pagination: {
        rowsPerPage: 10
    }
});

onMounted(() => {
    getCustomer(route.params.id);
    getCustomerSubscriptions(route.params.id);
});

const getCustomer = async (id) => {
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
    };
    try {
        const response = await axios.get(`crm/customers/${id}`, config);
        customer.value = response.data;
    } catch (error) {
        console.error(error);
    }
};

const getCustomerSubscriptions = async (id) => {
    subscriptions.value.loading = true;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
    };
    try {
        const response = await axios.get(`crm/subscriptions/customers/${id}`, config);
        subscriptions.value.items = response.data.content;
        subscriptions.value.loading = false;
    } catch (error) {
        console.error(error);
    }
}

</script>