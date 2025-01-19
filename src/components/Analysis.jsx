import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import { AuthContext } from "../context/authcontext";
import { analysisContext } from "../context/analysisContext";

import Skeleton from "@mui/material/Skeleton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SideBar from "./Sidebar";

import InsideAnalysis from "./InsideAnalysis";
import { useNavigate } from "react-router-dom";

const Analysis = () => {
  const { user } = useContext(AuthContext);
  const [topics, settopics] = useState([]);
  const {selectedTopic,setselectedTopic} = useContext(analysisContext);
  const [showanalysis, setshowanalysis] = useState(false)
  let navigate = useNavigate()
  const getsugData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/getAnalysisTopic",
        { user: user.email },
        {
          withCredentials: true,
        }
      );
      // console.log(response.data);

      response.data.forEach((data) => {
        settopics((prevTopics) => {
          // Create a new Set with previous topics and add the new topic
          const uniqueTopics = new Set([...prevTopics, data.topic]);
          // Convert the Set back to an array and return it
          return Array.from(uniqueTopics);
        });
      });
      console.log(topics);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getsugData();
  },[]);
  const handelSubmit = (text)=>{
    navigate("/analysis/course");
    setselectedTopic(text);
  }

  return (
    <>

      <div>
        <SideBar/>
      </div>
      <div className="home-container">
      <h1 className="listTitle">
            Track your performance
          </h1>
        <div className="listDiv">
          <List className="listContainer">
            {topics.map((text, index) => (
              <ListItem className="listItem" key={text} disablePadding>
                <ListItemButton onClick={() => handelSubmit(text)}>
                  <ListItemText primary={text} />
                  {/* <CheckCircleIcon /> */}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </div>
       
      </div>

    </>
  );
};

export default Analysis;
