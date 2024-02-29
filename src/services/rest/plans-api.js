import http from '@/plugins/axios'

export const getPlans = async(page, size, search) => {
    return await http.get(`/crm/plans?size=${size}&page=${page}&search=${search}`).then(response => {
        return response.data;
    }).catch(error => {
        console.error('Error getting plans:', error.message);
    });
};

export const getActivePlansByType = async (type) => {
    return await http.get(`crm/plans/device-type/${type}/active`).then(response => {
        return response.data;
    }).catch(error => {
        console.error('Error getting plans by type:', error.message);
    });
};

export const addPlan = async (plan) => {
    return await http.post(`/crm/plans`, {
        name: plan.name,
        description: plan.description,
        duration: plan.period,
        price: plan.price,
        designatedDeviceType: plan.designatedDeviceType,
        services: plan.services
    }).then(response => {
        return response.data;
    }).catch(error => {
        console.error('Error adding plan:', error.message);
    });
};

export const updatePlan = async (plan) => {
    return await http.put(`/crm/plans/${plan.id}`, {
        name: plan.name,
        description: plan.description,
        duration: plan.duration,
        price: plan.price,
        designatedDeviceType: plan.designatedDeviceType,
        services: plan.services
    }).then(response => {
        return response.data;
    }).catch(error => {
        console.error('Error updating plan:', error.message);
    });
};

export const changePlanStatus = async (planId, mode) => {
    return await http.patch(`/crm/plans/${planId}/${mode}`, {}).then(response => {
        return response.data;
    }).catch(error => {
        console.error('Error changing plan status:', error.message);
    });
};

export const getPlanById = async (planId) => {
    return await http.get(`/crm/plans/${planId}`).then(response => {
        return response.data;
    }).catch(error => {
        console.error('Error getting plan by id:', error.message);
    });
}
