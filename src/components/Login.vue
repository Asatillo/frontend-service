<template>
  <div class="d-flex justify-center" style="height: 100vh">
    <v-sheet width="400" class="mx-6">
      <v-container class="d-flex justify-center" style="max-width: 200px ">
        <v-img src="../assets/logo1.png" width="200"></v-img>
      </v-container>

      <v-form fast-fail @submit.prevent="login">

        <v-text-field 
          v-model="username" 
          label="Username" 
          :rules="usernameRules"
        ></v-text-field>

        <v-text-field 
          v-model="password" 
          label="Password" 
          :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="passwordRules" 
          :type="show1 ? 'text' : 'password'"
          @click:append-inner="show1 = !show1"
        ></v-text-field>

        <a href="#" class="text-body-2 font-weight-regular"> Forgot Password? </a>

        <v-btn type="submit" color="primary" block class="mt-2" :disabled="!areAllRulesMet"> Log in </v-btn>
      </v-form>

      <div class="mt-2">
        <p class="text-body-2"> Don't have an account? <router-link to="/signup"> Sign Up </router-link></p>
      </div> <br>
      <v-alert type="error" v-if="error" dismissible>
        {{ error }}
      </v-alert>
    </v-sheet>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

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
  try {
    const userData = await axios.post('auth-service/auth/authenticate', {
      username: username.value,
      password: password.value,
    });
    if (userData.data.token) {
      localStorage.setItem('accessToken', userData.data.token);
      localStorage.setItem('user', JSON.stringify(userData.data.user));
      router.push('/');
    } else {
      error.value = 'Authentication failed';
    }
  } catch (err) {
    if (err.response) {
      error.value = err.response.data.message;
    }
  }
}
</script>
