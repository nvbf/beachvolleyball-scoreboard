import {
  getWinnerAsString,
  getTeamVsString,
  getMatch,
  getId,
  getSetResult,
  getResult
} from "../domain/tide/logic";

var debug = require("debug");
const helper = require("sendgrid").mail;
const log = debug("sendMail");
const fromMail = new helper.Email("sinsvend@gmail.com");

export default function(state) {
  const matchState = getMatch(state);
  const winner = getWinnerAsString(matchState);
  const vsString = getTeamVsString(matchState);
  const id = getId(matchState);
  const setResult = getSetResult(matchState);
  var result = {
    id,
    vsString,
    setResult,
    resultDetails: getResult(matchState),
    winner,
    details: `
      asdfwe
      epfnw
      efpowmf`
  };
  sendMail(toMail);
}

function sendMail(toMail, result) {
  if (typeof process.env.SENDGRID_API_KEY === "undefined") {
    log("SENDGRID_API_KEY was not set, not sending any mails");
    return;
  }

  const toEmail = new helper.Email(toMail);
  const subject = `Results from match ${result.id} (${vsString})`;
  const content = new helper.Content("text/plain", bodyTemplate(result));
  const mail = new helper.Mail(fromMail, subject, toEmail, content);

  const sg = require("sendgrid")(process.env.SENDGRID_API_KEY);

  const request = sg.emptyRequest({
    method: "POST",
    path: "/v3/mail/send",
    body: mail.toJSON()
  });

  sg.API(request, function(error, response) {
    log(response.statusCode);
    log(response.body);
    log(response.headers);
  });
}

function bodyTemplate({
  id,
  hometeam,
  awayteam,
  winner,
  setResult,
  resultDetails,
  details
}) {
  return `
        id: ${id}
        match: ${hometeam} - ${awayteam}
        winner: ${winner}
        sett Result: ${setResult}
        result details: ${resultDetails}

        details: ${details}
    `;
}
