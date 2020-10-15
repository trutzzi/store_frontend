/* Category page */

import React from 'react';
import Item from './Components/Item'
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';
import { useState } from 'react';
import { ToastsStore } from 'react-toasts'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
const config = require('./config.json')

function GetCategory(props) {
    const { id } = props.match.params
    const [redirect, setRedirect] = useState(false)
    const deleteFunction = () => {
        var safe = window.confirm("Are you sure you want to permanently delete this category?");
        if (safe) {
            const options = {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + props.token
                }
            };
            fetch(`${config.location}/del-cat/${id}`, options)
                .then(resp => {
                    if (resp.status === 200) {
                        return resp.json()
                    } else if (resp.status === 403) {
                        ToastsStore.error('Unauthorized')
                    }
                })
                .then(data => {
                    if (data.status == "Error") {
                        ToastsStore.error(data.description)
                    } else if (data.status == "Succes") {
                        ToastsStore.success('Category with id ' + data.id + ' was deleted.')
                        setRedirect(true)
                    }
                })
        }
    }
    let renderItem = []
    const [renderItems, setRenderItems] = useState([])
    const [categoryName, setName] = useState([])

    useEffect(() => {
        fetch(`${config.location}/shop/cat/${id}`)
            .then(res => res.json())
            .then(data => {
                for (let key in data.data) {
                    renderItem.push(<Item key={uuidv4()} data={data.data[key]} />)
                }
                setRenderItems(renderItem)
            })
        fetch(`${config.location}/category/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.data.length > 0) {
                    for (let key in data) {
                        if (data[key].id = id) {
                            setName(data[key][0].name)
                        }
                    }
                    setRenderItems(renderItem)
                } else {
                    setName('This category does not exist')
                }
            })
    }, [id])
    return (
        <React.Fragment>
            {
                props.admin_role ?
                    <div className="item-detail_toggle-edit">
                        <button className="btn" onClick={deleteFunction}>Delete category</button>
                    </div> : ''
            }
            < section className="category" >
                {redirect ? <Redirect to='/' /> : ''
                }
                <h2>{categoryName}</h2>
                <article>
                    {renderItems.length <= 0 && <p className="info">This category is empty.</p>}
                    {renderItems}
                </article>
            </section >
        </React.Fragment>
    )
}

const mapStateToProps = (state) => ({
    token: state.authReducer.token,
    admin_role: state.authReducer.admin_role,
})

export default connect(mapStateToProps)(GetCategory);
