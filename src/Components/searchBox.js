import { GrFormSearch } from "react-icons/gr";
import uuid from 'react-uuid'
import React from 'react';
const config = require('../config.json')
class SearchBox extends React.Component {
    constructor() {
        super();
        this.state = {
            search: [],
            renderSearchResults: []
        }
    }
    searchF() {
        fetch(`${config.location}/search/${this.state.search}`)
            .then(res => res.json())
            .then(data => {
                var temp = [];
                data.data.map(item => {
                    return temp.push(<li key={uuid()}><a href={`/product/${item.id}`}>{item.name}</a></li>)
                })
                this.setState({
                    renderSearchResults: temp
                })
            })
            .catch(e => console.log(e))
    }
    searchHandler(e) {
        let value = e.target.value
        this.setState({ search: value }, () => {
            this.searchF()
        })
    }
    render() {
        return (
            <div className="search-box">
                <input type="text" onInput={(e) => this.searchHandler(e)} placeholder="Search products" />
                <button><GrFormSearch /></button>
                {this.state.renderSearchResults.length ? <div className="results">
                    <ul>{this.state.renderSearchResults}</ul>
                </div> : ''}
            </div>
        )
    }
}

export default SearchBox;
