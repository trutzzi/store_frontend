/* Redux Actions for CRUD Buy Delete set Count  in  items */
export function buy(id, count) {
    return {
        type: 'BUY',
        payload: { id, count }
    }
}
export function del(id) {
    return {
        type: 'DELETE',
        payload: id
    }
} export function count(count) {
    return {
        type: 'COUNT',
        payload: count
    }
}