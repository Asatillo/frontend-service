import http from '@/plugins/axios'

export const getOfferedPromotions = async (page, size, search) => {
    return await http.get(`/sales/promotions/offered?page=${page}&size=${size}&search=${search}`).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const getOfferedPromotionsByCustomerId = async (id, page, size, search) => {
    return await http.get(`/sales/promotions/offered/customer/${id}?page=${page}&size=${size}&search=${search}`).then(response => {
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

export const addOfferedPromotion = async (data) => {
    return await http.post('/sales/promotions/offered', data).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}