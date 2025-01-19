import React, { useContext, useEffect, useState } from "react";

import { AuthContext } from "../context/authcontext";
import SideBar from "./Sidebar";
import axios from "axios";
import ExamChart from "./testData";
import Dashboard from "./Dashboard";

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <div className="container-fluid">
        <div className="container">
          <SideBar />
        </div>
      </div>

      <div className="home-container">
        <Dashboard user={user}/>
      </div>
    </>
  );
};

export default Home;
