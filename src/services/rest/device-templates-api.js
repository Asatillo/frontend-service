import http from '@/plugins/axios'

export const getDeviceTemplates = async (paginate) => {
        return await http.get(`/crm/device-templates?paginate=${paginate}`).then(response => {
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
    return await http.get(`/crm/device-templates/type/${type}?size=${itemsPerPage}&page=${page}&search=${search}`).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const addDeviceTemplate = async (deviceTemplate) => {
    return await http.post('/crm/device-templates', deviceTemplate).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}