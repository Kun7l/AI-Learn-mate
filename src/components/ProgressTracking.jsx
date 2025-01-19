// src/components/ProgressTracking.js
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

const ProgressTracking = ({ progress }) => {
  
  return (
    <Card sx={{ minWidth: 275, marginTop: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          Progress
        </Typography>
        {progress.map((course, index) => (
          <div key={index}>
            <Typography variant="body2">{course.name}</Typography>
            <LinearProgress variant="determinate" value={course.percentage} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProgressTracking;
