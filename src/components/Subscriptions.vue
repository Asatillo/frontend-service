<template>
  <v-container fluid>
    <v-row justify="center">
        <h2 class="text-h2 text-center">Subscriptions</h2>
    </v-row>
  </v-container>
  <v-container v-if="subscriptions.length">
    <v-table>
      <!-- https://vuetifyjs.com/en/components/data-tables/server-side-tables/#server-side-search -->
      <thead>
        <tr>
          <th class="text-left">Id</th>
          <th class="text-left">Customer</th>
          <th class="text-left">Active</th>
          <th class="text-left">Network Entity</th>
          <th class="text-left">Plan</th>
          <th class="text-left">Device</th>
          <th class="text-left">Start Date</th>
          <th class="text-left">End Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in subscriptions" :key="item.id">

          <td>{{ item.id }}</td>
          <td>
            <span v-if="item.networkEntity.owner">{{ item.networkEntity.owner.firstName }} {{ item.networkEntity.owner.lastName }}</span>
            <span v-else>-</span>
          </td>
          <td>{{ item.active }}</td>
          <td>{{ item.networkEntity.networkIdentifier }}</td>
          <td>{{ item.plan.name }}</td>
          <td>
            <span v-if="item.device">{{ item.device.deviceTemplate.model }}</span>
            <span v-else>-</span>  
          </td>
          <td>{{ item.startDate }}</td>
          <td>{{ item.endDate }}</td>
        </tr>
      </tbody>
    </v-table>
    <v-pagination :length="totalPages"></v-pagination>
  </v-container>
  <v-container v-else>
    
    <v-row justify="center">
      <v-col cols="12" md="8" justify="center">
        <v-progress-circular color="blue-lighten-3" :size="40" indeterminate></v-progress-circular>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Subscriptions',
  data() {
    return {
      subscriptions: [],
      totalPages: "",
      currentPage: "",
    }
  },
  mounted() {
    this.getSubscriptions()
  },
  methods: {
    async getSubscriptions() {
      const config = {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
      };
      try{
        const response = await axios.get('http://localhost:8765/crm/subscriptions', config);
        if(response.data){
          console.log(response.data)
          this.totalPages = response.data.totalPages;
          this.currentPage = response.data.page;
          this.subscriptions = response.data.content;
        }
        // this.subscriptions = response.data;
      }catch(err){
        console.log(err)
      }
    },
  },
}
</script>