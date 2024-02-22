import axios from 'axios'

const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
}

export const getSubscriptionsByCustomer = async (customerId, {page, itemsPerPage}) => {
    return await axios.get(`/crm/subscriptions/customers/${customerId}?page=${page}&size=${itemsPerPage}`, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const getSubscriptions = async ({page, itemsPerPage}) => {
    return await axios.get(`/crm/subscriptions?page=${page}&size=${itemsPerPage}`, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}
