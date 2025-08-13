import {AdminMatch} from "../components/tournamentAdmin/types";
import {useState} from "react";
import TournamentOverlay
    from "../components/tournamentOverlay/tournamentOverlay";
import {
    getComingMatches,
    getCurrentMatch,
    normalizeServerMatches
} from "../util/overlay";


const TestTournamentOverlay = () => {
    const [matchesList, setMatchesList] = useState<AdminMatch[]>(getMatchList ());

    const courtID = "Bane 1";

    const handleStartNextMatch = () => {
        setMatchesList(matchesList => {
            const nextMatches = getComingMatches(matchesList, courtID);
            if (nextMatches.length === 0) {
                return matchesList;
            }
            const nextMatchId = nextMatches[0].matchId;
            return matchesList.map(match => {
                if (match.matchId === nextMatchId) {
                    return {
                        ...match,
                        isStarted: true
                    }
                }
                return match;
            })
        });
    }

    const handlEndCurrentMatch = () => {
        setMatchesList(matchesList => {
            const currentMatch = getCurrentMatch(matchesList, courtID);
            if (!currentMatch) {
                return matchesList;
            }

            return matchesList.map(match => {
                if (match.matchId === currentMatch.matchId) {
                    return {
                        ...match,
                        isFinalized: true,
                        hasWinner: true
                    }
                }
                return match;
            })
        });
    }



    return <>
        <div style={{position: 'relative', transform: 'scale(0.5)'}}>
            <TournamentOverlay matchesList={matchesList} courtID={courtID} />
        </div>
        <div
            style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            backgroundColor: '#ccc',
            textAlign: "center",
            width: "200px",
            padding: "10px",
        }}
            >
            <button onClick={handleStartNextMatch}>Start next match</button>
            <button onClick={handlEndCurrentMatch}>End current match</button>
        </div>
    </>
}

export default TestTournamentOverlay;


function getMatchList () : AdminMatch[] { return normalizeServerMatches([
    {
        "matchId": 1,
        "awayTeam": {
            "isWinner": false,
            "name": "Johanna Tara / Andrea  Riise-Krogh",
            "player1": "Johanna Tara",
            "player2": "Andrea  Riise-Krogh"
        },
        "currentScore": [
            {
                "AWAY": 14,
                "HOME": 21
            },
            {
                "HOME": 21,
                "AWAY": 7
            }
        ],
        "currentSetScore": {
            "AWAY": 0,
            "HOME": 2
        },
        "startTime": 1754643600000,
        "startTimestamp": 1754643659715,
        "arenaName": "Bane 1",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "E. Skaue / P. Johansen",
        "homeTeam": {
            "isWinner": true,
            "name": "Svanhild Remme / Aisha Zamboli Niang",
            "player1": "Svanhild Remme",
            "player2": "Aisha Zamboli Niang"
        },
        "matchCategory": "K",
        "matchGroup": "A",
        "sets": [
            {
                "PointsHomeTeam": 21,
                "PointsAwayTeam": 14,
                "Number": 1
            },
            {
                "PointsAwayTeam": 7,
                "Number": 2,
                "PointsHomeTeam": 21
            }
        ],
        "name": "",
        "scoreboardID": "86b7934a-5350-4eac-a09f-e98b9f71abba"
    },
    {
        "matchId": 10,
        "awayTeam": {
            "isWinner": false,
            "name": "Johan Selnes Rønningen / Ole Andreas  Grøteide",
            "player1": "Johan Selnes Rønningen",
            "player2": "Ole Andreas  Grøteide"
        },
        "currentScore": [
            {
                "AWAY": 12,
                "HOME": 21
            },
            {
                "AWAY": 13,
                "HOME": 21
            }
        ],
        "currentSetScore": {
            "HOME": 2,
            "AWAY": 0
        },
        "startTime": 1754649600000,
        "startTimestamp": 1754649630128,
        "arenaName": "Bane 2",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "A. The / S. Havelin",
        "homeTeam": {
            "isWinner": true,
            "name": "Thomas Steen Evensen / Simon Storsæter Evensen",
            "player1": "Thomas Steen Evensen",
            "player2": "Simon Storsæter Evensen"
        },
        "matchCategory": "M",
        "matchGroup": "B",
        "sets": [
            {
                "Number": 1,
                "PointsAwayTeam": 12,
                "PointsHomeTeam": 21
            },
            {
                "PointsHomeTeam": 21,
                "PointsAwayTeam": 13,
                "Number": 2
            }
        ],
        "name": "",
        "scoreboardID": "8ab7c76a-248d-45f9-9bbd-47d0dc3f2e0e"
    },
    {
        "matchId": 11,
        "awayTeam": {
            "isWinner": false,
            "name": "Amund Remme Røstengen / Vegard Høidalen",
            "player1": "Amund Remme Røstengen",
            "player2": "Vegard Høidalen"
        },
        "currentScore": [
            {
                "HOME": 16,
                "AWAY": 21
            },
            {
                "AWAY": 18,
                "HOME": 21
            },
            {
                "HOME": 15,
                "AWAY": 13
            }
        ],
        "currentSetScore": {
            "HOME": 2,
            "AWAY": 1
        },
        "startTime": 1754649600000,
        "startTimestamp": 1754649979118,
        "arenaName": "Bane 3",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "O. Billerfors / S. Tourres",
        "homeTeam": {
            "isWinner": true,
            "name": "Mikael Beckman Dos Santos / Oscar Hans Michelsen",
            "player1": "Mikael Beckman Dos Santos",
            "player2": "Oscar Hans Michelsen"
        },
        "matchCategory": "M",
        "matchGroup": "A",
        "sets": [
            {
                "PointsHomeTeam": 16,
                "Number": 1,
                "PointsAwayTeam": 21
            },
            {
                "Number": 2,
                "PointsAwayTeam": 18,
                "PointsHomeTeam": 21
            },
            {
                "PointsAwayTeam": 13,
                "PointsHomeTeam": 15,
                "Number": 3
            }
        ],
        "name": "",
        "scoreboardID": "7255947b-6c93-4f69-b72e-ad1af8ad951c"
    },
    {
        "matchId": 12,
        "awayTeam": {
            "isWinner": false,
            "name": "Matilde Lamøy / Juana Knöferl",
            "player1": "Matilde Lamøy",
            "player2": "Juana Knöferl"
        },
        "currentScore": [
            {
                "AWAY": 8,
                "HOME": 21
            },
            {
                "HOME": 21,
                "AWAY": 15
            }
        ],
        "currentSetScore": {
            "HOME": 2,
            "AWAY": 0
        },
        "startTime": 1754652600000,
        "startTimestamp": 1754652917103,
        "arenaName": "Bane 1",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "S. Remme / A. Niang",
        "homeTeam": {
            "isWinner": true,
            "name": "Vilde Alexandra Reiersen Høidalen / Martha Ravndal Øvsthus",
            "player1": "Vilde Alexandra Reiersen Høidalen",
            "player2": "Martha Ravndal Øvsthus"
        },
        "matchCategory": "K",
        "matchGroup": "B",
        "sets": [
            {
                "PointsAwayTeam": 8,
                "PointsHomeTeam": 21,
                "Number": 1
            },
            {
                "PointsHomeTeam": 21,
                "PointsAwayTeam": 15,
                "Number": 2
            }
        ],
        "name": "",
        "scoreboardID": "dc7812d4-1c54-4185-950c-608fda347038"
    },
    {
        "matchId": 13,
        "awayTeam": {
            "isWinner": false,
            "name": "Fredrik Andersen / Taha  Tokmak",
            "player1": "Fredrik Andersen",
            "player2": "Taha  Tokmak"
        },
        "currentScore": [
            {
                "AWAY": 18,
                "HOME": 21
            },
            {
                "AWAY": 22,
                "HOME": 20
            },
            {
                "HOME": 15,
                "AWAY": 6
            }
        ],
        "currentSetScore": {
            "AWAY": 1,
            "HOME": 2
        },
        "startTime": 1754652600000,
        "startTimestamp": 1754652579144,
        "arenaName": "Bane 2",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "J. Rønningen / O. Grøteide",
        "homeTeam": {
            "isWinner": true,
            "name": "Theodor Atilla Bartinlioglu / Kristian  Nohr",
            "player1": "Theodor Atilla Bartinlioglu",
            "player2": "Kristian  Nohr"
        },
        "matchCategory": "M",
        "matchGroup": "E",
        "sets": [
            {
                "PointsAwayTeam": 18,
                "Number": 1,
                "PointsHomeTeam": 21
            },
            {
                "PointsHomeTeam": 20,
                "PointsAwayTeam": 22,
                "Number": 2
            },
            {
                "PointsHomeTeam": 15,
                "PointsAwayTeam": 6,
                "Number": 3
            }
        ],
        "name": "",
        "scoreboardID": "bacacf37-6576-41d0-9dd6-6e88d5d06c9f"
    },
    {
        "matchId": 14,
        "awayTeam": {
            "isWinner": false,
            "name": "Oskar Billerfors / Stephane Tourres",
            "player1": "Oskar Billerfors",
            "player2": "Stephane Tourres"
        },
        "currentScore": [
            {
                "AWAY": 15,
                "HOME": 21
            },
            {
                "AWAY": 12,
                "HOME": 21
            }
        ],
        "currentSetScore": {
            "AWAY": 0,
            "HOME": 2
        },
        "startTime": 1754646600000,
        "startTimestamp": 1754646319598,
        "arenaName": "Bane 3",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "S. Jonassen / I. Sørensen",
        "homeTeam": {
            "isWinner": true,
            "name": "Tuomas Ilkka Henrikki Heiskanen / Andreas Alexandersen",
            "player1": "Tuomas Ilkka Henrikki Heiskanen",
            "player2": "Andreas Alexandersen"
        },
        "matchCategory": "M",
        "matchGroup": "F",
        "sets": [
            {
                "Number": 1,
                "PointsHomeTeam": 21,
                "PointsAwayTeam": 15
            },
            {
                "Number": 2,
                "PointsHomeTeam": 21,
                "PointsAwayTeam": 12
            }
        ],
        "name": "",
        "scoreboardID": "e964853d-29c2-4ddc-9bf7-f03beb6ee991"
    },
    {
        "matchId": 15,
        "awayTeam": {
            "isWinner": true,
            "name": "Josefine Sørland Øines / Grethe Tuft Soltvedt",
            "player1": "Josefine Sørland Øines",
            "player2": "Grethe Tuft Soltvedt"
        },
        "currentScore": [
            {
                "AWAY": 17,
                "HOME": 21
            },
            {
                "AWAY": 21,
                "HOME": 17
            },
            {
                "AWAY": 15,
                "HOME": 12
            }
        ],
        "currentSetScore": {
            "HOME": 1,
            "AWAY": 2
        },
        "startTime": 1754655600000,
        "startTimestamp": 1754655648865,
        "arenaName": "Bane 1",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "M. Lamøy / J. Knöferl",
        "homeTeam": {
            "isWinner": false,
            "name": "Ingrid Mogstad Tørlen / Kristine Wiig Skarlund",
            "player1": "Ingrid Mogstad Tørlen",
            "player2": "Kristine Wiig Skarlund"
        },
        "matchCategory": "K",
        "matchGroup": "B",
        "sets": [
            {
                "PointsHomeTeam": 21,
                "PointsAwayTeam": 17,
                "Number": 1
            },
            {
                "PointsAwayTeam": 21,
                "PointsHomeTeam": 17,
                "Number": 2
            },
            {
                "PointsHomeTeam": 12,
                "PointsAwayTeam": 15,
                "Number": 3
            }
        ],
        "name": "",
        "scoreboardID": "294f190b-56e1-464b-8d34-ce8040757fb6"
    },
    {
        "matchId": 16,
        "awayTeam": {
            "isWinner": true,
            "name": "Roel-Johan Johansen / Ermīns  Trušelis",
            "player1": "Roel-Johan Johansen",
            "player2": "Ermīns  Trušelis"
        },
        "currentScore": [
            {
                "AWAY": 21,
                "HOME": 7
            },
            {
                "AWAY": 21,
                "HOME": 10
            }
        ],
        "currentSetScore": {
            "AWAY": 2,
            "HOME": 0
        },
        "startTime": 1754655600000,
        "startTimestamp": 1754655882099,
        "arenaName": "Bane 2",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "F. Andersen / T. Tokmak",
        "homeTeam": {
            "isWinner": false,
            "name": "Lucas Rossi / Patrik  Abelsen",
            "player1": "Lucas Rossi",
            "player2": "Patrik  Abelsen"
        },
        "matchCategory": "M",
        "matchGroup": "C",
        "sets": [
            {
                "PointsAwayTeam": 21,
                "Number": 1,
                "PointsHomeTeam": 7
            },
            {
                "Number": 2,
                "PointsHomeTeam": 10,
                "PointsAwayTeam": 21
            }
        ],
        "name": "",
        "scoreboardID": "20d52331-0f96-40ec-afd4-dcec9097d645"
    },
    {
        "matchId": 17,
        "awayTeam": {
            "isWinner": true,
            "name": "Kai-Uwe Eiselt / Athit Duangkanya",
            "player1": "Kai-Uwe Eiselt",
            "player2": "Athit Duangkanya"
        },
        "currentScore": [
            {
                "HOME": 16,
                "AWAY": 21
            },
            {
                "HOME": 19,
                "AWAY": 21
            }
        ],
        "currentSetScore": {
            "HOME": 0,
            "AWAY": 2
        },
        "startTime": 1754652600000,
        "startTimestamp": 1754653201831,
        "arenaName": "Bane 3",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "A. Røstengen / V. Høidalen",
        "homeTeam": {
            "isWinner": false,
            "name": "Nicolay Martin Hansen / Christoffer Vikjord",
            "player1": "Nicolay Martin Hansen",
            "player2": "Christoffer Vikjord"
        },
        "matchCategory": "M",
        "matchGroup": "D",
        "sets": [
            {
                "Number": 1,
                "PointsAwayTeam": 21,
                "PointsHomeTeam": 16
            },
            {
                "PointsAwayTeam": 21,
                "PointsHomeTeam": 19,
                "Number": 2
            }
        ],
        "name": "",
        "scoreboardID": "e9bd2fdd-d9d5-468c-90d4-15cd020c32fc"
    },
    {
        "matchId": 18,
        "awayTeam": {
            "isWinner": true,
            "name": "Andrea Nerbøvik Persøy / Jenny Josefin Hansen",
            "player1": "Andrea Nerbøvik Persøy",
            "player2": "Jenny Josefin Hansen"
        },
        "currentScore": [
            {
                "HOME": 21,
                "AWAY": 7
            },
            {
                "AWAY": 21,
                "HOME": 4
            }
        ],
        "currentSetScore": {
            "AWAY": 1,
            "HOME": 1
        },
        "startTime": 1754655600000,
        "startTimestamp": 1754656174011,
        "arenaName": "Bane 4",
        "isStarted": false,
        "hasWinner": false,
        "referee": "Arrangør",
        "homeTeam": {
            "isWinner": false,
            "name": "Johanna Tara / Andrea  Riise-Krogh",
            "player1": "Johanna Tara",
            "player2": "Andrea  Riise-Krogh"
        },
        "matchCategory": "K",
        "matchGroup": "A",
        "sets": [
            {
                "PointsHomeTeam": 4,
                "Number": 1,
                "PointsAwayTeam": 21
            },
            {
                "Number": 2,
                "PointsAwayTeam": 21,
                "PointsHomeTeam": 7
            }
        ],
        "name": "",
        "scoreboardID": "faf11354-5adc-4be7-b318-5c6c0d5eb911"
    },
    {
        "matchId": 19,
        "awayTeam": {
            "isWinner": true,
            "name": "Siri Okkenhaug / Hilde Stokke Bauck",
            "player1": "Siri Okkenhaug",
            "player2": "Hilde Stokke Bauck"
        },
        "currentScore": [
            {
                "HOME": 16,
                "AWAY": 21
            },
            {
                "HOME": 10,
                "AWAY": 21
            }
        ],
        "currentSetScore": {
            "AWAY": 2,
            "HOME": 0
        },
        "startTime": 1754658600000,
        "startTimestamp": 1754659064272,
        "arenaName": "Bane 1",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "I. Tørlen / K. Skarlund",
        "homeTeam": {
            "isWinner": false,
            "name": "Høidalen, Vilde Alexandra Reiersen / Engøy Hadland Løkaas, Sofie ",
            "player1": "Høidalen, Vilde Alexandra Reiersen",
            "player2": "Engøy Hadland Løkaas, Sofie"
        },
        "matchCategory": "K",
        "matchGroup": "B",
        "sets": [
            {
                "Number": 1,
                "PointsAwayTeam": 21,
                "PointsHomeTeam": 16
            },
            {
                "Number": 2,
                "PointsHomeTeam": 10,
                "PointsAwayTeam": 21
            }
        ],
        "name": "",
        "scoreboardID": "02e868a9-707f-4e34-ba69-c6df9b766e98"
    },
    {
        "matchId": 2,
        "awayTeam": {
            "isWinner": false,
            "name": "William Tiderman / Werner Skaue",
            "player1": "William Tiderman",
            "player2": "Werner Skaue"
        },
        "currentScore": [
            {
                "HOME": 21,
                "AWAY": 18
            },
            {
                "AWAY": 15,
                "HOME": 21
            }
        ],
        "currentSetScore": {
            "AWAY": 0,
            "HOME": 2
        },
        "startTime": 1754643600000,
        "startTimestamp": 1754643649995,
        "arenaName": "Bane 2",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "T. Evensen / S. Evensen",
        "homeTeam": {
            "isWinner": true,
            "name": "Lars Ragnar Vollan / Syver Drolsum Klungsøyr",
            "player1": "Lars Ragnar Vollan",
            "player2": "Syver Drolsum Klungsøyr"
        },
        "matchCategory": "M",
        "matchGroup": "A",
        "sets": [
            {
                "PointsHomeTeam": 21,
                "Number": 1,
                "PointsAwayTeam": 18
            },
            {
                "PointsHomeTeam": 21,
                "Number": 2,
                "PointsAwayTeam": 15
            }
        ],
        "name": "",
        "scoreboardID": "6bb73540-6916-4304-82c2-1d79a7ef4358"
    },
    {
        "matchId": 20,
        "awayTeam": {
            "isWinner": false,
            "name": "Adrian The / Sebastian Havelin",
            "player1": "Adrian The",
            "player2": "Sebastian Havelin"
        },
        "currentScore": [
            {
                "AWAY": 21,
                "HOME": 15
            },
            {
                "AWAY": 21,
                "HOME": 23
            },
            {
                "HOME": 15,
                "AWAY": 10
            }
        ],
        "currentSetScore": {
            "AWAY": 1,
            "HOME": 2
        },
        "startTime": 1754658600000,
        "startTimestamp": 1754665054686,
        "arenaName": "Bane 2",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "L. Rossi / P. Abelsen",
        "homeTeam": {
            "isWinner": true,
            "name": "Johan Selnes Rønningen / Ole Andreas  Grøteide",
            "player1": "Johan Selnes Rønningen",
            "player2": "Ole Andreas  Grøteide"
        },
        "matchCategory": "M",
        "matchGroup": "B",
        "sets": [
            {
                "PointsHomeTeam": 15,
                "Number": 1,
                "PointsAwayTeam": 21
            },
            {
                "Number": 2,
                "PointsHomeTeam": 23,
                "PointsAwayTeam": 21
            },
            {
                "Number": 3,
                "PointsAwayTeam": 10,
                "PointsHomeTeam": 15
            }
        ],
        "name": "",
        "scoreboardID": "2ba2e58a-0f68-49e5-8014-756fb04c1596"
    },
    {
        "matchId": 21,
        "awayTeam": {
            "isWinner": true,
            "name": "Amund Remme Røstengen / Vegard Høidalen",
            "player1": "Amund Remme Røstengen",
            "player2": "Vegard Høidalen"
        },
        "currentScore": [
            {
                "HOME": 10,
                "AWAY": 21
            },
            {
                "AWAY": 21,
                "HOME": 10
            }
        ],
        "currentSetScore": {
            "AWAY": 2,
            "HOME": 0
        },
        "startTime": 1754658600000,
        "startTimestamp": 1754659200794,
        "arenaName": "Bane 3",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "O. Billerfors / S. Tourres",
        "homeTeam": {
            "isWinner": false,
            "name": "William Tiderman / Werner Skaue",
            "player1": "William Tiderman",
            "player2": "Werner Skaue"
        },
        "matchCategory": "M",
        "matchGroup": "A",
        "sets": [
            {
                "PointsAwayTeam": 21,
                "Number": 1,
                "PointsHomeTeam": 10
            },
            {
                "Number": 2,
                "PointsHomeTeam": 10,
                "PointsAwayTeam": 21
            }
        ],
        "name": "",
        "scoreboardID": "064597d9-f8be-43cf-b7db-ac6d9894eeec"
    },
    {
        "matchId": 22,
        "awayTeam": {
            "isWinner": true,
            "name": "Elise Skaue / Pia Sivertsen Johansen",
            "player1": "Elise Skaue",
            "player2": "Pia Sivertsen Johansen"
        },
        "currentScore": [
            {
                "HOME": 10,
                "AWAY": 21
            },
            {
                "AWAY": 21,
                "HOME": 8
            }
        ],
        "currentSetScore": {
            "AWAY": 2,
            "HOME": 0
        },
        "startTime": 1754658600000,
        "startTimestamp": 1754658685197,
        "arenaName": "Bane 4",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "A. Persøy / J. Hansen",
        "homeTeam": {
            "isWinner": false,
            "name": "Oda Emilie Høidalen / Victoria Kalheim",
            "player1": "Oda Emilie Høidalen",
            "player2": "Victoria Kalheim"
        },
        "matchCategory": "K",
        "matchGroup": "A",
        "sets": [
            {
                "PointsHomeTeam": 10,
                "PointsAwayTeam": 21,
                "Number": 1
            },
            {
                "PointsHomeTeam": 8,
                "Number": 2,
                "PointsAwayTeam": 21
            }
        ],
        "name": "",
        "scoreboardID": "685d78a7-0555-4ac4-bf3b-eac0ad195e2b"
    },
    {
        "matchId": 23,
        "awayTeam": {
            "isWinner": false,
            "name": "Svanhild Remme / Aisha Zamboli Niang",
            "player1": "Svanhild Remme",
            "player2": "Aisha Zamboli Niang"
        },
        "currentScore": [
            {
                "AWAY": 9,
                "HOME": 21
            },
            {
                "HOME": 21,
                "AWAY": 9
            }
        ],
        "currentSetScore": {
            "HOME": 2,
            "AWAY": 0
        },
        "startTime": 1754661600000,
        "startTimestamp": 1754661667244,
        "arenaName": "Bane 1",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "H. Reiersen / E. ",
        "homeTeam": {
            "isWinner": true,
            "name": "Andrea Nerbøvik Persøy / Jenny Josefin Hansen",
            "player1": "Andrea Nerbøvik Persøy",
            "player2": "Jenny Josefin Hansen"
        },
        "matchCategory": "K",
        "matchGroup": "A",
        "sets": [
            {
                "Number": 1,
                "PointsAwayTeam": 9,
                "PointsHomeTeam": 21
            },
            {
                "PointsAwayTeam": 9,
                "PointsHomeTeam": 21,
                "Number": 2
            }
        ],
        "name": "",
        "scoreboardID": "b40a8ea8-0dde-486b-b782-cab871340928"
    },
    {
        "matchId": 24,
        "awayTeam": {
            "isWinner": false,
            "name": "Theodor Atilla Bartinlioglu / Kristian  Nohr",
            "player1": "Theodor Atilla Bartinlioglu",
            "player2": "Kristian  Nohr"
        },
        "currentScore": [
            {
                "AWAY": 15,
                "HOME": 21
            },
            {
                "AWAY": 16,
                "HOME": 21
            }
        ],
        "currentSetScore": {
            "AWAY": 0,
            "HOME": 2
        },
        "startTime": 1754661600000,
        "startTimestamp": 1754661671785,
        "arenaName": "Bane 2",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "A. The / S. Havelin",
        "homeTeam": {
            "isWinner": true,
            "name": "Maren Næss Våge / Fredrik Hannås",
            "player1": "Maren Næss Våge",
            "player2": "Fredrik Hannås"
        },
        "matchCategory": "M",
        "matchGroup": "E",
        "sets": [
            {
                "Number": 1,
                "PointsAwayTeam": 15,
                "PointsHomeTeam": 21
            },
            {
                "PointsHomeTeam": 21,
                "Number": 2,
                "PointsAwayTeam": 16
            }
        ],
        "name": "",
        "scoreboardID": "049527c6-563e-4e7f-af06-bb9ae2375ea8"
    },
    {
        "matchId": 25,
        "awayTeam": {
            "isWinner": true,
            "name": "Tuomas Ilkka Henrikki Heiskanen / Andreas Alexandersen",
            "player1": "Tuomas Ilkka Henrikki Heiskanen",
            "player2": "Andreas Alexandersen"
        },
        "currentScore": [
            {
                "AWAY": 21,
                "HOME": 12
            },
            {
                "HOME": 14,
                "AWAY": 21
            }
        ],
        "currentSetScore": {
            "AWAY": 2,
            "HOME": 0
        },
        "startTime": 1754664600000,
        "startTimestamp": 1754664882740,
        "arenaName": "Bane 3",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "N. Hansen / C. Vikjord",
        "homeTeam": {
            "isWinner": false,
            "name": "Jesper Solheim Johansen / Magnus Eidissen",
            "player1": "Jesper Solheim Johansen",
            "player2": "Magnus Eidissen"
        },
        "matchCategory": "M",
        "matchGroup": "F",
        "sets": [
            {
                "PointsHomeTeam": 12,
                "Number": 1,
                "PointsAwayTeam": 21
            },
            {
                "PointsHomeTeam": 14,
                "PointsAwayTeam": 21,
                "Number": 2
            }
        ],
        "name": "",
        "scoreboardID": "50a59104-2c8d-4355-aeac-61decb86df49"
    },
    {
        "matchId": 26,
        "awayTeam": {
            "isWinner": true,
            "name": "Ingrid Mogstad Tørlen / Kristine Wiig Skarlund",
            "player1": "Ingrid Mogstad Tørlen",
            "player2": "Kristine Wiig Skarlund"
        },
        "currentScore": [
            {
                "AWAY": 21,
                "HOME": 3
            },
            {
                "AWAY": 21,
                "HOME": 6
            }
        ],
        "currentSetScore": {
            "HOME": 0,
            "AWAY": 2
        },
        "startTime": 1754664600000,
        "startTimestamp": 1754664588435,
        "arenaName": "Bane 1",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "S. Remme / A. Niang",
        "homeTeam": {
            "isWinner": false,
            "name": "Matilde Lamøy / Juana Knöferl",
            "player1": "Matilde Lamøy",
            "player2": "Juana Knöferl"
        },
        "matchCategory": "K",
        "matchGroup": "B",
        "sets": [
            {
                "PointsHomeTeam": 3,
                "Number": 1,
                "PointsAwayTeam": 21
            },
            {
                "PointsAwayTeam": 21,
                "Number": 2,
                "PointsHomeTeam": 6
            }
        ],
        "name": "",
        "scoreboardID": "f711b4e3-cbc3-4d16-bcdd-61ed3afa46a7"
    },
    {
        "matchId": 27,
        "awayTeam": {
            "isWinner": false,
            "name": "Lucas Rossi / Patrik  Abelsen",
            "player1": "Lucas Rossi",
            "player2": "Patrik  Abelsen"
        },
        "currentScore": [
            {
                "HOME": 23,
                "AWAY": 21
            },
            {
                "AWAY": 17,
                "HOME": 21
            }
        ],
        "currentSetScore": {
            "HOME": 2,
            "AWAY": 0
        },
        "startTime": 1754664600000,
        "startTimestamp": 1754665111038,
        "arenaName": "Bane 2",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "T. Bartinlioglu / K. Nohr",
        "homeTeam": {
            "isWinner": true,
            "name": "Henry Ivan Falch / Martin  Hermo",
            "player1": "Henry Ivan Falch",
            "player2": "Martin  Hermo"
        },
        "matchCategory": "M",
        "matchGroup": "C",
        "sets": [
            {
                "PointsHomeTeam": 23,
                "Number": 1,
                "PointsAwayTeam": 21
            },
            {
                "PointsHomeTeam": 21,
                "Number": 2,
                "PointsAwayTeam": 17
            }
        ],
        "name": "",
        "scoreboardID": "fa097851-b683-456c-bbd6-26e06d272526"
    },
    {
        "matchId": 28,
        "awayTeam": {
            "isWinner": false,
            "name": "Nicolay Martin Hansen / Christoffer Vikjord",
            "player1": "Nicolay Martin Hansen",
            "player2": "Christoffer Vikjord"
        },
        "currentScore": [
            {
                "HOME": 19,
                "AWAY": 21
            },
            {
                "HOME": 21,
                "AWAY": 11
            },
            {
                "HOME": 15,
                "AWAY": 6
            }
        ],
        "currentSetScore": {
            "AWAY": 1,
            "HOME": 2
        },
        "startTime": 1754661600000,
        "startTimestamp": 1754661982516,
        "arenaName": "Bane 3",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "W. Tiderman / W. Skaue",
        "homeTeam": {
            "isWinner": true,
            "name": "Simon Pleym Jonassen / Isak Elias Sørensen",
            "player1": "Simon Pleym Jonassen",
            "player2": "Isak Elias Sørensen"
        },
        "matchCategory": "M",
        "matchGroup": "D",
        "sets": [
            {
                "Number": 1,
                "PointsAwayTeam": 21,
                "PointsHomeTeam": 19
            },
            {
                "PointsHomeTeam": 21,
                "PointsAwayTeam": 11,
                "Number": 2
            },
            {
                "Number": 3,
                "PointsAwayTeam": 6,
                "PointsHomeTeam": 15
            }
        ],
        "name": "",
        "scoreboardID": "47afb391-b23b-432a-95da-cdfd80c456ae"
    },
    {
        "matchId": 29,
        "awayTeam": {
            "isWinner": false,
            "name": "Siri Okkenhaug / Hilde Stokke Bauck",
            "player1": "Siri Okkenhaug",
            "player2": "Hilde Stokke Bauck"
        },
        "currentScore": [
            {
                "AWAY": 15,
                "HOME": 21
            }
        ],
        "currentSetScore": {
            "AWAY": 0,
            "HOME": 1
        },
        "startTime": 1754667600000,
        "startTimestamp": 1754668929579,
        "arenaName": "Bane 1",
        "isStarted": false,
        "hasWinner": false,
        "referee": "M. Lamøy / J. Knöferl",
        "homeTeam": {
            "isWinner": true,
            "name": "Josefine Sørland Øines / Grethe Tuft Soltvedt",
            "player1": "Josefine Sørland Øines",
            "player2": "Grethe Tuft Soltvedt"
        },
        "matchCategory": "K",
        "matchGroup": "B",
        "sets": [
            {
                "PointsAwayTeam": 12,
                "Number": 1,
                "PointsHomeTeam": 21
            },
            {
                "Number": 2,
                "PointsAwayTeam": 15,
                "PointsHomeTeam": 21
            }
        ],
        "name": "",
        "scoreboardID": "ef41a6f3-df42-4347-bc87-c84ec0ff9575"
    },
    {
        "matchId": 3,
        "awayTeam": {
            "isWinner": false,
            "name": "Oskar Billerfors / Stephane Tourres",
            "player1": "Oskar Billerfors",
            "player2": "Stephane Tourres"
        },
        "currentScore": [
            {
                "AWAY": 16,
                "HOME": 21
            },
            {
                "HOME": 21,
                "AWAY": 14
            }
        ],
        "currentSetScore": {
            "HOME": 2,
            "AWAY": 0
        },
        "startTime": 1754655600000,
        "startTimestamp": 1754656001389,
        "arenaName": "Bane 3",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "N. Hansen / C. Vikjord",
        "homeTeam": {
            "isWinner": true,
            "name": "Jesper Solheim Johansen / Magnus Eidissen",
            "player1": "Jesper Solheim Johansen",
            "player2": "Magnus Eidissen"
        },
        "matchCategory": "M",
        "matchGroup": "F",
        "sets": [
            {
                "PointsAwayTeam": 16,
                "PointsHomeTeam": 21,
                "Number": 1
            },
            {
                "Number": 2,
                "PointsAwayTeam": 14,
                "PointsHomeTeam": 21
            }
        ],
        "name": "",
        "scoreboardID": "43c3d83d-0119-4a9e-8cb8-d0c5db9385f2"
    },
    {
        "matchId": 30,
        "awayTeam": {
            "isWinner": false,
            "name": "Pavle Cetkovic / Nikolay Syrota",
            "player1": "Pavle Cetkovic",
            "player2": "Nikolay Syrota"
        },
        "currentScore": [
            {
                "AWAY": 21,
                "HOME": 15
            },
            {
                "HOME": 21,
                "AWAY": 14
            },
            {
                "AWAY": 12,
                "HOME": 15
            }
        ],
        "currentSetScore": {
            "HOME": 2,
            "AWAY": 1
        },
        "startTime": 1754667600000,
        "startTimestamp": 1754668155652,
        "arenaName": "Bane 2",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "L. Rossi / P. Abelsen",
        "homeTeam": {
            "isWinner": true,
            "name": "Thomas Steen Evensen / Simon Storsæter Evensen",
            "player1": "Thomas Steen Evensen",
            "player2": "Simon Storsæter Evensen"
        },
        "matchCategory": "M",
        "matchGroup": "B",
        "sets": [
            {
                "Number": 1,
                "PointsHomeTeam": 15,
                "PointsAwayTeam": 21
            },
            {
                "PointsAwayTeam": 14,
                "PointsHomeTeam": 21,
                "Number": 2
            },
            {
                "Number": 3,
                "PointsAwayTeam": 12,
                "PointsHomeTeam": 15
            }
        ],
        "name": "",
        "scoreboardID": "55cba8be-6c9e-40f6-acc3-e3002f8aa96e"
    },
    {
        "matchId": 31,
        "awayTeam": {
            "isWinner": false,
            "name": "Mikael Beckman Dos Santos / Oscar Hans Michelsen",
            "player1": "Mikael Beckman Dos Santos",
            "player2": "Oscar Hans Michelsen"
        },
        "currentScore": [
            {
                "AWAY": 15,
                "HOME": 21
            },
            {
                "AWAY": 18,
                "HOME": 21
            }
        ],
        "currentSetScore": {
            "HOME": 2,
            "AWAY": 0
        },
        "startTime": 1754667600000,
        "startTimestamp": 1754667877783,
        "arenaName": "Bane 3",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "J. Johansen / M. Eidissen",
        "homeTeam": {
            "isWinner": true,
            "name": "Lars Ragnar Vollan / Syver Drolsum Klungsøyr",
            "player1": "Lars Ragnar Vollan",
            "player2": "Syver Drolsum Klungsøyr"
        },
        "matchCategory": "M",
        "matchGroup": "A",
        "sets": [
            {
                "Number": 1,
                "PointsAwayTeam": 15,
                "PointsHomeTeam": 21
            },
            {
                "PointsHomeTeam": 21,
                "PointsAwayTeam": 18,
                "Number": 2
            }
        ],
        "name": "",
        "scoreboardID": "8fd79dbc-6800-48c2-8fa5-26744ac4ddde"
    },
    {
        "matchId": 32,
        "awayTeam": {
            "isWinner": false,
            "name": "Høidalen, Vilde Alexandra Reiersen / Engøy Hadland Løkaas, Sofie ",
            "player1": "Høidalen, Vilde Alexandra Reiersen",
            "player2": "Engøy Hadland Løkaas, Sofie"
        },
        "currentScore": [
            {
                "HOME": 21,
                "AWAY": 10
            }
        ],
        "currentSetScore": {
            "AWAY": 0,
            "HOME": 1
        },
        "startTime": 1754670600000,
        "startTimestamp": 1754670657016,
        "arenaName": "Bane 1",
        "isStarted": false,
        "hasWinner": false,
        "referee": "S. Okkenhaug / H. Bauck",
        "homeTeam": {
            "isWinner": true,
            "name": "Ingrid Mogstad Tørlen / Kristine Wiig Skarlund",
            "player1": "Ingrid Mogstad Tørlen",
            "player2": "Kristine Wiig Skarlund"
        },
        "matchCategory": "K",
        "matchGroup": "B",
        "sets": [
            {
                "PointsAwayTeam": 10,
                "PointsHomeTeam": 21,
                "Number": 1
            },
            {
                "PointsHomeTeam": 21,
                "PointsAwayTeam": 6,
                "Number": 2
            }
        ],
        "name": "",
        "scoreboardID": "e6d8d9ec-0853-4d5a-917e-a5e698ebb57c"
    },
    {
        "matchId": 33,
        "awayTeam": {
            "isWinner": true,
            "name": "Tuomas Ilkka Henrikki Heiskanen / Andreas Alexandersen",
            "player1": "Tuomas Ilkka Henrikki Heiskanen",
            "player2": "Andreas Alexandersen"
        },
        "currentScore": [
            {
                "AWAY": 21,
                "HOME": 5
            },
            {
                "AWAY": 20,
                "HOME": 12
            }
        ],
        "currentSetScore": {
            "AWAY": 1,
            "HOME": 0
        },
        "startTime": 1754670600000,
        "startTimestamp": 1754671923365,
        "arenaName": "Bane 2",
        "isStarted": false,
        "hasWinner": false,
        "referee": "P. Cetkovic / N. Syrota",
        "homeTeam": {
            "isWinner": false,
            "name": "Roel-Johan Johansen / Ermīns  Trušelis",
            "player1": "Roel-Johan Johansen",
            "player2": "Ermīns  Trušelis"
        },
        "matchCategory": "M",
        "matchGroup": "",
        "sets": [
            {
                "PointsAwayTeam": 21,
                "PointsHomeTeam": 5,
                "Number": 1
            },
            {
                "Number": 2,
                "PointsAwayTeam": 21,
                "PointsHomeTeam": 12
            }
        ],
        "name": "A-PO 2",
        "scoreboardID": "16673059-1f7e-4092-8ade-424405e99bbb"
    },
    {
        "matchId": 34,
        "awayTeam": {
            "isWinner": true,
            "name": "Maren Næss Våge / Fredrik Hannås",
            "player1": "Maren Næss Våge",
            "player2": "Fredrik Hannås"
        },
        "currentScore": [
            {
                "AWAY": 21,
                "HOME": 15
            },
            {
                "AWAY": 21,
                "HOME": 15
            }
        ],
        "currentSetScore": {
            "AWAY": 2,
            "HOME": 0
        },
        "startTime": 1754670600000,
        "startTimestamp": 1754670741382,
        "arenaName": "Bane 3",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "M. Santos / O. Michelsen",
        "homeTeam": {
            "isWinner": false,
            "name": "Kai-Uwe Eiselt / Athit Duangkanya",
            "player1": "Kai-Uwe Eiselt",
            "player2": "Athit Duangkanya"
        },
        "matchCategory": "M",
        "matchGroup": "",
        "sets": [
            {
                "PointsHomeTeam": 15,
                "PointsAwayTeam": 21,
                "Number": 1
            },
            {
                "Number": 2,
                "PointsAwayTeam": 21,
                "PointsHomeTeam": 15
            }
        ],
        "name": "A-PO 1",
        "scoreboardID": "f50146dd-c717-467b-a199-cff151698174"
    },
    {
        "matchId": 35,
        "awayTeam": {
            "isWinner": true,
            "name": "Johanna Tara / Andrea  Riise-Krogh",
            "player1": "Johanna Tara",
            "player2": "Andrea  Riise-Krogh"
        },
        "currentScore": [],
        "currentSetScore": {
            "AWAY": 1,
            "HOME": 0
        },
        "startTime": 1754730000000,
        "startTimestamp": 1754730404505,
        "arenaName": "Bane 1",
        "isStarted": false,
        "hasWinner": false,
        "referee": "A. Persøy / J. Hansen",
        "homeTeam": {
            "isWinner": false,
            "name": "Høidalen, Vilde Alexandra Reiersen / Engøy Hadland Løkaas, Sofie ",
            "player1": "Høidalen, Vilde Alexandra Reiersen",
            "player2": "Engøy Hadland Løkaas, Sofie"
        },
        "matchCategory": "K",
        "matchGroup": "",
        "sets": [
            {
                "Number": 1,
                "PointsAwayTeam": 21,
                "PointsHomeTeam": 19
            },
            {
                "PointsAwayTeam": 23,
                "PointsHomeTeam": 21,
                "Number": 2
            }
        ],
        "name": "1/16 1",
        "scoreboardID": "bef4d2d2-a4ed-40ea-a248-91dbddad2287"
    },
    {
        "matchId": 36,
        "awayTeam": {
            "isWinner": true,
            "name": "Maren Næss Våge / Fredrik Hannås",
            "player1": "Maren Næss Våge",
            "player2": "Fredrik Hannås"
        },
        "currentScore": {
            "HOME": 0,
            "AWAY": 0
        },
        "currentSetScore": [],
        "startTime": 1754730000000,
        "startTimestamp": 0,
        "arenaName": "Bane 2",
        "hasWinner": false,
        "referee": "A. Røstengen / V. Høidalen",
        "homeTeam": {
            "isWinner": false,
            "name": "Adrian The / Sebastian Havelin",
            "player1": "Adrian The",
            "player2": "Sebastian Havelin"
        },
        "matchCategory": "M",
        "matchGroup": "",
        "sets": [
            {
                "PointsHomeTeam": 0,
                "PointsAwayTeam": 21,
                "Number": 1
            },
            {
                "PointsHomeTeam": 0,
                "Number": 2,
                "PointsAwayTeam": 21
            }
        ],
        "name": "1/16 1"
    },
    {
        "matchId": 37,
        "awayTeam": {
            "isWinner": false,
            "name": "William Tiderman / Werner Skaue",
            "player1": "William Tiderman",
            "player2": "Werner Skaue"
        },
        "currentScore": [
            {
                "AWAY": 5,
                "HOME": 21
            },
            {
                "AWAY": 18,
                "HOME": 21
            }
        ],
        "currentSetScore": {
            "AWAY": 0,
            "HOME": 2
        },
        "startTime": 1754730000000,
        "startTimestamp": 1754730091938,
        "arenaName": "Bane 3",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "J. Rønningen / O. Grøteide",
        "homeTeam": {
            "isWinner": true,
            "name": "Tuomas Ilkka Henrikki Heiskanen / Andreas Alexandersen",
            "player1": "Tuomas Ilkka Henrikki Heiskanen",
            "player2": "Andreas Alexandersen"
        },
        "matchCategory": "M",
        "matchGroup": "",
        "sets": [
            {
                "PointsHomeTeam": 21,
                "PointsAwayTeam": 5,
                "Number": 1
            },
            {
                "Number": 2,
                "PointsHomeTeam": 21,
                "PointsAwayTeam": 18
            }
        ],
        "name": "1/16 2",
        "scoreboardID": "1c3a24c1-382b-4742-9553-d86df623e2b4"
    },
    {
        "matchId": 38,
        "awayTeam": {
            "isWinner": true,
            "name": "Simon Pleym Jonassen / Isak Elias Sørensen",
            "player1": "Simon Pleym Jonassen",
            "player2": "Isak Elias Sørensen"
        },
        "currentScore": [
            {
                "AWAY": 18,
                "HOME": 21
            },
            {
                "AWAY": 21,
                "HOME": 19
            },
            {
                "AWAY": 18,
                "HOME": 16
            }
        ],
        "currentSetScore": {
            "HOME": 1,
            "AWAY": 2
        },
        "startTime": 1754730000000,
        "startTimestamp": 1754730164392,
        "arenaName": "Bane 4",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "J. Johansen / M. Eidissen",
        "homeTeam": {
            "isWinner": false,
            "name": "Theodor Atilla Bartinlioglu / Kristian  Nohr",
            "player1": "Theodor Atilla Bartinlioglu",
            "player2": "Kristian  Nohr"
        },
        "matchCategory": "M",
        "matchGroup": "",
        "sets": [
            {
                "Number": 1,
                "PointsAwayTeam": 18,
                "PointsHomeTeam": 21
            },
            {
                "PointsHomeTeam": 19,
                "Number": 2,
                "PointsAwayTeam": 21
            },
            {
                "Number": 3,
                "PointsHomeTeam": 16,
                "PointsAwayTeam": 18
            }
        ],
        "name": "B - Kvart 2",
        "scoreboardID": "c5c93073-9ab4-4496-9fd9-be854e8dd893"
    },
    {
        "matchId": 39,
        "awayTeam": {
            "isWinner": true,
            "name": "Svanhild Remme / Aisha Zamboli Niang",
            "player1": "Svanhild Remme",
            "player2": "Aisha Zamboli Niang"
        },
        "currentScore": {
            "HOME": 0,
            "AWAY": 0
        },
        "currentSetScore": [],
        "startTime": 1754733000000,
        "startTimestamp": 0,
        "arenaName": "Bane 1",
        "hasWinner": false,
        "referee": "H. Reiersen / E. ",
        "homeTeam": {
            "isWinner": false,
            "name": "Matilde Lamøy / Juana Knöferl",
            "player1": "Matilde Lamøy",
            "player2": "Juana Knöferl"
        },
        "matchCategory": "K",
        "matchGroup": "",
        "sets": [
            {
                "PointsHomeTeam": 0,
                "Number": 1,
                "PointsAwayTeam": 21
            },
            {
                "PointsHomeTeam": 0,
                "PointsAwayTeam": 21,
                "Number": 2
            }
        ],
        "name": "1/16 2"
    },
    {
        "matchId": 4,
        "awayTeam": {
            "isWinner": false,
            "name": "Fredrik Andersen / Taha  Tokmak",
            "player1": "Fredrik Andersen",
            "player2": "Taha  Tokmak"
        },
        "currentScore": [
            {
                "AWAY": 8,
                "HOME": 21
            },
            {
                "AWAY": 11,
                "HOME": 21
            }
        ],
        "currentSetScore": {
            "AWAY": 0,
            "HOME": 2
        },
        "startTime": 1754643600000,
        "startTimestamp": 1754643905341,
        "arenaName": "Bane 4",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "T. Bartinlioglu / K. Nohr",
        "homeTeam": {
            "isWinner": true,
            "name": "Maren Næss Våge / Fredrik Hannås",
            "player1": "Maren Næss Våge",
            "player2": "Fredrik Hannås"
        },
        "matchCategory": "M",
        "matchGroup": "E",
        "sets": [
            {
                "Number": 1,
                "PointsHomeTeam": 21,
                "PointsAwayTeam": 8
            },
            {
                "PointsAwayTeam": 11,
                "Number": 2,
                "PointsHomeTeam": 21
            }
        ],
        "name": "",
        "scoreboardID": "dad2ba33-68fd-4210-9ebe-3b1d07a63f1f"
    },
    {
        "matchId": 40,
        "awayTeam": {
            "isWinner": true,
            "name": "Fredrik Andersen / Taha  Tokmak",
            "player1": "Fredrik Andersen",
            "player2": "Taha  Tokmak"
        },
        "currentScore": {
            "HOME": 0,
            "AWAY": 0
        },
        "currentSetScore": [],
        "startTime": 1754733000000,
        "startTimestamp": 0,
        "arenaName": "Bane 2",
        "hasWinner": false,
        "referee": "A. The / S. Havelin",
        "homeTeam": {
            "isWinner": false,
            "name": "Nicolay Martin Hansen / Christoffer Vikjord",
            "player1": "Nicolay Martin Hansen",
            "player2": "Christoffer Vikjord"
        },
        "matchCategory": "M",
        "matchGroup": "",
        "sets": [
            {
                "PointsHomeTeam": 0,
                "PointsAwayTeam": 21,
                "Number": 1
            },
            {
                "Number": 2,
                "PointsHomeTeam": 0,
                "PointsAwayTeam": 21
            }
        ],
        "name": "B - 1/8 1"
    },
    {
        "matchId": 41,
        "awayTeam": {
            "isWinner": true,
            "name": "Oskar Billerfors / Stephane Tourres",
            "player1": "Oskar Billerfors",
            "player2": "Stephane Tourres"
        },
        "currentScore": [
            {
                "AWAY": 21,
                "HOME": 8
            },
            {
                "AWAY": 21,
                "HOME": 6
            }
        ],
        "currentSetScore": {
            "HOME": 0,
            "AWAY": 2
        },
        "startTime": 1754733000000,
        "startTimestamp": 1754733224019,
        "arenaName": "Bane 3",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "W. Tiderman / W. Skaue",
        "homeTeam": {
            "isWinner": false,
            "name": "Lucas Rossi / Patrik  Abelsen",
            "player1": "Lucas Rossi",
            "player2": "Patrik  Abelsen"
        },
        "matchCategory": "M",
        "matchGroup": "",
        "sets": [
            {
                "PointsAwayTeam": 21,
                "Number": 1,
                "PointsHomeTeam": 8
            },
            {
                "PointsHomeTeam": 6,
                "PointsAwayTeam": 21,
                "Number": 2
            }
        ],
        "name": "B - 1/8 2",
        "scoreboardID": "161e2963-35d9-4951-b4d8-dd6d7cb33102"
    },
    {
        "matchId": 42,
        "awayTeam": {
            "isWinner": true,
            "name": "Andrea Nerbøvik Persøy / Jenny Josefin Hansen",
            "player1": "Andrea Nerbøvik Persøy",
            "player2": "Jenny Josefin Hansen"
        },
        "currentScore": [
            {
                "HOME": 8,
                "AWAY": 21
            },
            {
                "AWAY": 21,
                "HOME": 7
            }
        ],
        "currentSetScore": {
            "AWAY": 2,
            "HOME": 0
        },
        "startTime": 1754736000000,
        "startTimestamp": 1754735751201,
        "arenaName": "Bane 1",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "M. Lamøy / J. Knöferl",
        "homeTeam": {
            "isWinner": false,
            "name": "Johanna Tara / Andrea  Riise-Krogh",
            "player1": "Johanna Tara",
            "player2": "Andrea  Riise-Krogh"
        },
        "matchCategory": "K",
        "matchGroup": "",
        "sets": [
            {
                "PointsHomeTeam": 8,
                "PointsAwayTeam": 21,
                "Number": 1
            },
            {
                "PointsHomeTeam": 7,
                "PointsAwayTeam": 21,
                "Number": 2
            }
        ],
        "name": "1/8 1",
        "scoreboardID": "adc514e4-415f-464b-bf3f-cc3199b65083"
    },
    {
        "matchId": 43,
        "awayTeam": {
            "isWinner": true,
            "name": "Amund Remme Røstengen / Vegard Høidalen",
            "player1": "Amund Remme Røstengen",
            "player2": "Vegard Høidalen"
        },
        "currentScore": [
            {
                "HOME": 14,
                "AWAY": 21
            },
            {
                "HOME": 12,
                "AWAY": 21
            }
        ],
        "currentSetScore": {
            "HOME": 0,
            "AWAY": 2
        },
        "startTime": 1754736000000,
        "startTimestamp": 1754735872596,
        "arenaName": "Bane 2",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "N. Hansen / C. Vikjord",
        "homeTeam": {
            "isWinner": false,
            "name": "Maren Næss Våge / Fredrik Hannås",
            "player1": "Maren Næss Våge",
            "player2": "Fredrik Hannås"
        },
        "matchCategory": "M",
        "matchGroup": "",
        "sets": [
            {
                "PointsHomeTeam": 14,
                "PointsAwayTeam": 21,
                "Number": 1
            },
            {
                "PointsAwayTeam": 21,
                "Number": 2,
                "PointsHomeTeam": 12
            }
        ],
        "name": "1/8 1",
        "scoreboardID": "66cf2775-8b5b-4032-8c7c-1d16a94776b0"
    },
    {
        "matchId": 44,
        "awayTeam": {
            "isWinner": true,
            "name": "Tuomas Ilkka Henrikki Heiskanen / Andreas Alexandersen",
            "player1": "Tuomas Ilkka Henrikki Heiskanen",
            "player2": "Andreas Alexandersen"
        },
        "currentScore": [
            {
                "HOME": 6,
                "AWAY": 21
            },
            {
                "AWAY": 13,
                "HOME": 7
            }
        ],
        "currentSetScore": {
            "AWAY": 1,
            "HOME": 0
        },
        "startTime": 1754736000000,
        "startTimestamp": 1754735936841,
        "arenaName": "Bane 3",
        "isStarted": false,
        "hasWinner": false,
        "referee": "L. Rossi / P. Abelsen",
        "homeTeam": {
            "isWinner": false,
            "name": "Johan Selnes Rønningen / Ole Andreas  Grøteide",
            "player1": "Johan Selnes Rønningen",
            "player2": "Ole Andreas  Grøteide"
        },
        "matchCategory": "M",
        "matchGroup": "",
        "sets": [
            {
                "PointsAwayTeam": 21,
                "Number": 1,
                "PointsHomeTeam": 10
            },
            {
                "Number": 2,
                "PointsAwayTeam": 21,
                "PointsHomeTeam": 9
            }
        ],
        "name": "1/8 2",
        "scoreboardID": "ce5cd994-e62e-4b46-a4c2-ce9101017971"
    },
    {
        "matchId": 45,
        "awayTeam": {
            "isWinner": false,
            "name": "Henry Ivan Falch / Martin  Hermo",
            "player1": "Henry Ivan Falch",
            "player2": "Martin  Hermo"
        },
        "currentScore": [
            {
                "AWAY": 7,
                "HOME": 21
            },
            {
                "HOME": 21,
                "AWAY": 6
            }
        ],
        "currentSetScore": {
            "HOME": 2,
            "AWAY": 0
        },
        "startTime": 1754736000000,
        "startTimestamp": 1754736246511,
        "arenaName": "Bane 4",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "T. Bartinlioglu / K. Nohr",
        "homeTeam": {
            "isWinner": true,
            "name": "Jesper Solheim Johansen / Magnus Eidissen",
            "player1": "Jesper Solheim Johansen",
            "player2": "Magnus Eidissen"
        },
        "matchCategory": "M",
        "matchGroup": "",
        "sets": [
            {
                "Number": 1,
                "PointsHomeTeam": 21,
                "PointsAwayTeam": 7
            },
            {
                "PointsHomeTeam": 21,
                "PointsAwayTeam": 6,
                "Number": 2
            }
        ],
        "name": "B - Kvart 3",
        "scoreboardID": "6c198ca9-6b11-4c6e-b54f-41afadb98e80"
    },
    {
        "matchId": 46,
        "awayTeam": {
            "isWinner": false,
            "name": "Svanhild Remme / Aisha Zamboli Niang",
            "player1": "Svanhild Remme",
            "player2": "Aisha Zamboli Niang"
        },
        "currentScore": [
            {
                "HOME": 21,
                "AWAY": 13
            },
            {
                "AWAY": 6,
                "HOME": 21
            }
        ],
        "currentSetScore": {
            "AWAY": 0,
            "HOME": 2
        },
        "startTime": 1754739000000,
        "startTimestamp": 1754738928626,
        "arenaName": "Bane 1",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "J. Tara / A. Riise-Krogh",
        "homeTeam": {
            "isWinner": true,
            "name": "Ingrid Mogstad Tørlen / Kristine Wiig Skarlund",
            "player1": "Ingrid Mogstad Tørlen",
            "player2": "Kristine Wiig Skarlund"
        },
        "matchCategory": "K",
        "matchGroup": "",
        "sets": [
            {
                "PointsAwayTeam": 13,
                "Number": 1,
                "PointsHomeTeam": 21
            },
            {
                "PointsHomeTeam": 21,
                "PointsAwayTeam": 6,
                "Number": 2
            }
        ],
        "name": "1/8 2",
        "scoreboardID": "8745a5f3-ed11-4fe2-8393-1f4629f7dd0c"
    },
    {
        "matchId": 47,
        "awayTeam": {
            "isWinner": false,
            "name": "Fredrik Andersen / Taha  Tokmak",
            "player1": "Fredrik Andersen",
            "player2": "Taha  Tokmak"
        },
        "currentScore": [
            {
                "AWAY": 17,
                "HOME": 21
            },
            {
                "AWAY": 10,
                "HOME": 21
            }
        ],
        "currentSetScore": {
            "AWAY": 0,
            "HOME": 2
        },
        "startTime": 1754739000000,
        "startTimestamp": 1754739049873,
        "arenaName": "Bane 2",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "M. Våge / F. Hannås",
        "homeTeam": {
            "isWinner": true,
            "name": "Roel-Johan Johansen / Ermīns  Trušelis",
            "player1": "Roel-Johan Johansen",
            "player2": "Ermīns  Trušelis"
        },
        "matchCategory": "M",
        "matchGroup": "",
        "sets": [
            {
                "PointsAwayTeam": 17,
                "Number": 1,
                "PointsHomeTeam": 21
            },
            {
                "PointsHomeTeam": 21,
                "PointsAwayTeam": 10,
                "Number": 2
            }
        ],
        "name": "B - Kvart 1",
        "scoreboardID": "d192ea1e-0d42-4b96-81f4-921ae87caaa7"
    },
    {
        "matchId": 48,
        "awayTeam": {
            "isWinner": true,
            "name": "Oskar Billerfors / Stephane Tourres",
            "player1": "Oskar Billerfors",
            "player2": "Stephane Tourres"
        },
        "currentScore": [
            {
                "HOME": 22,
                "AWAY": 20
            },
            {
                "HOME": 16,
                "AWAY": 21
            },
            {
                "HOME": 10,
                "AWAY": 15
            }
        ],
        "currentSetScore": {
            "HOME": 1,
            "AWAY": 2
        },
        "startTime": 1754739000000,
        "startTimestamp": 1754739430042,
        "arenaName": "Bane 3",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "J. Rønningen / O. Grøteide",
        "homeTeam": {
            "isWinner": false,
            "name": "Kai-Uwe Eiselt / Athit Duangkanya",
            "player1": "Kai-Uwe Eiselt",
            "player2": "Athit Duangkanya"
        },
        "matchCategory": "M",
        "matchGroup": "",
        "sets": [
            {
                "PointsAwayTeam": 20,
                "PointsHomeTeam": 22,
                "Number": 1
            },
            {
                "PointsHomeTeam": 16,
                "PointsAwayTeam": 21,
                "Number": 2
            },
            {
                "PointsHomeTeam": 10,
                "PointsAwayTeam": 15,
                "Number": 3
            }
        ],
        "name": "B - Kvart 4",
        "scoreboardID": "b2743f4a-3d56-4ba2-9d5b-b0adc5924ce9"
    },
    {
        "matchId": 49,
        "awayTeam": {
            "isWinner": true,
            "name": "Siri Okkenhaug / Hilde Stokke Bauck",
            "player1": "Siri Okkenhaug",
            "player2": "Hilde Stokke Bauck"
        },
        "currentScore": [
            {
                "HOME": 22,
                "AWAY": 24
            },
            {
                "HOME": 17,
                "AWAY": 21
            }
        ],
        "currentSetScore": {
            "AWAY": 2,
            "HOME": 0
        },
        "startTime": 1754742000000,
        "startTimestamp": 1754741957594,
        "arenaName": "Bane 1",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "S. Remme / A. Niang",
        "homeTeam": {
            "isWinner": false,
            "name": "Andrea Nerbøvik Persøy / Jenny Josefin Hansen",
            "player1": "Andrea Nerbøvik Persøy",
            "player2": "Jenny Josefin Hansen"
        },
        "matchCategory": "K",
        "matchGroup": "",
        "sets": [
            {
                "PointsAwayTeam": 24,
                "Number": 1,
                "PointsHomeTeam": 22
            },
            {
                "PointsHomeTeam": 17,
                "PointsAwayTeam": 21,
                "Number": 2
            }
        ],
        "name": "Kvart 1",
        "scoreboardID": "b68524bb-1507-4150-aefc-a20d787c8fe5"
    },
    {
        "matchId": 5,
        "awayTeam": {
            "isWinner": true,
            "name": "Oda Emilie Høidalen / Victoria Kalheim",
            "player1": "Oda Emilie Høidalen",
            "player2": "Victoria Kalheim"
        },
        "currentScore": [
            {
                "HOME": 21,
                "AWAY": 15
            },
            {
                "HOME": 16,
                "AWAY": 21
            },
            {
                "HOME": 13,
                "AWAY": 15
            }
        ],
        "currentSetScore": {
            "HOME": 1,
            "AWAY": 2
        },
        "startTime": 1754646600000,
        "startTimestamp": 1754646648688,
        "arenaName": "Bane 1",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "J. Tara / A. Riise-Krogh",
        "homeTeam": {
            "isWinner": false,
            "name": "Andrea Nerbøvik Persøy / Jenny Josefin Hansen",
            "player1": "Andrea Nerbøvik Persøy",
            "player2": "Jenny Josefin Hansen"
        },
        "matchCategory": "K",
        "matchGroup": "A",
        "sets": [
            {
                "PointsAwayTeam": 15,
                "Number": 1,
                "PointsHomeTeam": 21
            },
            {
                "PointsAwayTeam": 21,
                "Number": 2,
                "PointsHomeTeam": 16
            },
            {
                "Number": 3,
                "PointsHomeTeam": 13,
                "PointsAwayTeam": 15
            }
        ],
        "name": "",
        "scoreboardID": "ba73b865-e959-4ba2-bb55-a9dbe055d31d"
    },
    {
        "matchId": 50,
        "awayTeam": {
            "isWinner": true,
            "name": "Pavle Cetkovic / Nikolay Syrota",
            "player1": "Pavle Cetkovic",
            "player2": "Nikolay Syrota"
        },
        "currentScore": [
            {
                "AWAY": 21,
                "HOME": 14
            },
            {
                "HOME": 18,
                "AWAY": 21
            }
        ],
        "currentSetScore": {
            "HOME": 0,
            "AWAY": 2
        },
        "startTime": 1754742000000,
        "startTimestamp": 1754742238283,
        "arenaName": "Bane 2",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "F. Andersen / T. Tokmak",
        "homeTeam": {
            "isWinner": false,
            "name": "Amund Remme Røstengen / Vegard Høidalen",
            "player1": "Amund Remme Røstengen",
            "player2": "Vegard Høidalen"
        },
        "matchCategory": "M",
        "matchGroup": "",
        "sets": [
            {
                "PointsHomeTeam": 14,
                "PointsAwayTeam": 21,
                "Number": 1
            },
            {
                "PointsHomeTeam": 18,
                "PointsAwayTeam": 21,
                "Number": 2
            }
        ],
        "name": "Kvart 1",
        "scoreboardID": "41292218-e6b1-4f43-8285-79c558ab3d5f"
    },
    {
        "matchId": 51,
        "awayTeam": {
            "isWinner": false,
            "name": "Tuomas Ilkka Henrikki Heiskanen / Andreas Alexandersen",
            "player1": "Tuomas Ilkka Henrikki Heiskanen",
            "player2": "Andreas Alexandersen"
        },
        "currentScore": [
            {
                "AWAY": 21,
                "HOME": 17
            },
            {
                "AWAY": 24,
                "HOME": 26
            },
            {
                "HOME": 15,
                "AWAY": 12
            }
        ],
        "currentSetScore": {
            "HOME": 2,
            "AWAY": 1
        },
        "startTime": 1754742000000,
        "startTimestamp": 1754742563031,
        "arenaName": "Bane 3",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "K. Eiselt / A. Duangkanya",
        "homeTeam": {
            "isWinner": true,
            "name": "Mikael Beckman Dos Santos / Oscar Hans Michelsen",
            "player1": "Mikael Beckman Dos Santos",
            "player2": "Oscar Hans Michelsen"
        },
        "matchCategory": "M",
        "matchGroup": "",
        "sets": [
            {
                "Number": 1,
                "PointsHomeTeam": 17,
                "PointsAwayTeam": 21
            },
            {
                "PointsHomeTeam": 26,
                "Number": 2,
                "PointsAwayTeam": 24
            },
            {
                "PointsHomeTeam": 15,
                "PointsAwayTeam": 12,
                "Number": 3
            }
        ],
        "name": "Kvart 2",
        "scoreboardID": "cada22f2-dbc7-4b50-b236-1d0418acb91c"
    },
    {
        "matchId": 52,
        "awayTeam": {
            "isWinner": true,
            "name": "Ingrid Mogstad Tørlen / Kristine Wiig Skarlund",
            "player1": "Ingrid Mogstad Tørlen",
            "player2": "Kristine Wiig Skarlund"
        },
        "currentScore": [
            {
                "AWAY": 5,
                "HOME": 0
            }
        ],
        "currentSetScore": {
            "HOME": 0,
            "AWAY": 0
        },
        "startTime": 1754745000000,
        "startTimestamp": 1754744934208,
        "arenaName": "Bane 1",
        "isStarted": false,
        "hasWinner": false,
        "referee": "A. Persøy / J. Hansen",
        "homeTeam": {
            "isWinner": false,
            "name": "Oda Emilie Høidalen / Victoria Kalheim",
            "player1": "Oda Emilie Høidalen",
            "player2": "Victoria Kalheim"
        },
        "matchCategory": "K",
        "matchGroup": "",
        "sets": [
            {
                "Number": 1,
                "PointsHomeTeam": 8,
                "PointsAwayTeam": 21
            },
            {
                "PointsHomeTeam": 18,
                "Number": 2,
                "PointsAwayTeam": 21
            }
        ],
        "name": "Kvart 2",
        "scoreboardID": "510c918e-6cf3-4362-a998-5da5c4916673"
    },
    {
        "matchId": 53,
        "awayTeam": {
            "isWinner": false,
            "name": "Simon Pleym Jonassen / Isak Elias Sørensen",
            "player1": "Simon Pleym Jonassen",
            "player2": "Isak Elias Sørensen"
        },
        "currentScore": [
            {
                "HOME": 21,
                "AWAY": 11
            },
            {
                "HOME": 21,
                "AWAY": 19
            }
        ],
        "currentSetScore": {
            "AWAY": 0,
            "HOME": 2
        },
        "startTime": 1754745000000,
        "startTimestamp": 1754745333214,
        "arenaName": "Bane 2",
        "isStarted": false,
        "hasWinner": false,
        "referee": "A. Røstengen / V. Høidalen",
        "homeTeam": {
            "isWinner": true,
            "name": "Roel-Johan Johansen / Ermīns  Trušelis",
            "player1": "Roel-Johan Johansen",
            "player2": "Ermīns  Trušelis"
        },
        "matchCategory": "M",
        "matchGroup": "",
        "sets": [
            {
                "Number": 1,
                "PointsAwayTeam": 11,
                "PointsHomeTeam": 21
            },
            {
                "PointsAwayTeam": 19,
                "PointsHomeTeam": 21,
                "Number": 2
            }
        ],
        "name": "B - Semi 1",
        "scoreboardID": "4df41ff9-36fd-4ae3-b161-6fcd946f7bdf"
    },
    {
        "matchId": 54,
        "awayTeam": {
            "isWinner": true,
            "name": "Oskar Billerfors / Stephane Tourres",
            "player1": "Oskar Billerfors",
            "player2": "Stephane Tourres"
        },
        "currentScore": [
            {
                "AWAY": 16,
                "HOME": 21
            },
            {
                "AWAY": 21,
                "HOME": 14
            },
            {
                "AWAY": 15,
                "HOME": 11
            }
        ],
        "currentSetScore": {
            "AWAY": 2,
            "HOME": 1
        },
        "startTime": 1754745000000,
        "startTimestamp": 1754746110901,
        "arenaName": "Bane 3",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "T. Heiskanen / A. Alexandersen",
        "homeTeam": {
            "isWinner": false,
            "name": "Jesper Solheim Johansen / Magnus Eidissen",
            "player1": "Jesper Solheim Johansen",
            "player2": "Magnus Eidissen"
        },
        "matchCategory": "M",
        "matchGroup": "",
        "sets": [
            {
                "Number": 1,
                "PointsAwayTeam": 16,
                "PointsHomeTeam": 21
            },
            {
                "PointsAwayTeam": 21,
                "PointsHomeTeam": 14,
                "Number": 2
            },
            {
                "Number": 3,
                "PointsHomeTeam": 11,
                "PointsAwayTeam": 15
            }
        ],
        "name": "B - Semi 2",
        "scoreboardID": "55facaa1-d615-4278-9cc7-53bb839c6fb5"
    },
    {
        "matchId": 55,
        "awayTeam": {
            "isWinner": false,
            "name": "Siri Okkenhaug / Hilde Stokke Bauck",
            "player1": "Siri Okkenhaug",
            "player2": "Hilde Stokke Bauck"
        },
        "currentScore": [
            {
                "HOME": 21,
                "AWAY": 11
            },
            {
                "HOME": 21,
                "AWAY": 12
            }
        ],
        "currentSetScore": {
            "AWAY": 0,
            "HOME": 2
        },
        "startTime": 1754748000000,
        "startTimestamp": 1754748024652,
        "arenaName": "Bane 1",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "O. Høidalen / V. Kalheim",
        "homeTeam": {
            "isWinner": true,
            "name": "Elise Skaue / Pia Sivertsen Johansen",
            "player1": "Elise Skaue",
            "player2": "Pia Sivertsen Johansen"
        },
        "matchCategory": "K",
        "matchGroup": "",
        "sets": [
            {
                "PointsHomeTeam": 21,
                "PointsAwayTeam": 11,
                "Number": 1
            },
            {
                "Number": 2,
                "PointsHomeTeam": 21,
                "PointsAwayTeam": 12
            }
        ],
        "name": "Semi 1",
        "scoreboardID": "9cfd99b4-badd-46d8-b2ea-d409eb2c110c"
    },
    {
        "matchId": 56,
        "awayTeam": {
            "isWinner": true,
            "name": "Thomas Steen Evensen / Simon Storsæter Evensen",
            "player1": "Thomas Steen Evensen",
            "player2": "Simon Storsæter Evensen"
        },
        "currentScore": [
            {
                "AWAY": 21,
                "HOME": 6
            },
            {
                "HOME": 19,
                "AWAY": 21
            }
        ],
        "currentSetScore": {
            "AWAY": 2,
            "HOME": 0
        },
        "startTime": 1754748000000,
        "startTimestamp": 1754748317164,
        "arenaName": "Bane 2",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "S. Jonassen / I. Sørensen",
        "homeTeam": {
            "isWinner": false,
            "name": "Mikael Beckman Dos Santos / Oscar Hans Michelsen",
            "player1": "Mikael Beckman Dos Santos",
            "player2": "Oscar Hans Michelsen"
        },
        "matchCategory": "M",
        "matchGroup": "",
        "sets": [
            {
                "Number": 1,
                "PointsHomeTeam": 6,
                "PointsAwayTeam": 21
            },
            {
                "Number": 2,
                "PointsHomeTeam": 19,
                "PointsAwayTeam": 21
            }
        ],
        "name": "Semi 2",
        "scoreboardID": "8511f1fa-51d2-4b5a-9be0-31540c323a70"
    },
    {
        "matchId": 57,
        "awayTeam": {
            "isWinner": false,
            "name": "Pavle Cetkovic / Nikolay Syrota",
            "player1": "Pavle Cetkovic",
            "player2": "Nikolay Syrota"
        },
        "currentScore": [
            {
                "AWAY": 12,
                "HOME": 21
            },
            {
                "AWAY": 19,
                "HOME": 21
            }
        ],
        "currentSetScore": {
            "HOME": 2,
            "AWAY": 0
        },
        "startTime": 1754748000000,
        "startTimestamp": 1754750142947,
        "arenaName": "Bane 3",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "J. Johansen / M. Eidissen",
        "homeTeam": {
            "isWinner": true,
            "name": "Lars Ragnar Vollan / Syver Drolsum Klungsøyr",
            "player1": "Lars Ragnar Vollan",
            "player2": "Syver Drolsum Klungsøyr"
        },
        "matchCategory": "M",
        "matchGroup": "",
        "sets": [
            {
                "Number": 1,
                "PointsAwayTeam": 12,
                "PointsHomeTeam": 21
            },
            {
                "PointsHomeTeam": 21,
                "Number": 2,
                "PointsAwayTeam": 19
            }
        ],
        "name": "Semi 1",
        "scoreboardID": "8bf786d3-b426-4141-9b36-eb896cf2166f"
    },
    {
        "matchId": 58,
        "awayTeam": {
            "isWinner": false,
            "name": "Josefine Sørland Øines / Grethe Tuft Soltvedt",
            "player1": "Josefine Sørland Øines",
            "player2": "Grethe Tuft Soltvedt"
        },
        "currentScore": [
            {
                "AWAY": 20,
                "HOME": 22
            },
            {
                "HOME": 8,
                "AWAY": 21
            },
            {
                "AWAY": 9,
                "HOME": 15
            }
        ],
        "currentSetScore": {
            "AWAY": 1,
            "HOME": 2
        },
        "startTime": 1754751000000,
        "startTimestamp": 1754751018148,
        "arenaName": "Bane 1",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "S. Okkenhaug / H. Bauck",
        "homeTeam": {
            "isWinner": true,
            "name": "Ingrid Mogstad Tørlen / Kristine Wiig Skarlund",
            "player1": "Ingrid Mogstad Tørlen",
            "player2": "Kristine Wiig Skarlund"
        },
        "matchCategory": "K",
        "matchGroup": "",
        "sets": [
            {
                "Number": 1,
                "PointsHomeTeam": 22,
                "PointsAwayTeam": 20
            },
            {
                "Number": 2,
                "PointsHomeTeam": 8,
                "PointsAwayTeam": 21
            },
            {
                "PointsHomeTeam": 15,
                "PointsAwayTeam": 9,
                "Number": 3
            }
        ],
        "name": "Semi 2",
        "scoreboardID": "943ba0c3-590c-4aa9-a8fe-680f5aa1fe9e"
    },
    {
        "matchId": 59,
        "awayTeam": {
            "isWinner": true,
            "name": "Oskar Billerfors / Stephane Tourres",
            "player1": "Oskar Billerfors",
            "player2": "Stephane Tourres"
        },
        "currentScore": [
            {
                "AWAY": 21,
                "HOME": 19
            },
            {
                "HOME": 14,
                "AWAY": 21
            }
        ],
        "currentSetScore": {
            "AWAY": 2,
            "HOME": 0
        },
        "startTime": 1754751000000,
        "startTimestamp": 1754750697259,
        "arenaName": "Bane 2",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "M. Santos / O. Michelsen",
        "homeTeam": {
            "isWinner": false,
            "name": "Roel-Johan Johansen / Ermīns  Trušelis",
            "player1": "Roel-Johan Johansen",
            "player2": "Ermīns  Trušelis"
        },
        "matchCategory": "M",
        "matchGroup": "",
        "sets": [
            {
                "PointsHomeTeam": 19,
                "PointsAwayTeam": 21,
                "Number": 1
            },
            {
                "PointsAwayTeam": 21,
                "PointsHomeTeam": 14,
                "Number": 2
            }
        ],
        "name": "B - Finale",
        "scoreboardID": "17f90634-5fec-481b-8779-1949e65e6742"
    },
    {
        "matchId": 6,
        "awayTeam": {
            "isWinner": false,
            "name": "Adrian The / Sebastian Havelin",
            "player1": "Adrian The",
            "player2": "Sebastian Havelin"
        },
        "currentScore": [
            {
                "HOME": 21,
                "AWAY": 9
            },
            {
                "AWAY": 8,
                "HOME": 21
            }
        ],
        "currentSetScore": {
            "HOME": 2,
            "AWAY": 0
        },
        "startTime": 1754646600000,
        "startTimestamp": 1754647206541,
        "arenaName": "Bane 2",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "W. Tiderman / W. Skaue",
        "homeTeam": {
            "isWinner": true,
            "name": "Pavle Cetkovic / Nikolay Syrota",
            "player1": "Pavle Cetkovic",
            "player2": "Nikolay Syrota"
        },
        "matchCategory": "M",
        "matchGroup": "B",
        "sets": [
            {
                "PointsAwayTeam": 9,
                "Number": 1,
                "PointsHomeTeam": 21
            },
            {
                "Number": 2,
                "PointsAwayTeam": 8,
                "PointsHomeTeam": 21
            }
        ],
        "name": "",
        "scoreboardID": "40938772-a463-4f61-b9b4-e08d27a2be7b"
    },
    {
        "matchId": 60,
        "awayTeam": {
            "isWinner": true,
            "name": "Thomas Steen Evensen / Simon Storsæter Evensen",
            "player1": "Thomas Steen Evensen",
            "player2": "Simon Storsæter Evensen"
        },
        "currentScore": [
            {
                "AWAY": 17,
                "HOME": 21
            },
            {
                "AWAY": 24,
                "HOME": 22
            },
            {
                "AWAY": 15,
                "HOME": 12
            }
        ],
        "currentSetScore": {
            "AWAY": 2,
            "HOME": 1
        },
        "startTime": 1754754000000,
        "startTimestamp": 1754754571031,
        "arenaName": "Bane 2",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "Arrangør",
        "homeTeam": {
            "isWinner": false,
            "name": "Lars Ragnar Vollan / Syver Drolsum Klungsøyr",
            "player1": "Lars Ragnar Vollan",
            "player2": "Syver Drolsum Klungsøyr"
        },
        "matchCategory": "M",
        "matchGroup": "",
        "sets": [
            {
                "PointsAwayTeam": 17,
                "Number": 1,
                "PointsHomeTeam": 21
            },
            {
                "PointsAwayTeam": 24,
                "Number": 2,
                "PointsHomeTeam": 22
            },
            {
                "PointsHomeTeam": 12,
                "Number": 3,
                "PointsAwayTeam": 15
            }
        ],
        "name": "Finale",
        "scoreboardID": "9d215ea6-25e8-4ae0-91e3-2ac0901e807f"
    },
    {
        "matchId": 61,
        "awayTeam": {
            "isWinner": true,
            "name": "Ingrid Mogstad Tørlen / Kristine Wiig Skarlund",
            "player1": "Ingrid Mogstad Tørlen",
            "player2": "Kristine Wiig Skarlund"
        },
        "currentScore": [
            {
                "HOME": 22,
                "AWAY": 24
            },
            {
                "HOME": 21,
                "AWAY": 12
            },
            {
                "AWAY": 15,
                "HOME": 8
            }
        ],
        "currentSetScore": {
            "HOME": 1,
            "AWAY": 2
        },
        "startTime": 1754757000000,
        "startTimestamp": 1754759704427,
        "arenaName": "Bane 2",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "Arrangør",
        "homeTeam": {
            "isWinner": false,
            "name": "Elise Skaue / Pia Sivertsen Johansen",
            "player1": "Elise Skaue",
            "player2": "Pia Sivertsen Johansen"
        },
        "matchCategory": "K",
        "matchGroup": "",
        "sets": [
            {
                "Number": 1,
                "PointsAwayTeam": 24,
                "PointsHomeTeam": 22
            },
            {
                "Number": 2,
                "PointsAwayTeam": 12,
                "PointsHomeTeam": 21
            },
            {
                "Number": 3,
                "PointsHomeTeam": 8,
                "PointsAwayTeam": 15
            }
        ],
        "name": "Finale",
        "scoreboardID": "bca35ec8-0008-4661-8381-7272b4548b51"
    },
    {
        "matchId": 7,
        "awayTeam": {
            "isWinner": true,
            "name": "Kai-Uwe Eiselt / Athit Duangkanya",
            "player1": "Kai-Uwe Eiselt",
            "player2": "Athit Duangkanya"
        },
        "currentScore": [
            {
                "AWAY": 21,
                "HOME": 17
            },
            {
                "AWAY": 21,
                "HOME": 15
            }
        ],
        "currentSetScore": {
            "AWAY": 2,
            "HOME": 0
        },
        "startTime": 1754643600000,
        "startTimestamp": 1754643591340,
        "arenaName": "Bane 3",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "M. Santos / O. Michelsen",
        "homeTeam": {
            "isWinner": false,
            "name": "Simon Pleym Jonassen / Isak Elias Sørensen",
            "player1": "Simon Pleym Jonassen",
            "player2": "Isak Elias Sørensen"
        },
        "matchCategory": "M",
        "matchGroup": "D",
        "sets": [
            {
                "Number": 1,
                "PointsAwayTeam": 21,
                "PointsHomeTeam": 17
            },
            {
                "PointsHomeTeam": 15,
                "Number": 2,
                "PointsAwayTeam": 21
            }
        ],
        "name": "",
        "scoreboardID": "04ec2029-ac3d-4847-8e6f-30e083c95f89"
    },
    {
        "matchId": 8,
        "awayTeam": {
            "isWinner": true,
            "name": "Roel-Johan Johansen / Ermīns  Trušelis",
            "player1": "Roel-Johan Johansen",
            "player2": "Ermīns  Trušelis"
        },
        "currentScore": [
            {
                "AWAY": 21,
                "HOME": 13
            },
            {
                "HOME": 11,
                "AWAY": 21
            }
        ],
        "currentSetScore": {
            "HOME": 0,
            "AWAY": 2
        },
        "startTime": 1754646600000,
        "startTimestamp": 1754646724247,
        "arenaName": "Bane 4",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "F. Andersen / T. Tokmak",
        "homeTeam": {
            "isWinner": false,
            "name": "Henry Ivan Falch / Martin  Hermo",
            "player1": "Henry Ivan Falch",
            "player2": "Martin  Hermo"
        },
        "matchCategory": "M",
        "matchGroup": "C",
        "sets": [
            {
                "Number": 1,
                "PointsAwayTeam": 21,
                "PointsHomeTeam": 13
            },
            {
                "PointsHomeTeam": 11,
                "Number": 2,
                "PointsAwayTeam": 21
            }
        ],
        "name": "",
        "scoreboardID": "df69d93c-aa37-4c12-ab30-579a5bfa2a2f"
    },
    {
        "matchId": 9,
        "awayTeam": {
            "isWinner": true,
            "name": "Elise Skaue / Pia Sivertsen Johansen",
            "player1": "Elise Skaue",
            "player2": "Pia Sivertsen Johansen"
        },
        "currentScore": [
            {
                "AWAY": 21,
                "HOME": 7
            },
            {
                "AWAY": 21,
                "HOME": 10
            }
        ],
        "currentSetScore": {
            "AWAY": 2,
            "HOME": 0
        },
        "startTime": 1754649600000,
        "startTimestamp": 1754650183728,
        "arenaName": "Bane 1",
        "isStarted": false,
        "isFinalized": false,
        "hasWinner": false,
        "referee": "A. Persøy / J. Hansen",
        "homeTeam": {
            "isWinner": false,
            "name": "Svanhild Remme / Aisha Zamboli Niang",
            "player1": "Svanhild Remme",
            "player2": "Aisha Zamboli Niang"
        },
        "matchCategory": "K",
        "matchGroup": "A",
        "sets": [
            {
                "Number": 1,
                "PointsAwayTeam": 21,
                "PointsHomeTeam": 7
            },
            {
                "Number": 2,
                "PointsAwayTeam": 21,
                "PointsHomeTeam": 10
            }
        ],
        "name": "",
        "scoreboardID": "a5955146-de93-4e07-961a-38f253efde0b"
    }
]);
}