<template>
  <v-dialog v-model="dialog" max-width="500" @click:outside="close">
    <v-card>
      <v-card-title class="text-h6 text-center">{{ dialogTitle }}</v-card-title>
      <v-card-text>
        <v-window v-model="step">
          <v-window-item :value="1">
            <v-row class="ma-1">
              <v-col cols="6">
                <SelectCustomer v-model="editedItem.customer" :customerId="editedItem.customer" />
              </v-col>
              <v-col cols="6">
                <v-select v-model="deviceType" :items="['MOBILE', 'ROUTER']" label="Device type" density="comfortable"
                  @update:model-value="getNetworkEntities"></v-select>
              </v-col>
              <v-col cols="6">
                <v-autocomplete v-model="editedItem.networkEntity" :items="networkEntities" label="Network Identifier"
                  :loading="networkEntitiesLoading" item-title="networkEntity" item-value="id"
                  density="comfortable"></v-autocomplete>
              </v-col>
              <v-col cols="6">
                <v-autocomplete v-model="editedItem.plan" :items="plans" label="Plan" :loading="plansLoading"
                  item-title="name" item-value="id" density="comfortable">
                </v-autocomplete>
              </v-col>
              <v-col cols="6">
                <OfferedPromotionsByCustomerAndType v-model="editedItem.promotion" :promotion="editedItem.promotion" type="PLAN" :customerId="editedItem.customer"/>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="editedItem.startDate" label="Start Date" type="date"
                  density="comfortable"></v-text-field>
              </v-col>
            </v-row>
          </v-window-item>
          <v-window-item :value="2">
            <div v-if="!responseObj.loading" class="pa-4 text-center">
              <v-icon v-if="responseObj.success" size="80" color="green">mdi-check</v-icon>
              <v-icon v-else size="80" color="red">mdi-message-alert</v-icon>
              <h3 class="text-h6 font-weight-light mb-2">{{ responseObj.message }}</h3>
            </div>
            <v-progress-linear v-else indeterminate color="primary"></v-progress-linear>
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="warning" text @click="close">Close</v-btn>
        <v-btn v-if="step == 1" color="primary" text @click="save"
          :disabled="!editedItem.plan || !editedItem.networkEntity">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="changeActiveDialog" max-width="500px" @click:outside="closeActiveChangeDialog">
    <v-card>
      <v-card-title class="text-h6 text-center">{{ changeActiveDialogTitle }}</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue" @click="closeActiveChangeDialog">Cancel</v-btn>
        <v-btn color="blue" @click="changeActiveStatus">Confirm</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-toolbar flat>
    <v-text-field class="ma-1" v-model="search" append-inner-icon="mdi-magnify" label="Search" single-line
      hide-details></v-text-field>
    <v-divider class="mx-2" inset vertical></v-divider>
    <v-btn prepend-icon="mdi-plus" color="primary" @click="openAddNumberDialog">Add subscription</v-btn>
  </v-toolbar>
  <v-data-table-server v-model:itemsPerPage="itemsPerPage" :headers="headers" :items-length="totalItems"
    :items="subscriptions" item-value="id" :itemsPerPageOptions="[10, 15, 20]" :loading="loading" :search="search"
    @update:options="requestServerItems" no-data-text="No subscriptions found">
    <template v-slot:item.active="{ item }">
      <v-icon size="15" v-if="item.active" color="green">mdi-check</v-icon>
      <v-icon size="15" v-else color="red">mdi-close</v-icon>
    </template>

    <template v-slot:item.networkEntity.networkIdentifier="{ item }">
      <v-icon v-if="item.networkEntity.deviceType == 'MOBILE'" color="green">mdi-sim</v-icon>
      <v-icon v-else color="blue">mdi-router-wireless</v-icon>
      <span>{{ item.networkEntity.networkIdentifier }}</span>
    </template>

    <template v-slot:item.customer="{ item }">
      <v-chip v-if="item.networkEntity.owner"
        @click="$router.push({ name: 'Customer', params: { id: item.networkEntity.owner.id } })">{{
    item.networkEntity.owner.firstName + ' ' +
    item.networkEntity.owner.lastName }}</v-chip>
    </template>

    <template v-slot:item.startDate="{ item }">
      <span>{{ formatDateString(item.startDate) }}</span>
    </template>

    <template v-slot:item.endDate="{ item }">
      <span>{{ formatDateString(item.endDate) }}</span>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon class="mx-1" @click="openChangeActiveDialog(item)" :color="item.active ? 'red' : 'green'">{{ item.active ?
    'mdi-bell-off' : 'mdi-bell' }}</v-icon>
    </template>
  </v-data-table-server>
</template>

<script setup>
import { ref, watch } from 'vue';
import SelectCustomer from '@/components/customers/components/SelectCustomer.vue';
import { formatDateString } from '@/services/date-formatting';
import { searchCustomers } from '@/services/rest/customers-api'
import { getSubscriptions, addSubscription, changeSubscriptionStatus } from '@/services/rest/subscriptions-api';
import { getActivePlansByType } from '@/services/rest/plans-api';
import { getNetworkEntitiesOfCustomerByType } from '@/services/rest/network-entities-api';
import OfferedPromotionsByCustomerAndType from '@/components/offered-promotions/OfferedPromotionsByCustomerAndType.vue';

// data table variables
const itemsPerPage = ref(15);
const search = ref('');
const loading = ref(false);
const totalItems = ref(0);
const subscriptions = ref([]);

// dialog variables
const dialog = ref(false);
const dialogTitle = ref('');
const changeActiveDialog = ref(false);
const changeActiveDialogTitle = ref('');

// loding indicator variables
const plansLoading = ref(false);
const networkEntitiesLoading = ref(false);
const customersLoading = ref(false);

// data variables
const customers = ref([]);
const plans = ref([]);
const networkEntities = ref([]);
const deviceType = ref(null);
const itemToChange = ref(null);

const step = ref(1);
const responseObj = ref({ loading: false, success: null, message: '' })

const defaultItem = {
  customer: null,
  networkEntity: null,
  startDate: new Date().toISOString().substr(0, 10),
  plan: null,
};
const editedItem = ref(Object.assign({}, defaultItem));

const headers = [
  { title: 'Id', value: 'id', align: 'center' },
  { title: 'Active', value: 'active', align: 'center' },
  { title: 'Customer', value: 'customer', align: 'center' },
  { title: 'Network Entity', value: 'networkEntity.networkIdentifier', align: 'left' },
  { title: 'Plan', value: 'plan.name', align: 'center' },
  { title: 'Start Date', value: 'startDate', align: 'right' },
  { title: 'End Date', value: 'endDate', align: 'right' },
  { title: 'Actions', value: 'actions', align: 'center' }
]

function requestServerItems({ page, itemsPerPage, search }) {
  loading.value = true;
  getSubscriptions({ page, itemsPerPage, search }).then(response => {
    loading.value = false;
    totalItems.value = response.totalElements;
    subscriptions.value = response.content;
  }).finally(() => loading.value = false);
}

function openAddNumberDialog() {
  getCustomers('');
  dialog.value = true;
  dialogTitle.value = 'Add Subscription';
  editedItem.value = Object.assign({}, defaultItem);
}

function getCustomers(search) {
  customersLoading.value = true;
  searchCustomers(search).then(response => {
    customers.value = response

  }).finally(() => customersLoading.value = false);
}

function getNetworkEntities() {
  if (!editedItem.value.customer || !deviceType.value) return;
  networkEntitiesLoading.value = true;
  getNetworkEntitiesOfCustomerByType(editedItem.value.customer, deviceType.value).then(response => {
    networkEntities.value = response.content.map(entity => {
      return {
        id: entity.id,
        networkEntity: entity.networkIdentifier
      };
    });
  }).finally(() => networkEntitiesLoading.value = false);
}

function save() {
  step.value = 2;
  responseObj.value.loading = true;
  addSubscription(editedItem.value.networkEntity, editedItem.value.plan, editedItem.value.promotion, editedItem.value.startDate).then((response) => {
    if (response) {
      responseObj.value.message = 'Subscription added successfully';
      responseObj.value.success = true;
      requestServerItems({ page: 1, itemsPerPage: itemsPerPage.value, search: search.value });
      setTimeout(() => {
        if (dialog.value) {
          close();
        }
      }, 5000);
    }
  }).finally(() => responseObj.value.loading = false);
}

function close() {
  dialog.value = false;
  step.value = 1;
  deviceType.value = null;
  editedItem.value = Object.assign({}, defaultItem);
  plans.value = Object.assign([]);
  networkEntities.value = Object.assign([]);
}

function openChangeActiveDialog(promotion) {
  itemToChange.value = promotion
  changeActiveDialogTitle.value = `Are you sure you want to ${itemToChange.value.active ? 'deactivate' : 'activate'} this item?`
  changeActiveDialog.value = true
}

function closeActiveChangeDialog() {
  changeActiveDialog.value = false
  itemToChange.value = Object.assign({})
}

function changeActiveStatus() {
  var mode = itemToChange.value.active ? 'deactivate' : 'activate'
  changeSubscriptionStatus(itemToChange.value.id, mode).then(response => {
    subscriptions.value = subscriptions.value.map(subscription => {
      if (subscription.id === response.id) {
        subscription.active = response.active
      }
      return subscription
    })
    closeActiveChangeDialog()
  }).catch(error => {
    console.log(error)
  })
}

watch(deviceType, (newDeviceType) => {
  plansLoading.value = true;
  editedItem.value.plan = null;
  editedItem.value.networkEntity = null;
  getActivePlansByType(newDeviceType).then(response => {
    plans.value = response.content.map(plan => {
      return {
        id: plan.id,
        name: plan.name,
        subtitle: plan.services.map(service => service.name).join(', ')
      };
    });
  }).finally(() => plansLoading.value = false);
});
</script>