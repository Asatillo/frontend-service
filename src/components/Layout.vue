<!-- Layout.vue -->
<template>
  <Navbar />
  <v-container style="max-width: 70%;">
    <slot></slot>
  </v-container>
</template>
  
<script>
import Navbar from "../components/Navbar.vue"

export default {
  components: {
    Navbar
  },
};
</script>
  