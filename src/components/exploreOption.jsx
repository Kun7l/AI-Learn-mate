import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import zIndex from "@mui/material/styles/zIndex";
import { openContext } from "../context/isopen";
import { AuthContext } from "../context/authcontext";
import { IoMdClose } from "react-icons/io";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

const OptionsComponent = (props) => {
  const { user } = useContext(AuthContext);
  const isopen = useContext(openContext);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [newOption, setNewOption] = useState("");
  const [first, setfirst] = useState(0);
  const [isloading, setisloading] = useState(false);
  const [subjectMessage, setsubjectMessage] = useState("");

  let navigate = useNavigate();

  useEffect(() => {
    const firstapp = async () => {
      const response = await axios.post(
        "http://localhost:3000/subject",
        {
          level: user.education,
          subject: props.subject,
        },
        {
          withCredentials: true,
        }
      );
      for (let index = 0; index < response.data.length; index++) {
        options.push(response.data[index].subtopic);
        setfirst(1);
      }
      console.log(options);
    };
    firstapp();
  }, [options]);

  // Function to handle selection of an option
  const handleSelectOption = (e) => {
    setSelectedOption(e.target.value);
  };

  // Function to handle change in the new option input
  const handleNewOptionChange = (e) => {
    setNewOption(e.target.value);
  };

  // Function to add a new option to the list
  const handleAddOption = () => {
    console.log("function works");
    if (newOption.trim() && !options.includes(newOption)) {
      setOptions([...options, newOption]);
      setNewOption("");
    }
  };
  const submitOption = async () => {
    setisloading(true);
    console.log(user);
    try {
      const response = await axios.post(
        "http://localhost:3000/setoption",
        { option: selectedOption, subject: props.subject, user: user.email },
        { withCredentials: true }
      );

      console.log(response.data);
      if (response.data == 1) {
        setisloading(false);
        isopen.setisOpen(false);
        navigate("/opted");
      } else {
        setsubjectMessage("Invalid Topic");
      }
    } catch (error) {
      throw error;
    }
  };

  const closeMenu = () => {
    isopen.setisOpen(false);
  };
  if (isopen.isOpen) {
    if (!isloading) {
      return (
        <div className="selectDiv">
          <button onClick={closeMenu} className="selectClose btn btn-light">
            <IoMdClose className="closeIcon" />
          </button>
          <h1>Select a Topic</h1>
          <select value={selectedOption} onChange={handleSelectOption}>
            <option value="" disabled>
              Select an Topic
            </option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          <p>Selected Option: {selectedOption}</p>

          <div>
            <input
              type="text"
              value={newOption}
              onChange={handleNewOptionChange}
              placeholder="Add new option"
            />
            <button className="btn btn-dark" onClick={handleAddOption}>
              Add
            </button>
          </div>
          <button onClick={submitOption} className="btn subBtn">
            Submit
          </button>
        </div>
      );
    } else {
      return (
        <div className="selectDiv">
          {subjectMessage ? (
            <>
              <button onClick={closeMenu} className="selectClose btn btn-light">
                <IoMdClose className="closeIcon" />
              </button>
              <h3 className="text-danger">{subjectMessage}</h3>
            </>
          ) : (
            <CircularProgress color="inherit" />
          )}
        </div>
      );
    }
  } else {
    return "";
  }
};

export default OptionsComponent;
