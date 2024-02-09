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