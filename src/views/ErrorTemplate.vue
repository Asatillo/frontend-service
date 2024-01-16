<template>
    <div class="errorContainer">
      <div class="errorCard">
        <div class="text-h1 error-status">{{ errorStatus }}</div>
        <div class="text-h4">Oops! {{ errorMessage }}</div><br>
        <p>{{ errorText }}</p>
        <router-link to="/"> Go to Homepage </router-link>
      </div>
    </div>
</template>
  
<script>
export default {
    name: "ErrorTemplate",
    props: ["errorMessage", "errorStatus", "errorText"],
};
</script>
  
<style>
.errorContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
}

.errorCard {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: left;
    width: 800px;
}

.error-status {
    color: #2079dd;
}
</style>