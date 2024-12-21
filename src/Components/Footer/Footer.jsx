
import React from 'react';
import { Paper, Typography } from '@mui/material';
import "./Footer.scss";

export default function Footer() {


  return (
  
     <Paper elevation={3} className='footer'>
      <Typography className='copyright'>
        Copyright © 2024 <img  className="footer-img" src='../../asset/Login/SustainFooter.svg' alt='footer-img'></img> Net Carbon Vision
      </Typography>
    </Paper>
   
  );
}
