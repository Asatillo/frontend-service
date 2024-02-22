import axios from 'axios'

const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
}

export const getCustomers = async ({page, itemsPerPage, sortBy, groupBy, search}) => {
    return await axios.get(`/crm/customers?page=${page}&size=${itemsPerPage}&sort=${sortBy}&search=${search}`, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const getCustomerById = async (id) => {
    return await axios.get(`/crm/customers/${id}`, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const editCustomer = async (id, customer) => {
    return await axios.put(`/crm/customers/${id}`, customer, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const searchCustomers = async (search) => {
    return await axios.get(`/crm/customers?search=${search}&size=10`, {
        headers: headers,
    }).then(response => {
        var customersList = [];
        response.data.content.forEach(customer => {
            customersList.push({
                id: customer.id,
                name: `${customer.firstName} ${customer.lastName}`,
            })
        })
        return customersList;
    }).catch(err => {
        console.log(err)
    })
}

export const changeCustomerStatus = async (id, status) => {
    return await axios.patch(`/crm/customers/${id}/${status}`, {}, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const addCustomer = async (customer) => {
    return await axios.post(`/crm/customers`, customer, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}
