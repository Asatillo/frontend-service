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
