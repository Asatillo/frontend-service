<template>
    <v-container fluid>
        <v-row justify="center">
            <h2 class="text-h2 text-center">Plans</h2>
        </v-row>
    </v-container>
    <v-container>
        <v-row>
            <v-col style="max-width: 30%;">
                <v-card class="elevation-2 rounded-xl" color="rgb(0, 150, 255)">
                    <v-card-title class="text-center mt-1">New Plan</v-card-title>
                    <v-card-text class="text-center">
                        <v-icon size="100px">mdi-plus</v-icon>
                    </v-card-text>
                </v-card>
            </v-col>
        
            <v-col v-for="plan in plans" :key="plan.id" style="max-width: 30%;">
                <v-card class="elevation-2 hover-card rounded-xl">
                    <v-card-title >{{ plan.name }}</v-card-title>
                    <v-card-subtitle >{{ plan.description }}</v-card-subtitle>
                    <v-card-text>
                        <v-list-item prepend-icon="mdi-calendar-clock">
                            <v-list-item-title>Duration: {{ convertPeriodToDate(plan.duration) }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item prepend-icon="mdi-cash-multiple">
                            <v-list-item-title>Price: {{ plan.price }} HUF</v-list-item-title>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list dense class="rounded-xl mt-2 pl-2">
                            <v-chip-group>
                                <v-chip v-for="service in plan.services" :key="service.id">
                                    <v-icon>{{ icons[service.type] }}</v-icon>
                                    <span> {{ service.name }}</span>
                                </v-chip>
                            </v-chip-group>
                        </v-list>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary">Edit</v-btn>
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
                plans.value = response.data.content;
            } catch (error) {
                console.error('Error fetching plans:', error.message);
            }
        };

        onMounted(fetchPlans);

        function convertPeriodToDate(period) {
            // Remove the 'P' prefix
            period = period.substring(1);

            // Define time units
            const units = {
                'Y': ' years',
                'M': ' months',
                'D': ' days'
            };

            // Initialize result
            let result = '';

            // Process each unit
            for (let unit in units) {
                let index = period.indexOf(unit);
                if (index !== -1) {
                    let value = period.substring(0, index);
                    result += value + units[unit] + ', ';
                    period = period.substring(index + 1);
                }
            }

            // Remove trailing comma and space
            result = result.substring(0, result.length - 2);

            return result;
        }

        return {
            plans,
            icons,
            convertPeriodToDate,
        };
    },
};
</script>

<style scoped>
.hover-card:hover {
    background-color: #f0f0f0; /* Change this to the color you want when hovered */
}

</style>