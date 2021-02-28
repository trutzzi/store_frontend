/* Signup page template*/

import React from 'react';
import { ToastsStore } from 'react-toasts';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { setToken, setUser } from './Redux/authActions'
const config = require('./config.json')

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            succes: false,
            email: '',
            country: '',
            state: '',
            address: '',
            phone: '',

        }
        this.InputHandle = this.InputHandle.bind(this)
        this.signUp = this.signUp.bind(this)
    }
    signUp(e) {
        let succes = false
        e.preventDefault()
        let { username, password, email, country, state, address, phone } = this.state
        if (username.length > 0 && password.length >= 6 && email.length > 0 && country.length > 0 && state.length > 0 && address.length > 0 && phone.length > 0) {
            fetch(`${config.location}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "username": username,
                    "email": email,
                    "country": country,
                    "state": state,
                    "address": address,
                    "phone": phone,
                    "password": password
                })
            }
            ).then(res => {
                console.log(res)
                if (res.status === 411) {
                    ToastsStore.warning('Please fill all the required fields.')
                } else if (res.status === 200) {
                    this.setState({ succes: true })
                    succes = true
                }
                return res.json()
            })
                .then(data => {
                    if (succes) {
                        if (data.status === "Error") {
                            ToastsStore.error(data.description)
                        } else if (data.status === 'Succes') {
                            console.log(data)
                            ToastsStore.success(data.data.username + ', your account has been created.');
                        }
                    }
                }
                )
                .catch(error => {
                    ToastsStore.error('I can\'t reach the API')
                    console.log(error)
                })
        } else {
            ToastsStore.warning('Please fill all the required fields.')
        }
    }
    render() {
        return (
            <React.Fragment>
                <h2>Sign up</h2>
                <section className="Login" >
                    {this.state.succes ? < Redirect to="/" /> : ''}
                    <article>
                        <form onSubmit={this.signUp} className="fixed-width">
                            <h3>User information</h3>
                            <input name="username" placeholder="Your username" onInput={this.InputHandle} type="text" />
                            <input name="email" placeholder="Your email" onInput={this.InputHandle} type="text" />
                            <input name="password" placeholder="Your password" onInput={this.InputHandle} type="password" />
                            <h3>Address billing</h3>
                            email, state, contry, address, phone
                            <input type="text" onInput={this.InputHandle} name="country" placeholder="Country" />
                            <input type="text" onInput={this.InputHandle} name="state" placeholder="State" />
                            <input type="text" onInput={this.InputHandle} name="address" placeholder="Address" />
                            <input type="text" onInput={this.InputHandle} name="phone" placeholder="Phone" />
                            <button className="btn btn--inverted">Sign up</button>
                        </form>
                    </article>
                </section>
            </React.Fragment >
        )
    }
    InputHandle(e) {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        setToken: token => dispatch(setToken(token)),
        setUser: (id, username, email, admin_role) => dispatch(setUser(id, username, email, admin_role))
    }
}
export default connect(null, mapDispatchToProps)(Login);