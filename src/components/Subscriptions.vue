<template>
  <v-container fluid>
    <v-row justify="center">
        <h2 class="text-h2 text-center">Subscriptions</h2>
    </v-row>
  </v-container>
  <v-container >
    <v-data-table-server
    v-model:itemsPerPage="itemsPerPage"
    :headers="headers"
    :items-length="totalItems"
    :items="subscriptions"
    item-value="id"
    :itemsPerPageOptions="[10, 15, 20]"
    :loading="loading"
    @update:options="getSubscriptions">    
      <template v-slot:item.active="{ item }">
        <v-icon v-if="item.active" color="green">mdi-check</v-icon>
        <v-icon v-else color="red">mdi-close</v-icon>
      </template>
      <template v-slot:item.device.deviceTemplate.model="{ item }">
        <span v-if="item.device">{{ item.device.deviceTemplate.model }}</span>
        <span v-else>-</span>
      </template>
      <template v-slot:item.networkEntity.networkIdentifier="{ item }">
        <v-icon v-if="item.networkEntity.deviceType == 'MOBILE'" color="green">mdi-sim</v-icon>
        <v-icon v-else color="blue">mdi-router-wireless</v-icon>
        <span>{{ item.networkEntity.networkIdentifier }}</span>
      </template>
      <template v-slot:item.startDate="{ item }">
        <span>{{ formatDateString(item.startDate) }}</span>
      </template>
      <template v-slot:item.endDate="{ item }">
        <span>{{ formatDateString(item.endDate) }}</span>
      </template>
    </v-data-table-server>

  </v-container>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Subscriptions',
  data() {
    return {
      itemsPerPage: 10,
      search: '',
      subscriptions: [],
      loading: false,
      totalItems: 0,
      headers: [
        {text: 'Id', value: 'id', align: 'center'},
        {text: 'Customer', value: 'networkEntity.owner.firstName', align: 'center'},
        {text: 'CC', value: 'networkEntity.owner.lastName', align: 'center'},
        {text: 'Active', value: 'active', align: 'center'},
        {text: 'Network Entity', value: 'networkEntity.networkIdentifier', align: 'left'},
        {text: 'Plan', value: 'plan.name', align: 'center'},
        {text: 'Device', value: 'device.deviceTemplate.model', align: 'center'},
        {text: 'Start Date', value: 'startDate', align: 'right'},
        {text: 'End Date', value: 'endDate', align: 'right'}
      ]
    }
  },
  methods: {
    async getSubscriptions({ page, itemsPerPage, sortBy }) {
      this.loading = true;
      const config = {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
      };
      try{
        const response = await axios.get(`http://localhost:8765/crm/subscriptions?page=${page}&size=${itemsPerPage}`, config);
        if(response.data){
          console.log(response.data)
          this.totalItems = response.data.totalElements;
          this.loading = false;
          this.subscriptions = response.data.content;
        }
      }catch(err){
        console.log(err)
      }
    },
    formatDateString(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
      return formattedDate;
    },
  },
}
</script>