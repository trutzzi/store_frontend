/* New Item page and functions */

import React from 'react';
import { connect } from 'react-redux'
import { Redirect } from "react-router-dom";
import { ToastsStore } from 'react-toasts';
import uuid from 'react-uuid'
import { GrAttachment } from "react-icons/gr";

const config = require('./config.json')

class NewItem extends React.Component {
  //De facut in backend sa nu poti da submit fara categorie
  // De facut sa dea si unlike (sterge fisierele de iamgini pentru item)
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      description: '',
      price: '',
      redirect: '',
      lastPrice: '',
      category_id: '',
      options: '',
    }
    this.inputHandle = this.inputHandle.bind(this)
    this.formSubmit = this.formSubmit.bind(this)
  }
  inputHandle(e) {
    let { name, value } = e.target
    this.setState({
      [name]: value
    })
  }
  componentDidMount() {
    let options2 = []
    fetch(`${config.location}/category`)
      .then(res => res.json())
      .then(data => {
        data.data.forEach(i => {
          options2.push(<option key={uuid()} value={i.catId}>{i.name}</option>)
        })
        this.setState({
          options: <select onChange={this.inputHandle} name="category_id">
            <option value='NA'>Select Category</option>
            {options2}
          </select>
        })
      })
  }
  formSubmit(e) {
    let succes = false
    const { name, description, price, lastPrice, category_id } = this.state
    e.preventDefault();
    if (name.length > 0 && description.length > 0 && price.length > 0 && category_id != 'NA' && category_id != '' && category_id != undefined) {
      const fileInput = document.querySelector('#itemPhoto');
      const formData = new FormData();
      const filelistToArray = Array.from(fileInput.files);
      filelistToArray.map(file => {
        formData.append('itemPhoto', file);
      })
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('lastPrice', lastPrice);
      formData.append('category_id', category_id);

      const options = {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'Bearer ' + this.props.token
        }
      };

      fetch(`${config.location}/new-item`, options)
        .then(resp => {
          if (resp.status === 200) {
            succes = true
          } else if (resp.status === 403) {
            ToastsStore.error('Forbidden')
          }
          return resp.json()
        })
        .then(data => {
          if (succes) {
            if (data.status === 'Succes') {
              ToastsStore.success(data.description)
              this.setState({ redirect: data.itemId })
            } else if (data.status === 'Error') {
              ToastsStore.error(data.description)
            }
          }
        })
    } else {
      ToastsStore.error("All input is required.")
    }
  }
  render() {
    return (
      <section className="New Product" >
        {this.state.redirect}
        {this.state.redirect ? <Redirect to={'/product/ ' + this.state.redirect} /> : ''}
        <h2>New Product</h2>
        <article>
          <form className="fixed-width" onSubmit={this.formSubmit}>
            <label htmlFor="itemPhoto" className="filePicker">
              <GrAttachment />
              <input type="file" multiple name="itemPhoto" id="itemPhoto" />
            </label>
            <input onInput={this.inputHandle} placeholder="Product name" name="name" multipleplaceholder="Product name" type="text" />
            <br />
            <input onInput={this.inputHandle} name="description" placeholder="Product description" type="text" />
            <br />
            <input onInput={this.inputHandle} name="price" placeholder="Product price" type="number" />
            <br />
            <input onInput={this.inputHandle} name="lastPrice" placeholder="Last price" type="number" />
            <br />
            {this.state.options}
            <button className="inverted full">New item</button>
          </form>
        </article>
      </section>
    )
  }
}
const mapStateToProps = (state) => ({
  token: state.authReducer.token,
})
export default connect(mapStateToProps)(NewItem);
