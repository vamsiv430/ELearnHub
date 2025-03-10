import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axiosInstance from './AxiosInstance';
import Dropdown from 'react-bootstrap/Dropdown';

const Register = () => {
   const navigate = useNavigate();
   const [selectedOption, setSelectedOption] = useState('Select User');
   const [data, setData] = useState({
      name: "",
      email: "",
      password: "",
      type: "",
   });

   const handleSelect = (eventKey) => {
      setSelectedOption(eventKey);
      setData({ ...data, type: eventKey });
   };

   const handleChange = (e) => {
      const { name, value } = e.target;
      setData({ ...data, [name]: value });
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      if (!data?.name || !data?.email || !data?.password || !data?.type) return alert("Please fill all fields");
      else {
         axiosInstance.post('/api/user/register', data)
            .then((response) => {
               if (response.data.success) {
                  alert(response.data.message);
                  navigate('/login');
               } else {
                  console.log(response.data.message);
               }
            })
            .catch((error) => {
               console.log("Error", error);
            });
      }
   };

   return (
      <>
         {/* Consistent Navbar */}
         <Navbar expand="lg" style={{ backgroundColor: '#ffffff' }}>
            <Container fluid>
               <Navbar.Brand>
                  <h2 style={{ color: '#007bff', fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>LearnHub</h2>
               </Navbar.Brand>
               <Navbar.Toggle aria-controls="navbarScroll" />
               <Navbar.Collapse id="navbarScroll">
                  <Nav className="me-auto my-2 my-lg-0" navbarScroll></Nav>
                  <Nav>
                     <Link to={'/'}><Button variant='primary' className='m-2'>Home</Button></Link>
                     <Link to={'/login'}><Button variant='primary' className='m-2'>Login</Button></Link>
                     <Link to={'/register'}><Button variant='primary' className='m-2'>Register</Button></Link>
                  </Nav>
               </Navbar.Collapse>
            </Container>
         </Navbar>

         {/* Register Form */}
         <div className="first-container">
            <Container component="main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
               <Box
                  sx={{
                     marginTop: 8,
                     marginBottom: 4,
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: 'center',
                     padding: '20px',
                     background: '#f8f9fa',
                     border: '1px solid lightblue',
                     borderRadius: '10px',
                     boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
                  }}
               >
                  <Avatar sx={{ bgcolor: 'secondary.main' }}></Avatar>
                  <Typography component="h1" variant="h5" style={{ fontWeight: 'bold', color: '#007bff' }}>
                     Register
                  </Typography>
                  <Box component="form" onSubmit={handleSubmit} noValidate>
                     <TextField
                        margin="normal"
                        fullWidth
                        id="name"
                        label="Full Name"
                        name="name"
                        value={data.name}
                        onChange={handleChange}
                        autoComplete="name"
                        autoFocus
                     />
                     <TextField
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        autoComplete="email"
                     />
                     <TextField
                        margin="normal"
                        fullWidth
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                     />
                     <Dropdown className='my-3'>
                        <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
                           {selectedOption}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                           <Dropdown.Item onClick={() => handleSelect("Student")}>Student</Dropdown.Item>
                           <Dropdown.Item onClick={() => handleSelect("Teacher")}>Teacher</Dropdown.Item>
                        </Dropdown.Menu>
                     </Dropdown>
                     <Box mt={2}>
                        <Button
                           type="submit"
                           variant="contained"
                           sx={{ mt: 3, mb: 2 }}
                           style={{ width: '200px', backgroundColor: '#007bff', color: 'white' }}
                        >
                           Sign Up
                        </Button>
                     </Box>
                     <Grid container>
                        <Grid item>Have an account?
                           <Link style={{ color: "#007bff", fontWeight: 'bold', marginLeft: '5px' }} to={'/login'}>
                              Sign In
                           </Link>
                        </Grid>
                     </Grid>
                  </Box>
               </Box>
            </Container>
         </div>
      </>
   );
};

export default Register;
