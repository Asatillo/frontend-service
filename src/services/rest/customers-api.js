import axios from 'axios'

const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
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