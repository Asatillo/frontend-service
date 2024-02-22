import axios from 'axios'

const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
}

export const getPromotions = async (page, size) => {
    return await axios.get(`/sales/promotions?size=${size}&page=${page}`, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(error => {
        console.error('Error getting promotions:', error.message);
    });
};

export const addPromotion = async (promotion) => {
    return await axios.post('/sales/promotions', promotion, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(error => {
        console.error('Error adding promotion:', error.message);
    });
};

export const changePromotionStatus = async (id, status) => {
    return await axios.patch(`/sales/promotions/${id}/${status}`, { }, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(error => {
        console.error('Error changing status promotion:', error.message);
    });
};

export const editPromotion = async (promotion) => {
    return await axios.put(`/sales/promotions/${promotion.id}`, promotion, {
        headers: headers,
    }).then(response => {
        return response.data;
    }).catch(error => {
        console.error('Error editing promotion:', error.message);
    });
}