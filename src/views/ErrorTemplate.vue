<template>
    <v-container fill-height>
        <v-row justify="center" align="center">
            <v-col cols="12" sm="4">
                <div class="text-h1 error-status">{{ errorStatus }}</div>
                <div class="text-h4">Oops! {{ errorMessage }}</div><br>
                <p>{{ errorText }}</p>
                <router-link to="/"> Go to Homepage </router-link>
            </v-col>
        </v-row>
    </v-container>
</template>
  
<script setup>
defineProps(["errorMessage", "errorStatus", "errorText"]);
</script>
  
<style>
.error-status {
    color: #2079dd;
}
</style>