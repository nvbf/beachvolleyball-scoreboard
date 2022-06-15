import { createReducer } from "@reduxjs/toolkit"
import { matchesState } from "../types"

const initState = {
  matches: [
    {
      homeTeam: {
        player1Name: "Haidar Nuri",
        player2Name: "Øystein Grændsen",
        shirtColor: "#0000ff",
        added: true,
      },
      awayTeam: {
        player1Name: "Frode Walde",
        player2Name: "Ståle Mygland",
        shirtColor: "#ff0000",
        added: true,
      },
      matchId: "x8y9wy02ax",
      matchName: "MA42",
      tournementId: "123456",
      timestamp: new Date(),
      sets: [
        {
          homeTeamScore: 21,
          awayTeamScore: 4
        },
        {
          homeTeamScore: 18,
          awayTeamScore: 21
        },
        {
          homeTeamScore: 15,
          awayTeamScore: 13
        }
      ]
    },
    {
      homeTeam: {
        player1Name: "Haidar Olsen",
        player2Name: "Nils Grændsen",
        shirtColor: "#00ffff",
        added: true,
      },
      awayTeam: {
        player1Name: "Jens Walde",
        player2Name: "Ståle Larsen",
        shirtColor: "#ffff00",
        added: true,
      },
      matchId: "yrd8m3xq",
      matchName: "MA40",
      tournementId: "123456",
      timestamp: new Date(),
      sets: []
    },
    {
      homeTeam: {
        player1Name: "Ola Nuri",
        player2Name: "Øystein Normann",
        shirtColor: "#00ff00",
        added: true,
      },
      awayTeam: {
        player1Name: "Frode Svendsen",
        player2Name: "Per Mygland",
        shirtColor: "#ff00ff",
        added: true,
      },
      matchId: "h4d98ra9",
      matchName: "MA41",
      tournementId: "123456",
      timestamp: new Date(),
      sets: [
        {
          homeTeamScore: 21,
          awayTeamScore: 4
        },
        {
          homeTeamScore: 12,
          awayTeamScore: 4
        }
      ]
    }
  ],
  lastUpdated: new Date(),
  errorMessage: null,
}

export const matchesReducer = createReducer<matchesState>(initState, {})
