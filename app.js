const util = require("util");
const superagent = require("superagent");

const { parse } = require("url");
const next = require("next");
const express = require("express");
const bodyParser = require("body-parser");
const send = require("./src/util/sendMail");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const pathMatch = require("path-match");

const route = pathMatch();
const match = route("/tournament/:id");

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

    const mailStatusCode = send(mail, result);
    if (mailStatusCode == 500) {
      res.status(500).send(":\\ ");
    } else {
      res.send(":)");
    }
  });

  server.get("/tournament/:tournamentSlug", (req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;
    console.log("1", query);
    app.render(req, res, "/tournament", pathname);
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
