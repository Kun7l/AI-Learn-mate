import React, { useContext } from "react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { Link } from "react-router-dom";
import { FaRegUser } from "react-icons/fa6";
import { IoIosLogOut } from "react-icons/io";

import { AuthContext } from "../context/authcontext";
import { useNavigate } from "react-router-dom";

const sideBar = () => {
  const { user, logout } = useContext(AuthContext);
  let navigate = useNavigate();
  const userBtn = () => {
    navigate("/");
  };
  return (
    <div>
      <Drawer
        size={230}
        enableOverlay={false}
        open={true}
        direction="left"
        className="sidebar"
      >
        <div className="userdiv" onClick={userBtn}>
          <div className="icondiv">
            <FaRegUser className="userIcon" />
          </div>
          <div className="namediv">
            <h4>{user.name}</h4>
            <h6>{user.email}</h6>
          </div>
        </div>

        <div className="sideNav">
          <ul className="sideul">
          <li>
              <Link to={"/"} className="lnk">Home</Link>
            </li>
            <li>
              <Link to={"/explore"} className="lnk">Explore</Link>
            </li>
            <li>
              <Link to={"/opted"}>Enrolled</Link>
            </li>
            <li>
              <Link to={"/analysis"}>Analysis</Link>
            </li>
          
          </ul>
        </div>
        <div className="btmDrawer">
          <button onClick={logout} className=" btn btn-dark">
            <span>
              <IoIosLogOut />
            </span>{" "}
            Logout
          </button>
        </div>
      </Drawer>
    </div>
  );
};

export default sideBar;
