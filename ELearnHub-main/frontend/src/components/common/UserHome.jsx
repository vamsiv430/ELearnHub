import React, { useContext } from 'react';
import { Container } from 'react-bootstrap';
import { UserContext } from "../../App";

import TeacherHome from '../user/teacher/TeacherHome';
import AdminHome from '../admin/AdminHome';
import StudentHome from '../user/student/StudentHome';

const UserHome = () => {
   const { userData } = useContext(UserContext); // Destructure userData to avoid redundancy

   if (!userData || !userData.type) {
      return <Container>Loading...</Container>; // Prevents errors when userData is not available
   }

   let content;
   switch (userData.type) {
      case "Teacher":
         content = <TeacherHome />;
         break;
      case "Admin":
         content = <AdminHome />;
         break;
      case "Student":
         content = <StudentHome />;
         break;
      default:
         content = <Container>User type not recognized.</Container>;
   }

   return <Container>{content}</Container>;
};

export default UserHome;
