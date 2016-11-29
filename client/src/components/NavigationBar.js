import React from 'react'
import { Link } from 'react-router'
import { Glyphicon, Navbar, NavDropdown, MenuItem, Nav, NavItem } from 'react-bootstrap'

const NavigationBar = ({ router, isAuthenticated, displayName, avatar, handleLogout }) => {

  return (
    <Navbar fixedTop>
      <Navbar.Header>
        <Navbar.Brand>
          <Link to="/">
            <Glyphicon glyph="fire" aria-hidden="true" />
            Voting App
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle/>
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <Link to="/">{({ href, onClick }) => (
              <NavItem href={href} onClick={onClick} eventKey={1}> Home </NavItem>
            )
          }</Link>
          <Link to="/mypolls">{({ href, onClick }) => (
              <NavItem href={href} onClick={onClick} eventKey={2}> My Polls </NavItem>
            )
          }</Link>
          <Link to="/mypolls/results">{({ href, onClick }) => (
              <NavItem href={href} onClick={onClick} eventKey={3}> My Poll Results </NavItem>
            )
          }</Link>
        </Nav>

        <Nav pullRight>

          {isAuthenticated ? (
              <NavDropdown title={<span><img src={avatar} role="presentation"/>{displayName}</span>} eventKey={4} id="basic-nav-dropdown">
                {/* <MenuItem onSelect={() => { router.transitionTo('/profile') }} eventKey={3.1}> Profile </MenuItem> */}
                <MenuItem onSelect={() => { handleLogout().then( () => { router.transitionTo('/') }) }} eventKey={4.2}> Logout </MenuItem>
              </NavDropdown>
          ) : (
            <Link to="/login">{({ href, onClick }) => (
                <NavItem href={href} onClick={onClick} eventKey={3}> Login </NavItem>
              )
            }</Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default NavigationBar
