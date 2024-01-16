<template>
    <Layout>
      <Users />
    </Layout>
</template>

<script>
import { defineComponent } from 'vue';

// Components
import Layout from '../components/Layout.vue';
import Users from '../components/Users.vue';

export default defineComponent({
  name: 'HomeView',

  components: {
    Users,
    Layout
  },
});
</script>