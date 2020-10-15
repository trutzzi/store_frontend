// Checkout Redux functions 

const initStore = {
    itemsPurchased: []
}
if (localStorage.getItem('itemsPurchased')) {
    initStore.itemsPurchased = JSON.parse(localStorage.getItem('itemsPurchased'));
}
export function checkoutReducer(state = initStore, action) {
    switch (action.type) {
        case 'COUNT':

            let index = state.itemsPurchased.map(a => a.id).indexOf(action.payload.id);
            if (index !== -1) {
                var tmp = [...state.itemsPurchased]
                tmp.map(i => { if (i.id === action.payload.id) { return i.count = action.payload.count } })
                state = {
                    ...state, itemsPurchased: tmp
                }
                if (state.itemsPurchased[index].count === 0) {
                    var newList = [...state.itemsPurchased]
                    newList.splice(index, index + 1)
                    state = { ...state, itemsPurchased: [...newList] }
                }
            } else {
                let tmp = { "id": action.payload.id, "count": Number(action.payload.count) };
                state = {
                    ...state, itemsPurchased: [...state.itemsPurchased, tmp]
                };
            }

            break
        default:
            break;
    }
    localStorage.setItem('itemsPurchased', JSON.stringify(state.itemsPurchased))
    return state
}