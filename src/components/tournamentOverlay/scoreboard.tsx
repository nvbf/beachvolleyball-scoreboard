import { Box, Grid, Typography } from "@mui/material";
import { AdminMatch, Team } from "../tournamentAdmin/types";
import { getInitials } from "../../util/names";
import { TeamType } from "../types";
import React, { forwardRef, useEffect, useRef, useState } from "react";

const Scoreboard = ({ match }: { match: AdminMatch }) => {
  const homeTeamNameRef = useRef<HTMLDivElement>(null);
  const awayTeamNameRef = useRef<HTMLDivElement>(null);
  const [maxWidth, setMaxWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      console.log("resize observer");
      const homeWidth = homeTeamNameRef.current?.offsetWidth ?? 0;
      const awayWidth = awayTeamNameRef.current?.offsetWidth ?? 0;
      setMaxWidth(Math.max(homeWidth, awayWidth));
    });
    if (homeTeamNameRef.current) observer.observe(homeTeamNameRef.current);
    if (awayTeamNameRef.current) observer.observe(awayTeamNameRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const homeWidth = homeTeamNameRef.current?.offsetWidth ?? 0;
    const awayWidth = awayTeamNameRef.current?.offsetWidth ?? 0;
    setMaxWidth(Math.max(homeWidth, awayWidth));
  }, []);

  return (
    <Box
      sx={{
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        backgroundColor: "#123452",
      }}
    >
      <Box display="flex" justifyContent="center" mt={14}>
        <Box display="flex">
          <SetsAndPointsContainer reverse={false}>
            <TeamSetsWon setsWon={match.currentSetScore[TeamType.Home]} />

            <TeamPoints
              points={
                match.currentScore[match.currentScore.length - 1]?.[
                  TeamType.Home
                ] ?? 0
              }
            />
          </SetsAndPointsContainer>

          <Box style={{ width: "100px" }} />

          <SetsAndPointsContainer reverse={true}>
            <TeamPoints
              points={
                match.currentScore[match.currentScore.length - 1]?.[
                  TeamType.Away
                ] ?? 0
              }
            />
            <TeamSetsWon setsWon={match.currentSetScore[TeamType.Away]} />
          </SetsAndPointsContainer>
        </Box>
      </Box>
      <Box
        display="flex"
        mt={8}
        sx={{
          backgroundColor: "#123452",
          color: "rgb(246, 251, 255)",
          padding: "4px",
        }}
      >
        <TeamName
          team={match.homeTeam}
          ref={homeTeamNameRef}
          width={maxWidth}
          position="left"
        />

        <Box style={{ width: "100px" }} />

        <TeamName
          team={match.awayTeam}
          ref={awayTeamNameRef}
          width={maxWidth}
          position="right"
        />
      </Box>
    </Box>
  );
};

interface TeamNameProps {
  team: Team;
  width: number | undefined;
  position: "right" | "left";
}
const TeamName = forwardRef<HTMLDivElement, TeamNameProps>(
  ({ team, width, position }, ref) => {
    const nameSize = 72;

    console.log("Width is currently ", width);

    return (
      <Box
        sx={{ backgroundColor: "transparent" }}
        display="flex"
        alignItems="center"
        justifyContent={position === "left" ? "flex-end" : "flex-start"}
        flex={1}
      >
        <Grid
          container
          ref={ref}
          spacing={1}
          direction="column"
          paddingRight={position === "left" ? 2 : 2}
          paddingLeft={position === "left" ? 2 : 2}
          textAlign={position === "left" ? "right" : "left"}
          alignItems={position === "left" ? "flex-end" : "flex-start"}
          sx={{ backgroundColor: "transparent" }}
          width={"auto"}
          flexShrink={0}
        >
          <Grid item padding={0}>
            <Typography
              textTransform={"uppercase"}
              padding={0}
              fontSize={nameSize}
              lineHeight={1.4}
              whiteSpace="nowrap"
            >
              {getInitials(team.player1)}
            </Typography>
          </Grid>
          <Grid item padding={0}>
            <Typography
              padding={0}
              fontSize={nameSize}
              lineHeight={1.0}
              whiteSpace="nowrap"
            >
              {getInitials(team.player2)}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    );
  },
);

const TeamSetsWon = ({ setsWon }: { setsWon: number }) => {
  const numberSize = 200;

  return (
    <Box
      sx={{
        backgroundColor: "#123452",
        color: "#ffffff",
        margin: "6px",
        width: "240px",
      }}
      display="flex"
      alignItems="center"
      justifyContent="center" // center horizontally
    >
      <Box display="flex" flexDirection="column">
        <Box>
          <Typography
            textTransform={"uppercase"}
            fontSize={72}
            padding={0}
            margin={0}
            noWrap
          >
            set
          </Typography>
        </Box>
        <Box>
          <Typography fontSize={numberSize} lineHeight={1.2} noWrap>
            {setsWon}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const TeamPoints = ({ points }: { points: number }) => {
  const numberSize = 300;
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center" // center horizontally
      sx={{ textAlign: "right", minWidth: "400px", color: "white" }}
    >
      <Typography fontSize={numberSize}>{points}</Typography>
    </Box>
  );
};

const TournamentLogo = () => {
  return (
    <Grid item height={60} sx={{}} display="flex" alignItems="center">
      <img
        src={"/images/nvbf-logo.png"}
        style={{ height: "45px", marginRight: "20px", marginLeft: "20px" }}
      />
    </Grid>
  );
};

const SetsAndPointsContainer = ({
  reverse,
  children,
}: {
  reverse: boolean;
  children: React.ReactNode;
}) => {
  return (
    <Box
      display="flex"
      sx={{
        background: `linear-gradient(${reverse ? 90 : 270}deg,rgba(203, 32, 50, 1) 0%, rgba(203, 32, 50, 1) 50%, rgba(135, 23, 34, 1) 100%);`,
      }}
    >
      {children}
    </Box>
  );
};

export default Scoreboard;
