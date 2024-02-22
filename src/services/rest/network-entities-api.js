import axios from 'axios'

const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
}

export const getNetworkEntitiesByCustomer = async (customerId, {page, itemsPerPage}) => {
    return await axios.get(`/crm/network-entities/customer/${customerId}?page=${page}&size=${itemsPerPage}`, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}