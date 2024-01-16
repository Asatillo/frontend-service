<template>
  <div class="d-flex justify-center" style="height: 100vh">
    <v-sheet width="400" class="mx-auto">
      <v-container class="d-flex justify-center" style="max-width: 200px ">
        <v-img src="../assets/logo1.png" width="200"></v-img>
      </v-container>
      <v-form fast-fail @submit.prevent="signup">
        <v-text-field v-model="username" label="Username"></v-text-field>
        <v-text-field v-model="email" label="Email"></v-text-field>
        <v-text-field v-model="password" label="Password"></v-text-field>
        <v-text-field v-model="password2" label="Confirm password"></v-text-field>
        <v-btn type="submit" color="primary" block class="mt-2"> Sign up </v-btn>
      </v-form>
      <div class="mt-2">
        <p class="text-body-2"> Already have an account? <router-link to="/login"> Sign in </router-link></p>
      </div>
    </v-sheet>
  </div>
</template>

<script>
export default {
    name: 'Signup',
    data() {
        return {
            username: '',
            password: '',
            password2: '',
            email: '',
        };
    },
    methods: {
        signup() {
        // Your login logic here
            this.$router.push('/');
        }
    },
}
</script>