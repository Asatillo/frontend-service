<template>
    <v-container class="pb-0">
        <div class="text-h5">Customers</div>
    </v-container>
    <v-container>
        <v-toolbar>
            <v-text-field v-model="search" append-inner-icon="mdi-magnify" label="Search" single-line hide-details
                class="ma-1"></v-text-field>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-btn prepend-icon="mdi-plus" color="primary" @click="createNewCustomerDialog">New
                customer</v-btn>
        </v-toolbar>
        <v-data-table-server v-model:itemsPerPage="itemsPerPage" :items="customers" item-value="id"
            :items-length="totalItems" :items-per-page-options="[15, 20, 25]" :loading="loading"
            @update:options="getAllCustomers" :headers="headers" :search="search" @click:row="handleRowClick"
            item-class="row-class">
            <template v-slot:item.active="{ item }">
                <v-icon :color="item.active ? 'green' : 'red'" dark>{{ item.active ? 'mdi-check' : 'mdi-close' }}</v-icon>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-row>
                    <v-btn color="blue" size="30" icon class="mr-2" @click.stop="editCustomerDialog(item)">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn size="30" icon @click.stop="changeActive(item)">
                        <v-icon v-if="item.active" color="red">mdi-bell-off-outline</v-icon>
                        <v-icon v-else color="green">mdi-bell-outline</v-icon>
                    </v-btn>
                </v-row>
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
            <template v-slot:item.name="{ item }">
                {{ item.firstName }} {{ item.lastName }}
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
                    <span class="text-h6">{{ dialogPurpose }}</span>
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
import { formatDateString } from '@/services/date-formatting'
import { getCustomers, changeCustomerStatus, editCustomer, addCustomer } from '@/services/rest/customers-api';
import router from '@/router';
const hu_cities = ref(require('@/assets/hu_cities.json'));

const itemsPerPage = ref(15);
const dialogChangeActive = ref(false);
const activeChangeMode = ref('');
const activeIndex = ref(-1);
const dialog = ref(false);

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
    { title: 'Name', key: 'name', sortable: true },
    { title: 'Birth date', key: 'dob', sortable: true },
    { title: 'Email', key: 'email', sortable: true },
    { title: 'Adress', key: 'adress', sortable: false },
    { title: 'Segment', key: 'segment', sortable: true },
    { title: "Account created", key: 'accCreationDate', sortable: true },
    { title: "Wired internet", key: "wiredInternetAvailable", sortable: false, align: "center" },
    { title: "Actions", key: "actions", sortable: false, align: "center" }

])
const totalItems = ref(0);
const customers = ref([]);
const loading = ref(false);

const getAllCustomers = async ({ page, itemsPerPage, sortBy, groupBy, search }) => {
    loading.value = true;
    getCustomers({ page, itemsPerPage, sortBy, groupBy, search }).then(response => {
        totalItems.value = response.totalElements;
        customers.value = response.content;
        loading.value = false;
    }).catch(error => {
        console.log(error)
    })
};

function changeActive(item) {
    activeIndex.value = item.id;
    activeChangeMode.value = item.active ? 'deactivate' : 'activate';
    dialogChangeActive.value = true;
};

function changeActiveConfirm() {
    changeCustomerActive(activeIndex.value, activeChangeMode.value);
    activeIndex.value = -1;
    editedItem.value = Object.assign({}, defaultItem.value);
    activeChangeMode.value = '';
    changeActiveClose();
};

const changeCustomerActive = async (id, mode) => {
    changeCustomerStatus(id, mode).then(response => {
        customers.value = customers.value.map((item) => {
            if (item.id == id) {
                return response;
            }
            return item;
        });
    }).catch(error => {
        console.log(error)
    })
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
        changeCustomer(editedItem.value);
    } else {
        addNewCustomer(editedItem.value);
    }

    close();
};

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
        customers.value = customers.value.map((item) => {
            if (item.id == response.id) {
                return response;
            }
            return item;
        });
    }).catch(error => {
        console.log(error)
    })
};

function createNewCustomerDialog() {
    dialogPurpose.value = 'New Customer';
    editedItem.value = Object.assign({}, defaultItem.value);
    dialog.value = true;
}

const addNewCustomer = async (item) => {
    var newCustomer = {
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
        address: item.address,
        city: item.city,
        dob: item.dob,
        segment: item.segment,
    }
    addCustomer(newCustomer).then(() => {
        getAllCustomers({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [], groupBy: [], search: '' });
    }).catch(error => {
        console.log(error)
    })
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