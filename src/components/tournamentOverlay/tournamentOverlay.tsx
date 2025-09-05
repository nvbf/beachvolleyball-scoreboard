import Grid from "@mui/material/Grid/Grid";
import { AdminMatch } from "../tournamentAdmin/types";
import Scoreboard from "./scoreboard";
import { Typography } from "@mui/material";
import { timestampToStringHours } from "../../util/time";
import { getComingMatches, getCurrentMatch } from "../../util/overlay";
import React, { useEffect, useMemo } from "react";

const TournamentOverlay = ({
  matchesList,
  courtID,
}: {
  matchesList: AdminMatch[];
  courtID: string | null;
}) => {
  useEffect(() => {
    // Save original body background color
    // const originalBodyBackgroundColor = document.body.style.backgroundColor;

    // Change body background color to transparent
    document.body.style.backgroundColor = "transparent";

    // Reset body background color after component unmount
    return () => {
      // Don't reset bg color as it's a overlay service and worst case
      // we just bring back a non transparent color
      //document.body.style.backgroundColor = originalBodyBackgroundColor;
    };
  }, []);

  const currentMatch = useMemo(() => {
    return getCurrentMatch(matchesList, courtID || "");
  }, [courtID, matchesList]);

  const comingMatches = useMemo(() => {
    return getComingMatches(matchesList, courtID || "");
  }, [courtID, matchesList]);

  console.log("Current matches", matchesList, courtID);

  return (
    <div
      style={{
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        backgroundColor: "rgba(0, 0, 0, 0)", // backgroundColor: "rgba(0,0,0,0.7)",
        textAlign: "center",
        width: "1920px",
        height: "1080px",
      }}
    >
      {currentMatch && <Scoreboard match={currentMatch} />}
      {!currentMatch && (
        <Grid
          container
          direction="column"
          padding={0}
          rowGap={2}
          spacing={0}
          columns={12}
          sx={{
            position: "absolute",
            width: "887px",
            bottom: "0",
            left: "25%",
            top: "167px",
            right: "0",
          }}
        >
          <Grid
            item
            height={104}
            width={1}
            padding={0}
            sx={{
              backgroundColor: "#00A3DA",
              borderColor: "#000000",
              borderRadius: "15px",
              paddingX: "48px",
              paddingY: "20px",
            }}
          >
            <Grid
              container
              direction="row"
              alignItems="center"
              padding={0}
              rowGap={0}
              spacing={0}
              columns={12}
              height={1}
            >
              <Grid
                item
                padding={0}
                marginTop={"10px"}
                sx={
                  {
                    // backgroundColor: "#ddA3DA",
                  }
                }
              >
                <Typography
                  color={"#FBF9F9"}
                  fontWeight={"bold"}
                  align="left"
                  textTransform={"uppercase"}
                  margin={0}
                  padding={0}
                  fontSize={"50px"}
                  lineHeight={1.0}
                >
                  Neste kamper {courtID}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          {comingMatches
            .filter(() => {
              // return !e.isFinalized
              return true;
            })
            .map((match) => (
              <Grid
                item
                key={match.matchId}
                width={1}
                height={88}
                padding={0}
                sx={{
                  backgroundColor: "rgba(233, 237, 233, 0.9)",
                  borderColor: "#000000",
                  borderRadius: "15px",
                  paddingX: "48px",
                  paddingY: "20px",
                }}
              >
                {formattedMatch(match)}
              </Grid>
            ))}
        </Grid>
      )}
    </div>
  );
};

const formattedMatch = (match: AdminMatch): React.ReactNode => {
  const formattedTime = timestampToStringHours(match.startTime);
  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      padding={0}
      rowGap={0}
      spacing={0}
      columns={12}
      height={1}
    >
      <Grid
        item
        xs={3}
        padding={0}
        marginTop={"10px"}
        sx={{
          // backgroundColor: "#ddA3DA",
          borderColor: "#000000",
          borderWidth: "2px",
        }}
      >
        <Typography
          color={"#000000"}
          fontWeight={"bold"}
          align="left"
          textTransform={"uppercase"}
          margin={0}
          padding={0}
          fontSize={"24px"}
          lineHeight={1.0}
        >
          {match.matchCategory +
            " - " +
            (match.matchGroup !== ""
              ? " Group " + match.matchGroup
              : match.name)}
        </Typography>
      </Grid>
      <Grid
        item
        xs={4}
        padding={0}
        marginTop={"10px"}
        sx={{
          // backgroundColor: "#ddA3DA",
          borderColor: "#000000",
          borderWidth: "2px",
        }}
      >
        <Grid direction="column">
          <Grid item>{match.homeTeam.player1}</Grid>
          <Grid item>{match.homeTeam.player2}</Grid>
        </Grid>
      </Grid>
      <Grid
        item
        xs={1}
        padding={0}
        marginTop={"10px"}
        sx={{
          // backgroundColor: "#ddA3DA",
          borderColor: "#000000",
          borderWidth: "2px",
        }}
      >
        <Typography
          color={"#000000"}
          fontWeight={"bold"}
          align="left"
          textTransform={"uppercase"}
          margin={0}
          padding={0}
          fontSize={"24px"}
          lineHeight={1.0}
        >
          {formattedTime}
        </Typography>
      </Grid>
      <Grid
        item
        xs={4}
        padding={0}
        marginTop={"10px"}
        sx={{
          // backgroundColor: "#ddA3DA",
          borderColor: "#000000",
          borderWidth: "2px",
        }}
      >
        <Grid direction="column">
          <Grid item>{match.awayTeam.player1}</Grid>
          <Grid item>{match.awayTeam.player2}</Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default TournamentOverlay;
