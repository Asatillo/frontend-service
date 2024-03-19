<template>
    <v-container class="pb-0">
        <div class="text-h5">Settings</div>
    </v-container>
    <!-- <v-container>
        <v-row>
            <v-col cols="12" md="6">
                <v-card>
                    <v-card-title>
                        <span class="text-h6">Change password</span>
                    </v-card-title>
                    <v-card-text>
                        <v-form ref="form" v-model="valid" lazy-validation>
                            <v-text-field v-model="password" :rules="passwordRules" label="Password"
                                type="password"></v-text-field>
                            <v-text-field v-model="passwordConfirm" :rules="passwordConfirmRules"
                                label="Confirm password" type="password"></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="changePassword" :disabled="!valid">Change</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container> -->

    <!-- API Documentation -->
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title>
                        <span class="text-h6">OpenAPI Documentation</span>
                    </v-card-title>
                    <v-card-actions>
                        <v-btn color="primary" href="http://localhost:8081/crm/docs" target="_blank">CRM API Documentation</v-btn>
                        <v-btn color="secondary" href="http://localhost:9191/docs" target="_blank">AUTH API Documentation</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
  
<script setup>
</script>