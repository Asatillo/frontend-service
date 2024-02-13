<template>
    <v-card class="hover-card elevation-1 rounded-xl">
        <v-card-title>
            <v-icon size="smaller" class="mr-1" :color="plan.active ? 'green' : 'red'">mdi-circle</v-icon>
            {{ plan.name }}
        </v-card-title>
        <v-card-subtitle>{{ plan.description }}</v-card-subtitle>
        <v-divider class="mt-1"></v-divider>
        <v-card-text class="py-3">
            <v-list-item prepend-icon="mdi-calendar-clock">
                <v-list-item-title>{{ convertPeriodToDate(plan.duration) }}</v-list-item-title>
            </v-list-item>
            <v-list-item prepend-icon="mdi-cash-multiple">
                <v-list-item-title>{{ plan.price }} HUF</v-list-item-title>
            </v-list-item>
            <v-list dense class="rounded-xl mt-2 pl-2 elevation-1">
                <v-chip-group>
                    <v-chip v-for="service in plan.services" :key="service.id" :value="service.name">
                        <v-icon>{{ icons[service.type] }}</v-icon>
                        <span> {{ service.name }}</span>
                    </v-chip>
                </v-chip-group>
            </v-list>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-container>
                <v-row justify="center">
                    <v-btn color="primary" @click="$emit('edit', plan)">Edit</v-btn>
                    <v-btn :color="plan.active ? 'error' : 'green'" @click="$emit('changeActive', plan)">{{ plan.active ?
                        'Deactivate' : 'Activate' }}</v-btn>
                </v-row>
            </v-container>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { defineProps } from 'vue'
import { ref } from 'vue'
import { convertPeriodToDate } from '@/services/date-formatting'

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