import React, { useState, useEffect, useContext } from "react";
import "../components/css/signup.css";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authcontext";

const Login = () => {
  let navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isBoard, setisBoard] = useState(true);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res == 200) {
      navigate("/");
    } else {
      alert("error");
    }
  };

  const toggleForm = () => {
    navigate("/signup");
  };

  return (
    <div className={"login-page container"}>
      <form onSubmit={handleLogin} className={"form"}>
        <h2 className={"header"}>Login</h2>
        <div className={"formGroup"}>
          <label className={"label"}>Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={"input"}
            required
          />
        </div>
        <div className={"formGroup"}>
          <label className={"label"}>Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={"input"}
            required
          />
        </div>
        <br />
        
        <div className="formGroup">
          <button type="submit" className={"button"}>
            Login
          </button>
        </div>

        <div className="formGroup">
          <p onClick={toggleForm} className={"toggle"}>
            Don't have an account? Sign up here.
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
