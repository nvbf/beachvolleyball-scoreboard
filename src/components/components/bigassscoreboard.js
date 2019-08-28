import React from 'react';
import styled from 'styled-components';
import { Textfit } from 'react-textfit';


const ScoreBoard = styled.div`
   width: 1920px;
   height: 1080px;
   background-color: #a29393;
   position: fixed; 
   left: 0; 
   top: 0;  
`;

const ScoreBoardBackground = styled.div`
  position: absolute;
  left: 0;
  top: 0;
   width: 100%;
   height: 100%;
   /*background-image: url(http://worldtour.2019.fivb.com/-/media/fivb_beachvolleyball_world_tour_finals_rome_background.jpeg);*/
   background-image: url(/static/img/bigassbackground.jpg);
   background-size: cover;
   opacity: 0.6;
`;

const TeamContainer = styled.div`    
    height: 480px;
    margin-top: 40px;
    margin-left: 40px;
    display: flex;
    align-items: center;
    border-radius: 4px;
    position: relative;
`

const Flag = styled.div`
    height: 480px;
    width: 500px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
   
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    background-image: url(/static/img/flags/${props => props.country.toLowerCase()}.png);
`;

const PlayerContainer = styled.div`
    height: 480px;
    width: 800px;
    background-color: rgba(68, 68, 68, 0.8);    
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
`;

const Player = styled.div`
    padding-left: 50px;
    height: 240px;
    line-height: 240px;
    font-size: 80px;
    color: white;
    padding-right: 50px;
    text-transform: uppercase;
    
    &.player-one {
      border-bottom: 2px solid #d1c8b5;
    }
`;

const PointList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  width: 450px;
  white-space: nowrap;
  
  > li {
    box-sizing: border-box;
    background-color: rgba(68, 68, 68, 0.8);
    display: inline-block;
    width: 150px;    
    line-height: 200px;
    font-size: 130px;
    color: white;
    text-align: center;    
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    margin-left: 10px;
  }
  > li.winner {
    color: #ffcc00;
  }
`

const getCountryFromPlayer = (player) => {
  const re = player.match(/^([^(\[]+)\[([^(\]]+)/);
  if (re) {
    return [re[1], re[2]]
  }
  return [player, 'NA'];
}

export default ({match, exitScoreBoard}) => {

  console.log('Score board!');

  console.log('Match', match)

  const homePoints = [];
  const awayPoints = [];

  if (match.scoreInCompletedSet) {
    for (let set of match.scoreInCompletedSet.split(/,/g)) {
      const [ht, at] = set.split(/\-/);
      homePoints.push([parseInt(ht), parseInt(ht) > parseInt(at)]);
      awayPoints.push([parseInt(at), parseInt(ht) < parseInt(at)]);
    }
  }

  if (!match.isFinished) {
    homePoints.push([match.pointsInCurrentSet[0], false]);
    awayPoints.push([match.pointsInCurrentSet[1], false]);
  }

  const [h2Player, homeCountry] = getCountryFromPlayer(match.h2Player)
  const [b2Player, awayCountry] = getCountryFromPlayer(match.b2Player)

  const maxNameSize = 110;

  return (
    <ScoreBoard onDoubleClick={e => exitScoreBoard(null)}>
      <ScoreBoardBackground />
      <TeamContainer>
        <Flag country={homeCountry} />
        <PlayerContainer>
          <Player className="player-one"><Textfit mode="single" max={maxNameSize}>{match.h1Player}</Textfit></Player>
          <Player><Textfit mode="single" max={maxNameSize}>{h2Player}</Textfit></Player>
        </PlayerContainer>
        <Sets  points={homePoints}/>
      </TeamContainer>

      <TeamContainer>
        <Flag country={awayCountry} />
        <PlayerContainer>
          <Player className="player-one"><Textfit mode="single" max={maxNameSize}>{match.b1Player}</Textfit></Player>
          <Player><Textfit mode="single" max={maxNameSize}>{b2Player}</Textfit></Player>
        </PlayerContainer>
        <Sets  points={awayPoints} />
      </TeamContainer>
  </ScoreBoard>)
}


const Sets = (props) => {
  const sets = props.points.map( (points) => {
    return <li className={points[1] ? 'winner' : ''}>{points[0]}</li>
  });
  return <PointList>{sets}</PointList>
}
