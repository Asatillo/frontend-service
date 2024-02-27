import axios from 'axios'

const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
}

export const getPlans = async(page, size, search) => {
    return await axios.get(`/crm/plans?size=${size}&page=${page}&search=${search}`, {
        headers: headers,
    }).then(response => {
        console.log(response.data);
        return response.data;
    }).catch(error => {
        console.error('Error getting plans:', error.message);
    });
};

export const getActivePlansByType = async (type) => {
    return await axios.get(`crm/plans/device-type/${type}/active`, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(error => {
        console.error('Error getting plans by type:', error.message);
    });
};

export const addPlan = async (plan) => {
    return await axios.post(`/crm/plans`, {
        name: plan.name,
        description: plan.description,
        duration: plan.period,
        price: plan.price,
        designatedDeviceType: plan.designatedDeviceType,
        services: plan.services
    }, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(error => {
        console.error('Error adding plan:', error.message);
    });
};

export const updatePlan = async (plan) => {
    return await axios.put(`/crm/plans/${plan.id}`, {
        name: plan.name,
        description: plan.description,
        duration: plan.duration,
        price: plan.price,
        designatedDeviceType: plan.designatedDeviceType,
        services: plan.services
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    }).then(response => {
        return response.data;
    }).catch(error => {
        console.error('Error updating plan:', error.message);
    });
};

export const changePlanStatus = async (planId, mode) => {
    return await axios.patch(`/crm/plans/${planId}/${mode}`, {}, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(error => {
        console.error('Error changing plan status:', error.message);
    });
};

export const getPlanById = async (planId) => {
    return await axios.get(`/crm/plans/${planId}`, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(error => {
        console.error('Error getting plan by id:', error.message);
    });
}
