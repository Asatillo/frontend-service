import axios from 'axios'

const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
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