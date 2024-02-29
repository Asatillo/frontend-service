import http from '@/plugins/axios'

export const authorizeUser = async (username, password) => {
    try {
        const userData = await http.post('auth-service/auth/authenticate', {
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
        const response = await http.post('auth-service/auth/register', userData);
        return response.data
    } catch (err) {
        if (err.response) {
            return err.response.data
        }
    }
}

export const getUsersByRole = async ({ page, itemsPerPage}, role) => {
    return await http.get(`/auth-service/users?page=${page}&size=${itemsPerPage}&role=${role}`).then(response => {
        return response.data
    }).catch(err => {
        console.log(err)
    })
}
