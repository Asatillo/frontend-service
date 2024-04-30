<template>
    <Layout>
      <User />
    </Layout>
</template>

<script>
import { defineComponent } from 'vue';

// Components
import User from '@/components/User.vue';
import Layout from '@/components/Layout.vue';

export default defineComponent({
  name: 'UserView',

  components: {
    User,
    Layout
},
});
</script>