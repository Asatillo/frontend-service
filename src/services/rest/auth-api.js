import http from '@/plugins/axios'

export const authorizeUser = async (username, password) => {
    var formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('grant_type', 'password');
    formData.append('client_id', 'nova_client');

    return fetch('http://localhost:8080/auth/realms/nova_realm/protocol/openid-connect/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(formData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
}

export const signUpUser = async (userData) => {
    return await http.post('auth-service/auth/register', userData).then(response => {
        return response.data
    }).catch(error => {
        return error.response.data
    })
}

export const getUsersByRole = async ({ page, itemsPerPage, search }, role) => {
    return await http.get(`/auth-service/users?page=${page}&size=${itemsPerPage}&search=${search}&role=${role}`).then(response => {
        return response.data
    })
}
