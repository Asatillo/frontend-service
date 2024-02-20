<template>
    <v-container fluid>
        <v-row justify="center">
            <h2 class="text-h2 text-center">Promotions</h2>
        </v-row>
    </v-container>
    <v-container>
        <v-toolbar flat>
            <v-text-field prepend-icon="mdi-magnify" label="Search" single-line hide-details
                class="ml-3"></v-text-field>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn prepend-icon="mdi-plus" color="blue-darken-1" @click="openNewPromotionDialog">New Promotion</v-btn>
        </v-toolbar>
        <PromotionsTable />
    </v-container>
    <v-dialog v-model="dialog" max-width="500px" @click:outside="close">
        <v-card>
            <v-card-title class="text-h6 text-center">New Promotion</v-card-title>
            <v-card-text>
                <v-container class="pa-0">
                    <v-row>
                        <v-col class="py-0" cols="12">
                            <v-text-field v-model="editedItem.name" label="Name" required></v-text-field>
                        </v-col>
                        <v-col class="py-0" cols="12">
                            <v-textarea v-model="editedItem.description" auto-grow label="Description" required rows="3"></v-textarea>
                        </v-col>
                        <v-col class="py-0" cols="6">
                            <v-select v-model="editedItem.type" label="Promotion type" required :items="['DISCOUNT', 'GIFT']"></v-select>
                        </v-col>
                        <v-col class="py-0" cols="6">
                            <v-select v-model="editedItem.productType" label="Product type" required :items="['PLAN', 'SERVICE', 'DEVICE']"></v-select>
                        </v-col>
                        <v-col class="py-0" cols="4">
                            <v-text-field v-model="editedItem.amount" label="Amount" required type="number"></v-text-field>
                        </v-col>
                        <v-col class="py-0" cols="4">
                            <v-text-field v-model="editedItem.maxAmount" label="Max Amount" required type="number" :disabled="editedItem.amountType === 'FIXED'"></v-text-field>
                        </v-col>
                        <v-col class="py-0" cols="4">
                            <v-select v-model="editedItem.amountType" label="Amount type" required :items="['PERCENTAGE', 'FIXED']"></v-select>
                        </v-col>
                        <v-col class="py-0" cols="6">
                            <v-text-field v-model="editedItem.startDate" label="Start Date" required type="date"></v-text-field>
                        </v-col>
                        <v-col class="py-0" cols="6">
                            <v-text-field v-model="editedItem.endDate" label="End Date" required type="date"></v-text-field>
                        </v-col>
                        <v-checkbox class="py-0" label="Renewable"></v-checkbox>
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
</template>

<script setup>
import PromotionsTable from '@/components/promotions/PromotionsTable.vue';
import { addPromotion } from '@/services/rest/promotions-api';
import { ref } from 'vue';

const dialog = ref(false);
const defaultItem = {
    name: '',
    description: '',
    type: null,
    productType: null,
    amount: null,
    amountType: null,
    maxAmount: null,
    discount: null,
    startDate: new Date().toISOString().substr(0, 10),
    endDate: null,
};
const editedItem = ref(Object.assign({}, defaultItem));

function openNewPromotionDialog() {
    dialog.value = true;
}

function close() {
    dialog.value = false;
}

function save() {
    addPromotion(editedItem.value).then(response => {
        console.log(response);
        close();
    });
}

</script>