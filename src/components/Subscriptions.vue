<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <h2 class="text-h2 text-center">Subscriptions</h2>
      </v-col>
    </v-row>
  </v-container>
  <v-container>
    <v-table>
      <!-- https://vuetifyjs.com/en/components/data-tables/server-side-tables/#server-side-search -->
      <thead>
        <tr>
          <th class="text-left">Id</th>
          <th class="text-left">Active</th>
          <th class="text-left">Network Entity</th>
          <th class="text-left">Plan</th>
          <th class="text-left">Device</th>
          <th class="text-left">Start Date</th>
          <th class="text-left">End Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in desserts" :key="item.name">

          <td>{{ item.name }}</td>
          <td>{{ item.calories }}</td>
        </tr>
      </tbody>
    </v-table>
    <v-pagination :length="4"></v-pagination>
  </v-container>
</template>

<script>
export default {
  name: 'Subscriptions',
  data() {
    return {
      desserts: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
        },
        {
          name: 'Eclair',
          calories: 262,
        },
        {
          name: 'Cupcake',
          calories: 305,
        },
        {
          name: 'Gingerbread',
          calories: 356,
        },
        {
          name: 'Jelly bean',
          calories: 375,
        },
        {
          name: 'Lollipop',
          calories: 392,
        },
        {
          name: 'Honeycomb',
          calories: 408,
        },
        {
          name: 'Donut',
          calories: 452,
        },
        {
          name: 'KitKat',
          calories: 518,
        },
      ],
    }
  },
}
</script>