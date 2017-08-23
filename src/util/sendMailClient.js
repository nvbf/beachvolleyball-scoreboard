import superagent from "superagent";

import {
  getWinnerAsString,
  getTeamVsString,
  getMatch,
  getId,
  getSetResult,
  getResult,
  getDetailsAsAnArrayOfString
} from "../domain/tide/logic";
import { EMAIL } from "../domain/tide/state";

import { constants as c } from "../domain/tide/state";

var debug = require("debug");
const log = debug("sendMailClient");

export default function sendMailClient(state) {
  const matchState = getMatch(state);
  const mail = matchState[EMAIL];
  if (!mail) {
    log("No email set, skipping!");
    return;
  }
  const winner = getWinnerAsString(matchState);
  const vsString = getTeamVsString(matchState);
  const id = getId(matchState);
  const setResult = getSetResult(matchState);
  const detailsList = state[c.ACTION_HISTORY];
  var result = {
    id,
    vsString,
    setResult,
    resultDetails: getResult(matchState),
    winner,
    details: getDetailsAsAnArrayOfString(detailsList).reverse().join("\n")
  };

  superagent.post("/send/mail").send({ result, mail }).end(function(err, res) {
    if (err || !res.ok) {
      log("mail failed", err);
    } else {
      log("mail sendt");
    }
  });
}
