/* New Category page and functions */

import React from 'react';
import { connect } from 'react-redux'
import { ToastsStore } from 'react-toasts';
import uuid from 'react-uuid'
import { Redirect } from 'react-router-dom';
const config = require('./config.json')

class NewCat extends React.Component {
  //De facut in backend sa nu poti da submit fara categorie
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      description: '',
      redirect: '',
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
          options2.push(<option key={uuid()} value={i.id}>{i.name}</option>)
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
    const { name, description } = this.state
    e.preventDefault();
    if (name.length > 0 && description.length > 0) {
      const fileInput = document.querySelector('#itemPhoto');
      const formData = new FormData();
      formData.append('itemPhoto', fileInput.files[0]);
      formData.append('name', name);
      formData.append('description', description);
      const options = {
        method: 'POST',
        body: formData,
        // If you add this, upload won't work
        headers: {
          'Authorization': 'Bearer ' + this.props.token
        }
      };

      fetch(`${config.location}/new-category`, options)
        .then(resp => {
          if (resp.status === 200) {
            succes = true
          } else if (resp.status === 403) {
            ToastsStore.error('Unauthorized')
          }
          return resp.json()
        })
        .then(data => {
          if (succes) {
            if (data.status === 'Succes') {
              ToastsStore.success(data.description)
              this.setState({ redirect: data.id })
            } else {
              ToastsStore.error(data.description)
            }
          }
        });
    } else {
      ToastsStore.error("All input is required.")
    }
  }
  render() {
    return (
      <section className="NewCategory" >
        {this.state.redirect ? <Redirect to={'/category/' + this.state.redirect} /> : ''}
        <h2>New Category</h2>
        <article>
          <form className="fixed-width" onSubmit={this.formSubmit}>
            <input type="file" multiple name="itemPhoto" id="itemPhoto" />
            <input onInput={this.inputHandle} name="name" placeholder="Category name" type="text" />
            <br />
            <input onInput={this.inputHandle} name="description" placeholder="Category description" type="text" />
            <button className="inverted full">Create Category</button>
          </form>
        </article>
      </section>
    )
  }
}
const mapStateToProps = (state) => ({
  token: state.authReducer.token,
})
export default connect(mapStateToProps)(NewCat);
