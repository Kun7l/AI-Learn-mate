import React, { useEffect, useState, useContext } from "react";
import SubjectCards from "./cards/subjectCards";
import SideBar from "./Sidebar";
import axios from "axios";

import { GoHomeFill } from "react-icons/go";

import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authcontext";

const Explore = () => {
  const [array, setarray] = useState([]);
  const [first, setfirst] = useState(0);
  const { user } = useContext(AuthContext);
const firstapp = async () => {
     if (user.board == false) {
      const response = await axios.post(
        "http://localhost:3000/explore",
        { user: user.email, board: user.board,education:user.education },
        {
          withCredentials: true,
        }
      );
      for (let index = 0; index < response.data.length; index++) {
        array.push(response.data[index].name);
        setfirst(1);
      }
     }
     else{
      const response = await axios.post(
        "http://localhost:3000/exploreBoard",
        { user: user.email, board: user.board,education:user.education },
        {
          withCredentials: true,
        }
      );
      for (let index = 0; index < response.data.length; index++) {
        array.push(response.data[index].name);
        setfirst(1);
      }
     }
    };
  useEffect(() => {
    firstapp();
  }, );

  return (
    <>
      <div className="container">
        <SideBar />
      </div>
      <div role="presentation" className="home-container">
        <Breadcrumbs aria-label="breadcrumb">
          <Link className="breadLink" underline="hover" to={"/"}>
            <GoHomeFill />
          </Link>
          <Typography className="breadMain">Explore</Typography>
        </Breadcrumbs>
      </div>
      <div className="home-container">
        <h1 className="listTitle">
          Explore courses tailored to your preferences
        </h1>
        <br />
        <div className="body-container">
          <div className="card-container d-flex">
            {array.map((text, index) => (
              <SubjectCards key={text} subject={text} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Explore;
