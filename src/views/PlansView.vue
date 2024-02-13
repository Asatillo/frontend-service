<template>
    <Layout>
      <Plans />
    </Layout>
</template>

<script>
import { defineComponent } from 'vue';

// Components
import Plans from '@/components/plans/Plans.vue';
import Layout from '@/components/Layout.vue';

export default defineComponent({
  name: 'PlansView',

  components: {
    Plans,
    Layout
},
});
</script>