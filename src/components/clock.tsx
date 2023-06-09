import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";

interface Props {
  format?: "12h" | "24h";
}

const Clock: React.FC<Props> = ({ format = "24h" }) => {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      let hours = now.getHours().toString();
      let minutes = now.getMinutes().toString();
      let seconds = now.getSeconds().toString();

      if (hours.length < 2) {
        hours = "0" + hours;
      }

      if (minutes.length < 2) {
        minutes = "0" + minutes;
      }

      if (seconds.length < 2) {
        seconds = "0" + seconds;
      }

      let formattedTime = "";

      if (format === "12h") {
        const meridiem = hours >= "12" ? "PM" : "AM";
        const hour12 = (parseInt(hours) % 12) || "12";
        formattedTime = `${hour12}:${minutes}:${seconds} ${meridiem}`;
      } else {
        formattedTime = `${hours}:${minutes}:${seconds}`;
      }

      setTime(formattedTime);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [format]);

  return (
    <Typography variant="h3" component="span">
      {time}
    </Typography>
  );
};

export default Clock;
