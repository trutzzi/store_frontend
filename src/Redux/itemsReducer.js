/* REDUX Items Reducer functions */
const initStore = {
    items: [],
    errorLoad: true,
    errorFetch: false,
}
export function itemsReducer(state = initStore, action) {
    switch (action.type) {
        case 'GET':
            break;
        case 'SET':
            state = { ...state, items: action.payload }
            break
        case 'UNABLETOLOAD':
            state = { ...state, errorLoad: false }
            break
        case 'UNABLETOFETCH':
            state = { ...state, errorFetch: true }
            break
        default:
            break;
    }
    return state
}