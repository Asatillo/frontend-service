<template>
    <v-card class="rounded-xl">
        <v-img class="mt-3" :src="device.deviceTemplate.imageUrl" height="250px" rounded-lg></v-img>
        <v-card-title class="pr-0 pb-0 d-flex justify-space-between text-truncate">
            {{ device.deviceTemplate.model }}
            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props">
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item>
                            Delete
                    </v-list-item>
                    <v-list-item @click="$emit('sell', device)">
                            Sell
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-card-title>
        <v-card-subtitle>
            {{ device.deviceTemplate.brand }}
        </v-card-subtitle>

        <v-divider class="mt-2"></v-divider>
        <v-container v-if="device.deviceTemplate.deviceType == 'MOBILE'" class="pl-0">
            <v-card-text class="py-1">
                <v-icon>mdi-sd</v-icon>
                {{ device.deviceTemplate.storage }} GB
            </v-card-text>
            <v-card-text class="py-1">
                <v-icon color="green">mdi-cash</v-icon>
                {{ addCommasToPrice(device.deviceTemplate.price) }} HUF
            </v-card-text>
            <v-card-subtitle>
                Warranty period of {{ convertPeriodToDate(device.deviceTemplate.warrantyDuration) }}
            </v-card-subtitle>
        </v-container>
    </v-card>
</template>

<script setup>
import { convertPeriodToDate } from '@/services/date-formatting'
import { addCommasToPrice } from '@/services/number-formatting'

defineProps({
    device: Object
})

defineEmits(['sell'])
</script>