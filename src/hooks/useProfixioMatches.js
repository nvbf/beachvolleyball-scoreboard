import {getScheduleBySlug} from "../profixio";
import {useEffect, useState} from "react";


export default (profixioSlug) => {
  const [gameSchedule, setGameSchedule] = useState([]);
  useEffect( () => {
    console.log('Init profixio matches');
    const updateGameSchedule = async () => {
      const schedule = await getScheduleBySlug(profixioSlug)
      console.log('Schedule', schedule);
      setGameSchedule(schedule);
    }

    const scheduleTimer = setInterval(updateGameSchedule, 1000*(60*3))

    updateGameSchedule();

    return () => {
      clearInterval(scheduleTimer);
    }

  }, [])

  return gameSchedule;
}
