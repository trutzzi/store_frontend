/* Auth redux functions */

import { ToastsStore } from 'react-toasts';
let initStore = {
    token: [],
    refreshToken: [],
    username: null,
    id: null,
    email: null,
    admin_role: null,
};
if (localStorage.getItem('token')) {
    initStore.token = localStorage.getItem('token')
    initStore.refreshToken = localStorage.getItem('refreshToken')
    initStore.username = localStorage.getItem('username')
    initStore.id = localStorage.getItem('id')
    initStore.email = localStorage.getItem('email')
    initStore.admin_role = Number(localStorage.getItem('admin_role'))
}
export function authReducer(state = initStore, action) {
    switch (action.type) {
        case 'SET':
            state = { ...state }
            state.token = action.payload.accessToken
            state.refreshToken = action.payload.refreshToken
            localStorage.setItem('token', action.payload.accessToken);
            localStorage.setItem('refreshToken', action.payload.refreshToken);
            break
        case 'REFRESHTOKEN':
            state = { ...state }
            localStorage.setItem('token', action.payload);
            state.token = action.payload
            // ToastsStore.success('Token hsa been refreshed')
            break
        case 'SETUSER':
            const { username, admin_role, email, id } = action.payload;
            state = { ...state };
            state.username = username;
            state.id = id;
            state.email = email;
            state.admin_role = admin_role;
            localStorage.setItem('username', username);
            localStorage.setItem('admin_role', admin_role);
            localStorage.setItem('email', email);
            localStorage.setItem('id', id);
            break
        case 'DOLOGOUT':
            state = { ...state }
            state.token = null
            state.refreshToken = null
            localStorage.clear();
            ToastsStore.success('Loggout succesfully')
            break
        default:
            break;
    }
    return state
}