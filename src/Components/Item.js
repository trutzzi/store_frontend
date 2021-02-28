/* Define Item detail page template */

import React from 'react'
import { Link } from 'react-router-dom'

const config = require('../config.json')

function Item(props) {
    const { images, item_name, item_id, price, lastPrice, date } = props.data
    return (
        <article className="grid__col grid__col--1-of-3 grid__col--md-1-of-2 grid__col--sm-1-of-1">
            <div className="item">
                <div className="item-image" style={{ backgroundImage: "url(" + config.location + "/" + images[0] + ")" }}>
                </div>
                <Link to={'/product/' + item_id}>
                    <h3>{item_name}</h3>
                </Link>
                <div className="price-wrapper">
                    <span className="price">{price}Lei</span>
                    {lastPrice ? <span className="last-price">{lastPrice}Lei</span> : ''}
                </div>
                {compareIsPast(date, 14) ? <span className="new">HOT</span> : ''}
            </div>
        </article >
    )
}
const compareIsPast = (date, dateAgo) => {

    var dateOffset = (24 * 60 * 60 * 1000) * dateAgo;
    var myDate = new Date();
    var toCompare = myDate.setTime(myDate.getTime() - dateOffset);
    var compare = new Date(date);
    if (compare >= toCompare) {
        return true
    }
    else {
        return false
    }
}
export default (Item)