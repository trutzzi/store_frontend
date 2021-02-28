/* Login Page and functions */

import React from 'react';
import { ToastsStore } from 'react-toasts';
import { connect } from 'react-redux'
import { setToken, setUser } from './Redux/authActions'
const config = require('./config.json')

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: ''
        }
    }
    render() {
        return (
            <section className="Login" >
                <h2>Login</h2>
                <article>
                    <div className="grid">
                        <div className="grid__col grid__col--1-of-2">
                            <form onSubmit={(e) => this.loginDo(e)} className="fixed-width">
                                <input name="username" placeholder="Your email" onInput={(e) => this.InputHandle(e)} type="text" />
                                <br />
                                <input name="password" placeholder="Your password" onInput={(e) => this.InputHandle(e)} type="password" />
                                <br />
                                <button className="btn--inverted">Log-in</button>
                                <a href="/signup" className="btn">Sign up</a>
                            </form>
                        </div>
                        <div className="grid__col grid__col--1-of-2">
                            <div>
                                <h3>Hello, stranger</h3>
                                <p>Login to your account or create one <a href="/signup">here.</a></p>
                            </div>
                        </div>
                    </div>
                </article>
            </section >
        )
    }
    loginDo(e) {
        const { setToken, setUser } = this.props
        e.preventDefault()
        let { username, password } = this.state
        if (username.length > 0 && password.length > 0) {
            fetch(`${config.location}/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'mode': 'no-cors'
                    },
                    body: JSON.stringify({
                        username,
                        password
                    })
                })
                .then(res => {
                    if (res.status === 403) {
                        ToastsStore.error('Invalide username or password')
                        return
                    } else if (res.status === 200) {
                        return res.json()
                    }
                })
                .then(data => {
                    let globUser = null;
                    if (typeof data !== 'undefined') {
                        setToken(data)
                        fetch(`${config.location}/user`,
                            {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + data.accessToken,
                                    'mode': 'no-cors'
                                },
                            }
                        )
                            .then(res => res.json())
                            .then(user => {
                                const { id, username, email, admin_role, country, state, address, phone } = user.data[0];
                                globUser = username
                                setUser(id, username, email, admin_role, country, state, address, phone);
                            })
                        ToastsStore.success('Autentification successfully')
                    }
                })
                .catch(error => {
                    ToastsStore.error('I can\'t reach the API')
                })
        } else {
            ToastsStore.warning('Insert username and password...')
        }
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
        setUser: (id, username, email, admin_role, country, state, address, phone) => dispatch(setUser(id, username, email, admin_role, country, state, address, phone))
    }
}
export default connect(null, mapDispatchToProps)(Login);