<template>
    <Layout>
      <MyProfile />
    </Layout>
</template>

<script>
import { defineComponent } from 'vue';

// Components
import MyProfile from '@/components/MyProfile.vue';
import Layout from '@/components/Layout.vue';

export default defineComponent({
  name: 'MyProfileView',

  components: {
    MyProfile,
    Layout
},
});
</script>