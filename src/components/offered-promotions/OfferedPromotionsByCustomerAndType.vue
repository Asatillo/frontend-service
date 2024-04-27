<template>
  <v-select :items="promotions" label="Promotion" item-title="name" item-value="id"
    :loading="loading" density="comfortable"></v-select>
</template>

<script setup>

import { onMounted, ref, watch } from 'vue'
import { getAcceptedOfferedPromotionsByCustomerAndType } from '@/services/rest/offered-promotions-api';

const promotions = ref([])
const loading = ref(false)

const props = defineProps(['promotion', 'customerId', 'type'])

onMounted(() => {
  getOffers()
})

watch(props, () => {
  getOffers()
})

function getOffers() {
  if (props.customerId && props.type) {
    loading.value = true
    getAcceptedOfferedPromotionsByCustomerAndType(props.customerId, props.type, '').then(response => {
      if (!response) return
      promotions.value = response.content.map(offeredPromotion => {
        return {
          id: offeredPromotion.promotion.id,
          name: offeredPromotion.promotion.name
        };
      });
    }).finally(() => loading.value = false);
  }
}

</script>