import http from '@/plugins/axios'

export const getServices = async ({ page, itemsPerPage, search }) => {
    return await http.get(`/crm/services?page=${page}&size=${itemsPerPage}&search=${search}`).then(response => {
        return response.data;
    }).catch(error => {
        console.error('Error getting services:', error.message);
    });
}

export const getServicesByDeviceType = async (deviceType) => {
    return await http.get(`/crm/services/device-type/${deviceType}?size=50`).then(response => {
        return response.data.content;
    }).catch(error => {
        console.error('Error getting services:', error.message);
    });
}

export const getServiceById = async (serviceId) => {
    return await http.get(`/crm/services/${serviceId}`).then(response => {
        return response.data;
    }).catch(error => {
        console.error('Error getting service:', error.message);
    });
}

export const changeServiceStatus = async (serviceId, mode) => {
    return await http.patch(`/crm/services/${serviceId}/${mode}`, {}).then(response => {
        return response.data;
    }).catch(error => {
        console.error('Error changing service status:', error.message);
    });
}

export const updateService = async (id, service) => {
    return await http.put(`/crm/services/${id}`, service).then(response => {
        return response.data;
    }).catch(error => {
        console.error('Error updating service:', error.message);
    });
}

export const createService = async (service) => {
    return await http.post(`/crm/services`, service).then(response => {
        return response.data;
    }).catch(error => {
        console.error('Error creating service:', error.message);
    });
}