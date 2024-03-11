import http from '@/plugins/axios'

export const getSalesByCustomerId = async (id, page, size, search) => {
    return await http.get(`/sales/orders/customer/${id}?page=${page}&size=${size}&search=${search}`).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const getSales = async (page, size, search) => {
    return await http.get(`/sales/orders?page=${page}&size=${size}&search=${search}`).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}