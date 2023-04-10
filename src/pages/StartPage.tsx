// import RaisedButton from "@mui/material/RaisedButton";
import AppBarMain from "../components/appbar";
import AppCards from "../components/appCards"
import Grid from "@mui/material/Grid"

import SportsIcon from '@mui/icons-material/Sports';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  CardActionArea,
} from "@mui/material";

const iconSize = 80

function StartPage() {
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
          <Grid container
            justifyContent="center"
            alignItems="center"
            rowSpacing={2}
            spacing={2}
            columns={12}
          >
            <AppCards
              title="New Match"
              subHeader="Electronic scoresheet, no need for a seperate scorer."
              path="match"
              iconName="timer"
              size={iconSize}
            />
            <AppCards
              title="Create Tournament"
              subHeader="Connect matches to one tournament"
              path="create-tournement"
              iconName="flute"
              size={iconSize}
            />
            <AppCards
              title="Live score"
              subHeader="Get livescore from an tournament or one match"
              path="tournements"
              iconName="player"
              size={iconSize}
            />
            <AppCards
              title="See Tournements"
              subHeader="See ongoing or past tournament"
              path="tournements"
              iconName="volleyball"
              size={iconSize}
            />
          </Grid>
        </main>
      </div>
      {/* </ThemeProvider> */}
    </div>
  );
}

export default StartPage;
