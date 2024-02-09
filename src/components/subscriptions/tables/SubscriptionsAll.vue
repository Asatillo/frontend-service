<template>
    <v-data-table-server v-model:itemsPerPage="itemsPerPage" :headers="headers" :items-length="totalItems"
        :items="subscriptions" item-value="id" :itemsPerPageOptions="[10, 15, 20]" :loading="loading"
        @update:options="requestServerItems">
        <template v-slot:item.active="{ item }">
            <v-icon v-if="item.active" color="green">mdi-check</v-icon>
            <v-icon v-else color="red">mdi-close</v-icon>
        </template>
        <template v-slot:item.networkAdress="{ item }">
            <v-icon v-if="item.deviceType == 'MOBILE'" color="green">mdi-sim</v-icon>
            <v-icon v-else color="blue">mdi-router-wireless</v-icon>
            <span>{{ item.networkAdress }}</span>
        </template>
    </v-data-table-server>
</template>

<script setup>
import { ref } from 'vue';
import { formatDateString } from '@/services/date-formatting';
import axios from 'axios';

const itemsPerPage = ref(15);
const search = ref('');
const loading = ref(false);
const subscriptions = ref([]);
const totalItems = ref(0);
const headers = ref([
  { title: 'Id', key: 'id', align: 'center' },
  { title: 'Customer', key: 'fullname', align: 'center' },
  { title: 'Active', key: 'active', align: 'center' },
  { title: 'Network Entity', key: 'networkAdress', align: 'left' },
  { title: 'Device', key: 'deviceModel', align: 'center' },
  { title: 'Plan', key: 'plan.name', align: 'center' },
  { title: 'Start Date', key: 'startDate', align: 'right' },
  { title: 'End Date', key: 'endDate', align: 'right' }
]);

function requestServerItems({ page, itemsPerPage }) {
    loading.value = true;
    getSubscriptions({ page, itemsPerPage });
    loading.value = false;
}

const getSubscriptions = async ({ page, itemsPerPage }) => {
  const config = {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    },
  };
  try {
    const response = await axios.get(`crm/subscriptions?page=${page}&size=${itemsPerPage}`, config);
    if (response.data) {
      totalItems.value = response.data.totalElements;
      subscriptions.value = response.data.content;
      subscriptions.value.forEach(element => {
        if (element.networkEntity.owner != null) {
          element.fullname = element.networkEntity.owner.firstName + ' ' + element.networkEntity.owner.lastName;
        }
        element.networkAdress = element.networkEntity.networkIdentifier;
        element.deviceType = element.networkEntity.deviceType;
        if (element.device != null) {
          element.deviceModel = element.device.deviceTemplate.model;
        } else {
          element.deviceModel = '-';
        }
        element.startDate = formatDateString(element.startDate);
        element.endDate = formatDateString(element.endDate);

      });
      loading.value = false;
    }
  } catch (err) {
    console.log(err)
  }
};
</script>