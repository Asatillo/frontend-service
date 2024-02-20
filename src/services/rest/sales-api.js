import axios from 'axios'

const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
}

export const getSalesByCustomerId = async (id, page, size) => {
    return await axios.get(`/sales/orders/customer/${id}?page=${page}&size=${size}`, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const getSales = async (page, size) => {
    return await axios.get(`/sales/orders?page=${page}&size=${size}`, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}