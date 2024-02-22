import axios from 'axios'

const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
}

export const authorizeUser = async (username, password) => {
    try {
        const userData = await axios.post('auth-service/auth/authenticate', {
            username: username,
            password: password,
        });
        return userData.data
    } catch (err) {
        if (err.response) {
            return err.response.data
        }
    }
}

export const signUpUser = async (userData) => {
    try {
        const response = await axios.post('auth-service/auth/register', userData);
        return response.data
    } catch (err) {
        if (err.response) {
            return err.response.data
        }
    }
}

// const response = await axios.get(`/auth-service/users?page=${tab.pagination.currentPage}&size=${itemsPerPage.value}&role=${tab.role}`, config);
export const getUsersByRole = async ({ page, itemsPerPage}, role) => {
    try {
        const response = await axios.get(`/auth-service/users?page=${page}&size=${itemsPerPage}&role=${role}`, {
            headers: headers,
        });
        return response.data
    } catch (err) {
        if (err.response) {
            return err.response.data
        }
    }
}
