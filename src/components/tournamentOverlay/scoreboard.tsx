import { Grid, Typography } from "@mui/material";
import {AdminMatch} from "../tournamentAdmin/types";
import {getInitials} from "../../util/names";
import {TeamType} from "../types";

const Scoreboard = ({match}: {match: AdminMatch}) => {
    const numberSize = 32;
    const nameSize = 12;


    return <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        padding={0}
        spacing={0}
        columns={12}
        sx={{
            position: "absolute",
            width: 1,
            bottom: "60px",
            left: "0",
            right: "0",
        }}
    >
        <Grid
            item
            height={60}
            padding={0}
            sx={{
                backgroundColor: "#ffffff",
                borderColor: "#000000",
                border: 2,
            }}
        >
            <Grid
                container
                spacing={1}
                height={60}
                direction="column"
                justifyContent={"center"}
                padding={0.5}
                paddingRight={1}
                paddingLeft={2}
                textAlign={"right"}
            >
                <Grid item padding={0}>
                    <Typography
                        textTransform={"uppercase"}
                        padding={0}
                        fontSize={nameSize}
                        lineHeight={1.4}
                    >
                        {match
                            ? `${getInitials(match.homeTeam.player1)}`
                            : ""}
                    </Typography>
                </Grid>
                <Grid item padding={0}>
                    <Typography
                        textTransform={"uppercase"}
                        padding={0}
                        fontSize={nameSize}
                        lineHeight={1.0}
                    >
                        {match
                            ? `${getInitials(match.homeTeam.player2)}`
                            : ""}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
        <Grid
            item
            height={60}
            sx={{
                borderColor: "#000000",
                backgroundColor: "#000000",
                color: "#ffffff",
            }}
        >
            <Grid
                container
                // spacing={1}
                paddingY={0.5}
                paddingX={2}
                columns={12}
                direction={"column"}
            >
                <Grid item padding={0} margin={0}>
                    <Typography
                        textTransform={"uppercase"}
                        fontSize={8}
                        padding={0}
                        margin={0}
                        noWrap
                    >
                        sets
                    </Typography>
                </Grid>
                <Grid item padding={0} margin={0}>
                    <Typography fontSize={numberSize} lineHeight={1.2} noWrap>
                        {match.currentSetScore[TeamType.Home]
                            ? match.currentSetScore[TeamType.Home]
                            : ""}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
        <Grid
            item
            height={60}
            sx={{
                backgroundColor: "#ffffff",
                borderColor: "#000000",
                border: 2,
            }}
        >
            <Grid
                container
                height={1}
                spacing={1}
                padding={0.5}

                // padding={1}
            >
                <Grid item height={1}>
                    <Typography fontSize={numberSize}>
                        {match
                            ? match.currentScore[
                            match.currentScore.length - 1
                                ][TeamType.Home]
                            : ""}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography fontSize={numberSize}>-</Typography>
                </Grid>
                <Grid item>
                    <Typography fontSize={numberSize}>
                        {match
                            ? match.currentScore[
                            match.currentScore.length - 1
                                ][TeamType.Away]
                            : ""}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
        <Grid
            item
            height={60}
            sx={{
                borderColor: "#000000",
                backgroundColor: "#000000",
                color: "#ffffff",
            }}
        >
            <Grid
                container
                // spacing={1}
                paddingY={0.5}
                paddingX={2}
                columns={12}
                direction={"column"}
            >
                <Grid item padding={0} margin={0}>
                    <Typography
                        textTransform={"uppercase"}
                        fontSize={8}
                        padding={0}
                        margin={0}
                        noWrap
                    >
                        sets
                    </Typography>
                </Grid>
                <Grid item padding={0} margin={0}>
                    <Typography fontSize={numberSize} lineHeight={1.2} noWrap>
                        {match
                            ? match.currentSetScore[TeamType.Away]
                            : ""}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
        <Grid
            item
            height={60}
            sx={{
                backgroundColor: "#ffffff",
                borderColor: "#000000",
                border: 2,
            }}
        >
            <Grid
                container
                spacing={1}
                height={60}
                direction="column"
                justifyContent={"center"}
                padding={0.5}
                paddingRight={2}
                paddingLeft={1}
                textAlign={"left"}
            >
                <Grid item padding={0}>
                    <Typography
                        textTransform={"uppercase"}
                        padding={0}
                        fontSize={nameSize}
                        lineHeight={1.4}
                    >
                        {match
                            ? `${getInitials(match.awayTeam.player1)}`
                            : ""}
                    </Typography>
                </Grid>
                <Grid item padding={0}>
                    <Typography
                        textTransform={"uppercase"}
                        padding={0}
                        fontSize={nameSize}
                        lineHeight={1.0}
                    >
                        {match
                            ? `${getInitials(match.awayTeam.player2)}`
                            : ""}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    </Grid>
}


export default Scoreboard;