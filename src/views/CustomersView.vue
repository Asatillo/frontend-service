<template>
    <Layout>
      <Customers />
    </Layout>
</template>

<script>
import { defineComponent } from 'vue';

// Components
import Customers from '@/components/Customers/Customers.vue';
import Layout from '@/components/Layout.vue';

export default defineComponent({
  name: 'CustomersView',

  components: {
    Customers,
    Layout
},
});
</script>