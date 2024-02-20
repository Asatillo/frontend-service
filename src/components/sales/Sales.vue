<template>
    <v-container fluid>
        <v-row justify="center">
            <h2 class="text-h2 text-center">Sales</h2>
        </v-row>
    </v-container>
    <v-container>
        <SalesTable />
    </v-container>
</template>
  
<script setup>
import SalesTable from '@/components/sales/SalesTable.vue'
</script>
    
  
<style></style>