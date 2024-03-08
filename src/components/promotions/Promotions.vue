<template>
    <v-container class="pb-0">
        <div class="text-h5">Promotions</div>
    </v-container>
    <v-container>
        <PromotionsTable ref="promotionTableComponent" @edit-promotion-from-child="openChangePromotion"
            @create-new-promotion="openNewPromotion" />
    </v-container>
    <PromotionDialog ref="promotionDialog" @update-table-after-dialog="updateTable" />
</template>

<script setup>
import PromotionsTable from '@/components/promotions/PromotionsTable.vue';
import PromotionDialog from '@/components/promotions/dialogs/PromotionDialog.vue';

import { ref } from 'vue';

const promotionDialog = ref(null);
const promotionTableComponent = ref(null);

function openNewPromotion() {
    promotionDialog.value.openNewPromotionDialog();
}

function openChangePromotion(promotion) {
    promotionDialog.value.openChangePromotionDialog(promotion);
}

function updateTable() {
    promotionTableComponent.value.updateTable();
}
</script>