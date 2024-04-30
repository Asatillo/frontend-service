<template>
  <div class="d-flex justify-center" style="height: fit-content">
    <v-sheet width="400" class="px-6">
      <v-container class="d-flex justify-center" style="max-width: 200px ">
        <v-img src="../assets/logo_nova.png" width="200"></v-img>
      </v-container>

      <v-form fast-fail @submit.prevent="login">

        <v-text-field v-model="username" label="Username" :rules="usernameRules" autocomplete="on"></v-text-field>

        <v-text-field v-model="password" label="Password" :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="passwordRules" :type="show1 ? 'text' : 'password'" @click:append-inner="show1 = !show1"
          autocomplete="on"></v-text-field>

        <v-btn type="submit" color="primary" block class="mt-2 mb-5" :disabled="!areAllRulesMet"> Log in </v-btn>
      </v-form>

    </v-sheet>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { authorizeUser } from '@/services/rest/auth-api';
import router from '@/plugins/router';
import VueJwtDecode from 'vue-jwt-decode'
import { useSnackbarStore } from '@/stores/SnackBarStore';

const show1 = ref(false);
const username = ref('');
const password = ref('');

const usernameRules = computed(() => [required(username.value), min(username.value)]);
const passwordRules = computed(() => [required(password.value), min(password.value)]);

const areAllRulesMet = computed(() => {
  return usernameRules.value.every(result => result === true) &&
    passwordRules.value.every(result => result === true);
});

function required(value) {
  return !!value || 'Required.';
}

function min(value) {
  return value.length >= 4 || 'Min 4 characters';
}

async function login() {
  authorizeUser(username.value, password.value).then(response => {
    if (response.access_token) {
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      useSnackbarStore().showSnackbar('Logged in successfully', 'mdi-check', 'success', 3000);

      var decodedJWT = VueJwtDecode.decode(response.access_token);
      var user = {
        username: decodedJWT.preferred_username,
        firstName: decodedJWT.given_name,
        lastName: decodedJWT.family_name,
        name: decodedJWT.name,
        email: decodedJWT.email,
        city: decodedJWT.city,
        roles: decodedJWT.resource_access.nova_client.roles,
        imageUrl: "https://randomuser.me/api/portraits/men/1.jpg"
      }
      localStorage.setItem('user', JSON.stringify(user));
      router.push({ name: 'Home' });
    } else {
      useSnackbarStore().showSnackbar('Invalid credentials', 'mdi-alert-circle', 'error', 3000);
    }
  })
}
</script>