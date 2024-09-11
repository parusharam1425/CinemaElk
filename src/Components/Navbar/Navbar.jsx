import React from 'react';
import { Button, Container, Navbar } from 'react-bootstrap';
import Logo from '../../assets/login.jpg';
import Avatar from '../../assets/cinemaElk.png'
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
            <img className='avatar' src={Avatar} alt="cinema ELk Avatar" />
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