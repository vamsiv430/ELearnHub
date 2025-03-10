import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Nav, Button, Navbar } from 'react-bootstrap';
import AllCourses from './AllCourses';

const Home = () => {
   return (
      <>
         <Navbar expand="lg" style={{ backgroundColor: '#ffffff' }}>
            <Container fluid>
               <Navbar.Brand>
                  <h2 style={{ color: '#007bff', fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>LearnHub</h2>
               </Navbar.Brand>
               <Navbar.Toggle aria-controls="navbarScroll" />
               <Navbar.Collapse id="navbarScroll">
                  <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
                  </Nav>
                  <Nav>
                     <Link to={'/'}><Button variant='primary' className='m-2'>Home</Button></Link>
                     <Link to={'/login'}><Button variant='primary' className='m-2'>Login</Button></Link>
                     <Link to={'/register'}><Button variant='primary' className='m-2'>Register</Button></Link>
                  </Nav>
               </Navbar.Collapse>
            </Container>
         </Navbar>

         <div id='home-container' className='first-container'>
            <div className="content-home">
               <p style={{ color: '#ffffff', fontWeight: 'bold' }}>
                  Empower Your Learning, Anytime, Anywhere. Discover, Connect, and Grow with LearnHub
               </p>
               <Link to={'/register'}><Button variant='warning' className='m-2' size='md'>Explore Courses</Button></Link>
            </div>
         </div>

         <Container className="second-container" style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px' }}>
            <h2 className="text-center my-4" style={{ color: '#007bff', fontWeight: 'bold' }}>Trending Courses</h2>
            <AllCourses />
         </Container>
      </>
   )
}

export default Home;
