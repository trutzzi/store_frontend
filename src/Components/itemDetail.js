import React from 'react'
import { count } from '../Redux/checkoutActions'
import { connect } from 'react-redux'
import uuid from 'react-uuid'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Redirect } from 'react-router-dom'
import { ToastsStore } from 'react-toasts';
const config = require('../config.json')


class ItemDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            editMode: false,
            count: 0,
            refresh: this.props.refresh,
            ok: false,
            redirect: ''
        }
        this.toggleEdit = this.toggleEdit.bind(this)
        this.delete = this.delete.bind(this)
        this.buy = this.buy.bind(this)
        this.del = this.del.bind(this)
    }
    componentDidMount() {
        this.renderCats();
        const countItem = this.props.itemsPurchased;
        if (countItem.length > 0) {
            countItem.map(i => {
                if (i.id === this.props.data.item_id) {
                    this.setState({ count: i.count })
                }
            })
        }
    }
    toggleEdit() {
        this.setState(prevState => ({
            editMode: !prevState.editMode
        }))
    }
    buy() {
        this.setState(prevState => ({ count: Number(prevState.count + 1) }), () => {
            this.props.count({
                id: this.props.data.item_id,
                count: this.state.count
            })
        })
    }
    del() {
        this.setState(prevState => ({ count: prevState.count - 1 }),
            () => {
                this.props.count({
                    id: this.props.data.item_id,
                    count: this.state.count
                })
            })
    }
    changeVal(val) {
        this.setState({
            count: Number(val.target.value)
        })
        this.props.count({
            id: this.props.data.item_id,
            count: val.target.value
        })
    }
    delete() {
        const id = this.props.data.item_id;
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
    formSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const itemName = data.get('itemName')
        const description = data.get('description')
        const price = data.get('price')
        const lastPrice = data.get('lastPrice')
        const categoryId = data.get('categoryId')
        const id = this.props.data.item_id;
        const token = data.get('token')
        fetch(`${config.location}/shop/${id}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "name": itemName,
                    "description": description,
                    "price": price,
                    "lastPrice": lastPrice,
                    "category": categoryId
                })
            })
            .then(async resp => {
                if (await resp.status === 403) {
                    ToastsStore.error("Unauthorized: 403");
                } else if (await resp.status === 200) {
                    this.setState({ ok: true })
                    let x = await resp.json()
                    return Promise.resolve(x);
                }
            })
            .then(data => {
                if (this.state.ok) {
                    ToastsStore.info(data.description)
                    this.state.refresh();
                }
            })
            .catch(e => {
                ToastsStore.error(e)
                console.log(e)
            })
    }

    async renderCats() {
        var options = [];
        var category = await fetch(`${config.location}/category`)
        category = await category.json();
        category.data.map(c => {
            options.push(<option key={uuid()} value={c.id} defaultValue={c.catId}>{c.name}</option>)
        })
        this.setState({
            categorys: options
        })
    }
    render() {
        const { images, item_name, catName, description, item_id, price, lastPrice, createdAt } = this.props.data
        const { editMode } = this.state
        const responsive = {
            desktop: {
                breakpoint: { max: 3000, min: 1 },
                items: 1
            }
        };
        return (
            <React.Fragment>
                {editMode ?
                    <div className="edit-box-wrapper">
                        <div className="edit-box">
                            <button className="btn--fluid" onClick={this.delete}>Delete Item</button>
                            <form className="fixed-width" onSubmit={this.formSubmit}>
                                {this.props.admin_role === 1 ? <input type="hidden" name="token" defaultValue={this.props.token} /> : ''}
                                <input type="hidden" name="id" defaultValue={item_id} />
                                <label>Nume Produs</label><input type="text" name="itemName" defaultValue={item_name} />
                                <div className="description">
                                    <label>Categorie</label>
                                    {this.props.catId}
                                    <select defaultValue={this.props.data.catId} id='categoryId' name='categoryId'>
                                        {this.state.categorys}
                                    </select>
                                    <br />
                                    <label>Descriere</label><textarea name="description" defaultValue={description}></textarea>

                                </div>
                                <label>Pret</label><input type="text" name="price" defaultValue={price} />
                                <label>Ultimul pret</label><input type="text" name="lastPrice" defaultValue={lastPrice} />
                                <button className="btn--inverted btn--2-2">Save</button>
                                <button className="btn btn--2-2" onClick={this.toggleEdit}>Cancel</button>
                            </form>
                        </div>
                    </div>

                    : ''
                }
                <article className="item-detail" >
                    {this.state.redirect ? <Redirect to={this.state.redirect} /> : ''}
                    {this.props.admin_role === 1 && <div className="item-detail_toggle-edit">  {editMode ? '' : <button onClick={this.toggleEdit}>Toggle edit </button>}
                    </div>}
                    < Carousel className="item-image" responsive={responsive} >
                        {
                            images.map((img, index) => {
                                return <div className="img" key={uuid()} >
                                    <img src={`${config.location}/${images[index]}`} />
                                </div>
                            })
                        }
                    </Carousel>
                    <div className="item-detail">
                        <h3>{item_name}</h3>
                        <div className="description">
                            <p>{description}</p>
                            <a href={'/category/' + this.props.data.catId}><p>Category {catName}</p></a>
                        </div>
                    </div>
                    {compareIsPast(createdAt, 14) ? <span className="new">HOT</span> : ''}
                    <span className="control">
                        <span className="quantity">Quantity</span> <span onClick={this.buy} className="btn add" > + </span>
                        <input type="text" onChange={(val) => this.changeVal(val)} name="count" placeholder="Amount" value={this.state.count} />
                        {this.state.count ? <span onClick={this.del} className="btn dell" >  - </span> : ''}
                        <span className="price">{price + ' Lei'}</span>
                    </span>
                </article >
            </React.Fragment >
        )
    }
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
export default connect(mapStateToProps, mapDispatchToProps)(ItemDetail)