import React from 'react';
import styled from 'styled-components';


const ScoreBoard = styled.div`
   width: 1920px;
   height: 1080px;
   background-color: #a29393;
   position: fixed; 
   left: 0; 
   top: 0
`;

const TeamContainer = styled.div`    
    height: 480px;
    margin-top: 40px;
    margin-left: 40px;
    display: flex;
    align-items: center;
    border-radius: 4px;
`

const Flag = styled.div`
    height: 480px;
    width: 500px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
   
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    background-image: url(http://spider.netlife.no/~oveien/flags/${props => props.country.toLowerCase()}.png);
`;

const PlayerContainer = styled.div`
    height: 480px;
    width: 800px;
    background-color: #444;
    padding-left: 50px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
`;

const Player = styled.div`
    height: 240px;
    line-height: 240px;
    font-size: 80px;
    color: white;
`;

const PointList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  width: 450px;
  white-space: nowrap;
  
  > li {
    box-sizing: border-box;
    background-color: #444;
    display: inline-block;
    width: 150px;    
    line-height: 200px;
    font-size: 130px;
    color: white;
    text-align: center;    
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    margin-left: 4px;
  }
`

const getCountryFromPlayer = (player) => {
  const re = player.match(/^([^(\[]+)\[([^(\]]+)/);
  return [re[1], re[2]]
}

export default ({match}) => {

  console.log('Score board!');

  console.log('Match', match)

  const homePoints = [];
  const awayPoints = [];

  if (match.scoreInCompletedSet) {
    for (let set of match.scoreInCompletedSet.split(/,/g)) {
      const [ht, at] = set.split(/\-/);
      homePoints.push(parseInt(ht));
      awayPoints.push(parseInt(at));
    }
  }

  homePoints.push(match.pointsInCurrentSet[0]);
  awayPoints.push(match.pointsInCurrentSet[1]);

  const [h1Player, homeCountry] = getCountryFromPlayer(match.h1Player + "[NOR]")
  const [b1Player, awayCountry] = getCountryFromPlayer(match.b1Player + "[SWE]")

  return (
    <ScoreBoard>
      <TeamContainer>
        <Flag country={homeCountry} />
        <PlayerContainer>
          <Player>{h1Player}</Player>
          <Player>{match.h2Player}</Player>
        </PlayerContainer>
        <Sets  points={homePoints}/>
      </TeamContainer>

      <TeamContainer>
        <Flag country={awayCountry} />
        <PlayerContainer>
          <Player>{b1Player}</Player>
          <Player>{match.b2Player}</Player>
        </PlayerContainer>
        <Sets  points={awayPoints}/>
      </TeamContainer>
  </ScoreBoard>)
}


const Sets = (props) => {
  const sets = props.points.map( (points) => {
    return <li>{points}</li>
  });
  return <PointList>{sets}</PointList>
}
