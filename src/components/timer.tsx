import React, { useState, useRef } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

interface Props {
  initialTime?: number;
}

const Timer: React.FC<Props> = ({ initialTime = 0 }) => {
  const [time, setTime] = useState<number>(initialTime);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const intervalRef = useRef<number>(0);

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
    intervalRef.current = window.setInterval(() => {
      setTime((time) => time + 1);
    }, 1000);
  };

  const pauseTimer = () => {
    clearInterval(intervalRef.current);
    setIsPaused(true);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsActive(false);
    setIsPaused(false);
    setTime(initialTime);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div>
      <Typography variant="h4" component="span">
        {formatTime(time)}
      </Typography>
      <br />
      {!isActive && !isPaused && (
        <Button variant="contained" color="primary" onClick={startTimer}>
          Start
        </Button>
      )}
      {isActive && (
        <Button variant="contained" color="secondary" onClick={pauseTimer}>
          Pause
        </Button>
      )}
      {isActive || isPaused ? (
        <Button variant="contained" onClick={resetTimer}>
          Reset
        </Button>
      ) : null}
    </div>
  );
};

export default Timer;
