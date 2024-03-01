import http from '@/plugins/axios'

export const getNetworkEntities = async ({page, itemsPerPage, search}) => {
    return await http.get(`/crm/network-entities?page=${page}&size=${itemsPerPage}&search=${search}`).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const getNetworkEntitiesByCustomer = async (customerId, {page, itemsPerPage, search}) => {
    return await http.get(`/crm/network-entities/customer/${customerId}?page=${page}&size=${itemsPerPage}&search=${search}`).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const getNetworkEntitiesOfCustomerByType = async (customerId, type) => {
    return await http.get(`/crm/network-entities/customer/${customerId}/device-type/${type}?size=-1`).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const getAvailableEntitiesWithoutLimit = async (type, search) => {
    return await http.get(`/crm/network-entities/available/device-type/${type}?size=-1&search=${search}`).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const assignNetworkEntityToCustomer = async (entityId, updatedNetworkEntity) => {
    return await http.put(`/crm/network-entities/${entityId}/sell`, updatedNetworkEntity).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}