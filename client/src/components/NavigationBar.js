import React from 'react';
import Link from 'react-router/Link';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Navbar from 'react-bootstrap/lib/Navbar';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';

class NavigationBar extends React.Component {
  state = { expanded: false };

  toggle = () => {
    this.setState(prevState => ({ expanded: !prevState.expanded }));
  };

  close = () => {
    this.setState({ expanded: false });
  };

  render() {
    const {
      router,
      isAuthenticated,
      displayName,
      avatar,
      handleLogout,
    } = this.props;
    return (
      <Navbar
        fixedTop
        onToggle={this.toggle}
        expanded={this.state.expanded}
        collapseOnSelect
      >
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">
              <Glyphicon glyph="check" aria-hidden="true" />
              Voting App
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <Link to="/">
              {({ href, onClick }) => (
                <NavItem
                  href={href}
                  onClick={onClick}
                  onSelect={this.close}
                  eventKey={1}
                >
                  Home
                </NavItem>
              )}
            </Link>
            {isAuthenticated &&
              <Link to="/mypolls">
                {({ href, onClick }) => (
                  <NavItem
                    href={href}
                    onClick={onClick}
                    onSelect={this.close}
                    eventKey={2}
                  >
                    My Polls
                  </NavItem>
                )}
              </Link>}
            {isAuthenticated &&
              <Link to="/mypolls/results">
                {({ href, onClick }) => (
                  <NavItem
                    href={href}
                    onClick={onClick}
                    onSelect={this.close}
                    eventKey={3}
                  >
                    My Poll Results
                  </NavItem>
                )}
              </Link>}
          </Nav>
          <Nav pullRight>
            {isAuthenticated
              ? <NavDropdown
                  title={
                    <span>
                      <img src={avatar} role="presentation" />{displayName}
                    </span>
                  }
                  eventKey={4}
                  id="basic-nav-dropdown"
                >
                  {}
                  <MenuItem
                    onSelect={() => {
                      handleLogout().then(() => {
                        router.transitionTo('/');
                      });
                    }}
                    eventKey={4.2}
                  >
                    {' '}Logout{' '}
                  </MenuItem>
                </NavDropdown>
              : <Link to="/login">
                  {({ href, onClick }) => (
                    <NavItem
                      href={href}
                      onClick={onClick}
                      onSelect={this.close}
                      eventKey={3}
                    >
                      Login
                    </NavItem>
                  )}
                </Link>}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavigationBar;
