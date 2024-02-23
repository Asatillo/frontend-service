<template>
    <v-container class="pb-0">
        <div class="text-h5">Devices</div>
    </v-container>
    <v-container fluid>
        <v-tabs fixed-tabs v-model="mainTab">
            <v-tab>
                Devices
            </v-tab>
            <v-tab>
                Device Templates
            </v-tab>
        </v-tabs>
        <v-window v-model="mainTab">
            <v-window-item value="0">
                <DeviceProducts />
            </v-window-item>
            <v-window-item value="1">
                <DeviceTemplates />
            </v-window-item>
        </v-window>
    </v-container>
</template>
  
<script setup>
import { ref } from 'vue'
import DeviceProducts from '@/components/devices/DeviceProducts.vue'
import DeviceTemplates from '@/components/devices/DeviceTemplates.vue'

const mainTab = ref(null)

</script>