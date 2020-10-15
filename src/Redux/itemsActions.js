/* Redux CRUD Buy Delete set Count  for items */

export function getItems() {
    return {
        type: 'GET'
    }
}
export function setItems(payload) {
    return {
        type: 'SET',
        payload: payload
    }
}
export function setErrorLoad(payload) {
    return {
        type: 'UNABLETOLOAD',
        payload
    }
}
export function setErrorFetch(payload) {
    return {
        type: 'UNABLETOFETCH',
        payload
    }
}