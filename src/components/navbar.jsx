// src/components/NavBar.js
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
const NavBar = () => {
  return (
    <AppBar position="static" className='appBar'>
      <Toolbar >
        <Typography  variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Student Dashboard
        </Typography>
        <Link to="/opted"><Button color="inherit">Courses</Button></Link>
        <Link to="/analysis"> <Button color="inherit">Exams</Button></Link>
       
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
