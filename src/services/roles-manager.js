export function canAccess(allowedRoles) {
    const userRoles = JSON.parse(localStorage.getItem('user'))?.roles;
    return allowedRoles.some(role => userRoles?.includes(role));
}