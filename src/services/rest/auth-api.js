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
            return response.json();
        });
}

export const refreshToken = async (username, refresh_token) => {
    var formData = new FormData();
    formData.append('username', username);
    formData.append('refresh_token', refresh_token);
    formData.append('grant_type', 'refresh_token');
    formData.append('client_id', 'nova_client');

    return fetch('http://localhost:8080/auth/realms/nova_realm/protocol/openid-connect/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(formData)
    })
        .then(response => {
            return response.json();
        });
}
