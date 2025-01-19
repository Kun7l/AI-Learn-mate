import React, { useState, useEffect,useContext } from "react";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { Grid, Typography, Paper, Divider } from "@mui/material";
import SideBar from "./Sidebar";
import axios from "axios";

// Register chart.js components
ChartJS.register(
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

import { analysisContext } from "../context/analysisContext";

const InsideAnalysis = () => {
  const {selectedTopic} = useContext(analysisContext);
  const [labels, setlabels] = useState([]);
  const [score, setscore] = useState([]);
  const [highest, sethighest] = useState()
  const [lowest, setlowest] = useState()
  const [avg, setavg] = useState()
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const getsugData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/getAnalysisTopic",
        { user: "test@gmail.com" },
        {
          withCredentials: true,
        }
      );

      const newLabels = [];
      const newScore = [];
      response.data.forEach((data) => {
        if (data.topic === selectedTopic) {
          newLabels.push(data.smallTopic);
          newScore.push(data.score);
        }
      });

      setlabels(newLabels);
      setscore(newScore)
      if (newScore.length > 0) {
        sethighest(Math.max(...newScore));
        setlowest(Math.min(...newScore));
      }
      setIsDataLoaded(true);  // Data has been loaded
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getsugData();
  }, []);

  // Dummy data for overall scores
  const overallScore = 85;
  const averageScore = 75;
  const highestScore = highest;
  const lowestScore = lowest;

  // Dummy data for Score Breakdown by Topic (Bar Chart)
  const scoreByTopic = {
    labels: labels,
    datasets: [
      {
        label: "Scores",
        data: score,
        backgroundColor: "rgba(75,192,192,0.6)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

  // Dummy data for Performance Trends (Line Chart)
  const performanceTrend = {
    labels: labels,
    datasets: [
      {
        label: "Performance Over Time",
        data: score,
        fill: false,
        backgroundColor: "rgba(255,159,64,0.6)",
        borderColor: "rgba(255,159,64,1)",
      },
    ],
  };

  // Dummy data for Strengths and Weaknesses
  const strongTopics = ["Math", "Art"];
  const weakTopics = ["English"];

  // Dummy data for Suggested Areas for Improvement
  const suggestions =
    "Focus more on English and review the previous week's tests to improve.";

  return (
    <>
      <div>
        <SideBar />
      </div>
      <div className="home-container">
        <Grid container spacing={3}>
          {/* Overall Score Summary */}
          <Grid item xs={12} className="ScoreCard">
            <Paper elevation={3} className="paperPadding">
              <Typography variant="h6">Exam Scores</Typography>
              <Divider />

              <Typography variant="body1">
                Highest Score: {(highestScore*100)/10} %
              </Typography>
              <Typography variant="body1">
                Lowest Score: {(lowestScore*100)/10} %
              </Typography>
            </Paper>
          </Grid>

          {/* Score Breakdown by Topic */}
          {isDataLoaded && (
            <Grid item xs={12} md={6} className="barGraph">
              <Paper elevation={3} className="paperPadding">
                <Typography variant="h6">Score Breakdown by Topic</Typography>
                <Bar data={scoreByTopic} />
              </Paper>
            </Grid>
          )}

          {/* Performance Trends */}
          <Grid item xs={12}>
            <Paper elevation={3} className="paperPadding">
              <Typography variant="h6">Performance Trends</Typography>
              <Line data={performanceTrend} />
            </Paper>
          </Grid>

          {/* Strengths and Weaknesses */}
          <Grid item xs={12}>
            <Paper elevation={3} className="paperPadding">
              <Typography variant="h6">Strengths and Weaknesses</Typography>
              <Typography variant="body1">
                Strongest Topics: {strongTopics.join(", ")}
              </Typography>
              <Typography variant="body1">
                Weakest Topics: {weakTopics.join(", ")}
              </Typography>
            </Paper>
          </Grid>

          {/* Suggested Areas for Improvement */}
          <Grid item xs={12}>
            <Paper elevation={3} className="paperPadding">
              <Typography variant="h6">
                Suggested Areas for Improvement
              </Typography>
              <Typography variant="body1">{suggestions}</Typography>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default InsideAnalysis;
