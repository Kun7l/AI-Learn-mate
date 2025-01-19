import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import OptionsComponent from "../exploreOption";
import { openContext } from "../../context/isopen";
import { FaArrowRightLong } from "react-icons/fa6";

const SubjectCards = (props) => {
  const [isOpen, setisOpen] = useState(false);
  const handelClick = () => {
    setisOpen(true);
  };

  return (
    <openContext.Provider value={{ isOpen, setisOpen }}>
      <div className=" w-35 m-3 col-sm-5 card">
        <div className="card-body ">
          <div className="cardDiv">
            <h5 className="card-title">{props.subject}</h5>
            <h6 className="card-subtitle mb-2 text-body-secondary">
              explore your {props.subject} skills.
            </h6>
          </div>
          <button onClick={handelClick} className="btn btn-dark card-btn">
            Explore <FaArrowRightLong />
          </button>
          {isOpen ? <OptionsComponent subject={props.subject} /> : ""}
        </div>
      </div>
    </openContext.Provider>
  );
};

export default SubjectCards;
