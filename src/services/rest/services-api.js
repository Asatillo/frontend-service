import axios from 'axios'

const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
}

export const getServices = async ({ page, itemsPerPage }) => {
    return await axios.get(`/crm/services?page=${page}&size=${itemsPerPage}`, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(error => {
        console.error('Error getting services:', error.message);
    });
}

export const getServicesByDeviceType = async (deviceType) => {
    return await axios.get(`/crm/services/device-type/${deviceType}?size=50`, {
        headers: headers,
    }).then(response => {
        return response.data.content;
    }).catch(error => {
        console.error('Error getting services:', error.message);
    });
}

export const getServiceById = async (serviceId) => {
    return await axios.get(`/crm/services/${serviceId}`, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(error => {
        console.error('Error getting service:', error.message);
    });
}

export const changeServiceStatus = async (serviceId, mode) => {
    return await axios.patch(`/crm/services/${serviceId}/${mode}`, {}, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(error => {
        console.error('Error changing service status:', error.message);
    });
}

export const updateService = async (id, service) => {
    return await axios.put(`/crm/services/${id}`, service, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(error => {
        console.error('Error updating service:', error.message);
    });
}

export const createService = async (service) => {
    return await axios.post(`/crm/services`, service, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(error => {
        console.error('Error creating service:', error.message);
    });
}