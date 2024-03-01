<template>
    <Layout>
      <NetworkEntities />
    </Layout>
</template>

<script>
import { defineComponent } from 'vue';

// Components
import NetworkEntities from '@/components/network-entities/NetworkEntities.vue';
import Layout from '@/components/Layout.vue';

export default defineComponent({
  name: 'MyProfileView',

  components: {
    NetworkEntities,
    Layout
},
});
</script>