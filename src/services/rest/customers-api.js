import http from '@/plugins/axios';

export const getCustomers = async ({page, itemsPerPage, sortBy, groupBy, search}) => {
    return await http.get(`/crm/customers?page=${page}&size=${itemsPerPage}&sort=${sortBy}&search=${search}`).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const getCustomersFullName = async (id) => {
    return await http.get(`/crm/customers/${id}/fullname`).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const getCustomerById = async (id) => {
    return await http.get(`/crm/customers/${id}`).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const editCustomer = async (id, customer) => {
    return await http.put(`/crm/customers/${id}`, customer).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const searchCustomers = async (search) => {
    return await http.get(`/crm/customers?search=${search}&size=10`).then(response => {
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
    return await http.patch(`/crm/customers/${id}/${status}`, {}).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}

export const addCustomer = async (customer) => {
    return await http.post(`/crm/customers`, customer).then(response => {
        return response.data;
    }).catch(err => {
        console.log(err);
    })
}
