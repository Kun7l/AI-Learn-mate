// src/Dashboard.js
import React, { useState, useContext, useEffect } from "react";
import Container from "@mui/material/Container";
import NavBar from "./navbar";
import UserProfile from "./UserProfile";
import ProgressTracking from "./ProgressTracking";
import ExamScores from "./ExamScores";
import StudyMaterials from "./StudyMaterials";
import LinearProgress from '@mui/material/LinearProgress';

import { AuthContext } from "../context/authcontext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [userDetails, setuserDetails] = useState(null)
  const [progress, setprogress] = useState(null)
  const [scores, setscores] = useState(null)
  const [materials, setmaterials] = useState(null)
  
  useEffect(() => {
    setTimeout(() => {
        setuserDetails({
            name: user.name,
            age: user.age,
            course: [user.subtopic],
          });
          
          setprogress([
            { name: "Math", percentage: 75 },
            { name: "Science", percentage: 50 },
            { name: "Programming with java", percentage: 90 },
          ]);
        
         setscores([
            { subject: "Math", score: 85 },
            { subject: "Science", score: 88 },
            { subject: "History", score: 92 },
          ]);
        
          setmaterials([
            { title: "Math Textbook", description: "Chapters 1-10" },
            { title: "Science Lab Manual", description: "Experiments 1-5" },
            { title: "History Notes", description: "Ancient to Modern" },
          ]);
    }, 1000);
  }, [user])
  
if (!userDetails || !materials || !progress || !scores  ) {
    return <LinearProgress color="inherit" />
}
else{
    return (
        <Container>
          <NavBar />
          <UserProfile user={userDetails} />
          <br />
          <ProgressTracking progress={progress}/>
        </Container>
      );
}
};

export default Dashboard;
