import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Accordion, Modal } from 'react-bootstrap';
import axiosInstance from '../../common/AxiosInstance';
import ReactPlayer from 'react-player';
import { UserContext } from '../../../App';
import NavBar from '../../common/NavBar';
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Button } from '@mui/material';

const CourseContent = () => {
   const user = useContext(UserContext);
   const { courseId, courseTitle } = useParams();
   const [courseContent, setCourseContent] = useState([]);
   const [currentVideo, setCurrentVideo] = useState(null);
   const [playingSectionIndex, setPlayingSectionIndex] = useState(-1);
   const [completedSections, setCompletedSections] = useState([]);
   const [completedModule, setCompletedModule] = useState([]);
   const [showModal, setShowModal] = useState(false);
   const [certificate, setCertificate] = useState(null);

   const completedModuleIds = completedModule.map((item) => item.sectionId);
   const backendURL = "http://localhost:5001/uploads";

   const downloadPdfDocument = async (rootElementId) => {
      const input = document.getElementById(rootElementId);

      if (!input) {
         console.error("Certificate element not found");
         return;
      }

      try {
         const canvas = await html2canvas(input, { scale: 2, useCORS: true });
         const imgData = canvas.toDataURL('image/png');
         const pdf = new jsPDF('p', 'mm', 'a4');
         pdf.addImage(imgData, 'JPEG', 10, 10, 190, 0);
         pdf.save('certificate.pdf');
      } catch (error) {
         console.error("Error generating PDF:", error);
      }
   };

   const getCourseContent = async () => {
      try {
         const res = await axiosInstance.get(`/api/user/coursecontent/${courseId}`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem("token")}`
            }
         });

         if (res.data.success) {
            setCourseContent(res.data.courseContent);
            setCompletedModule(res.data.completeModule);
            setCertificate(res.data.certificateData?.updatedAt || null);
         }
      } catch (error) {
         console.log("Error fetching course content:", error);
      }
   };

   useEffect(() => {
      getCourseContent();
   }, [courseId]);

   const playVideo = (videoPath, index) => {
      if (videoPath) {
         const encodedVideoPath = encodeURIComponent(videoPath);
         setCurrentVideo(`${backendURL}/${encodedVideoPath}`);
         setPlayingSectionIndex(index);
      }
   };

   const completeModule = async (sectionId) => {
      if (completedModule.length >= courseContent.length) {
         setShowModal(true);
         return;
      }

      if (playingSectionIndex !== -1 && !completedSections.includes(playingSectionIndex)) {
         setCompletedSections((prev) => [...prev, playingSectionIndex]);

         try {
            const res = await axiosInstance.post(`/api/user/completemodule`, {
               courseId,
               sectionId
            }, {
               headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
               }
            });

            if (res.data.success) {
               alert(res.data.message);
               getCourseContent();
            }
         } catch (error) {
            console.log("Error completing module:", error);
         }
      }
   };

   return (
      <>
         <NavBar />
         <h1 className='my-3 text-center'>Welcome to the course: {courseTitle}</h1>

         <div className='course-content'>
            <div className="course-section">
               <Accordion defaultActiveKey="0" flush>
                  {courseContent.map((section, index) => {
                     const sectionId = section?._id;
                     const isSectionCompleted = completedModuleIds.includes(sectionId);

                     return (
                        <Accordion.Item key={sectionId || index} eventKey={index.toString()}>
                           <Accordion.Header>{section.S_title}</Accordion.Header>
                           <Accordion.Body>
                              {section.S_description}
                              {section.S_content?.filename && (
                                 <>
                                    <Button
                                       className="play-video-btn mx-2"
                                       variant="contained"
                                       size="small"
                                       color="success"
                                       onClick={() => playVideo(section.S_content.filename, index)}
                                    >
                                       Play Video
                                    </Button>

                                    {!isSectionCompleted && !completedSections.includes(index) && (
                                       <Button
                                          className="completed-btn"
                                          variant="contained"
                                          size="small"
                                          onClick={() => completeModule(sectionId)}
                                          disabled={playingSectionIndex !== index}
                                       >
                                          Completed
                                       </Button>
                                    )}
                                 </>
                              )}
                           </Accordion.Body>
                        </Accordion.Item>
                     );
                  })}
                  {completedModule.length === courseContent.length && (
                     <Button className='my-2' onClick={() => setShowModal(true)}>Download Certificate</Button>
                  )}
               </Accordion>
            </div>
            <div className="course-video w-50">
               {currentVideo && (
                  <ReactPlayer
                     key={currentVideo}
                     url={currentVideo}
                     width="100%"
                     height="100%"
                     controls
                     playing={true}
                     volume={1}
                     muted={false}
                     crossOrigin="anonymous"
                     config={{
                        file: {
                           attributes: {
                              controlsList: "nodownload",
                              disablePictureInPicture: true
                           }
                        }
                     }}
                     onError={(e) => console.error("Video Error:", e)}
                  />
               )}
            </div>
         </div>

         <Modal
            size="lg"
            show={showModal}
            onHide={() => setShowModal(false)}
            dialogClassName="modal-90w"
            aria-labelledby="example-custom-modal-styling-title"
         >
            <Modal.Header closeButton>
               <Modal.Title id="example-custom-modal-styling-title">
                  Completion Certificate
               </Modal.Title>
            </Modal.Header>
            <Modal.Body>
               Congratulations! You have completed all sections. Here is your certificate
               <div id='certificate-download' className="certificate text-center">
                  <h1>Certificate of Completion</h1>
                  <div className="content">
                     <p>This is to certify that</p>
                     <h2>{user.userData?.name}</h2>
                     <p>has successfully completed the course</p>
                     <h3>{courseTitle}</h3>
                     <p>on</p>
                     <p className="date">{certificate ? new Date(certificate).toLocaleDateString() : "N/A"}</p>
                  </div>
               </div>
               <Button onClick={() => downloadPdfDocument('certificate-download')} style={{ float: 'right', marginTop: 3 }}>
                  Download Certificate
               </Button>
            </Modal.Body>
         </Modal>
      </>
   );
};

export default CourseContent;
