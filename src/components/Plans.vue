<template>
    <v-container fluid>
        <v-row justify="center">
            <h2 class="text-h2 text-center">Plans</h2>
        </v-row>
    </v-container>
    <v-container>
        <v-row>
            <v-toolbar :elevation="2" density="compact">
                <v-dialog v-model="dialog" max-width="500px" @click:outside="handleOutsideClick">
                    <template v-slot:activator="{ props }">
                        <v-btn color="primary" dark v-bind="props">
                            <v-icon left>mdi-plus</v-icon>
                            <span value="New Plan">New Plan</span>
                        </v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="text-h5">{{ editedItem.id != null ? "Edit Plan" : "New Plan" }}</span>
                        </v-card-title>

                        <v-card-text class="pt-0">
                            <v-container>
                                <v-row>
                                    <v-col>
                                        <v-text-field v-model="editedItem.name" label="Name" required></v-text-field>
                                        <v-textarea v-model="editedItem.description" auto-grow label="Description" required
                                            rows="3"></v-textarea>
                                        <v-row>
                                            <v-col cols="4">
                                                <v-text-field v-model="editedItem.days" label="Days" required
                                                    type="number"></v-text-field>
                                            </v-col>
                                            <v-col cols="4">
                                                <v-text-field v-model="editedItem.months" label="Months" required
                                                    type="number"></v-text-field>
                                            </v-col>
                                            <v-col cols="4">
                                                <v-text-field v-model="editedItem.years" label="Years" required
                                                    type="number"></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-text-field v-model="editedItem.price" type="number" label="Price"
                                            required></v-text-field>
                                        <v-select v-model="editedItem.designatedDeviceType" label="Designated device type"
                                            :items="['MOBILE', 'ROUTER']" required @update:model-value="handleTypeSelect"
                                            chips></v-select>
                                        <v-select v-model="editedItem.services" :disabled="!editedItem.designatedDeviceType"
                                            label="Services" :items="services[editedItem.designatedDeviceType]" multiple
                                            required chips item-title="name" item-value="id"></v-select>
                                    </v-col>
                                </v-row>

                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue-darken-1" @click="close">
                                Cancel
                            </v-btn>
                            <v-btn color="blue-darken-1" @click="save">
                                Save
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="dialogChangeActive" max-width="500px">
                    <v-card>
                        <v-card-title class="text-h6 text-center">Are you sure you want to {{ activeChangeMode }} this
                            item?</v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue-darken-1" variant="text" @click="changeActiveClose">Cancel</v-btn>
                            <v-btn color="blue-darken-1" variant="text" @click="changeActiveConfirm">Confirm</v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>



            <v-col v-for="plan in plans" :key="plan.id" style="max-width: 30%;">
                <v-card class="elevation-2 hover-card rounded-xl">
                    <v-card-title >{{ plan.name }} 
                    <v-icon size="smaller" :color="plan.active ? 'green' : 'red'">mdi-circle</v-icon>
                    </v-card-title>
                    <v-card-subtitle>{{ plan.description }}</v-card-subtitle>
                    <v-card-text>
                        <v-list-item prepend-icon="mdi-calendar-clock">
                            <v-list-item-title>{{ convertPeriodToDate(plan.duration) }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item prepend-icon="mdi-cash-multiple">
                            <v-list-item-title>{{ plan.price }} HUF</v-list-item-title>
                        </v-list-item>
                        <v-list dense class="rounded-xl mt-2 pl-2">
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
                        <v-btn color="primary" @click="editPlan(plan)">Edit</v-btn>
                        <v-btn :color="plan.active ? 'error' : 'green'"  @click=changeActive(plan)>{{ plan.active ? 'Deactivate' : 'Activate'
                        }}</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

  
<script>
import { ref, onMounted } from 'vue';
import { convertPeriodToDate, convertDateToPeriod, periodToNumbers } from '../services/date-formatting';
import axios from 'axios';

export default {
    setup() {
        const dialog = ref(false);
        const plans = ref([]);
        const dialogChangeActive = ref(false);
        const activeIndex = ref(-1);
        const services = ref({ "MOBILE": [], "ROUTER": [] });
        const activeChangeMode = ref('');
        const editedItem = ref({
            id: null,
            name: '',
            description: '',
            days: null,
            months: null,
            years: null,
            price: null,
            designatedDeviceType: null,
            services: [],
        });
        const defaultItem = ref({
            id: null,
            name: '',
            description: '',
            days: null,
            months: null,
            years: null,
            price: null,
            designatedDeviceType: null,
            services: [],
        });
        const icons = ref({
            'SMS': 'mdi-message-text',
            'VOICE': 'mdi-phone',
            'DATA': 'mdi-wifi',
        });

        const fetchPlans = async () => {
            try {
                const response = await axios.get(`/crm/plans?size=50`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
                plans.value = response.data.content;
            } catch (error) {
                console.error('Error fetching plans:', error.message);
            }
        };

        const addPlan = async (plan) => {
            const period = convertDateToPeriod(plan.days, plan.months, plan.years);
            try {
                const response = await axios.post(`/crm/plans`, {
                    name: plan.name,
                    description: plan.description,
                    duration: period,
                    price: plan.price,
                    designatedDeviceType: plan.designatedDeviceType,
                    services: plan.services
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
                plans.value.push(response.data);
            } catch (error) {
                console.error('Error adding plan:', error.message);
            }
        };

        const fetchServicesByType = async (type) => {
            try {
                const response = await axios.get(`/crm/services/device-type/${type}?size=50`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
                var itemList = [];
                response.data.content.forEach((element) => {
                    itemList.push({
                        id: element.id,
                        name: element.name,
                    });
                });
                return itemList;
            } catch (error) {
                console.error('Error fetching services:', error.message);
            }
        };

        const updatePlan = async (plan) => {
            try {
                const response = await axios.put(`/crm/plans/${plan.id}`, {
                    name: plan.name,
                    description: plan.description,
                    duration: convertDateToPeriod(plan.days, plan.months, plan.years),
                    price: plan.price,
                    designatedDeviceType: plan.designatedDeviceType,
                    services: plan.services
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
                plans.value = plans.value.map((item) => {
                    if (item.id === response.data.id) {
                        return response.data;
                    }
                    return item;
                });
            } catch (error) {
                console.error('Error updating plan:', error.message);
            }
        }

        onMounted(() => {
            fetchPlans();
            fetchServicesByType('MOBILE').then((response) => {
                services.value['MOBILE'] = response;
            });
            fetchServicesByType('ROUTER').then((response) => {
                services.value['ROUTER'] = response;
            });
        })

        function handleTypeSelect() {
            editedItem.value.services = [];
        }

        function editPlan(plan) {
            editedItem.value = mapPlanToEditedItem(plan);
            dialog.value = true;
        }

        function mapPlanToEditedItem(plan) {
            var periodArray = periodToNumbers(plan.duration);
            var servicesArray = [];
            plan.services.forEach((element) => {
                servicesArray.push(element.id);
            });
            return {
                id: plan.id,
                name: plan.name,
                description: plan.description,
                days: periodArray['days'] ? periodArray['days'] : null,
                months: periodArray['months'] ? periodArray['months'] : null,
                years: periodArray['years'] ? periodArray['years'] : null,
                price: plan.price,
                designatedDeviceType: plan.designatedDeviceType,
                services: servicesArray,
            };
        }

        function changeActive(plan) {
            activeChangeMode.value = plan.active ? 'deactivate' : 'activate';
            activeIndex.value = plan.id;
            console.log(plan);
            dialogChangeActive.value = true;
        }

        function changeActiveClose() {
            dialogChangeActive.value = false;
        };

        const changePlanActive = async (id, mode) => {
            try {
                const response = await axios.patch(`/crm/plans/${id}/${mode}`, {}, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
                console.log(response.data);
                plans.value = plans.value.map((item) => {
                    if (item.id === response.data.id) {
                        return response.data;
                    }
                    return item;
                });
            } catch (error) {
                console.error('Error updating plan:', error.message);
            }
        };

        function changeActiveConfirm() {
            changePlanActive(activeIndex.value, activeChangeMode.value);
            activeIndex.value = -1;
            activeChangeMode.value = '';
            changeActiveClose();
        };

        function handleOutsideClick() {
            dialog.value = false;
        }

        function close() {
            editedItem.value = defaultItem.value;
            dialog.value = false;
        }

        function save() {
            if (editedItem.value.id) {
                updatePlan(editedItem.value);
            } else {
                addPlan(editedItem.value);
            }
            editedItem.value = defaultItem.value;
            dialog.value = false;
        }

        return {
            plans,
            icons,
            convertPeriodToDate,
            dialog,
            handleOutsideClick,
            close,
            save,
            handleTypeSelect,
            changeActive,
            editPlan,
            services,
            editedItem,
            dialogChangeActive,
            activeChangeMode,
            changeActiveClose,
            changeActiveConfirm
        };
    },
};
</script>

<style scoped>
.hover-card:hover {
    background-color: #f0f0f0;
}
</style>