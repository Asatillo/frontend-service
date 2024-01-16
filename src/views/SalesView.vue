<template>
    <Layout>
      <Sales />
    </Layout>
</template>

<script>
import { defineComponent } from 'vue';

// Components
import Layout from '../components/Layout.vue';
import Sales from '../components/Sales.vue';

export default defineComponent({
  name: 'HomeView',

  components: {
    Sales,
    Layout
  },
});
</script>