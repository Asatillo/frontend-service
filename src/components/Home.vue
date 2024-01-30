<template>
  <v-container fluid>
    <v-row justify="center">
      <h2 class="text-h2 text-center">Dashboard</h2>
    </v-row>
  </v-container>
  <v-container>
    
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
const actions = ref([
  {
    "action": "User Management",
    "features": [
      "Add, modify, or remove user accounts",
      "Modify access control"
    ]
  },
  {
    "action": "Plan Management",
    "features": [
      "Create, update, and delete subscription plans",
      "View and analyze plan performance"
    ]
  },
  {
    "action": "Billing Information",
    "features": [
      "Display billing details, payment history, and invoices",
      "Process payments and view pending payments"
    ]
  },
  {
    "action": "Network Analytics",
    "features": [
      "Show real-time analytics and performance metrics",
      "Graphs and charts for data usage, network speed, and reliability"
    ]
  },
  {
    "action": "Customer Support",
    "features": [
      "Customer support",
      "Ticketing system for tracking and resolving concerns"
    ]
  },
  {
    "action": "Inventory Management",
    "features": [
      "Maintain inventory of telecom equipment and devices",
      "Track stock levels and order new inventory"
    ]
  },
  {
    "action": "Notifications and Alerts",
    "features": [
      "Notifications"    
    ]
  },
  {
    "action": "Reports and Analytics",
    "features": [
      "Provide detailed reports on user activities, network performance, and finances",
      "Filters and customization options for specific reports"
    ]
  },
  {
    "action": "System Settings",
    "features": [
      "Configure system settings",
      "Customization options like themes or language preferences"
    ]
  }
]);
</script>

<style></style>