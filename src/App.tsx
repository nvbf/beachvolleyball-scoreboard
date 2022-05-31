import React from 'react';
import logo from './logo.svg';
import cardImage from './static/img/match.jpg'
import './App.css';
import ThemeProvider from "@mui/material/styles/ThemeProvider";
// import RaisedButton from "@mui/material/RaisedButton";
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardActionArea,
  Typography
} from "@mui/material";
import AppBarMain from "../src/components/appbar";
import styled from 'styled-components'
import Link from "next/link";
import CardContent from '@mui/material/CardContent';

function App() {
  // const util = require("util");
  // const superagent = require("superagent");
  
  // const { parse } = require("url");
  // const next = require("next");
  // const express = require("express");
  // const bodyParser = require("body-parser");
  // const send = require("./src/util/sendMail");
  
  // const dev = process.env.NODE_ENV !== "production";
  // const app = next({ dev });
  // const pathMatch = require("path-match");
  
  // const route = pathMatch();
  // const match = route("/tournament/:id");
  
  // const handle = app.getRequestHandler();

  const StyledCard = styled(Card)`
    margin: 1rem;
    cursor: pointer;
    maxWidth: 345px;
`;

  return (
    <div>
    {/* <ThemeProvider> */}
    <div>
      <AppBarMain />
      <div>
        <ul>
          <li>Do you need an electronically beachvolleyball scoresheet? </li>
          <li>Do you want livescore on your game? </li>
          <li>
            Do you want the scoresheet to remember, switch, technical timeouts
            and everything else that is hard to remebmer?
          </li>
        </ul>
        <p>
          {" "}We offer you all of the above for free! You can also create a
          tournament with livescore{" "}
        </p>
        <p>
          {" "}PS: want to go hardcore and setup streaming also? see{" "}
          <a href="https://volleystream.no">Volleystream.no</a>{" "}
        </p>
      </div>
      <main>
        <Card sx={{ maxWidth: 650 }}>
          <CardActionArea>
            <CardHeader
              title="New match"
              subheader="Electronic scoresheet, no need for an seperate scorer."
            />
            <CardMedia 
              component="img"
              src={cardImage}
              alt="Beacvolleyballcourt" 
            />
          </CardActionArea>
        </Card>
        <Card sx={{ maxWidth: 650 }}>
          <CardActionArea>
            <CardHeader
              title="New match"
              subheader="Electronic scoresheet, no need for an seperate scorer."
            />
            <CardMedia 
              component="img"
              src={cardImage}
              alt="Beacvolleyballcourt" 
            />
          </CardActionArea>
        </Card>
        <Card sx={{ maxWidth: 650 }}>
          <CardActionArea>
            <CardHeader
              title="New match"
              subheader="Electronic scoresheet, no need for an seperate scorer."
            />
            <CardMedia 
              component="img"
              src={cardImage}
              alt="Beacvolleyballcourt" 
            />
          </CardActionArea>
        </Card>
      </main>
    </div>
  {/* </ThemeProvider> */}
  </div>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
