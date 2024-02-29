<template>
  <div class="d-flex justify-center" style="height: fit-content">
    <v-sheet width="400" class="px-6">
      <v-container class="d-flex justify-center" style="max-width: 200px ">
        <v-img src="../assets/logo1.png" width="200"></v-img>
      </v-container>

      <v-form fast-fail @submit.prevent="login">

        <v-text-field v-model="username" label="Username" :rules="usernameRules" autocomplete="on"></v-text-field>

        <v-text-field v-model="password" label="Password" :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="passwordRules" :type="show1 ? 'text' : 'password'" @click:append-inner="show1 = !show1"
          autocomplete="on"></v-text-field>

        <v-alert type="error" v-if="error" dismissible>
          {{ error }}
        </v-alert>

        <a href="#" class="text-body-2 font-weight-regular"> Forgot Password? </a>

        <v-btn type="submit" color="primary" block class="mt-2" :disabled="!areAllRulesMet"> Log in </v-btn>
      </v-form>

      <div class="mt-2">
        <p class="text-body-2"> Don't have an account? <router-link to="/signup"> Sign Up </router-link></p>
      </div> <br>

    </v-sheet>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { authorizeUser } from '@/services/rest/auth-api';
import router from '@/router';

const show1 = ref(false);
const username = ref('');
const password = ref('');
const error = ref('');

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
  return value.length >= 5 || 'Min 5 characters';
}

async function login() {
  authorizeUser(username.value, password.value).then(response => {
    if (response.token) {
      localStorage.setItem('accessToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      router.push({ name: 'Home' });
    } else if (response.error) {
      error.value = response.message;
    }
  }).catch(error => {
    console.log(error);
  });
}
</script>
