<template>
  <div class="d-flex justify-center" style="height: fit-content">
    <v-sheet width="400" class="px-6">
      <v-container class="d-flex justify-center" style="max-width: 200px ">
        <v-img src="../assets/logo1.png" width="200"></v-img>
      </v-container>
      <v-form @submit.prevent="handleSignup">

        <v-text-field v-model="firstName" label="First name" :rules="nameRules">
        </v-text-field>

        <v-text-field v-model="lastName" label="Last name" :rules="nameRules">
        </v-text-field>

        <v-text-field v-model="username" label="Username" :rules="usernameRules">
        </v-text-field>

        <v-text-field v-model="email" label="Email" :rules="emailRules">
        </v-text-field>

        <v-text-field v-model="password" label="Password" :rules="passwordRules"
          :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :type="show1 ? 'text' : 'password'"
          @click:append-inner="show1 = !show1">
        </v-text-field>

        <v-text-field v-model="password2" label="Confirm password" :rules="confirmPasswordRules"
          :append-inner-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'" :type="show2 ? 'text' : 'password'"
          @click:append-inner="show2 = !show2">
        </v-text-field>

        <v-btn type="submit" color="primary" block class="mt-2" :disabled="!areAllRulesMet"> Sign up </v-btn>
      </v-form>
      <div class="mt-2">
        <p class="text-body-2"> Already have an account? <router-link to="/login"> Sign in </router-link></p>
      </div> <br>
      <v-alert type="error" v-if="error" dismissible>
        {{ error }}
      </v-alert>
    </v-sheet>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { signUpUser } from '@/services/rest/auth-api';
import axios from 'axios';
import router from '@/router';

const show1 = ref(false);
const show2 = ref(false);
const username = ref('');
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const password2 = ref('');
const error = ref('');

const nameRules = computed(() => [required(firstName.value), required(lastName.value)]);
const usernameRules = computed(() => [required(username.value)]);
const emailRules = computed(() => [required(email.value), emailValidator(email.value)]);
const passwordRules = computed(() => [required(password.value), min(password.value)]);
const confirmPasswordRules = computed(() => [required(password2.value), confirmPassword(password2.value)]);

const areAllRulesMet = computed(() => {
  return [
    nameRules.value.every(result => result === true),
    usernameRules.value.every(result => result === true),
    emailRules.value.every(result => result === true),
    passwordRules.value.every(result => result === true),
    confirmPasswordRules.value.every(result => result === true),
  ].every(Boolean);
});

function required(value) {
  return !!value || 'Required.';
}

function emailValidator(value) {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegex.test(value) || 'Invalid email format.';
}

function min(value) {
  return value.length >= 5 || 'Min 5 characters.';
}

function confirmPassword(value) {
  return value === password.value || 'Passwords do not match.';
}

async function handleSignup() {
  if (password.value !== password2.value) {
    error.value = 'Passwords do not match';
    return;
  }

  var userData = {
      username: username.value,
      firstName: firstName.value,
      lastName: lastName.value,
      password: password.value,
      email: email.value,
    }
  signUpUser(userData).then(response => {
    if (response.token) {
      localStorage.setItem('accessToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      router.push({ name: 'Home' });
    } else {
      error.value = 'Authentication failed';
    }
  }).catch(error => {
    console.log(error);
  });
}
</script>