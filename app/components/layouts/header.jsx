import React, { Component } from "react"

import { Link } from "react-router"

import { DropdownButton, MenuItem, Navbar, Nav, NavItem } from "react-bootstrap"

import { MenuItemLink, NavItemLink } from "react-router-bootstrap"

class Header extends Component {

  render () {

    let authlink = localStorage.user ?
      <DropdownButton eventKey={3} title={"Welcome, " + JSON.parse(localStorage.user).username}>
        <MenuItemLink to="logout" eventKey="1">Sign Out</MenuItemLink>
      </DropdownButton> :
      <DropdownButton eventKey={3} title="Sign In or Up">
        <MenuItemLink to="login" eventKey="1">Sign In</MenuItemLink>
        <MenuItemLink to="signup" eventKey="2">Sign Up</MenuItemLink>
      </DropdownButton>

    let bookslink = localStorage.user ?
      <NavItemLink to="books" eventKey={3}>Books</NavItemLink> :
      undefined

    let dd = <DropdownButton eventKey={3} title="Dropdown">
      <MenuItemLink to="login" eventKey="1">{this.props.profileLinkName}</MenuItemLink>
      <MenuItemLink to="home" eventKey="2">{this.props.anotherProp}</MenuItemLink>
    </DropdownButton>

    return <Navbar brand={<Link to="home">Quoth</Link>} toggleNavKey={0}>
      <Nav right eventKey={0}>
        <NavItemLink to="home" eventKey={1}>Home</NavItemLink>
        <NavItemLink to="about" eventKey={2}>About</NavItemLink>
        {bookslink}
        {authlink}
      </Nav>
    </Navbar>
  }
}

export default Header
