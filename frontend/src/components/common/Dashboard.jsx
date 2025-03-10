import React, { useContext, useState, useEffect } from "react";
import NavBar from "../common/NavBar";
import { Container } from "react-bootstrap";
import AddCourse from "../user/teacher/AddCourse";
import StudentHome from "../user/student/StudentHome";
import AdminHome from "../admin/AdminHome";
import { UserContext } from "../../App";
import EnrolledCourses from "../user/student/EnrolledCourses";
import CourseContent from "../user/student/CourseContent";
import AllCourses from "../admin/AllCourses";
import UserHome from "./UserHome";
import TeacherHome from "../user/teacher/TeacherHome";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { userData, setUserData } = useContext(UserContext);
  const [selectedComponent, setSelectedComponent] = useState("home");
  const navigate = useNavigate();

  // Initialize user data from localStorage on first mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    } else {
      setUserData(null); // Ensure null is explicitly set if no user is found
    }
  }, [setUserData]);

  useEffect(() => {
    console.log("User Data in Dashboard:", userData);
    if (userData === null) {
      console.warn("No userData found, redirecting to login.");
      navigate("/login");
    }
  }, [userData, navigate]);

  useEffect(() => {
    console.log("Selected Component:", selectedComponent);
  }, [selectedComponent]);

  const renderSelectedComponent = () => {
    if (!userData) return null; // Prevents rendering before userData is set
  
    const userRole = userData?.type?.toLowerCase(); // Ensure case consistency
  
    switch (selectedComponent) {
      case "home":
        return userRole === "admin" ? (
          <AdminHome />
        ) : userRole === "teacher" ? (
          <TeacherHome />
        ) : (
          <StudentHome />
        );
      case "addcourse":
        return userRole === "teacher" ? <AddCourse /> : <UserHome />;
      case "enrolledcourses":
        return userRole === "student" ? <EnrolledCourses /> : <UserHome />;
      case "courseSection":
        return <CourseContent />;
      case "courses":
        return <AllCourses />;
      default:
        return <UserHome />;
    }
  };
  
  if (userData === undefined) {
    return <div>Loading...</div>; // Show a loader while checking userData
  }

  return (
    <>
      <NavBar setSelectedComponent={setSelectedComponent} />
      <Container className="my-3">{renderSelectedComponent()}</Container>
    </>
  );
};

export default Dashboard;
