/* Define Item Detail from checkout */

import React from 'react'
import { Link } from 'react-router-dom'
import { count } from '../Redux/checkoutActions'
import { connect } from 'react-redux'
import { ToastsStore } from 'react-toasts';
import { GrAdd, GrSubtract } from "react-icons/gr";

const config = require('../config.json')

class itemHorizontal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            item_name: null,
            item_id: null,
            price: null,
            image: null

        }
    }
    componentDidMount() {
        for (let i in this.props.data.data) {
            this.setState({
                item_name: this.props.data.data[i].item_name,
                item_id: this.props.data.data[i].item_id,
                images: this.props.data.data[i].images,
                price: this.props.data.data[i].price
            }, () => {
                const countItem = this.props.itemsPurchased;
                if (countItem.length > 0) {
                    countItem.map(i => {
                        if (i.id === Number(this.state.item_id)) {
                            this.setState({ count: i.count })
                        }
                    })
                }
            })
        }
    }
    buy() {
        this.setState(prevState => ({ count: Number(prevState.count + 1) }), () => {
            this.props.count({
                id: this.state.item_id,
                count: this.state.count
            })
        })
    }
    del() {
        this.setState(prevState => ({ count: prevState.count - 1 }),
            () => {
                this.props.count({
                    id: this.state.item_id,
                    count: this.state.count
                })
            })
    }
    changeVal(val) {
        this.setState({
            count: Number(val.target.value)
        })
        this.props.count({
            id: this.state.item_id,
            count: val.target.value
        })
    }
    delete() {
        const id = this.state.item_id;
        const options = {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + this.props.token
            }
        };
        let safe = window.confirm("Are you sure you want to permanenlty delete this item?")
        if (safe) {
            fetch(`${config.location}/del-item/${id}`, options)
                .then(resp => {
                    if (resp.status === 403) {
                        ToastsStore.error('Unauthorized 403')
                    }
                    return resp.json()
                })
                .then(data => {
                    if (data.status === "Error") {
                        ToastsStore.error(data.description)
                    } else if (data.status === "Succes") {
                        ToastsStore.success('Item id ' + data.id + ' was deleted.')
                        this.setState({ redirect: '/' })
                    }
                })
        }
    }
    render() {
        return (
            <article className="item-chart">
                <div className="grid">
                    <div className="grid__col grid__col--1-of-6 grid__col--am">
                        {this.state.images ? <img style={{ maxWidth: 124 + 'px', verticalAlign: "middle", marginRight: 15 + 'px' }} src={config.location + '/' + this.state.images[0]} /> : ''}
                    </div>
                    <div className="grid__col grid__col--2-of-6 grid__col--am">
                        <Link to={'/product/' + this.state.item_id}>
                            <h3>{this.state.item_name}</h3>
                        </Link>
                    </div>
                    <div className="grid__col grid__col--1-of-6 grid__col--am">
                        <span className="price">{this.state.price} Lei</span>
                    </div>
                    <div className="grid__col grid__col--2-of-6 grid__col--am">
                        <span className="control">
                            <span className="count">
                                x {this.state.count}
                            </span>
                            <span onClick={() => this.buy(this.state.item_id)} className="btn add" > <GrAdd /></span>
                            <input type="text" onChange={(val) => this.changeVal(val)} name="count" placeholder="Amount" value={this.state.count} />
                            {this.state.count ? <span onClick={() => this.del(this.state.item_id)} className="btn dell" > <GrSubtract /></span> : ''}
                        </span>
                    </div>
                </div>
            </article >
        )
    }
}
const mapStateToProps = (state) => ({
    token: state.authReducer.token,
    admin_role: state.authReducer.admin_role,
    itemsPurchased: state.checkoutReducer.itemsPurchased
})
const mapDispatchToProps = dispatch => {
    return {
        count: e => dispatch(count(e))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(itemHorizontal)