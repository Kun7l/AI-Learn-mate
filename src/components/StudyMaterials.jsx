// src/components/StudyMaterials.js
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const StudyMaterials = ({ materials }) => {
  return (
    <Card sx={{ minWidth: 275, marginTop: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          Study Materials
        </Typography>
        <List>
          {materials.map((material, index) => (
            <ListItem key={index}>
              <ListItemText primary={material.title} secondary={material.description} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default StudyMaterials;
