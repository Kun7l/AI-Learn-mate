// ExamChart.js
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ExamChart = ({ data }) => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    if (data.length > 0) {
      const initialTopic = data[0].topic;
      setSelectedTopic(initialTopic);
      updateChartData(initialTopic);
    }
  }, [data]);

  const handleChange = (event, newTopic) => {
    if (newTopic !== null) {
      setSelectedTopic(newTopic);
      updateChartData(newTopic);
    }
  };

  const updateChartData = (topic) => {
    const filteredData = data.filter(item => item.topic === topic);
    setChartData({
      labels: filteredData.map(item => item.subject),
      datasets: [
        {
          label: 'Score',
          data: filteredData.map(item => item.score),
          fill: false,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
        },
      ],
    });
  };

  const topics = [...new Set(data.map(item => item.topic))];

  return (
    <div>
      <ToggleButtonGroup
        color="primary"
        value={selectedTopic}
        exclusive
        onChange={handleChange}
        aria-label="Topic"
      >
        {topics.map(topic => (
          <ToggleButton key={topic} value={topic}>
            {topic}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <Line data={chartData} />
    </div>
  );
};

export default ExamChart;
