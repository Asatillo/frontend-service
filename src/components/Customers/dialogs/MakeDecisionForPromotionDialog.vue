<template>
    <v-dialog v-model="dialog" max-width="500px" @click:outside="close">
        <v-card>
            <v-card-title class="text-h6 text-center">
                Customer's decision
            </v-card-title>
            <v-card-actions>
                <v-btn color="secondary" @click="close">Close</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="red" @click="changeActiveStatus('reject')">Reject</v-btn>
                <v-btn color="primary" @click="changeActiveStatus('accept')">Accept</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { makeDecision } from '@/services/rest/offered-promotions-api'

const offerIdToDecide = ref(null)

defineExpose({ openChangeDecisionDialog })

const emit = defineEmits(['update-promotion'])

const dialog = ref(false)

function openChangeDecisionDialog(id) {
    offerIdToDecide.value = id
    dialog.value = true
}

function close() {
    dialog.value = false
}

function changeActiveStatus(decision) {
    makeDecision(offerIdToDecide.value, decision).then(response => {
        if(!response) return
        emit('update-promotion', response)
        dialog.value = false        
    })
}

</script>