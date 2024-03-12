import http from '@/plugins/axios'

export const getDevices = async (type, itemsPerPage, currentPage, search) => {
    return await http.get(`/crm/devices/type/${type}?size=${itemsPerPage}&page=${currentPage}&search=${search}`).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const getDeviceById = async (deviceId) => {
    return await http.get(`/crm/devices/${deviceId}`).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const addDevice = async (deviceTemplateId, amount) => {
    return await http.post('/crm/devices', {
        deviceTemplateId: deviceTemplateId,
        amount: amount,
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const getDevicesByCustomer = async (customerId, {page, itemsPerPage, search}) => {
    return await http.get(`/crm/devices/customer/${customerId}?page=${page}&size=${itemsPerPage}&search=${search}`).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const getAvailableDevicesWithoutPagination = async (type) => {
    return await http.get(`crm/devices/type/${type}/available?size=-1`).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}


export const sellDeviceToCustomer = async (customerId, deviceId, promotionId) => {
    return await http.post(`/crm/devices/${deviceId}/sell`, {
        customerId: customerId,
        promotionId: promotionId,
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}