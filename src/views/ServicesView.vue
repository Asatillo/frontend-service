<template>
    <Layout>
      <Services />
    </Layout>
</template>

<script>
import { defineComponent } from 'vue';

// Components
import Layout from '@/components/Layout.vue';
import Services from '@/components/Services.vue';

export default defineComponent({
  name: 'HomeView',

  components: {
    Services,
    Layout
  },
});
</script>