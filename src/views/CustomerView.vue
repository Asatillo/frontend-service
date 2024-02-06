<template>
    <Layout>
      <Customer />
    </Layout>
</template>

<script>
import { defineComponent } from 'vue';

// Components
import Customer from '@/components/customers/Customer.vue';
import Layout from '@/components/Layout.vue';

export default defineComponent({
  name: 'CustomerView',

  components: {
    Customer,
    Layout
},
});
</script>