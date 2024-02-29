import http from '@/plugins/axios'

export const getOfferedPromotionsByCustomerId = async (id, page, size) => {
    return await http.get(`/sales/promotions/offered/customer/${id}?page=${page}&size=${size}`).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}