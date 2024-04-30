<template>
    <Layout>
      <Home />
    </Layout>
</template>

<script>
import { defineComponent } from 'vue';

// Components
import Home from '@/components/Home.vue';
import Layout from '@/components/Layout.vue';

export default defineComponent({
  name: 'HomeView',

  components: {
    Home,
    Layout
  },
});
</script>