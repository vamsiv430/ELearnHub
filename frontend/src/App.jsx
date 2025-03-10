import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, createContext } from "react";

import "./App.css";
import Home from "./components/common/Home";
import Login from "./components/common/Login";
import Register from "./components/common/Register";
import Dashboard from "./components/common/Dashboard";
import CourseContent from "./components/user/student/CourseContent";

export const UserContext = createContext();

function App() {
  const date = new Date().getFullYear();
  const [userData, setUserData] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const getData = () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        console.log("Retrieved user from localStorage:", user);

        if (user && typeof user.role === "string" && user.role.trim() !== "") {
          console.log("Valid user role detected:", user.role);
          setUserData(user);
          setUserLoggedIn(true);
        } else {
          console.warn("No valid user role found, resetting state.");
          localStorage.removeItem("user");
          setUserData(null);
          setUserLoggedIn(false);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUserData(null);
        setUserLoggedIn(false);
      }
    };
    getData();
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData, userLoggedIn, setUserLoggedIn }}>
      <div className="App">
        <Router>
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={userLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />} />
              <Route path="/courseSection/:courseId/:courseTitle" element={userLoggedIn ? <CourseContent /> : <Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to={userLoggedIn ? "/dashboard" : "/login"} replace />} />
            </Routes>
          </div>
          <footer className="bg-light text-center text-lg-start">
            <div className="text-center p-3">
              © {date} Copyright: LearnHub
            </div>
          </footer>
        </Router>
      </div>
    </UserContext.Provider>
  );
}

export default App;