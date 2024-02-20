<template>
    <Layout>
      <Promotions />
    </Layout>
</template>

<script>
import { defineComponent } from 'vue';

// Components
import Layout from '@/components/Layout.vue';
import Promotions from '@/components/promotions/Promotions.vue';

export default defineComponent({
  name: 'PromotionsView',

  components: {
    Promotions,
    Layout
  },
});
</script>