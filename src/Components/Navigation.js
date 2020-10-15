import React from 'react'
import { NavLink } from "react-router-dom";
import { GrHome } from "react-icons/gr";
import uuid from 'react-uuid'
const config = require('../config.json')

export default class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navCategory: []
        }
    }
    componentDidMount() {
        var myCats = []
        fetch(`${config.location}/category`)
            .then(resp => resp.json())
            .then(data => {
                data.data.map(c => myCats.push(< li key={uuid()}> <NavLink activeClassName='is-active' to={'/category/' + c.id}>{c.name}</NavLink></li >))
                this.setState({ navCategory: myCats })
                return myCats
            })
            .catch(e => console.log(e))
    }
    render() {
        return (<nav>
            <ul>
                <li>
                    <NavLink exact activeClassName='is-active' to="/"><GrHome /> Home</NavLink>
                </li>
                {this.state.navCategory.length ? <li className="has-children"><a href="#">Category</a><ul>{this.state.navCategory.map(i => i)} </ul></li> : ''}
                <li>
                    <NavLink activeClassName='is-active' to="/checkout">Checkout
    </NavLink>
                </li>
                <li>
                </li>
            </ul>
        </nav>
        )
    }
}