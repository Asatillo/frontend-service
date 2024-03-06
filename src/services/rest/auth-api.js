import http from '@/plugins/axios'

export const authorizeUser = async (username, password) => {
    return await http.post('auth-service/auth/authenticate', {
        username: username,
        password: password,
    }).then(response => {
        return response.data
    }).catch(error => {
        return error.response.data
    })
}

export const signUpUser = async (userData) => {
    return await http.post('auth-service/auth/register', userData).then(response => {
        return response.data
    }).catch(error => {
        return error.response.data
    })
}

export const getUsersByRole = async ({ page, itemsPerPage, search}, role) => {
    return await http.get(`/auth-service/users?page=${page}&size=${itemsPerPage}&search=${search}&role=${role}`).then(response => {
        return response.data
    })
}
