import React, { Component } from "react"

import { Link } from "react-router"

import { DropdownButton, MenuItem, Navbar, Nav, NavItem } from "react-bootstrap"

import { MenuItemLink, NavItemLink } from "react-router-bootstrap"

class Header extends Component {

  render () {
    let dd = <DropdownButton eventKey={3} title="Dropdown">
      <MenuItemLink to="about" eventKey="1">{this.props.profileLinkName}</MenuItemLink>
      <MenuItemLink to="home" eventKey="2">{this.props.anotherProp}</MenuItemLink>
    </DropdownButton>

    return <Navbar brand={<Link to="home">Quoth</Link>} toggleNavKey={0}>
      <Nav right eventKey={0}>
        <NavItemLink to="home" eventKey={1} href="#">Home</NavItemLink>
        <NavItemLink to="about" eventKey={2} href="#">About</NavItemLink>
        <NavItemLink to="books" eventKey={3} href="#">Books</NavItemLink>
        <NavItemLink to="signup" eventKey={4} href="#">Sign Up</NavItemLink>
      </Nav>
    </Navbar>
  }
}

export default Header
