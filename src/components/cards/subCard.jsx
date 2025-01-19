import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import OptionsComponent from "../exploreOption";
import { FaArrowRightLong } from "react-icons/fa6";
import { courseContext } from "../../context/courseContext";
import Chip from "@mui/material/Chip";
import { AuthContext } from "../../context/authcontext";

const SubCard = (props) => {
  const { opt, setopt } = useContext(courseContext);
  let navigate = useNavigate();
  const handelClick = () => {
    setopt(props);
    navigate("/opted/topic");
  };


  return (
    <div className=" w-35 m-3 col-sm-5 card">
      <div className="card-body ">
        <div className="cardDiv">
          <h5 className="course-title">{props.course}</h5>
          <h6 className="card-title">{props.subject}</h6>
        </div>
        <Chip label={props.level} className={"card-chip " + props.level} />
        <button onClick={handelClick} className="btn btn-dark card-btn">
          Learn <FaArrowRightLong />
        </button>
      </div>
    </div>
  );
};

export default SubCard;
