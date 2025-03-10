import React, { useEffect, useState } from "react";
import axiosInstance from "../../common/AxiosInstance";
import { Link } from "react-router-dom";
import { Button, styled, TableRow, TableHead, TableContainer, Paper, Table, TableBody, TableCell, tableCellClasses } from "@mui/material";

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
   "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
   "&:last-child td, &:last-child th": { border: 0 },
}));

const EnrolledCourses = () => {
   const [allEnrolledCourses, setAllEnrolledCourses] = useState([]);

   useEffect(() => {
      const fetchCourses = async () => {
         try {
            const res = await axiosInstance.get("/api/user/getallcoursesuser", {
               headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            if (res.data?.success && Array.isArray(res.data.data)) {
               setAllEnrolledCourses(res.data.data);
            }
         } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
         }
      };
      fetchCourses();
   }, []);

   return (
      <TableContainer component={Paper}>
         <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
               <TableRow>
                  <StyledTableCell>Course ID</StyledTableCell>
                  <StyledTableCell align="left">Course Name</StyledTableCell>
                  <StyledTableCell align="left">Course Educator</StyledTableCell>
                  <StyledTableCell align="left">Course Category</StyledTableCell>
                  <StyledTableCell align="left">Action</StyledTableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {allEnrolledCourses.length > 0 ? (
                  allEnrolledCourses.map((course) => (
                     <StyledTableRow key={course?._id || Math.random()}>
                        <StyledTableCell>{course?._id}</StyledTableCell>
                        <StyledTableCell>{course?.C_title}</StyledTableCell>
                        <StyledTableCell>{course?.C_educator}</StyledTableCell>
                        <StyledTableCell>{course?.C_categories}</StyledTableCell>
                        <StyledTableCell>
                           <Link to={`/courseSection/${course?._id}/${course?.C_title}`}>
                              <Button size="small" variant="contained" color="success">Go To</Button>
                           </Link>
                        </StyledTableCell>
                     </StyledTableRow>
                  ))
               ) : (
                  <StyledTableRow>
                     <StyledTableCell colSpan={5} align="center">Yet to be enrolled in any courses</StyledTableCell>
                  </StyledTableRow>
               )}
            </TableBody>
         </Table>
      </TableContainer>
   );
};

export default EnrolledCourses;
