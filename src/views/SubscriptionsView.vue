<template>
    <Layout>
      <Subscriptions />
    </Layout>
</template>

<script>
import { defineComponent } from 'vue';

// Components
import Subscriptions from '@/components/subscriptions/Subscriptions.vue';
import Layout from '@/components/Layout.vue';

export default defineComponent({
  name: 'SubscriptionsView',

  components: {
    Subscriptions,
    Layout
},
});
</script>