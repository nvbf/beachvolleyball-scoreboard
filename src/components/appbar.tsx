import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import logo from '../osvb_full_logo.svg';


/**
 * A simple example of `AppBar` with an icon on the right.
 * By default, the left icon is a navigation-menu.
 */
const AppBarMain = () =>
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Beachvolleyball Scoreboard
      </Typography>
      <img src={logo} alt="logo" style={{ height: '3rem' }} />
    </Toolbar>
  </AppBar>

export default AppBarMain;
