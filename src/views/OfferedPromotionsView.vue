<template>
    <Layout>
      <OfferedPromotions />
    </Layout>
</template>

<script>
import { defineComponent } from 'vue';

// Components
import OfferedPromotions from '@/components/offered-promotions/OfferedPromotions.vue';
import Layout from '@/components/Layout.vue';

export default defineComponent({
  name: 'OfferedPromotionsView',

  components: {
    OfferedPromotions,
    Layout
},
});
</script>