/* Main app functions */

import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect, Link } from "react-router-dom";
import { connect } from 'react-redux';
import { GrClose, GrMenu, GrCart } from "react-icons/gr";
import { ToastsContainer, ToastsStore } from 'react-toasts';
import Navigation from './Components/Navigation.js'
import Product from './Product';
import Login from './Login';
import Signup from './Signup'
import NewItem from './NewItem';
import Checkout from './Checkout';
import Home from './Home';
import { setToken, resetToken } from './Redux/authActions';
import GetCategory from './Category';
import NewCat from './Newcat'
import Logout from "./Logout";
import SearchBox from './Components/searchBox.js';
const config = require('./config.json')
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      toggleMobile: true,
      year: new Date().getFullYear(),
      tokenTime: Number(config.tokenTime),
      //Miliseconds must be same in BACKEND API
      adm_visible: false,
    }
    this.toggleMobile = this.toggleMobile.bind(this)
    this.toggleAdminMenu = this.toggleAdminMenu.bind(this)
  }
  showChart() {
    this.setState(prevState => ({
      shoppingToggle: !prevState.shoppingToggle
    }))
  }
  toggleMobile() {
    this.setState(prevState => ({
      toggleMobile: !prevState.toggleMobile
    }))
  }
  toggleAdminMenu() {
    this.setState(prevState => ({
      adm_visible: !prevState.adm_visible
    }))
  }
  renderMenuAuthWithRole() {
    if (this.props.username) {
      if (this.props.admin_role === 1) {
        return (
          <React.Fragment>
            <div className="mini-menu_member">
              <div className="nav-member">
                <a onClick={this.toggleAdminMenu} href="#">Admin</a>
                <ul className={this.state.adm_visible ? '' : 'js--hidden'}>
                  <li>
                    <Link onClick={this.toggleAdminMenu} to="/new">New Item</Link>
                  </li>
                  <li>
                    <Link onClick={this.toggleAdminMenu} to="/newCategory">New Category</Link>
                  </li>
                </ul>
              </div>
            </div>
            <Link to="/logout">Logout</Link>
          </React.Fragment >
        )
      } else {
        return (
          <React.Fragment>
            <Link to="/logout">Logout</Link>
          </React.Fragment>
        )
      }
    } else {
      return (
        <React.Fragment>
          <Link to="/login">Login</Link>
        </React.Fragment>
      )
    }
  }
  componentDidMount() {
    const { newToken } = this.props
    this.timer = setInterval(
      () => {
        if (this.props.username) {
          console.log('Trying to refresh token')
          fetch(`${config.location}/token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'mode': 'no-cors'
            },
            body: JSON.stringify({
              token: this.props.refreshToken
            })
          }).then(res => res.json())
            .then(data => {
              newToken(data.accessToken)
            })
            .catch(e => {
              console.log('Error fetch api');
              console.log(e)
            })
        }
      },
      this.state.tokenTime,
    );
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <div className="App" >
        <ToastsContainer store={ToastsStore} />
        <Router>
          <header className="App-header">
            <div className="mini-menu">
              <div className="container">
                <span className="mini-menu_user">{this.props.username ? this.props.username : 'Stranger'}</span>
                {this.renderMenuAuthWithRole()}
                <Link to="/checkout">Checkout</Link>
              </div>
            </div>
            <div className="header-top">
              <div className="container">
                <div className="logo">
                  <a href="/"><h1>Shopper<span className="customColor"></span></h1></a>
                </div>
                <div className="toggleMobile" onClick={this.toggleMobile}>
                  {this.state.toggleMobile ? <GrMenu /> : <GrClose />}
                </div>
                <div className={this.state.toggleMobile ? 'layout-mobile' : 'layout-mobile js--hidden'}>
                  <Navigation />
                  <SearchBox searchAction={this.searchHandler} searchResults={this.state.renderSearchResults} />
                </div>
                <div className="navigation--desktop">
                  {/* De gasit o modalitate prin a seta bannerul  */}
                  <Navigation />
                </div>
                <SearchBox searchAction={this.searchHandler} searchResults={this.state.renderSearchResults} />
                <div className="header-member">
                  <a href="/checkout"><div className="chart">
                    <GrCart />
                    <span className="chart-notif">{this.props.chart.length}</span>
                  </div></a>
                  {this.props.username ? '' : <Link className="btn cta" to='/login'>Sign in</Link>}
                </div>
              </div>
            </div>
          </header>
          <div className="banner">
            <Switch>
              <Route exact path="/">
                <div className="container">

                  <div className="box">
                    <p className="info1">75% Discount</p>
                    <h2>New Products</h2>
                    <p className="info2">Best of the Collection</p>
                    <div className="btn cta">Shop now</div>
                  </div>
                </div>
              </Route>
              <Route exact path="/new">
                <div className="container container--small">

                  <div className="box">
                    {/* <p className="info1"></p> */}
                    <h2>New item</h2>
                    <p className="info2">Create new item</p>
                    {/* <div className="btn cta">BTN EXEMPLE</div> */}
                  </div>
                </div>
              </Route>
              <Route exact path="/newCategory">
                <div className="container container--small">

                  <div className="box">
                    {/* <p className="info1"></p> */}
                    <h2>New Category</h2>
                    <p className="info2">Create category</p>
                    {/* <div className="btn cta">BTN EXEMPLE</div> */}
                  </div>
                </div>
              </Route>
              <Route exact path="/category/:id">
                <div className="container container--small">

                  <div className="box">
                    {/* <p className="info1"></p> */}
                    <h2>Product Category</h2>
                    {/* <p className="info2"></p> */}
                    {/* <div className="btn cta">BTN EXEMPLE</div> */}
                  </div>
                </div>
              </Route>
              <Route exact path="/checkout/">
                <div className="container container--small">

                  <div className="box">
                    {/* <p className="info1"></p> */}
                    <h2>Your Chart</h2>
                    <p className="info2">Items in your chart</p>
                    {/* <div className="btn cta">BTN EXEMPLE</div> */}
                  </div>
                </div>
              </Route>
              <Route exact path="/product/:id">
                <div className="container container--small">

                  <div className="box">
                    {/* <p className="info1"></p> */}
                    <h2>Product </h2>
                    <p className="info2">Product Details</p>
                    {/* <div className="btn cta">BTN EXEMPLE</div> */}
                  </div>
                </div>
              </Route>
            </Switch>
          </div>
          <main>
            <div className="container">
              {this.props.errorFetch ? 'Error fetching API' : ''}
              {this.props.errorLoad ? 'Loading' : ''}
              <Switch>
                <Route exact component={Home} path="/"></Route>
                {this.props.admin_role === 1 ? <Route exact component={NewItem} path="/new"></Route> : < Redirect from="/new" to="/" />}
                {this.props.admin_role === 1 ? <Route exact component={NewCat} path="/newCategory"></Route> : < Redirect from="/newCategory" to="/" />}
                <Route exact component={Product} path="/product/:id"></Route>
                <Route exact component={Signup} path="/signup"></Route>
                <Route exact component={GetCategory} path="/category/:id/"></Route>
                {this.props.username ? < Redirect from='/login/' to="/" /> : <Route exact component={Login} path="/login"></Route>}
                <Route exact component={Logout} path="/logout"></Route>
                <Route exact path="/checkout" component={Checkout}>
                </Route>
              </Switch>
            </div>
          </main>
        </Router>
        <footer>
          <div className="container">
            <p className="copyright">
              Copyright © {this.state.year}
            </p>
          </div>
        </footer>
      </div >
    );
  }
}
const mapDispatchToProps = dispatch => {
  return {
    setToken: token => dispatch(setToken(token)),
    newToken: token => dispatch(resetToken(token))
  }
}
const mapStateToProps = (state) => {
  return {
    admin_role: state.authReducer.admin_role,
    token: state.authReducer.token,
    refreshToken: state.authReducer.refreshToken,
    username: state.authReducer.username,
    chart: state.checkoutReducer.itemsPurchased
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
