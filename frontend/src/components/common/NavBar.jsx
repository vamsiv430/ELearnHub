import React, { useContext } from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { UserContext } from "../../App";

const NavBar = ({ setSelectedComponent }) => {
   const { userData } = useContext(UserContext);

   if (!userData) {
      return null;
   }

   const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/"; // Ensure a full refresh to clear state
   };

   console.log("User Type:", userData.type);

   return (
      <Navbar expand="lg" className="bg-body-tertiary">
         <Container fluid>
            <Navbar.Brand>
               <h2 style={{ color: '#007bff', fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>LearnHub</h2>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
               <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>

                  {/* ✅ FIX: Replace NavLink with button for Home */}
                  <button className="btn btn-primary m-2" onClick={() => setSelectedComponent("home")}>
                     Home
                  </button>

                  {userData.type === 'Teacher' && (
                     <button className="btn btn-primary m-2" onClick={() => setSelectedComponent("addcourse")}>
                        Add Course
                     </button>
                  )}

                  {userData.type === 'Admin' && (
                     <button className="btn btn-primary m-2" onClick={() => setSelectedComponent("courses")}>
                        Courses
                     </button>
                  )}

                  {userData.type === 'Student' && (
                     <button className="btn btn-primary m-2" onClick={() => setSelectedComponent("enrolledcourses")}>
                        Enrolled Courses
                     </button>
                  )}
               </Nav>
               <Nav>
                  <h5 className='mx-3'>Hi {userData.name}</h5>
                  <Button onClick={handleLogout} size='sm' variant='outline-danger'>Log Out</Button>
               </Nav>
            </Navbar.Collapse>
         </Container>
      </Navbar>
   );
};

export default NavBar;
