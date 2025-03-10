import React, { useEffect, useState } from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import axiosInstance from '../../common/AxiosInstance';



const TeacherHome = () => {
   const [allCourses, setAllCourses] = useState([]);

   const getAllCoursesUser = async () => {
      try {
         const res = await axiosInstance.get(`api/user/getallcoursesteacher`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         });
         if (res.data.success) {
            setAllCourses(res.data.data);
         }
      } catch (error) {
         console.log('An error occurred:', error);
      }
   };

   useEffect(() => {
      getAllCoursesUser();
   }, []);

   const toggleDescription = (courseId) => {
      setAllCourses((prevCourses) =>
         prevCourses.map((course) =>
            course._id === courseId
               ? { ...course, showFullDescription: !course.showFullDescription }
               : course
         )
      );
   };

   const deleteCourse = async (courseId) => {
      const confirmation = confirm('Are you sure you want to delete');
      if (!confirmation) {
         return;
      }
      try {
         const res = await axiosInstance.delete(`api/user/deletecourse/${courseId}`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         });
         if (res.data.success) {
            alert(res.data.message);
            getAllCoursesUser();
         } else {
            alert('Failed to delete the course');
         }
      } catch (error) {
         console.log('An error occurred:', error);
      }
   };

   return (
      <Container className='card-container'>
         {allCourses?.length > 0 ? (
            allCourses.map((course) => (
               <Card key={course._id} className='card'>
                  <Card.Body>
                     <Card.Title>{course.C_title}</Card.Title>
                     <div>
                        <strong>Description: </strong>
                        {course.showFullDescription
                           ? course.C_description
                           : course.C_description.slice(0, 10)}{' '}
                        {course.C_description.length > 10 && (
                           <span
                              className='read-more-link'
                              onClick={() => toggleDescription(course._id)}
                           >
                              {course.showFullDescription ? 'Read Less' : 'Read More'}
                           </span>
                        )}
                     </div>
                     <div>
                        <strong>Category: </strong> {course.C_categories}
                     </div>
                     <div>
                        <strong>Sections: </strong> {course.sections.length}
                     </div>
                     <div style={{ color: '#c3b9b9' }}>
                        <strong>Enrolled students: </strong> {course.enrolled}
                     </div>
                     <div style={{ float: 'right' }} className='d-flex'>
                        <Button variant='primary' onClick={() => deleteCourse(course._id)}>
                           Delete
                        </Button>
                     </div>
                  </Card.Body>
               </Card>
            ))
         ) : (
            'No courses found!!'
         )}
      </Container>
   );
};

export default TeacherHome;
