import React from "react";
import { Box, Typography } from "@mui/material";

interface ScoreBoxProps {
  score: number | string;
  color: string;
  size?: "small" | "medium" | "large";
}

const sizeConfig = {
  small: {
    width: 52,
    height: 52,
    border: "2px",
    fontSize: "1.6rem",
    fontWeight: 700,
  },
  medium: {
    width: 70,
    height: 70,
    border: "4px",
    fontSize: "2.5rem",
    fontWeight: 800,
  },
  large: {
    width: 88,
    height: 88,
    border: "6px",
    fontSize: "3.25rem",
    fontWeight: 800,
  },
};

export const ScoreBox: React.FC<ScoreBoxProps> = ({ score, color, size = "medium" }) => {
  const config = sizeConfig[size];

  return (
    <Box
      className="match-score-shell"
      sx={{
        width: config.width,
        height: config.height,
        border: `${config.border} solid ${color}`,
        borderRadius: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.55)",
      }}
    >
      <Typography
        sx={{
          color: "#1c1c1e",
          fontWeight: config.fontWeight,
          fontSize: config.fontSize,
          lineHeight: 1,
        }}
      >
        {score}
      </Typography>
    </Box>
  );
};

export default ScoreBox;
