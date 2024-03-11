<template>
  <v-select v-model="props.promotion" :items="promotions" label="Promotion" item-title="name" item-value="id"
    :loading="loading" density="comfortable"></v-select>
</template>

<script setup>

import { ref, watch } from 'vue'
import { getAcceptedOfferedPromotionsByCustomerAndType } from '@/services/rest/offered-promotions-api';

const promotions = ref([])
const loading = ref(false)

const props = defineProps(['promotion', 'customerId', 'type'])

watch(props, () => {
  if(props.customerId){
    console.log(props)
    loading.value = true;
    getAcceptedOfferedPromotionsByCustomerAndType(props.customerId, props.type, '').then(response => {
      promotions.value = response.content.map(offeredPromotion => {
        return {
          id: offeredPromotion.promotion.id,
          name: offeredPromotion.promotion.name
        };
      });
    }).then(() => loading.value = false);
  }
})

</script>