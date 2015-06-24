import React, { Component } from "react"

import { Link } from "react-router"

import { DropdownButton, MenuItem, Navbar, Nav, NavItem } from "react-bootstrap"

import { MenuItemLink, NavItemLink } from "react-router-bootstrap"

class Header extends Component {

  render () {
    let authlink = localStorage.user ?
      <NavItemLink to="logout" eventKey={4}>Log Out</NavItemLink> :
      <NavItemLink to="login" eventKey={4}>Log In</NavItemLink>

    let dd = <DropdownButton eventKey={3} title="Dropdown">
      <MenuItemLink to="about" eventKey="1">{this.props.profileLinkName}</MenuItemLink>
      <MenuItemLink to="home" eventKey="2">{this.props.anotherProp}</MenuItemLink>
    </DropdownButton>

    return <Navbar brand={<Link to="home">Quoth</Link>} toggleNavKey={0}>
      <Nav right eventKey={0}>
        <NavItemLink to="home" eventKey={1}>Home</NavItemLink>
        <NavItemLink to="about" eventKey={2}>About</NavItemLink>
        <NavItemLink to="books" eventKey={3}>Books</NavItemLink>
        {authlink}
        <NavItemLink to="signup" eventKey={5}>Sign Up</NavItemLink>
      </Nav>
    </Navbar>
  }
}

export default Header
