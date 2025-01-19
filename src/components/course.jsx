import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { courseContext } from "../context/courseContext";
import { AuthContext } from "../context/authcontext";
import { topicContext } from "../context/topicContext";
import { examContext } from "../context/examContext";

import { GoHomeFill } from "react-icons/go";
import { GoPencil } from "react-icons/go";
import AddIcon from "@mui/icons-material/Add";
import { IoChatbubbleSharp } from "react-icons/io5";
import { IoChatbubbleOutline } from "react-icons/io5";

import SideBar from "./Sidebar";
import MCQTest from "./exam";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import SubCard from "./cards/subCard";
import Loading from "./loading";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Topic from "./Topic";
import Fab from "@mui/material/Fab";
import Chatbot from "./chatbot";

import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Subject } from "@mui/icons-material";



const steps = [
  "Select master blaster campaign settings",
  "Create an ad group",
  "Create an ad",
];

const Course = () => {
  const { user } = useContext(AuthContext);
  const [giveExam, setgiveExam] = useState(false);
  const { opt, setopt } = useContext(courseContext);
  const { topicSub, settopicSub } = useContext(topicContext);
  const [content, setcontent] = useState("");
  const [isloading, setisloading] = useState(true);
  const [links, setlinks] = useState([]);
  const [questions, setquestions] = useState([]);
  const [chatBotOpen, setchatBotOpen] = useState(false);
  const [suggestedTopic, setsuggestedTopic] = useState([]);

  const getData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/course",
        {
          topic: opt.course,
          level: opt.level,
          smallTopic: topicSub,
          user: user.email,
          subject: opt.subject,
        },
        {
          withCredentials: true,
        }
      );
      setcontent(response.data);
      setisloading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const getStepper = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/getStepper",
        {
          user: user.email,
          smallTopic: topicSub,
          subtopic: opt.course,
          subject: opt.subject,
        },
        { withCredentials: true }
      );
      for (let index = 0; index < response.data.length; index++) {
        suggestedTopic.push(response.data[index]);
      }
      console.log("get stepper");
      console.log(suggestedTopic);
    } catch (error) {
      console.log(error);
    }
    // console.log(links);
  };
  const getLinks = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/yt",
        { opt: opt.course },
        { withCredentials: true }
      );
      for (let index = 0; index < response.data.length; index++) {
        links.push(response.data[index]);
      }
    } catch (error) {
      console.log(error);
    }
    // console.log(links);
  };
  const getExam = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/exam",
        { topic: topicSub, level: opt.level },
        { withCredentials: true }
      );
      setquestions(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const loadExam = () => {
    setgiveExam(true);
  };
  const handelFab = () => {
    setchatBotOpen(!chatBotOpen);
  };
  useEffect(() => {
    getData();
    getLinks();
    getExam();
    getStepper();
  }, []);

  return (
    <>
      <div className="container">
        <SideBar />
      </div>
      <div className="home-container">
        <Breadcrumbs aria-label="breadcrumb">
          <Link className="breadLink " underline="hover" to={"/"}>
            <GoHomeFill className="goHome" />
          </Link>
          <Link className="breadLink " underline="hover" to={"/opted"}>
            Enrolled
          </Link>
          <Link className="breadLink " underline="hover" to={"/opted/topic"}>
            {opt.course}
          </Link>
          <Link
            className="breadLink breadMain"
            underline="hover"
            to={"/opted/topic/course"}
          >
            {topicSub}
          </Link>
        </Breadcrumbs>
      </div>
      {isloading ? (
        <div className="home-container">
          <Loading />
          <br />
          <Skeleton variant="rounded" width={1250} height={800} />
        </div>
      ) : (
        <>
          {giveExam ? (
            <div className="home-container">
              {" "}
              <examContext.Provider value={{ giveExam, setgiveExam }}>
                <MCQTest questions={questions} smallTopic={topicSub} />
              </examContext.Provider>
            </div>
          ) : (
            <>
              <div className="home-container">
                <Fab
                  onClick={handelFab}
                  className="chatBotBtn"
                  color="primary"
                  aria-label="add"
                >
                  <IoChatbubbleOutline className="chatIcon" />
                </Fab>
                {chatBotOpen ? (
                  <Chatbot content={content} className="chatBot" />
                ) : (
                  ""
                )}
                <div>
                  <Chip
                    label={opt.level}
                    className={"card-chip " + opt.level}
                  />
                </div>
                <div>
                  <Box sx={{ width: "100%" }}>
                    <Stepper alternativeLabel>
                      {suggestedTopic.map((label) => (
                        <Step key={label}>
                          <StepLabel>{label}</StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </Box>
                </div>
                <br />
                <div
                  className="dangDiv"
                  dangerouslySetInnerHTML={{ __html: content }}
                />

                <div className="linksDiv">
                  {links.map((text, index) => (
                    <a target="_blank" className="" href={text}>
                      Resources
                    </a>
                  ))}
                </div>

                <div className="give-exam">
                  <h2>Show What You've Learned!</h2>{" "}
                  <Button
                    onClick={loadExam}
                    className="examBtn"
                    variant="contained"
                    disableElevation
                    endIcon={<GoPencil />}
                  >
                    Start Test
                  </Button>
                </div>
              </div>
            </>
          )}
          <div className="home-container"></div>
        </>
      )}
    </>
  );
};

export default Course;
