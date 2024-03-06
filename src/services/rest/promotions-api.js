import http from '@/plugins/axios'

export const getPromotions = async (page, size, search) => {
    return await http.get(`/sales/promotions?size=${size}&page=${page}&search=${search}`).then(response => {
        return response.data;
    }).catch(error => {
        console.error('Error getting promotions:', error.message);
    });
};

export const addPromotion = async (promotion) => {
    return await http.post('/sales/promotions', promotion).then(response => {
        return response.data;
    }).catch(error => {
        console.error('Error adding promotion:', error.message);
    });
};

export const changePromotionStatus = async (id, status) => {
    return await http.patch(`/sales/promotions/${id}/${status}`, {}).then(response => {
        return response.data;
    }).catch(error => {
        console.error('Error changing status promotion:', error.message);
    });
};

export const editPromotion = async (promotion) => {
    return await http.put(`/sales/promotions/${promotion.id}`, promotion).then(response => {
        return response.data;
    }).catch(error => {
        console.error('Error editing promotion:', error.message);
    });
}