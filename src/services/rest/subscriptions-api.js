import http from '@/plugins/axios'

export const getSubscriptionsByCustomer = async (customerId, {page, itemsPerPage}) => {
    return await http.get(`/crm/subscriptions/customers/${customerId}?page=${page}&size=${itemsPerPage}`).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const getSubscriptions = async ({page, itemsPerPage, search}) => {
    return await http.get(`/crm/subscriptions?page=${page}&size=${itemsPerPage}&search=${search}`).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const addSubscription = async (networkEntityId, planId, startDate, promotionId) => {
    return await http.post('/crm/subscriptions', {
        networkEntity: networkEntityId,
        planId: planId,
        promotionId: promotionId,
        startDate: startDate
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const changeSubscriptionStatus = async (subscriptionId, status) => {
    return await http.patch(`/crm/subscriptions/${subscriptionId}/${status}`, {}).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}
