import React, { useState, useEffect, useContext } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { courseContext } from "../context/courseContext";
import { AuthContext } from "../context/authcontext";
import { examContext } from "../context/examContext";
import axios from "axios";
import { IoMdClose } from "react-icons/io";

const MCQTest = (props) => {
  const { giveExam, setgiveExam } = useContext(examContext);
  const { user } = useContext(AuthContext);
  const { opt, setopt } = useContext(courseContext);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleOptionChange = (questionIndex, option) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = option;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    let newScore = 0;
    props.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        newScore += 1;
      }
    });
    setScore(newScore);
    setSubmitted(true);
    setShowResults(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/submitExam",
        {
          user: user.email,
          subject: opt.subject,
          topic: opt.course,
          level: opt.level,
          test: props.questions,
          userAnswers: answers,
          score: newScore,
          smallTopic: props.smallTopic,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
    localStorage.setItem("mcqTestScore", newScore);
    
  };

  const handelBack = () => {
    setgiveExam(false);
  };

  return (
    <div className="exam-container">
      <h1>MCQ Test</h1>
      {!submitted ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {props.questions.map((question, index) => (
            <div className="question-div" key={index}>
              <div className="question">
                <h2>{question.question}</h2>
              </div>
              <RadioGroup
                row
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                value={answers[index] || ""}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              >
                {question.options.map((option) => (
                  <FormControlLabel
                    key={option}
                    control={<Radio />}
                    label={option}
                    id={`${index}-${option}`}
                    name={`question-${index}`}
                    value={option}
                    checked={answers[index] === option}
                  />
                ))}
              </RadioGroup>
            </div>
          ))}
          <button className="btn btn-dark" type="submit">
            Submit
          </button>
        </form>
      ) : (
        <div>
          <h2>
            Your Score: {score} / {props.questions.length}
          </h2>
          <button onClick={handelBack} className="selectClose btn btn-light">
            <IoMdClose className="closeIcon" />
          </button>
          {score === props.questions.length ? (
            <h6>Excellent</h6>
          ) : score > props.questions.length / 2 ? (
            <h6>Good efforts</h6>
          ) : (
            <h6>Need more practice</h6>
          )}
          {showResults && (
            <div className="results-container">
              <h3>Results</h3>
              {props.questions.map((question, index) => (
                <div className="result-question" key={index}>
                  <h4>{question.question}</h4>
                  <p>
                    <strong>Correct Answer: </strong>
                    {question.correctAnswer}
                  </p>
                  <p>
                    <strong>Your Answer: </strong>
                    {answers[index]}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MCQTest;
