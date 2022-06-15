import React from 'react';
import logo from './logo.svg';
import cardImage from './static/img/match.jpg'
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';


import {
  Card,
  CardHeader,
  CardMedia,
  CardActionArea,
  Grid,
} from "@mui/material";
import AppBarMain from "../components/appbar";
import AppCards from "../components/appCards"

function CreateTournement() {
  const styleDivbox = {
    color:"black", 
    margin:"1vw", 
    border:"1px solid black"
  }

  return (
    <div>
      <div style={styleDivbox}>
     
           
              <div style={{margin:"1vw"}}>
                CREATE TOURNEMENT HERE
              </div>
              <div style={{margin:"1vw"}}>
              <Box
              component="form"
              sx={{
               '& > :not(style)': { m: 1, width: '25ch' },
               }}
              noValidate
              autoComplete="off"
            >
              <TextField id="textfield-tournementName" label="Tournament name" variant="standard" />
            </Box>
            </div>
            <div style={{margin:"1vw"}}>
              <Button variant="contained">Create tournement</Button>
              </div>
      </div>
    </div>
  );
}

export default CreateTournement;
