<template>
    <v-dialog v-model="dialog" max-width="500px" @click:outside="close">
        <v-card>
            <v-card-title class="text-h6 text-center">
                New Promotion Offer
            </v-card-title>
            <v-card-text>
                <v-container class="pa-0">
                    <v-row>
                        <v-col class="py-0" cols="12" v-if="!props.id">
                            <SelectCustomer v-model="editedItem.customerId" :customerId="editedItem.customerId" />
                        </v-col>
                        <v-col class="py-0" cols="12">
                            <v-autocomplete v-model="editedItem.promotionId" label="Promotion" :items="promotions"
                                item-title="name" item-value="id" :search="promotionsSearch"></v-autocomplete>
                        </v-col>
                        <v-col class="py-0" cols="12">
                            <v-select v-model="editedItem.communicationType" label="Communication type"
                                :items="communticationTypes" item-title="name" item-value="value"></v-select>
                        </v-col>
                        <v-col class="py-0" cols="12">
                            <v-select v-model="editedItem.decision" label="Decision"
                                :items="['PENDING', 'ACCEPTED', 'REJECTED']" required></v-select>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue" @click="close">Cancel</v-btn>
                <v-btn color="blue" @click="save" :disabled="disabled">Confirm</v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import SelectCustomer from '@/components/customers/components/SelectCustomer.vue'
import { computed, onMounted, ref } from 'vue'
import { getActivePromotions } from '@/services/rest/promotions-api'
import { addOfferedPromotion } from '@/services/rest/offered-promotions-api'


const props = defineProps(['id'])
defineExpose({ openNewPromotionDialog })
const emit = defineEmits(['update-promotions'])

const promotions = ref([])
const promotionsSearch = ref('')
const communticationTypes = [{
    name: 'SMS',
    value: 'SMS'
}, {
    name: 'EMAIL',
    value: 'EMAIL'
}, {
    name: 'CALL',
    value: 'CALL'
}, {
    name: 'IN PERSON',
    value: 'IN_PERSON'
}]
const dialog = ref(false)
const defaultItem = {
    customerId: props.id,
    promotionId: null,
    communicationType: null,
    decision: 'PENDING',
}
const editedItem = ref(Object.assign({}, defaultItem))
const disabled = computed(() => {
    return !editedItem.value.promotionId || !editedItem.value.communicationType || !editedItem.value.decision || !editedItem.value.customerId
})

onMounted(() => {
    fetchPromotions()
})

const fetchPromotions = async () => {
    getActivePromotions(1, 25, promotionsSearch.value).then(response => {
        if(!response) return
        promotions.value = response.content.map(promotion => {
            return {
                id: promotion.id,
                name: promotion.name
            }
        })
    })
}

function openNewPromotionDialog() {
    dialog.value = true
    editedItem.value = Object.assign({}, defaultItem)
}

function close() {
    dialog.value = false
}

function save() {
    addOfferedPromotion(editedItem.value).then(response => {
        if(!response) return
        emit('update-promotions')
        close()
    })
}
</script>