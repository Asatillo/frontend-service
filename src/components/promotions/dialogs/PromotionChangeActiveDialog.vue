<template>
    <v-dialog v-model="dialog" max-width="500px">
        <v-card>
            <v-card-title class="text-h6 text-center">
                Are you sure you want to {{ itemToChange.active ? 'deactivate' : 'activate' }} this item?
            </v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue" @click="close">Cancel</v-btn>
                <v-btn color="blue" @click="changeActiveStatus">Confirm</v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { changePromotionStatus } from '@/services/rest/promotions-api'


defineExpose({ changeActive })
const emit = defineEmits(['update-table-after-active-change'])


const dialog = ref(false)
const itemToChange = ref(null)

function changeActive(promotion) {
    itemToChange.value = Object.assign({}, promotion)
    dialog.value = true
}

function changeActiveStatus() {
    changePromotionStatus(itemToChange.value.id, (itemToChange.value.active ? 'deactivate' : 'activate')).then(response => {
        dialog.value = false
        emit('update-table-after-active-change', response)
    }).catch(error => {
        console.log(error)
    })
}

function close() {
    dialog.value = false
}
</script>