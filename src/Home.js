/* Homepage*/

import React from 'react';
import Item from './Components/Item'
import CategoryId from './Components/CategoryId'
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';
import { Link } from 'react-router-dom'
import { GrStatusWarning } from "react-icons/gr";
import { useState } from 'react';
const config = require('./config.json')

function Home(props) {
    let renderItem = []
    let renderCat = []
    const [renderItems, setRenderItems] = useState([]);
    const [renderCats, SetRenderCats] = useState([]);
    useEffect(() => {
        // fetch(`${config.location}/shop/pg/2/rs/5`)
        fetch(`${config.location}/shop`)
            .then(res => res.json())
            .then(data => {
                for (let key in data.data) {
                    renderItem.push(<Item key={uuidv4()} data={data.data[key]} />)
                }
                setRenderItems(renderItem)
            })
        fetch(`${config.location}/category/`)
            .then(res => res.json())
            .then(data => {
                for (let key in data.data) {
                    renderCat.push(<CategoryId catName={data.data[key].name} key={uuidv4()} data={data.data[key]} />)
                }
                SetRenderCats(renderCat)
            })
    }, [])

    return (
        <section className="home">
            <h2>Latest Products</h2>
            <article className="section-shop grid">
                {renderItems.length ? renderItems : <p> <GrStatusWarning /> No Items to show.</p>}
            </article>
            <h2>Shop by Category</h2>
            <article className="section-shop grid">
                {renderCats.length ? renderCats : <p><GrStatusWarning /> No Categories to show.</p>}
            </article>
        </section>
    )
}
export default (Home);
