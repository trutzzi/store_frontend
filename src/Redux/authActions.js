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
export function setUser(id, username, email, admin_role) {
    return {
        type: 'SETUSER',
        payload: {
            id,
            username,
            email,
            admin_role
        }
    }
}
export function doLogOut() {
    return {
        type: 'DOLOGOUT',
    }
}