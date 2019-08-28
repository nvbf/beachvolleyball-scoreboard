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
    width: 480px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;   
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    margin-right: 2px;
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
    console.log('RE', re);
    return [re[1], getCountryCode(re[2])]
  }
  return [player, 'NA'];
}

const countryCodeMapping = {"BGD":"BD","BEL":"BE","BFA":"BF","BGR":"BG","BIH":"BA","BRB":"BB","WLF":"WF","BLM":"BL","BMU":"BM","BRN":"BN","BOL":"BO","BHR":"BH","BDI":"BI","BEN":"BJ","BTN":"BT","JAM":"JM","BVT":"BV","BWA":"BW","WSM":"WS","BES":"BQ","BRA":"BR","BHS":"BS","JEY":"JE","BLR":"BY","BLZ":"BZ","RUS":"RU","RWA":"RW","SRB":"RS","TLS":"TL","REU":"RE","TKM":"TM","TJK":"TJ","ROU":"RO","TKL":"TK","GNB":"GW","GUM":"GU","GTM":"GT","SGS":"GS","GRC":"GR","GNQ":"GQ","GLP":"GP","JPN":"JP","GUY":"GY","GGY":"GG","GUF":"GF","GEO":"GE","GRD":"GD","GBR":"GB","GAB":"GA","SLV":"SV","GIN":"GN","GMB":"GM","GRL":"GL","GIB":"GI","GHA":"GH","OMN":"OM","TUN":"TN","JOR":"JO","HRV":"HR","HTI":"HT","HUN":"HU","HKG":"HK","HND":"HN","HMD":"HM","VEN":"VE","PRI":"PR","PSE":"PS","PLW":"PW","PRT":"PT","SJM":"SJ","PRY":"PY","IRQ":"IQ","PAN":"PA","PYF":"PF","PNG":"PG","PER":"PE","PAK":"PK","PHL":"PH","PCN":"PN","POL":"PL","SPM":"PM","ZMB":"ZM","ESH":"EH","EST":"EE","EGY":"EG","ZAF":"ZA","ECU":"EC","ITA":"IT","VNM":"VN","SLB":"SB","ETH":"ET","SOM":"SO","ZWE":"ZW","SAU":"SA","ESP":"ES","ERI":"ER","MNE":"ME","MDA":"MD","MDG":"MG","MAF":"MF","MAR":"MA","MCO":"MC","UZB":"UZ","MMR":"MM","MLI":"ML","MAC":"MO","MNG":"MN","MHL":"MH","MKD":"MK","MUS":"MU","MLT":"MT","MWI":"MW","MDV":"MV","MTQ":"MQ","MNP":"MP","MSR":"MS","MRT":"MR","IMN":"IM","UGA":"UG","TZA":"TZ","MYS":"MY","MEX":"MX","ISR":"IL","FRA":"FR","IOT":"IO","SHN":"SH","FIN":"FI","FJI":"FJ","FLK":"FK","FSM":"FM","FRO":"FO","NIC":"NI","NLD":"NL","NOR":"NO","NAM":"NA","VUT":"VU","NCL":"NC","NER":"NE","NFK":"NF","NGA":"NG","NZL":"NZ","NPL":"NP","NRU":"NR","NIU":"NU","COK":"CK","XKX":"XK","CIV":"CI","CHE":"CH","COL":"CO","CHN":"CN","CMR":"CM","CHL":"CL","CCK":"CC","CAN":"CA","COG":"CG","CAF":"CF","COD":"CD","CZE":"CZ","CYP":"CY","CXR":"CX","CRI":"CR","CUW":"CW","CPV":"CV","CUB":"CU","SWZ":"SZ","SYR":"SY","SXM":"SX","KGZ":"KG","KEN":"KE","SSD":"SS","SUR":"SR","KIR":"KI","KHM":"KH","KNA":"KN","COM":"KM","STP":"ST","SVK":"SK","KOR":"KR","SVN":"SI","PRK":"KP","KWT":"KW","SEN":"SN","SMR":"SM","SLE":"SL","SYC":"SC","KAZ":"KZ","CYM":"KY","SGP":"SG","SWE":"SE","SDN":"SD","DOM":"DO","DMA":"DM","DJI":"DJ","DNK":"DK","VGB":"VG","DEU":"DE","YEM":"YE","DZA":"DZ","USA":"US","URY":"UY","MYT":"YT","UMI":"UM","LBN":"LB","LCA":"LC","LAO":"LA","TUV":"TV","TWN":"TW","TTO":"TT","TUR":"TR","LKA":"LK","LIE":"LI","LVA":"LV","TON":"TO","LTU":"LT","LUX":"LU","LBR":"LR","LSO":"LS","THA":"TH","ATF":"TF","TGO":"TG","TCD":"TD","TCA":"TC","LBY":"LY","VAT":"VA","VCT":"VC","ARE":"AE","AND":"AD","ATG":"AG","AFG":"AF","AIA":"AI","VIR":"VI","ISL":"IS","IRN":"IR","ARM":"AM","ALB":"AL","AGO":"AO","ATA":"AQ","ASM":"AS","ARG":"AR","AUS":"AU","AUT":"AT","ABW":"AW","IND":"IN","ALA":"AX","AZE":"AZ","IRL":"IE","IDN":"ID","UKR":"UA","QAT":"QA","MOZ":"MZ"};

const getCountryCode = (threeLetterCountryCode) => {
    if (countryCodeMapping[threeLetterCountryCode.toUpperCase()]) {
        return countryCodeMapping[threeLetterCountryCode.toUpperCase()].toLowerCase();
    }
    return threeLetterCountryCode.toLowerCase();
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
        <Flag className={`flag-icon-background flag-icon-squared flag-icon-${homeCountry}`}/>
        <PlayerContainer>
          <Player className="player-one"><Textfit mode="single" max={maxNameSize}>{match.h1Player}</Textfit></Player>
          <Player><Textfit mode="single" max={maxNameSize}>{h2Player}</Textfit></Player>
        </PlayerContainer>
        <Sets  points={homePoints}/>
      </TeamContainer>

      <TeamContainer>
        <Flag className={`flag-icon-background flag-icon-squared flag-icon-${awayCountry}`}/>
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
