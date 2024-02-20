import axios from 'axios'

const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
}

export const getOfferedPromotionsByCustomerId = async (id, page, size) => {
    return await axios.get(`/sales/promotions/offered/customer/${id}?page=${page}&size=${size}`, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}