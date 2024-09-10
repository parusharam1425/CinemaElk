import React from 'react';
import { Button, Container, Navbar } from 'react-bootstrap';
import Logo from '../../assets/login.jpg';
import './Navbar.css'
import { useNavigate } from 'react-router-dom';

function NavbarHome({handleLogout}) {
  const navigate = useNavigate()
  return (
    <div>
        <Navbar className="navbar fixed-top">
        <Container fluid>
          <Navbar.Brand className="navbar-brand">
            <img src={Logo} alt="Cinema Elk Logo" />
            <span>Cinema Elk</span>
          </Navbar.Brand>
          <Button className="logout-button" onClick={handleLogout}>
            Logout
          </Button>
        </Container>
      </Navbar>
      {/* <div className="sidebar-container"> */}
     
    </div>
    
  )
}

export default NavbarHome