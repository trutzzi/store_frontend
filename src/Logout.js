/* Logout page, functions and redirect */

import React, { useEffect } from 'react';
import { ToastsStore } from 'react-toasts';
import { connect } from 'react-redux'
import { doLogOut, setUser } from './Redux/authActions'
import { useHistory } from "react-router-dom";
const config = require('./config.json')

function Logout(props) {
    const history = useHistory();
    useEffect(() => {
        fetch(`${config.location}/logout`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'mode': 'no-cors'
                },
                body: JSON.stringify({
                    token: props.refreshToken
                })
            }).then(res => {
                if (res.status === 200) {
                    props.setUser(null, null, null, null);
                    props.doLogOut()
                    history.push("/login");
                } else {
                }
                return res.json()
            })
    }, [])
    return (
        <section className="Logout" >
            <h2>Logout</h2>
            <p>You will be redirected to login</p>
        </section>
    )
}
const mapDispatchToProps = (dispatch) => {
    return {
        doLogOut: () => dispatch(doLogOut()),
        setUser: (id, username, email, admin_role) => dispatch(setUser(id, username, email, admin_role))
    }
}
export default connect(null, mapDispatchToProps)(Logout);