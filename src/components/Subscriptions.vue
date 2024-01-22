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
      <template v-slot:item.networkAdress="{ item }">
        <v-icon v-if="item.deviceType == 'MOBILE'" color="green">mdi-sim</v-icon>
        <v-icon v-else color="blue">mdi-router-wireless</v-icon>
        <span>{{ item.networkAdress }}</span>
      </template>
    </v-data-table-server>

  </v-container>
</template>

<script>
import { ref, reactive } from 'vue';
import axios from 'axios';

export default {
  name: 'Subscriptions',
  setup() {
    const itemsPerPage = ref(10);
    const search = ref('');
    const subscriptions = ref([]);
    const loading = ref(false);
    const totalItems = ref(0);
    const headers = reactive([
      {text: 'Id', value: 'id', align: 'center'},
      {text: 'Customer', value: 'fullname', align: 'center'},
      {text: 'Active', value: 'active', align: 'center'},
      {text: 'Network Entity', value: 'networkAdress', align: 'left'},
      {text: 'Device', value: 'deviceModel', align: 'center'},
      {text: 'Plan', value: 'plan.name', align: 'center'},
      {text: 'Start Date', value: 'startDate', align: 'right'},
      {text: 'End Date', value: 'endDate', align: 'right'}
    ]);

    const getSubscriptions = async ({ page, itemsPerPage, sortBy }) => {
      loading.value = true;
      const config = {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
      };
      try{
        const response = await axios.get(`http://localhost:8765/crm/subscriptions?page=${page}&size=${itemsPerPage}`, config);
        if(response.data){
          console.log(response.data)
          totalItems.value = response.data.totalElements;       
          subscriptions.value = response.data.content;
          subscriptions.value.forEach(element => {
            if(element.networkEntity.owner != null){
              element.fullname = element.networkEntity.owner.firstName + ' ' + element.networkEntity.owner.lastName;
            }
            element.networkAdress = element.networkEntity.networkIdentifier;
            element.deviceType = element.networkEntity.deviceType;
            if(element.device != null){
              element.deviceModel = element.device.deviceTemplate.model;
            }else{
              element.deviceModel = '-';
            }
            element.startDate = formatDateString(element.startDate);
            element.endDate = formatDateString(element.endDate);
            
          });
          loading.value = false;
          console.log(subscriptions.value)
        }
      }catch(err){
        console.log(err)
      }
    };

    const formatDateString = (dateString) => {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
      return formattedDate;
    };

    return {
      itemsPerPage,
      search,
      subscriptions,
      loading,
      totalItems,
      headers,
      getSubscriptions,
      formatDateString
    };
  },
}
</script>
