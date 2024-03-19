<template>
    <v-card class="rounded-xl">
        <v-img class="mt-3" :src="deviceTemplate.imageUrl" height="250px" rounded-lg></v-img>
        <v-card-title class="pr-0 pb-0 d-flex justify-space-between text-truncate">
            {{ deviceTemplate.model }}
            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props">
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item>
                            Deactivate
                    </v-list-item>
                    <v-list-item @click="$emit('sell', deviceTemplate)">
                            Edit
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-card-title>
        <v-card-subtitle>
            {{ deviceTemplate.brand }}
        </v-card-subtitle>

        <v-divider class="mt-2"></v-divider>
        <v-container v-if="deviceTemplate.deviceType == 'MOBILE'" class="pl-0">
            <v-card-text class="py-1">
                <v-icon>mdi-sd</v-icon>
                {{ deviceTemplate.storage }} GB
            </v-card-text>
            <v-card-text class="py-1">
                <v-icon color="green">mdi-cash</v-icon>
                {{ addCommasToPrice(deviceTemplate.price) }} HUF
            </v-card-text>
            <v-card-subtitle>
                Warranty period of {{ convertPeriodToDate(deviceTemplate.warrantyDuration) }}
            </v-card-subtitle>
        </v-container>
    </v-card>
</template>

<script setup>
import { convertPeriodToDate } from '@/services/date-formatting'
import { addCommasToPrice } from '@/services/number-formatting'

defineProps({
    deviceTemplate: Object
})

defineEmits(['sell'])
</script>