/* Auth actions for redux */

export function setToken(token) {
    return {
        type: 'SET',
        payload: token
    }
}
export function resetToken(token) {
    return {
        type: 'REFRESHTOKEN',
        payload: token
    }
}
export function setUser(id, username, email, admin_role, state, country, address, phone) {
    return {
        type: 'SETUSER',
        payload: {
            id,
            username,
            email,
            admin_role,
            state,
            country,
            address,
            phone
        }
    }
}
export function doLogOut() {
    return {
        type: 'DOLOGOUT',
    }
}