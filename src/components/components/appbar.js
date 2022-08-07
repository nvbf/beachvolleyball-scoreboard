import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
/**
 * A simple example of `AppBar` with an icon on the right.
 * By default, the left icon is a navigation-menu.
 */
const AppBarMain = () => <AppBar position='sticky'>
    <Toolbar>
      <Typography variant="h6">
        Beachvolleyball Score
    </Typography>
    </Toolbar>
  </AppBar>

export default AppBarMain;
