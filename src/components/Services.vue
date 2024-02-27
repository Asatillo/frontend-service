<template>
    <v-container class="pb-0">
        <div class="text-h5">Services</div>
        <div class="text-subtitle-1 mt-2">
            Services are the entities that form a plan. They can be of three types: DATA, VOICE, SMS.
            Default quanities are: GB for DATA, minutes for VOICE, and SMS for SMS services.
        </div>
    </v-container>
    <v-container>
        <v-data-table-server v-model:itemsPerPage="itemsPerPage" :headers="headers" :items-length="totalItems"
            :items="services" item-value="id" :itemsPerPageOptions="[10, 15, 20]" :loading="loading"
            @update:options="getAllServices">
            <template v-slot:item.active="{ item }">
                <v-icon v-if="item.active" color="green">mdi-check</v-icon>
                <v-icon v-else color="red">mdi-close</v-icon>
            </template>
            <template v-slot:item.type="{ item }">
                <v-icon v-if="item.type == 'DATA'" color="blue">mdi-web</v-icon>
                <v-icon v-else-if="item.type == 'VOICE'" color="green">mdi-phone</v-icon>
                <v-icon v-else-if="item.type == 'SMS'" color="orange">mdi-message</v-icon>
            </template>
            <template v-slot:item.designatedDeviceType="{ item }">
                <v-icon v-if="item.designatedDeviceType == 'MOBILE'" color="green">mdi-cellphone</v-icon>
                <v-icon v-else color="blue">mdi-router-wireless</v-icon>
                <span>{{ item.designatedDeviceType }}</span>
            </template>
            <template v-slot:item.price="{ item }">
                <span>{{ item.price }}</span>
            </template>


            <template v-slot:top>
                <v-toolbar :elevation="2" density="compact">
                    <v-spacer></v-spacer>
                    <v-btn prepend-icon="mdi-plus" color="primary" dark @click="createNewServiceDialog">
                        New service
                    </v-btn>
                    <v-dialog v-model="dialog" max-width="500px" @click:outside="close">
                        <v-card>
                            <v-card-title>
                                <span class="text-h6">{{ editedItem.id != null ? "Edit Service" : "New Service" }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="12" md="12">
                                            <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-select v-model="editedItem.designatedDeviceType" label="Device type" cols="12" sm="6"
                                        md="6" :items="['MOBILE', 'ROUTER']">
                                    </v-select>
                                    <v-select v-model="editedItem.type" label="Type" cols="12" sm="6" md="6"
                                        :items="serviceTypesList">
                                    </v-select>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field v-model="editedItem.amount" type="number"
                                                label="Amount"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field v-model="editedItem.price" type="number"
                                                label="Price"></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue-darken-1" variant="text" @click="close">
                                    Cancel
                                </v-btn>
                                <v-btn color="blue-darken-1" variant="text" @click="save">
                                    Save
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
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
                </v-toolbar>
            </template>


            <template v-slot:item.actions="{ item }">
                <v-icon color="blue" size="small" class="me-2" @click="editServiceDialog(item)">
                    mdi-pencil
                </v-icon>
                <span @click="changeActive(item)">
                    <v-icon v-if="item.active" color="red" size="small">mdi-bell-off-outline</v-icon>
                    <v-icon v-else color="green" size="small">mdi-bell-outline</v-icon>
                </span>
            </template>
        </v-data-table-server>

    </v-container>
</template>
  
<script setup>
import { ref, reactive, computed } from 'vue';
import { getServices, changeServiceStatus, updateService, createService } from '@/services/rest/services-api';

const dialog = ref(false)
const dialogChangeActive = ref(false)
const activeChangeMode = ref('');
const itemsPerPage = ref(10);
const search = ref('');
const activeIndex = ref(-1);
const services = ref([]);
const loading = ref(false);
const totalItems = ref(0);
const dialogPurpose = ref('New Service');
const defaultItem = ref({
    id: null,
    name: "",
    type: "",
    amount: null,
    designatedDeviceType: "",
    price: null,
    active: true
});
const editedItem = ref(Object.assign({}, defaultItem.value));
const headers = reactive([
    { title: 'Name', key: 'name', align: 'left', sortable: true },
    { title: 'Active', key: 'active', align: 'center', sortable: false },
    { title: 'Type', key: 'type', align: 'left', sortable: false },
    { title: 'Amount', key: 'amount', align: 'left', sortable: false },
    { title: 'Device type', key: 'designatedDeviceType', align: 'center', sortable: false },
    { title: 'Price (HUF)', key: 'price', align: 'right', sortable: false },
    { title: 'Actions', key: 'actions', sortable: false, sortable: false },
]);

const getAllServices = async ({ page, itemsPerPage, sortBy }) => {
    loading.value = true;
    getServices({ page, itemsPerPage, sortBy }).then(response => {
        loading.value = false;
        totalItems.value = response.totalElements;
        services.value = response.content;
    });
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

function changeActiveClose() {
    dialogChangeActive.value = false;
};

var serviceTypesList = computed(() => {
    if (editedItem.value.designatedDeviceType == "MOBILE") {
        return ["DATA", "VOICE", "SMS"];
    } else {
        return ["DATA"];
    }
});

const changeServiceActive = async (id, mode) => {
    changeServiceStatus(id, mode).then(() => {
        services.value = services.value.map((item) => {
            if (item.id == id) {
                item.active = !item.active;
                return item;
            }
            return item;
        });
    });
};

function close() {
    dialog.value = false;
    editedItem.value = Object.assign({}, defaultItem.value)
};

function save() {
    if (editedItem.value.id) {
        editService(editedItem.value);
    } else {
        addService(editedItem.value);
    }

    close();
};

function editServiceDialog(item) {
    dialogPurpose.value = 'Edit service';
    dialog.value = true;
    editedItem.value = Object.assign({}, item);
};

const editService = async (item) => {
    var service = {
        name: item.name,
        type: item.type,
        amount: item.amount,
        designatedDeviceType: item.designatedDeviceType,
        price: item.price,
    };
    updateService(item.id, service).then(() => {
        getAllServices({ page: 1, itemsPerPage: 10, sortBy: [] });
    });
}

function createNewServiceDialog() {
    dialogPurpose.value = 'New service';
    dialog.value = true;
    editedItem.value = Object.assign({}, defaultItem.value);
};

const addService = async (item) => {
    createService(item).then(() => {
        getAllServices({ page: 1, itemsPerPage: 10, sortBy: [] });
    }).catch(err => {
        console.log(err);
    });
};
</script>
  