<template>
    <v-dialog v-model="dialog" max-width="500px" @click:outside="close">
        <v-card>
            <v-card-title>
                <div class="text-h6 text-center">{{ editedItem.id ? "Edit Plan" : "New Plan" }}</div>
            </v-card-title>
            <v-card-text>
                <v-window v-model="step">
                    <v-window-item :value="1" class="ma-1">
                        <v-text-field v-model="editedItem.name" label="Name" required></v-text-field>
                        <v-textarea v-model="editedItem.description" auto-grow label="Description" required
                            rows="3"></v-textarea>
                        <v-row>
                            <v-col cols="4">
                                <v-text-field v-model="editedItem.days" label="Days" required type="number"></v-text-field>
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
                        <v-text-field v-model="editedItem.price" type="number" label="Price" required></v-text-field>
                        <v-select v-model="editedItem.designatedDeviceType" label="Designated device type"
                            :items="['MOBILE', 'ROUTER']" required @update:model-value="handleTypeSelect" chips density="comfortable"></v-select>
                        <v-select v-model="editedItem.services" :disabled="!editedItem.designatedDeviceType"
                            label="Services" :items="services[editedItem.designatedDeviceType]" multiple required chips
                            item-title="name" item-value="id" density="comfortable"></v-select>
                    </v-window-item>
                    <v-window-item :value="2">
                        <div v-if="!responseObj.loading" class="pa-4 text-center">
                            <v-icon size="80" color="green">mdi-check</v-icon>
                            <h3 class="text-h6 font-weight-light mb-2">{{ responseObj.success ? 'Success' :
                                'Something went wrong' }}!</h3>
                            <span class="text-caption text-grey">{{ responseObj.message }}</span>
                        </div>
                        <v-progress-linear v-else indeterminate color="primary"></v-progress-linear>
                    </v-window-item>
                </v-window>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="warning" @click="close">Cancel</v-btn>
                <v-btn v-if="step == 1" color="primary" text @click="save">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogChangeActive" max-width="500px">
        <v-card>
            <v-card-title class="text-h6 text-center">Are you sure you want to {{ activeChangeMode }} this
                item?</v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="changeActiveDialogClose">Cancel</v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="changeActiveConfirm">Confirm</v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-container class="pb-0">
        <div class="text-h5">Plans</div>
    </v-container>
    <v-container>
        <v-toolbar>
            <v-text-field v-model="search" append-inner-icon="mdi-magnify" label="Search" class="ma-1" single-line
                hide-details v-on:update:model-value="fetchPlans"></v-text-field>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-btn color="primary" @click="openNewPlanDialog" prepend-icon="mdi-plus">New Plan</v-btn>
        </v-toolbar>
        <v-row>
            <v-col v-for="plan in plans" :key="plan.id" cols="3">
                <PlanCard :plan="plan" @edit="openEditPlanDialog" @changeActive="openChangeActiveDialog" />
            </v-col>
        </v-row>
        <v-pagination v-model="page" v-if="plans.length" class="pt-6" :length="totalPages"
            v-on:update:model-value="fetchPlans" />
    </v-container>
</template>

  
<script setup>
import { ref, onMounted } from 'vue';
import PlanCard from '@/components/plans/PlanCard.vue';
import { convertDateToPeriod, periodToNumbers } from '@/services/date-formatting';
import { addPlan, getPlans, updatePlan, changePlanStatus } from '@/services/rest/plans-api';
import { getServicesByDeviceType } from '@/services/rest/services-api';

const dialog = ref(false);
const plans = ref([]);
const dialogChangeActive = ref(false);
const activeIndex = ref(-1);
const services = ref({ "MOBILE": [], "ROUTER": [] });
const activeChangeMode = ref('');
const search = ref('');
const page = ref(1);
const itemsPerPage = ref(24);
const totalPages = ref(0);
const step = ref(1);
const responseObj = ref({ loading: false, success: false, message: '' });
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
const editedItem = ref(Object.assign({}, defaultItem.value));

async function fetchServicesByType(type) {
    var itemList = [];
    return getServicesByDeviceType(type).then((response) => {
        if (!response) {
            return [];
        }
        response.forEach((element) => {
            itemList.push({
                id: element.id,
                name: element.name,
            });
        });
        return itemList;
    });
};

const fetchPlans = () => {
    getPlans(page.value, itemsPerPage.value, search.value).then((response) => {
        if (!response) return;
        plans.value = response.content;
        totalPages.value = response.totalPages;
        page.value = response.page;
    });
};

onMounted(() => {
    fetchPlans()
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



function openEditPlanDialog(plan) {
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

function openNewPlanDialog() {
    editedItem.value = defaultItem.value;
    dialog.value = true;
}

function openChangeActiveDialog(plan) {
    activeChangeMode.value = plan.active ? 'deactivate' : 'activate';
    activeIndex.value = plan.id;
    dialogChangeActive.value = true;
}

function changeActiveDialogClose() {
    dialogChangeActive.value = false;
};

function changePlanActive(id, mode) {
    changePlanStatus(id, mode).then((response) => {
        plans.value = plans.value.map((item) => {
            if (item.id === response.id) {
                return response;
            }
            return item;
        });
    });
};

function changeActiveConfirm() {
    changePlanActive(activeIndex.value, activeChangeMode.value);
    activeIndex.value = -1;
    activeChangeMode.value = '';
    changeActiveDialogClose();
};


function close() {
    dialog.value = false;
    step.value = 1;
    responseObj.value = { loading: false, success: false, message: '' };
    editedItem.value = Object.assign({}, defaultItem.value);

}

function save() {
    responseObj.value.loading = true;
    step.value = 2;
    if (editedItem.value.id) {
        var plan = editedItem.value;
        plan.duration = convertDateToPeriod(plan.days, plan.months, plan.years);
        updatePlan(plan).then(() => {
            responseObj.value.loading = false;
            responseObj.value.success = true;
            responseObj.value.message = 'Plan updated successfully';
            fetchPlans();
            setTimeout(() => {
                if (dialog.value) {
                    close();
                }
            }, 2000);
        }).catch(() => {
            responseObj.value.loading = false;
            responseObj.value.success = false;
            responseObj.value.message = 'Something went wrong';
        });
    } else {
        var plan = editedItem.value;
        editedItem.value.period = convertDateToPeriod(plan.days, plan.months, plan.years);
        addPlan(editedItem.value).then(() => {
            responseObj.value.loading = false;
            responseObj.value.success = true;
            responseObj.value.message = 'Plan added successfully';
            fetchPlans();
            setTimeout(() => {
                if (dialog.value) {
                    close();
                }
            }, 2000);
        }).catch(() => {
            responseObj.value.loading = false;
            responseObj.value.success = false;
            responseObj.value.message = 'Something went wrong';
        });
    }
}

</script>