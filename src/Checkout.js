/* Checkout Page */

import React, { useState, useEffect } from 'react';
import ItemHorizontal from './Components/itemHorizontal'
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux'
import { GrStatusWarning } from "react-icons/gr";
import { ToastsStore } from 'react-toasts'

const config = require('./config.json')

function Checkout(props) {
    const { itemsPurchased } = props
    const [renderItem, setRenderItem] = useState([])
    const [total, setTotal] = useState(0);
    const [nextStep, setNextStep] = useState(0);

    const placeOrder = () => {
        if (itemsPurchased.length) {
            if (!nextStep) {
                setNextStep(1)
            } else if (nextStep == 1) {
                {
                    if (itemsPurchased) {
                        //If order exist
                        fetch(`${config.location}/checkout`,
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + props.token
                                },
                                body: JSON.stringify({
                                    customerId: props.userDetail.id,
                                    items: itemsPurchased
                                })
                            })
                            .then(resp => {
                                if (resp.status == 200) {
                                    ToastsStore.success('Order has been placed');
                                } else {
                                    ToastsStore.error("Unexpected error")
                                }
                            })
                    } else {
                        //No items in chart
                        ToastsStore.warning('You don\'t have items in chart')
                    }
                }
            }
        } else {
            //No Items in chart
            ToastsStore.warning('You don\'t have items in chart')
        }
    }

    useEffect(() => {
        getItem();
    }, [JSON.stringify(itemsPurchased)])
    async function getItem() {
        var temp = []
        var totalItems = 0;
        for (let item of itemsPurchased) {
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
            {renderItem.length === 0 && <p className="info"><GrStatusWarning /> Your Shopping Chart is empty.</p>}
            <article>
                {renderItem}
            </article>
            {nextStep ?
                <section className="placeOrder">
                    <h2>Order address</h2>
                    <form name="placeOrder fixed-width">
                        <input type="text" readOnly="yes" defaultValue={props.userDetail.country} placeholder="Country" />
                        <input type="text" readOnly="yes" defaultValue={props.userDetail.state} placeholder="State" />
                        <input type="text" readOnly="yes" defaultValue={props.userDetail.address} placeholder="Address" />
                        <input type="text" readOnly="yes" defaultValue={props.userDetail.phone} placeholder="Phone" />
                    </form>
                </section>
                : ""}
            <button onClick={placeOrder} className="btn btn--inverted">
                Place order
                </button>
            <div className="total">
                <span>Total: <b>{total} Lei</b> </span>
            </div>
        </section>

    )
}
const mapStateToProps = (state) => ({
    items: state.itemsReducer.items,
    itemsPurchased: state.checkoutReducer.itemsPurchased,
    userDetail: state.authReducer,
    token: state.authReducer.token,
    refreshToken: state.authReducer.refreshToken,
})
export default connect(mapStateToProps)(Checkout);
