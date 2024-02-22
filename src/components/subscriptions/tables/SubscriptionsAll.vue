<template>
  <v-data-table-server v-model:itemsPerPage="itemsPerPage" :headers="headers" :items-length="totalItems"
    :items="subscriptions" item-value="id" :itemsPerPageOptions="[10, 15, 20]" :loading="loading"
    @update:options="requestServerItems">
    <template v-slot:item.active="{ item }">
      <v-icon v-if="item.active" color="green">mdi-check</v-icon>
      <v-icon v-else color="red">mdi-close</v-icon>
    </template>
    <template v-slot:item.networkEntity.networkIdentifier="{ item }">
      <v-icon v-if="item.networkEntity.deviceType == 'MOBILE'" color="green">mdi-sim</v-icon>
      <v-icon v-else color="blue">mdi-router-wireless</v-icon>
      <span>{{ item.networkEntity.networkIdentifier }}</span>
    </template>
    <template v-slot:item.customer="{ item }">
      <span v-if="item.networkEntity.owner">{{ item.networkEntity.owner.firstName + ' ' +  item.networkEntity.owner.lastName }}</span>
    </template>
    <template v-slot:item.deviceModel="{ item }">
      <span v-if="item.device">{{ item.device.deviceTemplate.model }}</span>
      <span v-else>-</span>
    </template>
    <template v-slot:item.startDate="{ item }">
      <span>{{ formatDateString(item.startDate) }}</span>
    </template>
    <template v-slot:item.endDate="{ item }">
      <span>{{ formatDateString(item.endDate) }}</span>
    </template>
  </v-data-table-server>
</template>

<script setup>
import { ref } from 'vue';
import { formatDateString } from '@/services/date-formatting';
import { getSubscriptions } from '@/services/rest/subscriptions-api';

const itemsPerPage = ref(15);
const search = ref('');
const loading = ref(false);
const subscriptions = ref([]);
const totalItems = ref(0);
const headers = ref([
  { title: 'Id', value: 'id', align: 'center' },
  { title: 'Customer', value: 'customer', align: 'center' },
  { title: 'Active', value: 'active', align: 'center' },
  { title: 'Network Entity', value: 'networkEntity.networkIdentifier', align: 'left' },
  { title: 'Device', value: 'deviceModel', align: 'center' },
  { title: 'Plan', value: 'plan.name', align: 'center' },
  { title: 'Start Date', value: 'startDate', align: 'right' },
  { title: 'End Date', value: 'endDate', align: 'right' }
]);

function requestServerItems({ page, itemsPerPage }) {
  loading.value = true;
  getSubscriptions({ page, itemsPerPage }).then(response => {
    loading.value = false;
    totalItems.value = response.totalElements;
    subscriptions.value = response.content;
  });
  loading.value = false;
}
</script>