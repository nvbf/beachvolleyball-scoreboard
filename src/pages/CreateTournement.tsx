import React from 'react';
import logo from './logo.svg';
import cardImage from './static/img/match.jpg'
import ThemeProvider from "@mui/material/styles/ThemeProvider";
// import RaisedButton from "@mui/material/RaisedButton";
import {
  Card,
  CardHeader,
  CardMedia,
  CardActionArea,
} from "@mui/material";
import AppBarMain from "../components/appbar";
import AppCards from "../components/appCards"

function CreateTournement() {
  return (
    <div>
      {/* <ThemeProvider> */}
      <div>
        <main>
          <div>CREATE TOURNEMENT HERE</div>
        </main>
      </div>
      {/* </ThemeProvider> */}
    </div>
  );
}

export default CreateTournement;