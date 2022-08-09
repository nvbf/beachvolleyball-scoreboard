import {getScheduleBySlug} from "../profixio";
import {useEffect, useState} from "react";


export default (profixioSlug) => {
  const [gameSchedule, setGameSchedule] = useState([]);
  useEffect( () => {
    console.log('Init profixio matches');
    const updateGameSchedule = async () => {
      try {
        const schedule = await getScheduleBySlug(profixioSlug)
        console.log('Schedule', schedule);
        setGameSchedule(schedule
          .sort((a, b) => (a.epoch - b.epoch) || (a.court.localeCompare(b.court))));
      }
      catch (err) {
        console.warn('Failed to update profixio matches', err);
      }
    }

    const scheduleTimer = setInterval(updateGameSchedule, 1000*(60*3))

    updateGameSchedule();

    return () => {
      clearInterval(scheduleTimer);
    }

  }, [])

  return gameSchedule;
}
