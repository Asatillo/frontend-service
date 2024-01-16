<template>
    <Layout>
      <Devices />
    </Layout>
</template>

<script>
import { defineComponent } from 'vue';

// Components
import Devices from '../components/Devices.vue';
import Layout from '@/components/Layout.vue';

export default defineComponent({
  name: 'DevicesView',

  components: {
    Devices,
    Layout
},
});
</script>