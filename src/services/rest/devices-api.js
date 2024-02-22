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

export const addDevice = async (deviceTemplateId) => {
    return await axios.post('/crm/devices', {
        deviceTemplateId: deviceTemplateId,
    }, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const getDevicesByCustomer = async (customerId, {page, itemsPerPage}) => {
    return await axios.get(`/crm/customers/${customerId}/devices?page=${page}&size=${itemsPerPage}`, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}


// Stoped here
export const sellDevice = async (customerId, deviceId) => {
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