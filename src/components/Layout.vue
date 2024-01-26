<!-- Layout.vue -->
<template>
  <Navbar />
  <v-container style="max-width: 70%;">
    <slot></slot>
  </v-container>
</template>
  
<script setup>
import Navbar from "../components/Navbar.vue"
</script>
  