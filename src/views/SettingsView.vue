<template>
    <Layout>
      <Settings />
    </Layout>
</template>

<script>
import { defineComponent } from 'vue';

// Components
import Settings from '@/components/Settings.vue';
import Layout from '@/components/Layout.vue';

export default defineComponent({
  name: 'SettingsView',

  components: {
    Settings,
    Layout
},
});
</script>