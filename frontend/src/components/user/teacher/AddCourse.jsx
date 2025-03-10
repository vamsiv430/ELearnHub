import React, { useState, useContext, useEffect } from 'react';
import { Button, Form, Col, Row } from 'react-bootstrap';
import { UserContext } from '../../../App';
import axiosInstance from '../../common/AxiosInstance';

const AddCourse = () => {
   const user = useContext(UserContext);
   const [addCourse, setAddCourse] = useState({
      userId: user?.userData?._id || '',
      C_educator: '',
      C_title: '',
      C_categories: '',
      C_price: '',
      C_description: '',
      sections: [],
   });

   useEffect(() => {
      // Ensure userData is available before setting userId
      if (user?.userData?._id) {
         setAddCourse((prev) => ({ ...prev, userId: user.userData._id }));
      }
   }, [user]);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setAddCourse((prev) => ({ ...prev, [name]: value }));
   };

   const handleCourseTypeChange = (e) => {
      setAddCourse((prev) => ({ ...prev, C_categories: e.target.value }));
   };

   const addInputGroup = () => {
      setAddCourse((prev) => ({
         ...prev,
         sections: [
            ...prev.sections,
            { S_title: '', S_description: '', S_content: null }, // Add a new empty section
         ],
      }));
   };

   const handleChangeSection = (index, e) => {
      const { name, value, files } = e.target;
      setAddCourse((prev) => {
         const updatedSections = [...prev.sections];
         updatedSections[index] = {
            ...updatedSections[index],
            [name]: name.endsWith('S_content') ? files[0] : value,
         };
         return { ...prev, sections: updatedSections };
      });
   };

   const removeInputGroup = (index) => {
      setAddCourse((prev) => ({
         ...prev,
         sections: prev.sections.filter((_, i) => i !== index),
      }));
   };

  const handleSubmit = async (e) => {
   e.preventDefault();

   console.log("Submitting Course:", addCourse); // Debugging

   const formData = new FormData();
   Object.keys(addCourse).forEach((key) => {
      if (key === "sections") {
         addCourse[key].forEach((section, index) => {
            formData.append(`sections[${index}][S_title]`, section.S_title);
            formData.append(`sections[${index}][S_description]`, section.S_description);
            if (section.S_content instanceof File) {
               formData.append(`sections[${index}][S_content]`, section.S_content);
            }
         });
      } else {
         formData.append(key, addCourse[key]);
      }
   });

   console.log("FormData Values:");
   for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
   }

   try {
      const res = await axiosInstance.post('/api/user/addcourse', formData, {
         headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
         },
      });

      console.log("Response:", res);

      if (res.status === 201 && res.data.success) {
         alert(res.data.message);
         setAddCourse({
            userId: user?.userData?._id || '',
            C_educator: '',
            C_title: '',
            C_categories: '',
            C_price: '',
            C_description: '',
            sections: [],
         });
      } else {
         alert("Failed to create course");
      }
   } catch (error) {
      console.error("Error occurred:", error);
      alert("An error occurred while creating the course.");
   }
};


   return (
      <div>
         <Form className="mb-3" onSubmit={handleSubmit}>
            <Row className="mb-3">
               <Form.Group as={Col} controlId="formGridJobType">
                  <Form.Label>Course Type</Form.Label>
                  <Form.Select value={addCourse.C_categories} onChange={handleCourseTypeChange} required>
                     <option value="">Select categories</option>
                     <option value="IT & Software">IT & Software</option>
                     <option value="Finance & Accounting">Finance & Accounting</option>
                     <option value="Personal Development">Personal Development</option>
                  </Form.Select>
               </Form.Group>
               <Form.Group as={Col} controlId="formGridTitle">
                  <Form.Label>Course Title</Form.Label>
                  <Form.Control
                     name="C_title"
                     value={addCourse.C_title}
                     onChange={handleChange}
                     type="text"
                     placeholder="Enter Course Title"
                     required
                  />
               </Form.Group>
            </Row>

            <Row className="mb-3">
               <Form.Group as={Col} controlId="formGridTitle">
                  <Form.Label>Course Educator</Form.Label>
                  <Form.Control
                     name="C_educator"
                     value={addCourse.C_educator}
                     onChange={handleChange}
                     type="text"
                     placeholder="Enter Course Educator"
                     required
                  />
               </Form.Group>
               <Form.Group as={Col} controlId="formGridTitle">
                  <Form.Label>Course Price (Rs.)</Form.Label>
                  <Form.Control
                     name="C_price"
                     value={addCourse.C_price}
                     onChange={handleChange}
                     type="text"
                     placeholder="For free course, enter 0"
                     required
                  />
               </Form.Group>
               <Form.Group as={Col} className="mb-3" controlId="formGridAddress2">
                  <Form.Label>Course Description</Form.Label>
                  <Form.Control
                     name="C_description"
                     value={addCourse.C_description}
                     onChange={handleChange}
                     as="textarea"
                     placeholder="Enter Course description"
                     required
                  />
               </Form.Group>
            </Row>

            <hr />

            {addCourse.sections.map((section, index) => (
               <div key={index} className="d-flex flex-column mb-4 border rounded-3 border-3 p-3 position-relative">
                  <Col xs={24} md={12} lg={8}>
                     <span
                        className="position-absolute top-0 end-0 p-1"
                        style={{ cursor: 'pointer' }}
                        onClick={() => removeInputGroup(index)}
                     >
                        ❌
                     </span>
                  </Col>
                  <Row className="mb-3">
                     <Form.Group as={Col} controlId={`sectionTitle${index}`}>
                        <Form.Label>Section Title</Form.Label>
                        <Form.Control
                           name="S_title"
                           value={section.S_title}
                           onChange={(e) => handleChangeSection(index, e)}
                           type="text"
                           placeholder="Enter Section Title"
                           required
                        />
                     </Form.Group>
                     <Form.Group as={Col} controlId={`sectionContent${index}`}>
                        <Form.Label>Section Content (Video or Image)</Form.Label>
                        <Form.Control
                           name="S_content"
                           onChange={(e) => handleChangeSection(index, e)}
                           type="file"
                           accept="video/*,image/*"
                           required
                        />
                     </Form.Group>
                     <Form.Group className="mb-3" controlId={`sectionDescription${index}`}>
                        <Form.Label>Section Description</Form.Label>
                        <Form.Control
                           name="S_description"
                           value={section.S_description}
                           onChange={(e) => handleChangeSection(index, e)}
                           as="textarea"
                           placeholder="Enter Section description"
                           required
                        />
                     </Form.Group>
                  </Row>
               </div>
            ))}

            <Row className="mb-3">
               <Col xs={24} md={12} lg={8}>
                  <Button size="sm" variant="outline-secondary" onClick={addInputGroup}>
                     ➕ Add Section
                  </Button>
               </Col>
            </Row>

            <Button variant="primary" type="submit">
               Submit
            </Button>
         </Form>
      </div>
   );
};

export default AddCourse;
