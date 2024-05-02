<template>
  <v-app>
    <Navbar />
    <v-main>
      <router-view />
      <v-snackbar v-model="snackbarStore.show" varian="tonal" :timeout="snackbarStore.timeout"
        :color="snackbarStore.color">
        <v-icon>{{ snackbarStore.icon }}</v-icon>
        {{ snackbarStore.text }}
        <template v-slot:actions>
          <v-btn color="blue" variant="icon" icon="mdi-close" @click="snackbarStore.show = false">
          </v-btn>
        </template>
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script setup>
import { useSnackbarStore } from "@/stores/SnackBarStore"
import Navbar from "@/components/Navbar.vue"

const snackbarStore = useSnackbarStore()
</script>

<style>
/* TODO: place it to the global css file */
.v-table {
    border-radius: 13px;
    padding: 10px;
}
</style>
