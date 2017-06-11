const debug = require("debug");
const log = debug("sendMail");

function send(toMail, result) {
  const sg = require("sendgrid")(process.env.SENDGRID_API_KEY);
  const helper = require("sendgrid").mail;
  const fromMail = new helper.Email("sinsvend@gmail.com");

  if (typeof process.env.SENDGRID_API_KEY === "undefined") {
    log("SENDGRID_API_KEY was not set, not sending any mails");
    return 500;
  }

  const toEmail = new helper.Email(toMail);
  const subject = `Results from match ${result.id} (${result.vsString})`;
  const content = new helper.Content("text/plain", bodyTemplate(result));
  const mail = new helper.Mail(fromMail, subject, toEmail, content);

  const request = sg.emptyRequest({
    method: "POST",
    path: "/v3/mail/send",
    body: mail.toJSON()
  });

  sg.API(request, function(error, response) {
    if (error) {
      log("Error response received");
    }
    log(response.statusCode);
    log(response.body);
    log(response.headers);
  });
}

function bodyTemplate({
  id,
  vsString,
  winner,
  setResult,
  resultDetails,
  details
}) {
  return `
        Id: ${id}
        Match: ${vsString}
        Winner: ${winner}
        Set Result: ${setResult}
        Result details: ${resultDetails}

        details: ${details}
    `;
}

module.exports = send;
