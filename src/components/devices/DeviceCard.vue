<template>
    <v-card class="rounded-xl">
        <v-img class="mt-3" :src="device.deviceTemplate.imageUrl" height="250px" rounded-lg></v-img>
        <v-card-title class="pr-0 d-flex justify-space-between ">
            <p class="ma-2 mp-2 text-truncate">{{ device.deviceTemplate.brand + ' ' +
                device.deviceTemplate.model }}</p>

            <v-menu class="ma-2 mp-2">
                <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props">
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item class="pa-0">
                        <v-btn variant="text">
                            Delete
                        </v-btn>
                    </v-list-item>
                    <v-list-item class="pa-0">
                        <v-btn variant="text" @click="$emit('sell', device)">
                            Sell
                        </v-btn>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-card-title>


        <v-container v-if="device.deviceTemplate.deviceType == 'MOBILE'" class="pt-0">
            <v-card-subtitle>
                Warranty period of {{ convertPeriodToDate(device.deviceTemplate.warrantyDuration) }}
            </v-card-subtitle>
            <v-card-text class="py-3">
                <v-icon>mdi-sd</v-icon>
                {{ device.deviceTemplate.storage }} GB
            </v-card-text>
            <v-card-text class="py-0">
                <v-icon color="green">mdi-cash</v-icon>
                {{ addCommasToPrice(device.deviceTemplate.price) }} HUF
            </v-card-text>
        </v-container>
    </v-card>
</template>

<script setup>
import { convertPeriodToDate } from '@/services/date-formatting'
import { addCommasToPrice } from '@/services/number-formatting'

defineProps({
    device: Object
})
</script>