<template>
    <v-container fluid>
        <v-row justify="center">
            <h2 class="text-h2 text-center">Customers</h2>
        </v-row>
    </v-container>
    <v-container>
        <v-data-table-server v-model:itemsPerPage="itemsPerPage" :items="customers" item-value="id"
            :items-length="totalItems" :items-per-page-options="[15, 20, 25]" :loading="loading"
            @update:options="getCustomers" :headers="headers" :search="search" @click:row="handleRowClick"
            item-class="row-class">
            <template v-slot:item.active="{ item }">
                <v-icon :color="item.active ? 'green' : 'red'" dark>{{ item.active ? 'mdi-check' : 'mdi-close' }}</v-icon>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon color="blue" small class="mr-2" @click="editCustomerDialog(item)">mdi-pencil</v-icon>
                <span @click="changeActive(item)">
                    <v-icon v-if="item.active" color="red" size="small">mdi-bell-off-outline</v-icon>
                    <v-icon v-else color="green" size="small">mdi-bell-outline</v-icon>
                </span>
            </template>
            <template v-slot:item.wiredInternetAvailable="{ item }">
                <v-icon :color="item.wiredInternetAvailable ? 'green' : 'red'" dark>{{ item.wiredInternetAvailable ?
                    'mdi-check' : 'mdi-close' }}</v-icon>
            </template>
            <template v-slot:item.dob="{ item }">
                {{ formatDateString(item.dob) }}
            </template>
            <template v-slot:item.adress="{ item }">
                {{ item.address }}, {{ item.city }}
            </template>
            <template v-slot:item.accCreationDate="{ item }">
                {{ formatDateString(item.accCreationDate) }}
            </template>
            <template v-slot:top>
                <v-toolbar flat>
                    <v-text-field v-model="search" prepend-icon="mdi-magnify" label="Search" single-line hide-details
                        @keyup.enter="getCustomers" class="ml-3"></v-text-field>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn prepend-icon="mdi-plus" color="blue-darken-1" @click="createNewCustomerDialog">New customer</v-btn>
                </v-toolbar>
            </template>
        </v-data-table-server>
        <v-dialog v-model="dialogChangeActive" max-width="500px">
            <v-card>
                <v-card-title class="text-h6 text-center">Are you sure you want to {{ activeChangeMode }} this
                    item?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="changeActiveClose">Cancel</v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="changeActiveConfirm">Confirm</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialog" max-width="500px" @click:outside="close">
            <v-card>
                <v-card-title>
                    <span class="text-h5">{{ dialogPurpose }}</span>
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
    </v-container>
</template>
  
<script setup>
import { ref } from 'vue';
import { formatDateString } from '../services/date-formatting'
import axios from 'axios';
import router from '@/router';

const itemsPerPage = ref(15);
const dialogChangeActive = ref(false);
const activeChangeMode = ref('');
const activeIndex = ref(-1);
const dialog = ref(false);
const hu_cities = ref(require('../assets/hu_cities.json'));
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
const search = ref('');
const dialogPurpose = ref('New Customer');
const headers = ref([
    { title: "Active", key: 'active', sortable: false },
    { title: 'First name', key: 'firstName', sortable: true },
    { title: 'Last name', key: 'lastName', sortable: true },
    { title: 'Birth date', key: 'dob', sortable: true },
    { title: 'Email', key: 'email', sortable: true },
    { title: 'Adress', key: 'adress', sortable: false },
    { title: 'Segment', key: 'segment', sortable: true },
    { title: "Account created", key: 'accCreationDate', sortable: true },
    { title: "Wired internet", key: "wiredInternetAvailable", sortable: false },
    { title: "Actions", key: "actions", sortable: false }

])
const totalItems = ref(0);
const customers = ref([]);
const loading = ref(false);

const getCustomers = async ({ page, itemsPerPage, sortBy, groupBy, search }) => {
    loading.value = true;
    const config = {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
    };
    try {
        var sort = sortBy.length ? sortBy[0].key : 'id';

        const response = await axios.get(`crm/customers?page=${page}&size=${itemsPerPage}&sort=${sort}&search=${search}`, config);
        if (response.data) {
            totalItems.value = response.data.totalElements;
            customers.value = response.data.content;
            loading.value = false;
        }
    } catch (err) {
        console.log(err)
    }
};

function changeActive(item) {
    activeIndex.value = item.id;
    activeChangeMode.value = item.active ? 'deactivate' : 'activate';
    dialogChangeActive.value = true;
};

function changeActiveConfirm() {
    changeServiceActive(activeIndex.value, activeChangeMode.value);
    activeIndex.value = -1;
    editedItem.value = Object.assign({}, defaultItem.value);
    activeChangeMode.value = '';
    changeActiveClose();
};

const changeServiceActive = async (id, mode) => {
    const config = {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
    };
    try {
        const response = await axios.patch(`/crm/customers/${id}/${mode}`, {}, config);
        if (response.data) {
            customers.value = customers.value.map((item) => {
                if (item.id == id) {
                    return response.data;
                }
                return item;
            });
        }
    } catch (err) {
        console.log(err);
    }
};

function changeActiveClose() {
    dialogChangeActive.value = false;
};

function editCustomerDialog(item) {
    dialogPurpose.value = 'Edit Customer';
    editedItem.value = Object.assign({}, item);
    dialog.value = true;
};

function close() {
    dialog.value = false;
    editedItem.value = Object.assign({}, defaultItem.value)
};

function save() {
    if (editedItem.value.id) {
        editCustomer(editedItem.value);
    } else {
        addCustomer(editedItem.value);
    }

    close();
};

const editCustomer = async (item) => {
    const config = {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
    };
    try {
        const response = await axios.put(`/crm/customers/${item.id}`, {
            firstName: item.firstName,
            lastName: item.lastName,
            email: item.email,
            address: item.address,
            city: item.city,
            dob: item.dob,
            segment: item.segment,
        }, config);
        if (response.data) {
            customers.value = customers.value.map((item) => {
                if (item.id == response.data.id) {
                    return response.data;
                }
                return item;
            });
        }
    } catch (err) {
        console.log(err);
    }
};

function createNewCustomerDialog() {
    dialogPurpose.value = 'New Customer';
    editedItem.value = Object.assign({}, defaultItem.value);
    dialog.value = true;
}

const addCustomer = async (item) => {
    const config = {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
    };
    try {
        const response = await axios.post(`/crm/customers`, {
            firstName: item.firstName,
            lastName: item.lastName,
            email: item.email,
            address: item.address,
            city: item.city,
            dob: item.dob,
            segment: item.segment,
        }, config);
        if (response.data) {
            getCustomers({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [], groupBy: [], search: '' });
        }
    } catch (err) {
        console.log(err);
    }
};

function handleRowClick(event, customer) {
    router.push({ name: 'Customer', params: { id: customer.item.id } });
}

</script>
    
  
<style scoped>
.row-class:hover {
    background-color: lightblue;
    cursor: pointer;
}
</style>