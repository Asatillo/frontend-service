<template>
    <v-container fluid>
        <v-row justify="center">
            <h2 class="text-h2 text-center">Plans</h2>
        </v-row>
    </v-container>
    <v-container>
        <v-row>
            <v-col v-for="plan in plans" :key="plan.id" cols="12" sm="6" md="3">
                <v-card>
                    <v-card-title>{{ plan.name }}</v-card-title>
                    <v-card-subtitle>{{ plan.description }}</v-card-subtitle>
                    <v-card-text>
                        <v-list-item prepend-icon="mdi-calendar-clock">
                            <v-list-item-title>Duration: {{ plan.duration }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item prepend-icon="mdi-cash-multiple">
                            <v-list-item-title>Price: {{ plan.price }} HUF</v-list-item-title>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list dense>
                            <v-chip-group>
                                <v-chip v-for="service in plan.services" :key="service.id">
                                    <v-icon>{{ icons[service.type] }}</v-icon>
                                    <span> {{ service.name }}</span>
                                </v-chip>
                            </v-chip-group>
                        </v-list>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary">Select</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

  
<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
    setup() {
        const plans = ref([]);

        const icons = ref({
            'SMS': 'mdi-message-text',
            'VOICE': 'mdi-phone',
            'DATA': 'mdi-wifi',
        });

        const fetchPlans = async () => {
            try {
                const response = await axios.get('http://localhost:8765/crm/plans', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
                console.log('Plans:', response.data);
                plans.value = response.data.content;
            } catch (error) {
                console.error('Error fetching plans:', error.message);
            }
        };

        onMounted(fetchPlans);

        return {
            plans,
            icons,
        };
    },
};
</script>