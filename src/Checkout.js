/* Checkout Page */

import React, { useState, useEffect } from 'react';
import ItemHorizontal from './Components/itemHorizontal'
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux'
const config = require('./config.json')

function Checkout(props) {
    const { itemsPurchased } = props
    const [renderItem, setRenderItem] = useState([])
    const [total, setTotal] = useState(0);
    useEffect(() => {
        getItem();
    }, [JSON.stringify(itemsPurchased)])
    async function getItem() {
        var temp = []
        var totalItems = 0
        for (const item of itemsPurchased) {
            var resp = await fetch(`${config.location}/shop/${item.id}`)
            resp = await resp.json();
            totalItems = totalItems + (resp.data[item.id].price * item.count)
            temp.push(<ItemHorizontal count={item.count} key={uuidv4()} data={resp} />)
        }
        setTotal(totalItems)
        setRenderItem(temp)
    }
    return (
        <section className="Checkout">
            <h2>Shopping Chart</h2>
            <div className="grid table-headline">
                <div className="grid__col grid__col--3-of-6 grid__col--am">Product</div>
                <div className="grid__col grid__col--1-of-6 grid__col--am">Price</div>
                <div className="grid__col grid__col--2-of-6 grid__col--am">Quantity</div>
            </div>
            {renderItem.length === 0 && <p className="info">Your Shopping Chart is empty.</p>}
            <article>
                {renderItem}
            </article>
            <div className="total">
                <span>Total: <b>{total} Lei</b> </span>
            </div>
        </section >
    )
}
const mapStateToProps = (state) => ({
    items: state.itemsReducer.items,
    itemsPurchased: state.checkoutReducer.itemsPurchased
})
export default connect(mapStateToProps)(Checkout);
