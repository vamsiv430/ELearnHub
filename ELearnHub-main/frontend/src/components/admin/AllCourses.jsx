import React, { useState, useEffect } from 'react'
import { Button, styled, TableRow, TableHead, TableContainer, Paper, Table, TableBody, TableCell, tableCellClasses } from '@mui/material'
import axiosInstance from '../common/AxiosInstance'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
   [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
   },
   [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
   },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
   '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
   },
   '&:last-child td, &:last-child th': {
      border: 0,
   },
}));

const AllCourses = () => {
   const [allCourses, setAllCourses] = useState([])

   const allCoursesList = async () => {
      try {
         const res = await axiosInstance.get('/api/admin/getallcourses', {
            headers: {
               Authorization: `Bearer ${localStorage.getItem("token")}`
            }
         })
         if (res.data.success) {
            setAllCourses(res.data.data)
         } else {
            alert(res.data.message)
         }
      } catch (error) {
         console.log(error);
      }
   }

   useEffect(() => {
      allCoursesList()
   }, [])

   const deleteCourse = async (courseId) => {
      const confirmation = window.confirm('Are you sure you want to delete?')
      if (!confirmation) return;
      
      try {
         const res = await axiosInstance.delete(`/api/user/deletecourse/${courseId}`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         })
         if (res.data.success) {
            alert(res.data.message)
            allCoursesList()
         } else {
            alert("Failed to delete the course")
         }
      } catch (error) {
         console.log('An error occurred:', error);
      }
   }

   return (
      <TableContainer component={Paper}>
         <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
               <TableRow>
                  <StyledTableCell>Course ID</StyledTableCell>
                  <StyledTableCell align="center">Course Name</StyledTableCell>
                  <StyledTableCell align="center">Course Educator</StyledTableCell>
                  <StyledTableCell align="center">Course Category</StyledTableCell>
                  <StyledTableCell align="center">Course Price</StyledTableCell>
                  <StyledTableCell align="center">Course Sections</StyledTableCell>
                  <StyledTableCell align="center">Enrolled Students</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {allCourses.length > 0 ? (
                  allCourses.map((Course) => (
                     <StyledTableRow key={Course._id}>
                        <StyledTableCell component="th" scope="row">{Course._id}</StyledTableCell>
                        <StyledTableCell align="center">{Course.C_title}</StyledTableCell>
                        <StyledTableCell align="center">{Course.C_educator}</StyledTableCell>
                        <StyledTableCell align="center">{Course.C_categories}</StyledTableCell>
                        <StyledTableCell align="center">{Course.C_price}</StyledTableCell>
                        <StyledTableCell align="center">{Course.sections.length}</StyledTableCell>
                        <StyledTableCell align="center">{Course.enrolled}</StyledTableCell>
                        <StyledTableCell align="center">
                           <Button onClick={() => deleteCourse(Course._id)} size='small' color="error">Delete</Button>
                        </StyledTableCell>
                     </StyledTableRow>
                  ))
               ) : (
                  <StyledTableRow>
                     <StyledTableCell colSpan={8} align="center">No courses found</StyledTableCell>
                  </StyledTableRow>
               )}
            </TableBody>
         </Table>
      </TableContainer>
   )
}

export default AllCourses
