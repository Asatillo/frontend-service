import axios from 'axios'

const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
}

export const getNetworkEntitiesByCustomer = async (customerId, {page, itemsPerPage, search}) => {
    return await axios.get(`/crm/network-entities/customer/${customerId}?page=${page}&size=${itemsPerPage}&search=${search}`, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const getNetworkEntitiesOfCustomerByType = async (customerId, type) => {
    return await axios.get(`/crm/network-entities/customer/${customerId}/device-type/${type}?size=-1`, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const getAvailableEntitiesWithoutLimit = async (type, search) => {
    return await axios.get(`/crm/network-entities/available/device-type/${type}?size=-1&search=${search}`, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const assignNetworkEntityToCustomer = async (entityId, updatedNetworkEntity) => {
    return await axios.put(`/crm/network-entities/${entityId}/sell`, updatedNetworkEntity, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}