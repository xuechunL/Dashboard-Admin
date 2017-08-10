import React, { Component } from 'react'
import { Nav, Navbar, NavItem } from 'react-bootstrap'
import PropTypes from 'prop-types'

import './Header.css'

const propTypes = {
  selectedKey: PropTypes.number,
}

class Header extends Component {
  handleSelect (selectedKey) {
    location.href = selectedKey === 2 ? '/job/list' : '/'
  }
  render () {
    return (
      <section className="header">
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/">Wormhole Admin</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav activeKey={this.props.selectedKey} onSelect={this.handleSelect}>
              <NavItem eventKey={1} className="link" href="/">
                <i className="fa fa-database">{''}</i>&nbsp;&nbsp;Datasoueces
              </NavItem>
              <NavItem eventKey={2} className="link" href="/job/list">
                <i className="fa fa-tasks">{''}</i>&nbsp;&nbsp;Jobs
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </section>
    )
  }
}

Header.propTypes = propTypes

export default Header
