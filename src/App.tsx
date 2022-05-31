import React from 'react';
import logo from './logo.svg';
import cardImage from './static/img/match.jpg'
import './App.css';
import ThemeProvider from "@mui/material/styles/ThemeProvider";
// import RaisedButton from "@mui/material/RaisedButton";
import {
  Card,
  CardHeader,
  CardMedia,
  CardActionArea,
} from "@mui/material";
import AppBarMain from "./components/appbar";
import AppCards from "./components/appCards"
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import StartPage from './pages/StartPage';
import Match from './pages/Match';
import CreateTournement from './pages/CreateTournement';
import Tournements from './pages/Tournements';


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

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/match" element={<Match />} />
        <Route path="/create-tournement" element={<CreateTournement />} />
        <Route path="/tournements" element={<Tournements />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
