// src/components/UserProfile.js
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const UserProfile = ({ user }) => {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {user.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Age: {user.age}
        </Typography>
        <Typography variant="body2">
          Courses Enrolled: {5}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
