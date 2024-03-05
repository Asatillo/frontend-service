import http from '@/plugins/axios'

export const getOfferedPromotionsByCustomerId = async (id, page, size) => {
    return await http.get(`/sales/promotions/offered/customer/${id}?page=${page}&size=${size}`).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const getAcceptedOfferedPromotionsByCustomerAndType = async (id, type, search) => {
    return await http.get(`/sales/promotions/offered/customer/${id}/product-type/${type}?search=${search}`).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}