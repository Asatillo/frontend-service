<!-- Layout.vue -->
<template>
    <v-app>
        <Navbar>
            <slot></slot>
        </Navbar>
    </v-app>
  </template>
  
  <script>
  import Navbar from "../components/Navbar.vue"
  
  export default {
    components: {
      Navbar
    },
  };
  </script>
  