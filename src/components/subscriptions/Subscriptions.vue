<template>
  <v-container fluid>
    <v-row justify="center">
      <h2 class="text-h2 text-center">Subscriptions</h2>
    </v-row>
  </v-container>
  <v-container>
    <SubscriptionsAll />
  </v-container>
</template>

<script setup>
import SubscriptionsAll from '@/components/subscriptions/tables/SubscriptionsAll.vue';
</script>
