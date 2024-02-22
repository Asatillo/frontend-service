import axios from 'axios'

const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
}

export const getDeviceTemplates = async (paginate) => {
        return await axios.get(`/crm/device-templates?paginate=${paginate}`, {
            headers: headers,
        }).then(response => {
            var deviceTemplatesList = [];
            response.data.content.forEach(deviceTemplate => {
                deviceTemplatesList.push({
                    id: deviceTemplate.id,
                    name: `${deviceTemplate.brand} ${ deviceTemplate.model}, ${deviceTemplate.storage ? deviceTemplate.storage + 'GB, ' : ''} ${deviceTemplate.color}`,
                })
            })
            return deviceTemplatesList;
        }).catch(err => {
            console.log(err);
        })
}

export const getDeviceTemplatesByType = async (type, itemsPerPage, page, search) => {
    return await axios.get(`/crm/device-templates/type/${type}?size=${itemsPerPage}&page=${page}&search=${search}`, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const addDeviceTemplate = async (deviceTemplate) => {
    return await axios.post('/crm/device-templates', deviceTemplate, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}