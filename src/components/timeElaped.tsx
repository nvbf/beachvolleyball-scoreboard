import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import moment from "moment";

interface Props {
  startTime: number;
  onTick?: (elapsedSeconds: number) => void;
}

const TimeElapsed: React.FC<Props> = ({ startTime, onTick }) => {
  const [time, setTime] = useState<string>("00:00");

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now();
      const elapsed = startTime === 0 ? moment.duration(0) : moment.duration(now - startTime)
      let hours = elapsed.hours().toString();
      let minutes = elapsed.minutes().toString();
      let seconds = elapsed.seconds().toString();
      let formattedTime = "";

      if (minutes.length < 2) {
        minutes = "0" + minutes;
      }

      if (seconds.length < 2) {
        seconds = "0" + seconds;
      }

      if (elapsed.hours() === 0) {
        formattedTime = `${minutes}:${seconds}`;
      } else {
        formattedTime = `${hours}:${minutes}:${seconds}`;
      }

      setTime(formattedTime);
      onTick?.(elapsed.asSeconds());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [startTime, onTick]);

  return (
    <div>
      {time}
    </div>
  );
};

export default TimeElapsed;
