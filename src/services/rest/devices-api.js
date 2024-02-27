import axios from 'axios'

const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
}

export const getDevices = async (type, itemsPerPage, currentPage, search) => {
    return await axios.get(`/crm/devices/type/${type}?size=${itemsPerPage}&page=${currentPage}&search=${search}`, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const getDeviceById = async (deviceId) => {
    return await axios.get(`/crm/devices/${deviceId}`, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const addDevice = async (deviceTemplateId, amount) => {
    return await axios.post('/crm/devices', {
        deviceTemplateId: deviceTemplateId,
        amount: amount,
    }, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const getDevicesByCustomer = async (customerId, {page, itemsPerPage, search}) => {
    return await axios.get(`/crm/devices/customer/${customerId}?page=${page}&size=${itemsPerPage}&search=${search}`, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const getAvailableDevicesWithoutPagination = async (type) => {
    return await axios.get(`crm/devices/type/${type}/available?size=-1`, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}


// Stoped here
export const sellDeviceToCustomer = async (customerId, deviceId) => {
    return await axios.post(`/crm/devices/${deviceId}/sell`, {
        customerId: customerId,
    }, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}