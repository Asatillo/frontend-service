<template>
  <v-container class="pb-0">
    <div class="text-h5">Dashboard</div>
  </v-container>
  <v-container>
    <v-card>
      <v-card-title class="text-overline">
        Active users

        <div class="text-primary text-h3 font-weight-bold">90%</div>

        <div class="text-h6 text-medium-emphasis font-weight-regular">
          2,938 remaining
        </div>
      </v-card-title>
      <br>
      <v-card-text>
        <div :style="`right: calc(${review} - 32px)`" class="position-absolute mt-n8 text-caption text-primary">
          Activity review
        </div>
        <v-progress-linear color="primary" height="22" model-value="90" rounded="lg">
        </v-progress-linear>

        <div class="d-flex justify-space-between py-3">
          <span class="text-primary font-weight-medium">
            26,442 active
          </span>

          <span class="text-medium-emphasis" text-color="primary"> 29,380 total </span>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
  <v-container>
    <v-card>
      <v-card-title class="text-overline">
        Revenue

        <div class="text-primary text-h3 font-weight-bold">+$250,000</div>

        <div class="text-h6 text-medium-emphasis font-weight-regular">
          $50,000 remaining
        </div>
      </v-card-title>
      <br>
      <v-card-text>
        <div :style="`right: calc(${review} - 32px)`" class="position-absolute mt-n8 text-caption text-primary">
          Revenue review
        </div>
        <v-progress-linear color="primary" height="22" model-value="80" rounded="lg">
        </v-progress-linear>

        <div class="d-flex justify-space-between py-3">
          <span class="text-primary font-weight-medium">
            $200,000 earned
          </span>

          <span class="text-medium-emphasis" text-color="primary">$250,000 target</span>
        </div>
      </v-card-text>
    </v-card>
  </v-container>

  <v-container>
    <v-card>
      <v-card-title class="text-overline">
        Employees

        <div class="text-primary text-h3 font-weight-bold">+3</div>

        <div class="text-h6 text-medium-emphasis font-weight-regular">
          2 positions open
        </div>
      </v-card-title>
      <br>
      <v-card-text>
        <div :style="`right: calc(${review} - 32px)`" class="position-absolute mt-n8 text-caption text-primary">
          Employee review
        </div>
        <v-progress-linear color="primary" height="22" model-value="70" rounded="lg">
        </v-progress-linear>

        <div class="d-flex justify-space-between py-3">
          <span class="text-primary font-weight-medium">
            37 employees
          </span>

          <span class="text-medium-emphasis" text-color="primary">40 positions</span>
        </div>
      </v-card-text>
    </v-card>
  </v-container>

</template>

<script setup>

</script>

<style></style>