import axios from 'axios'

const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
}

export const getDevices = async (type, itemsPerPage, currentPage) => {
    return await axios.get(`/crm/devices/type/${type}?size=${itemsPerPage}&page=${currentPage}`, {
        headers: headers,
    }).then(response => {
        return {
            devices: response.data.content,
            totalPages: response.data.totalPages,
            currentPage: response.data.currentPage,
        }
    }).catch(err => {
        console.log(err);
    })
}