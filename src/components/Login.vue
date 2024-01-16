<template>
  <div class="d-flex justify-center" style="height: 100vh">
    <v-sheet width="400" class="mx-auto"> 
      <v-container class="d-flex justify-center" style="max-width: 200px ">
        <v-img src="../assets/logo1.png" width="200"></v-img>
      </v-container>
      
      <v-form fast-fail @submit.prevent="login">
        
        <v-text-field v-model="username" label="Username"></v-text-field>
        <v-text-field v-model="password" label="Password"></v-text-field>
        <a href="#" class="text-body-2 font-weight-regular"> Forgot Password? </a>
        <v-btn type="submit" color="primary" block class="mt-2"> Sign in </v-btn>
      </v-form>
      <div class="mt-2">
        <p class="text-body-2"> Don't have an account? <router-link to="/signup"> Sign Up </router-link></p>
      </div>
    </v-sheet>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
     async login() {
        this.$router.push('/');
        // try {
        //   const userData = await axios.post('http://localhost:8765/auth-service/auth/authenticate', {
        //     username: this.username,
        //     password: this.password,
        //   });

        //   const token = userData.token;
        //   localStorage.setItem('userData', userData);
        //   localStorage.setItem('accessToken', token);
          
        // } catch (err) {
        //   //Handle errors
        //   console.log(err);
        // }
    }
  },
}
</script>
