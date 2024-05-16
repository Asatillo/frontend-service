<template>
  <v-app>
    <!-- Navbar -->
    <v-main>
      <router-view />
      <v-snackbar v-model="snackbarStore.show" varian="tonal" :timeout="snackbarStore.timeout"
        :color="snackbarStore.color">
        <v-icon>{{ snackbarStore.icon }}</v-icon>
        {{ snackbarStore.text }}
        <template v-slot:actions>
          <v-btn color="blue" prepend-icon="mdi-close" @click="snackbarStore.show = false">
          </v-btn>
        </template>
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script setup>
import { useSnackbarStore } from "@/stores/SnackBarStore"

const snackbarStore = useSnackbarStore()
</script>
