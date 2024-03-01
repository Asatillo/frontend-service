<template>
    <v-container class="pb-0">
        <div class="text-h5">Network Entities</div>
    </v-container>
    <v-container>
        <NetworkEntitiesTable />
    </v-container>
</template>

<script setup>
import NetworkEntitiesTable from '@/components/network-entities/NetworkEntitiesTable.vue'
</script>