import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

import { courseContext } from "../context/courseContext";
import { AuthContext } from "../context/authcontext";
import { topicContext } from "../context/topicContext";

import Loading from "./loading";
import Skeleton from "@mui/material/Skeleton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { GoHomeFill } from "react-icons/go";
import { GoPencil } from "react-icons/go";
import { IoBookOutline } from "react-icons/io5";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Button from "@mui/material/Button";

import SideBar from "./Sidebar";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Coursechallenge from "./coursechallenge";
import { SuggestedTopic } from "../../models/sugTopic";

const Topic = () => {
  let navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { topicSub, settopicSub } = useContext(topicContext);
  const { opt, setopt } = useContext(courseContext);
  const [questions, setquestions] = useState([]);
  const [arrayTopic, setarrayTopic] = useState([]);
  const [sugarrayTopic, setsugarrayTopic] = useState([]);
  const [isloading, setisloading] = useState(true);
  const [first, setfirst] = useState(false);
  const [takecourcechallenge, settakecourcechallenge] = useState(false);
  const [isexamloading, setisexamloading] = useState(true);

  const getData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/getTopic",
        { topic: opt.course, subject: opt.subject, user: user.email },
        {
          withCredentials: true,
        }
      );
      for (let index = 0; index < response.data.length; index++) {
        if (!arrayTopic.includes(response.data[index])) {
          setarrayTopic((arrayTopic) => [...arrayTopic, response.data[index]]);
        }
      }
      setfirst(true);
    } catch (error) {
      console.log(error);
    }
  };

  const getsugData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/getsugTopic",
        { topic: opt.course, subject: opt.subject, user: user.email },
        {
          withCredentials: true,
        }
      );
      for (let index = 0; index < response.data.length; index++) {
        if (!sugarrayTopic.includes(response.data[index])) {
          setsugarrayTopic((sugarrayTopic) => [
            ...sugarrayTopic,
            response.data[index],
          ]);
        }
      }
      setisloading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getExam = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/coursechallenge",
        {
          topics: arrayTopic,
          subtopic: opt.course,
          subject: opt.subject,
          user: user.email,
        },
        { withCredentials: true }
      );
      response.data.map((data) => {
        questions.push(data);
      });
      setisexamloading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const clickexam = () => {
    settakecourcechallenge(true);
    getExam();
  };

  useEffect(() => {
    getData();
    getsugData();
  }, []);

  const handelSubmit = (value) => {
    settopicSub(value);
    navigate("/opted/topic/course");
  };

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
          <Link
            className="breadLink breadMain"
            underline="hover"
            to={"/opted/topic"}
          >
            {opt.course}
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
        <div className="home-container">
          {/* <h1 className="listTitle">
              Explore and select topics tailored to your subjects
            </h1> */}
          <div className="listDiv">
            <List className="listContainer">
              {arrayTopic.map((data, index) => (
                <ListItem className="listItem" key={data.name} disablePadding>
                  <ListItemButton onClick={() => handelSubmit(data.name)}>
                    <ListItemText primary={data.name} />
                    {data.completed ? <CheckCircleIcon /> : ""}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </div>
          <h1 className="listTitle">
            Explore and select topics tailored to your subjects
          </h1>
          <div className="listDiv">
            <List className="listContainer">
              {sugarrayTopic.map((text, index) => (
                <ListItem className="listItem" key={text} disablePadding>
                  <ListItemButton onClick={() => handelSubmit(text)}>
                    <ListItemText primary={text} />
                    {/* <CheckCircleIcon /> */}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </div>

          {takecourcechallenge ? (
            <div>
              {isexamloading ? (
                <Loading />
              ) : (
                <Coursechallenge questions={questions} />
              )}
            </div>
          ) : (
            <div className="give-exam">
              <h2>Test your knowledge of the skills in this course.</h2>{" "}
              <Button
                className="examBtn"
                variant="contained"
                disableElevation
                endIcon={<IoBookOutline />}
                onClick={clickexam}
              >
                Course challenge
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Topic;
