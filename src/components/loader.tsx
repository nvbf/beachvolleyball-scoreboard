import LinearProgress from "@mui/material/LinearProgress";
import Grid from "@mui/material/Grid";
import { Padding } from "@mui/icons-material";

const Loader = () =>
  <Grid container
    justifyContent="center"
    alignItems="center"
    rowSpacing={0}
    spacing={2}
    columns={12}>
    <Grid item xs={12}>
      < LinearProgress color="inherit" sx={{marginTop: "150px", padding: "2px"}} />
    </Grid>
  </Grid>

export default Loader;
