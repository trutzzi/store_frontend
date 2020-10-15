/* Product page display 
Eroare de arhitectura, nu are ce cauta componenta asta, trebuia direct in productDetail 
*/

import React from 'react';
import ItemDetail from './Components/itemDetail'
import { v4 as uuidv4 } from 'uuid';
const config = require('./config.json')

class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            itemsRendered: []
        };
    }
    fetchItems = () => {
        let renderItem = []
        const { id } = this.props.match.params
        fetch(`${config.location}/shop/${id}`)
            .then(res => res.json())
            .then(data => {
                for (let key in data.data) {
                    renderItem.push(<ItemDetail key={uuidv4()} refresh={this.fetchItems} data={data.data[key]} />)
                }
                this.setState({
                    itemsRendered: renderItem
                })
            })
    }
    componentDidMount() {
        this.fetchItems();
    }
    render() {
        return (
            <section className="home" >
                <article>
                    {this.state.itemsRendered.map(e => e)}
                </article>
            </section>
        )
    }
}
export default (Home);
