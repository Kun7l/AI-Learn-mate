import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/authcontext";
import { courseContext } from "../context/courseContext";
import axios from "axios";
import SideBar from "./Sidebar";

import { GoHomeFill } from "react-icons/go";

import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link } from "react-router-dom";
import SubCard from "./cards/subCard";

const OptedCourse = () => {
  const { user } = useContext(AuthContext);
  const [array, setarray] = useState([]);
  const [first, setfirst] = useState(0);
  useEffect(() => {
    console.log(user.email);
    const firstapp = async () => {
      const response = await axios.post(
        "http://localhost:3000/opted",
        { user: user.email },
        {
          withCredentials: true,
        }
      );
      for (let index = 0; index < response.data[0].subtopic.length; index++) {
        array.push(response.data[0].subtopic[index]);
        setfirst(1);
      }
    };
    firstapp();
  });

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
          <Link className="breadLink breadMain" underline="hover" to={"/opted"}>
            Enrolled
          </Link>
        </Breadcrumbs>
      </div>
      <div className="home-container">
        <div className="body-container">
          <div className="card-container d-flex">
            {array.map((text, index) => (
              <SubCard
                key={text.name}
                subject={text.subject}
                course={text.name}
                level={text.level}
                smallTopics={text.smallTopics}
              />
            ))}
          </div>
        </div>
      </div>
      ;
    </>
  );
};

export default OptedCourse;
