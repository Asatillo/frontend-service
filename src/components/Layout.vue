<!-- Layout.vue -->
<template>
  <Navbar />
  <v-container style="max-width: 100%;">
    <slot></slot>
  </v-container>
</template>
  
<script setup>
import Navbar from "@/components/Navbar.vue"
</script>
  