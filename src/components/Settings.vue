<template>
    <v-container class="pb-0">
        <div class="text-h5">Settings</div>
    </v-container>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-expansion-panels>
                    <v-expansion-panel>
                        <v-expansion-panel-title>
                            <span class="text-h6">Restart password</span>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                            <v-form ref="form" v-model="valid" lazy-validation>
                                <v-text-field v-model="password" :rules="passwordRules" label="Password"
                                    type="password"></v-text-field>
                                <v-text-field v-model="passwordConfirm" :rules="passwordConfirmRules"
                                    label="Confirm password" type="password"></v-text-field>
                            </v-form>
                        </v-expansion-panel-text>
                    </v-expansion-panel>

                    <v-expansion-panel>
                        <v-expansion-panel-title>
                            <span class="text-h6">OpenAPI Documentations</span>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                            <v-tabs v-model="apiDocsTab">
                                <v-tab v-for="panel in apiPanels" :value="panel.value">
                                    {{ panel.name }}
                                </v-tab>
                            </v-tabs>

                            <v-window v-model="apiDocsTab">
                                <v-window-item v-for="panel in apiPanels" :value="panel.value">
                                    <iframe :src="panel.url" width="100%" height="600"></iframe>
                                </v-window-item>
                            </v-window>

                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>

import { ref } from 'vue'

const apiDocsTab = ref('CRM API')
const apiPanels = [
    { name: 'CRM API', value: 'crm-api', url: 'http://localhost:8081/crm/docs' },
    { name: 'AUTH API', value: 'auth-api', url: 'http://localhost:9191/docs' },
    { name: 'Sales API', value: 'sales-api', url: 'http://localhost:8082/sales/docs' }
]
</script>