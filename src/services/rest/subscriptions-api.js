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

export const addSubscription = async (networkEntityId, planId) => {
    return await axios.post('/crm/subscriptions', {
        networkEntity: networkEntityId,
        planId: planId,
    }, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const changeSubscriptionStatus = async (subscriptionId, status) => {
    return await axios.patch(`/crm/subscriptions/${subscriptionId}/${status}`, {}, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}
