const util = require("util");
const superagent = require("superagent");

const { parse } = require("url");
const next = require("next");
const express = require("express");
const bodyParser = require("body-parser");
const send = require("./src/util/sendMail");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });

const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use(bodyParser.json());

  server.post("/send/mail", (req, res) => {
    const result = req.body.result;
    const mail = req.body.mail;
    if (!(mail && result)) {
      return res.status(500).send("feil data");
    }
    console.log("mail", mail);
    console.log("result", result);
    const mailStatusCode = send(mail, result);
    if (mailStatusCode == 500) {
      res.status(500).send(":\\ ");
    } else {
      res.send(":)");
    }
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(process.env.PORT || 3000, err => {
    if (err) {
      throw err;
    }
  });
});
