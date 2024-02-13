<template>
    <v-card class="hover-card elevation-1 rounded-xl">
        <v-card-title class="pr-0 d-flex justify-space-between align-center">
            <v-container class="pa-0 text-truncate">
                <v-icon size="smaller" :color="plan.active ? 'green' : 'red'">mdi-circle</v-icon>
                <span class="ml-1">{{ plan.name }}</span>
            </v-container>
            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-btn class="mr-1" icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
                </template>
                <v-list class="pa-0">
                    <v-list-item>
                        <v-btn color="primary" @click="$emit('edit', plan)" width="100%">Edit</v-btn>
                    </v-list-item>
                    <v-list-item>
                        <v-btn :color="plan.active ? 'error' : 'green'" @click="$emit('changeActive', plan)">
                            {{ plan.active ? 'Deactivate' : 'Activate' }}
                        </v-btn>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-card-title>
        <v-card-subtitle>{{ plan.description }}</v-card-subtitle>
        <v-divider class="mt-1"></v-divider>
        <v-card-text class="py-3">
            <v-list-item prepend-icon="mdi-calendar-clock">
                <v-list-item-title>{{ convertPeriodToDate(plan.duration) }}</v-list-item-title>
            </v-list-item>
            <v-list-item prepend-icon="mdi-cash-multiple">
                <v-list-item-title>{{ addCommasToPrice(plan.price) }} HUF</v-list-item-title>
            </v-list-item>
            <v-chip-group class="pl-2">
                <v-chip v-for="service in plan.services" :key="service.id" :value="service.name">
                    <v-icon>{{ icons[service.type] }}</v-icon>
                    <span> {{ service.name }}</span>
                </v-chip>
            </v-chip-group>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { defineProps } from 'vue'
import { ref } from 'vue'
import { convertPeriodToDate } from '@/services/date-formatting'
import { addCommasToPrice} from '@/services/number-formatting'

defineProps({
    plan: Object
})

const icons = ref({
    'SMS': 'mdi-message-text',
    'VOICE': 'mdi-phone',
    'DATA': 'mdi-wifi',
});
</script>

<style scoped>
.hover-card:hover {
    background-color: #c2c7cc;
}
</style>