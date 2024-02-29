<template>
    <v-container class="pb-0">
        <div class="text-h5">Promotions</div>
    </v-container>
    <v-container>
        <v-toolbar flat>
            <v-text-field append-inner-icon="mdi-magnify" label="Search" single-line hide-details class="ml-3"></v-text-field>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-btn prepend-icon="mdi-plus" color="blue-darken-1" @click="openNewPromotionDialog">New Promotion</v-btn>
        </v-toolbar>
        <PromotionsTable @editPromotionFromChild="openChangePromotionDialog" />
    </v-container>
    <v-dialog v-model="dialog" max-width="500px" @click:outside="close">
        <v-card>
            <v-card-title class="text-h6 text-center">{{ dialogReason }} Promotion</v-card-title>
            <v-card-text>
                <v-container class="pa-0">
                    <v-row>
                        <v-col class="py-0" cols="12">
                            <v-text-field v-model="editedItem.name" label="Name" required></v-text-field>
                        </v-col>
                        <v-col class="py-0" cols="12">
                            <v-textarea v-model="editedItem.description" auto-grow label="Description" required
                                rows="3"></v-textarea>
                        </v-col>
                        <v-col class="py-0" cols="6">
                            <v-select v-model="editedItem.type" label="Promotion type" required
                                :items="['DISCOUNT', 'GIFT']"></v-select>
                        </v-col>
                        <v-col class="py-0" cols="6">
                            <v-select v-model="editedItem.productType" label="Product type" required
                                :items="['PLAN', 'SERVICE', 'DEVICE']"></v-select>
                        </v-col>
                        <v-col class="py-0" cols="4">
                            <v-text-field v-model="editedItem.amount" label="Amount" required type="number"></v-text-field>
                        </v-col>
                        <v-col class="py-0" cols="4">
                            <v-text-field v-model="editedItem.maxAmount" label="Max Amount" required type="number"
                                :disabled="editedItem.amountType === 'FIXED'"></v-text-field>
                        </v-col>
                        <v-col class="py-0" cols="4">
                            <v-select v-model="editedItem.amountType" label="Amount type" required
                                :items="['PERCENTAGE', 'FIXED']"></v-select>
                        </v-col>
                        <v-col class="py-0" cols="6">
                            <v-text-field v-model="editedItem.startDate" label="Start Date" required
                                type="date"></v-text-field>
                        </v-col>
                        <v-col class="py-0" cols="6">
                            <v-text-field v-model="editedItem.endDate" label="End Date" required type="date"></v-text-field>
                        </v-col>
                        <v-checkbox v-model="editedItem.renewable" class="py-0" label="Renewable"></v-checkbox>
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
import { addPromotion, editPromotion } from '@/services/rest/promotions-api';
import { ref } from 'vue';

const dialog = ref(false);
const dialogReason = ref('');
const defaultItem = {
    id: null,
    name: null,
    description: null,
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
    editedItem.value = Object.assign({}, defaultItem);
    dialogReason.value = 'New';
    dialog.value = true;
}

function openChangePromotionDialog(promotion) {
    editedItem.value = Object.assign({}, promotion);
    dialogReason.value = 'Edit';
    dialog.value = true;
}

function close() {
    dialog.value = false;
}

function save() {
    if (editedItem.value.id) {
        editPromotion(editedItem.value).then(response => {
            // PromotionsTable.emit('editedPromotion', response);
            close();
        });
    } else {
        addPromotion(editedItem.value).then(response => {
            close();
        });
    }
}

</script>